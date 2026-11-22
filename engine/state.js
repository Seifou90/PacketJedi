import { roundAward } from './scoring.js';
import { evaluate } from './rules.js';
export function createRun(data) {
  return { data, challengeIndex: 0, selected: new Set(), seen: new Set(), correct: new Set(), wrong: new Set(), attempts: 0, firstExact: null, solved: false, hinted: false, hintedChallengeIds: new Set(), score: 0, streak: 0, view: 'briefing', lastResult: null, message: '', leaderboardSaved: false };
}
export const currentChallenge = run => run.data.challenges[run.challengeIndex];
export function begin(run) { run.view = 'challenge'; return run; }
export function toggle(run, id) { if (run.solved) return run; if (run.selected.has(id)) run.selected.delete(id); else { run.selected.add(id); if (!run.seen.has(id)) { run.seen.add(id); const challenge=run.data.challenges[run.challengeIndex]; const all=run.data.routers.filter(r=>r.role!=='external-bgp').map(r=>r.id); const expected=evaluate(challenge,run.data,all).expectedReceiverIds||[]; (expected.includes(id) ? run.correct : run.wrong).add(id); } } return run; }
export function submit(run, evaluation) {
  if (run.solved) return run;
  if (evaluation.status === 'invalid-input') { run.message='Choose at least one router. This does not count as an attempt.'; return run; }
  if (!['correct','incorrect'].includes(evaluation.status)) return run;
  run.attempts++; if (run.firstExact === null) run.firstExact = evaluation.status === 'correct';
  run.message=''; run.lastResult = evaluation;
  if (evaluation.status === 'correct') { const award = roundAward({ correct: run.correct.size, wrong: run.wrong.size, perfect: run.firstExact, streak: run.streak }); run.score += award.points; run.streak = award.streak; run.solved = true; run.view = 'feedback'; }
  else run.view = 'feedback';
  return run;
}
export function retry(run) { if (!run.solved) { run.selected.clear(); run.lastResult=null; run.message=''; run.view = 'challenge'; } return run; }
export function hint(run) { if (!run.solved) { run.hinted=true; run.hintedChallengeIds.add(currentChallenge(run).id); } return run; }
export function restart(run) { const fresh=createRun(run.data); Object.assign(run,fresh); return run; }
export function summary(run) { return { score: run.score, rank: run.score>=300?'Master':run.score>=200?'Knight':run.score>=100?'Padawan':'Youngling', rounds: run.challengeIndex, assistedRounds: run.hintedChallengeIds.size }; }
export function next(run) { if (!run.solved) return run; const previousLevel=currentChallenge(run).levelId; run.challengeIndex++; run.selected.clear(); run.seen.clear(); run.correct.clear(); run.wrong.clear(); run.attempts = 0; run.firstExact = null; run.solved = false; run.hinted = false; run.lastResult = null; run.view = run.challengeIndex >= run.data.challenges.length ? 'summary' : currentChallenge(run).levelId!==previousLevel?'briefing':'challenge'; return run; }
