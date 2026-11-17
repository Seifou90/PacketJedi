const $ = (selector, root=document) => root.querySelector(selector);
const esc = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const announce = text => { const region=document.querySelector('#announce'); if(region) region.textContent=text; };
export function render(app, run, board, message='') {
  const {data}=run;
  if (run.view === 'summary') {
    app.innerHTML=`<section class="panel"><p class="eyebrow">MISSION COMPLETE</p><h1 tabindex="-1" data-focus>Run summary</h1><p class="score">${run.score} points · ${esc(run.score>=300?'Master':run.score>=200?'Knight':run.score>=100?'Padawan':'Youngling')}</p><p>${run.challengeIndex} rounds complete · Hints used in ${run.hintedChallengeIds.size} round${run.hintedChallengeIds.size===1?'':'s'}.</p><p>Top-five scores are stored in this browser only.</p><p>${esc(message)}</p><ol>${board.entries.map(e=>`<li>${esc(e.score)} · ${esc(e.rank)}</li>`).join('')||'<li>No completed runs saved yet.</li>'}</ol><button data-action="restart">Restart</button></section>`; announce(`Run complete. ${run.score} points, rank ${run.score>=300?'Master':run.score>=200?'Knight':run.score>=100?'Padawan':'Youngling'}.`); return;
  }
  const c=data.challenges[run.challengeIndex]; const l=data.levels.find(x=>x.id===c.levelId);
  const isBrief=run.view==='briefing';
  const feedback=run.lastResult;
  const status=feedback ? (feedback.status==='correct'?'Correct set.':feedback.status==='incorrect'?'Not quite. Select Retry to try again.':'') : (run.message||message);
  const areaLabel=id=>`Area ${id}${l.areaOverrides[id]==='stub'?' (stub)':''}`;
  app.innerHTML=`<section class="panel">
    <div class="level-line"><span>LEVEL ${l.order} / 3</span><span>ROUND ${run.challengeIndex+1} / 5</span><span>${run.score} pts</span></div>
    ${isBrief?'<p class="eyebrow">MISSION BRIEFING</p>':`<div class="character"><img src="./assets/${['','hermit','admin','diplomat','guide','crier'][c.lsaType]}.svg" alt="Cartoon ${esc(c.character)}"><p class="eyebrow">LSA TYPE ${c.lsaType} · ${esc(c.character)}</p></div>`}
    <h1 tabindex="-1" data-focus>${esc(isBrief?l.title:`${esc(c.character)} enters the holomap`)}</h1>
    <p>${esc(isBrief?l.briefing:`${c.subject}. Origin: ${c.originRouterId}. Scope: ${c.scope==='as'?'AS-wide':areaLabel(c.floodingAreaId)}.`)}</p>
    ${isBrief?`<div class="lesson"><b>Scoring</b><p>+10 for each unique correct router, −5 for each unique wrong router. A perfect first answer earns +20; consecutive perfect rounds increase the multiplier up to 1.4×. Scores below 100 rank Youngling.</p><button data-action="begin">Enter holomap</button></div>`:`
      <div class="map-frame"><div class="map" aria-label="Fictional OSPF topology"><div class="area a0"><b>Area 0</b><span>J0</span><span>ABR-A1</span><span>ABR-A2</span></div><div class="area a1"><b>${areaLabel('1')}</b><span>ABR-A1</span><span>J1</span><span>J1b</span></div><div class="area a2"><b>${areaLabel('2')}</b><span>ABR-A2</span><span>J2</span><span>J2b</span><span>ASBR-A2</span><small>peers with BGP-X (external)</small></div></div></div>
      <details><summary>Text topology</summary><p>Area 0: J0, ABR-A1, ABR-A2; J0 links to both ABRs. Area 1${l.areaOverrides['1']==='stub'?' (stub)':''}: ABR-A1, J1, J1b; ABR-A1 links to J1, which links to J1b. Area 2: ABR-A2, J2, J2b, ASBR-A2; ABR-A2 links to J2, which connects to the transit LAN. Area 2 transit LAN: J2 (DR), J2b, ASBR-A2. ABR-A1 connects Areas 0 and 1; ABR-A2 connects Areas 0 and 2. ASBR-A2 peers with external BGP-X, which is not an OSPF receiver choice.</p></details>
      <fieldset ${run.solved?'disabled':''}><legend>Select every router that receives the LSA</legend><div class="choices">${data.routers.filter(r=>r.role!=='external-bgp').map(r=>`<button type="button" class="router-choice ${run.selected.has(r.id)?'selected':''}" data-router="${esc(r.id)}" aria-pressed="${run.selected.has(r.id)}">${esc(r.id)}<small>${esc(r.role)} · ${r.areaIds.map(areaLabel).join(', ')}</small></button>`).join('')}</div></fieldset>
      <div class="actions">${!run.solved?'<button data-action="submit">Submit receivers</button>':''}${feedback?.status==='incorrect'?'<button class="secondary" data-action="retry">Retry</button>':''}${run.solved?'<button data-action="next">Next</button>':''}<button class="secondary" data-action="hint">Hint</button><button class="secondary" data-action="restart">Restart</button></div>
      ${run.hinted?`<p class="hint">Hint: ${esc(c.hint)}</p>`:''}
      ${feedback?`<section class="feedback ${feedback.status}" aria-label="Answer feedback"><h2>${feedback.status==='correct'?'Correct!':'Try again'}</h2><p>${feedback.status==='incorrect'?`Extra: ${feedback.extraRouterIds.join(', ')||'none'} · Missing: ${feedback.missingRouterIds.join(', ')||'none'}. `:''}${esc(c.misconceptionsByReasonCode['extra-or-missing-receiver']||'') } <cite>RFC 2328 §${c.lsaType===5?'12.4.4':c.lsaType===4?'12.4.3':'12.4.'+c.lsaType}, §13.3</cite></p><p>Round score commits once on correct completion. First submission: ${run.firstExact?'perfect':'not perfect'}.</p></section>`:''}`}
    <p class="storage-note">${board.persistent?'Top-five leaderboard saves in this browser.':'Leaderboard storage is unavailable; you can keep playing.'}</p>
    <p class="status" role="status" aria-live="polite">${esc(status||message)}</p>
  </section>`;
  announce(status||(!board.persistent?'Leaderboard storage is unavailable; gameplay remains available.':''));
}
