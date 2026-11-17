import { evaluate } from './rules.js';

const ID = /^[A-Za-z0-9][A-Za-z0-9_.-]*$/;
const fail = message => { throw new Error(`Content error: ${message}`); };
const unique = (items, label) => { const s = new Set(items); if (s.size !== items.length) fail(`duplicate ${label}`); };
const levelAreaKind = (data, levelId, areaId) => data.levels.find(l=>l.id===levelId)?.areaOverrides?.[areaId] || data.areas.find(a=>a.id===areaId)?.kind;

export function validateContent(data, { complete = false } = {}) {
  if (!data || !Array.isArray(data.routers) || !Array.isArray(data.areas) || !Array.isArray(data.adjacencies) || !Array.isArray(data.levels) || !Array.isArray(data.challenges) || !Array.isArray(data.sources)) fail('missing topology or content collections');
  const ids = (list, key, label) => { const values = list.map(x => x?.[key]); if (values.some(x => typeof x !== 'string' || !ID.test(x))) fail(`invalid ${label} ID`); unique(values, label); return new Set(values); };
  const areas = ids(data.areas, 'id', 'area');
  const routers = ids(data.routers, 'id', 'router');
  const sources = ids(data.sources, 'id', 'source');
  const levels = ids(data.levels, 'id', 'level');
  const challenges = ids(data.challenges, 'id', 'challenge');
  const networks = ids(data.transitNetworks || [], 'id', 'transit network');
  for (const a of data.areas) if (!['0','1','2'].includes(a.id) || !['regular', 'stub'].includes(a.kind) || !Array.isArray(a.routerIds) || a.routerIds.some(x => !routers.has(x))) fail(`invalid area ${a.id}`);
  for (const r of data.routers) {
    if (!['router', 'abr', 'asbr', 'external-bgp'].includes(r.role) || !Array.isArray(r.areaIds) || r.areaIds.some(x => !areas.has(x))) fail(`invalid router ${r.id}`);
    if (r.role === 'external-bgp' && r.areaIds.length) fail(`external peer ${r.id} cannot be in an OSPF area`);
    if (r.role === 'abr' && (r.areaIds.length < 2 || !r.areaIds.includes('0'))) fail(`ABR ${r.id} needs Area 0 and another area`);
    if (r.role === 'asbr' && (!r.areaIds.includes('2') || data.areas.find(a=>a.id==='2')?.kind!=='regular')) fail(`ASBR ${r.id} must be in regular Area 2`);
    if (r.externalPeerId && (!routers.has(r.externalPeerId) || !data.routers.find(peer=>peer.id===r.externalPeerId) || data.routers.find(peer=>peer.id===r.externalPeerId).role!=='external-bgp')) fail(`invalid external peer for ${r.id}`);
    for (const a of data.areas) if (a.routerIds.includes(r.id) !== r.areaIds.includes(a.id)) fail(`membership mismatch for ${r.id}/${a.id}`);
  }
  for (const a of data.adjacencies) {
    const left=data.routers.find(r=>r.id===a.routerA),right=data.routers.find(r=>r.id===a.routerB);
    if (!left || !right || left.role==='external-bgp' || right.role==='external-bgp' || !areas.has(a.areaId) || !['point-to-point', 'transit'].includes(a.kind) || !left.areaIds.includes(a.areaId) || !right.areaIds.includes(a.areaId)) fail('invalid adjacency');
  }
  for (const area of data.areas) {
    if (area.routerIds.length<2) continue;
    const seen=new Set([area.routerIds[0]]), todo=[area.routerIds[0]];
    while(todo.length){const current=todo.pop();for(const edge of data.adjacencies.filter(e=>e.areaId===area.id&&(e.routerA===current||e.routerB===current))){const next=edge.routerA===current?edge.routerB:edge.routerA;if(!seen.has(next)){seen.add(next);todo.push(next);}}}
    if(seen.size!==area.routerIds.length) fail(`area ${area.id} adjacency graph is disconnected`);
  }
  for (const n of data.transitNetworks || []) if (!areas.has(n.areaId) || !routers.has(n.drRouterId) || !Array.isArray(n.attachedRouterIds) || n.attachedRouterIds.length < 2 || n.attachedRouterIds.some(id => !routers.has(id) || !data.routers.find(r=>r.id===id).areaIds.includes(n.areaId)) || !n.attachedRouterIds.includes(n.drRouterId)) fail(`invalid transit network ${n.id}`);
  for (const s of data.sources) if (!['RFC 2328', 'RFC 3101'].includes(s.document) || !s.section || !s.claim) fail(`invalid source ${s.id}`);
  for (const l of data.levels) if (!Number.isInteger(l.order) || !l.title || !l.briefing || !l.areaOverrides || Object.entries(l.areaOverrides).some(([id,kind])=>!areas.has(id)||!['regular','stub'].includes(kind)) || !Array.isArray(l.challengeIds) || l.challengeIds.some(x => !challenges.has(x))) fail(`invalid level ${l.id}`);
  for (const c of data.challenges) {
    if (!levels.has(c.levelId) || ![1,2,3,4,5].includes(c.lsaType) || !c.character || !routers.has(c.originRouterId) || !c.linkStateId || !areas.has(c.originAreaId) || !['area','as'].includes(c.scope) || !c.subject || !c.hint || !c.misconceptionsByReasonCode || !Array.isArray(c.sourceIds) || c.sourceIds.some(x => !sources.has(x)) || !Array.isArray(c.reviewedReceiverIds)) fail(`invalid challenge ${c.id}`);
    if ((c.lsaType<5&&c.scope!=='area')||(c.lsaType===5&&c.scope!=='as')) fail(`invalid scope for ${c.id}`);
    const origin=data.routers.find(r=>r.id===c.originRouterId);
    if (!origin.areaIds.includes(c.originAreaId)) fail(`origin area mismatch for ${c.id}`);
    if (c.lsaType < 5 && (!areas.has(c.floodingAreaId) || !origin.areaIds.includes(c.floodingAreaId))) fail(`invalid flooding area for ${c.id}`);
    if (c.lsaType === 2) {
      const network=data.transitNetworks?.find(n=>n.id===c.transitNetworkId);
      if (!c.transitNetworkId || !networks.has(c.transitNetworkId) || !network || network.areaId!==c.floodingAreaId || network.drRouterId!==origin.id || !network.attachedRouterIds.includes(origin.id)) fail('Type 2 requires a matching DR transit network');
    }
    if ((c.lsaType===3 || c.lsaType===4) && origin.role!=='abr') fail(`Type ${c.lsaType} requires an ABR origin`);
    if (c.lsaType === 5 && (origin.role!=='asbr' || c.scope!=='as')) fail('Type 5 requires an ASBR and AS scope');
    if (c.lsaType === 4 && levelAreaKind(data,c.levelId,c.floodingAreaId)==='stub') fail('Type 4 cannot flood into a stub area');
    const level=data.levels.find(l=>l.id===c.levelId);
    if (!level.challengeIds.includes(c.id)) fail(`level ${level.id} does not reference challenge ${c.id}`);
    if (complete) {
      const selectable=data.routers.filter(r=>r.role!=='external-bgp').map(r=>r.id);
      const computed=evaluate(c,data,selectable).expectedReceiverIds;
      if (!computed || JSON.stringify([...c.reviewedReceiverIds].sort())!==JSON.stringify(computed)) fail(`reviewed receiver mismatch for ${c.id}`);
    }
  }
  if (complete) {
    if (areas.size!==3 || ['0','1','2'].some(id=>!areas.has(id)) || !routers.has('BGP-X') || data.routers.find(r=>r.id==='BGP-X')?.role!=='external-bgp') fail('release topology must contain Areas 0, 1, 2 and external BGP-X');
    if (data.levels.length !== 3 || data.challenges.length !== 5 || data.levels.some((l, i) => l.order !== i + 1)) fail('release must have exactly three ordered levels and five challenges');
    if ([1,2,3,4,5].some(type => data.challenges.filter(c => c.lsaType === type).length !== 1)) fail('release must have one challenge for each LSA type 1–5');
    if (data.levels.map(x => x.challengeIds.length).join(',') !== '2,2,1') fail('challenge order must be 1–2, 3–4, then 5');
    const byId=new Map(data.challenges.map(c=>[c.id,c]));
    if (data.levels[0].challengeIds.map(id=>byId.get(id).lsaType).join(',')!=='1,2' || data.levels[1].challengeIds.map(id=>byId.get(id).lsaType).join(',')!=='3,4' || data.levels[2].challengeIds.map(id=>byId.get(id).lsaType).join(',')!=='5') fail('levels must teach Types 1–2, then 3–4, then Type 5');
    if (data.levels[2].areaOverrides['1']!=='stub' || levelAreaKind(data,data.levels[2].id,'0')!=='regular' || levelAreaKind(data,data.levels[2].id,'2')!=='regular') fail('Level 3 must stub only Area 1');
  }
  return { areas, routers, levels, challenges, sources };
}

