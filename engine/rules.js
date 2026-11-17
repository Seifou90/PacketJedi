const sort = list => [...new Set(list)].sort();

export function evaluate(challenge, topology, selectedRouterIds) {
  const selected = Array.isArray(selectedRouterIds) ? sort(selectedRouterIds) : [];
  const base = { status: 'content-error', expectedReceiverIds: null, selectedRouterIds: selected, extraRouterIds: [], missingRouterIds: [], reasonCodes: [], evidence: null };
  const routers = new Map((topology?.routers || []).map(r => [r.id, r]));
  const origin = routers.get(challenge?.originRouterId);
  if (!challenge || !origin) return base;
  const levels = topology.levels || [];
  const level = levels.find(l => l.id === challenge.levelId);
  if (!level) return base;
  const areaKind = id => level.areaOverrides?.[id] || topology.areas.find(a => a.id === id)?.kind;
  let expected;
  if (challenge.lsaType >= 1 && challenge.lsaType <= 4) {
    const areaId = challenge.floodingAreaId;
    if (!areaId || !origin.areaIds.includes(areaId)) return base;
    if (challenge.lsaType === 4 && areaKind(areaId) === 'stub') return base;
    expected = topology.routers.filter(r => r.id !== origin.id && r.role !== 'external-bgp' && r.areaIds.includes(areaId)).map(r => r.id);
    if (challenge.lsaType === 2) {
      const network = topology.transitNetworks?.find(n => n.id === challenge.transitNetworkId);
      if (!network || network.areaId !== areaId || network.drRouterId !== origin.id || !network.attachedRouterIds.includes(origin.id)) return base;
    }
  } else if (challenge.lsaType === 5 && challenge.scope === 'as') {
    expected = topology.routers.filter(r => r.id !== origin.id && r.role !== 'external-bgp' && r.areaIds.some(id => areaKind(id) !== 'stub')).map(r => r.id);
  } else return base;
  expected = sort(expected);
  if (selected.length === 0 || selected.some(id => !routers.has(id) || routers.get(id).role === 'external-bgp')) return { ...base, status: 'invalid-input', expectedReceiverIds: expected, reasonCodes: ['invalid-selection'] };
  const extra = selected.filter(id => !expected.includes(id));
  const missing = expected.filter(id => !selected.includes(id));
  const correct = !extra.length && !missing.length;
  const ref = challenge.lsaType === 5 ? '12.4.4' : challenge.lsaType === 4 ? '12.4.3' : `12.4.${challenge.lsaType}`;
  const evidence = { lsaType: challenge.lsaType, origin: origin.id, floodingScope: challenge.scope, selectedAreas: challenge.floodingAreaId ? [challenge.floodingAreaId] : [], excludedAreas: topology.areas.filter(a => areaKind(a.id) === 'stub').map(a => a.id), rule: `RFC 2328 §${ref}, §13.3; area membership and flooding scope determine eligible OSPF receivers.`, sourceIds: challenge.sourceIds };
  return { status: correct ? 'correct' : 'incorrect', expectedReceiverIds: expected, selectedRouterIds: selected, extraRouterIds: extra, missingRouterIds: missing, reasonCodes: correct ? [] : ['extra-or-missing-receiver'], evidence };
}

export const receiverSet = (challenge, topology) => evaluate(challenge, topology, evaluate(challenge, topology, topology.routers.filter(r => r.id !== challenge.originRouterId && r.role !== 'external-bgp').map(r => r.id)).expectedReceiverIds || []).expectedReceiverIds;
