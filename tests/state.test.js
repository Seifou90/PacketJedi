import { createRun,begin,currentChallenge,toggle,submit,retry,next,hint,restart } from '../engine/state.js';
import { evaluate } from '../engine/rules.js';
export function registerStateTests(test,ok,data) {
  test('state-retry-progression-and-solved-guard',()=>{const run=createRun(data);begin(run);const c=currentChallenge(run);for(const id of ['J1b','ABR-A1','J0'])toggle(run,id);submit(run,evaluate(c,data,[...run.selected]));ok(!run.solved&&run.firstExact===false);retry(run);for(const id of ['J1b','ABR-A1'])toggle(run,id);submit(run,evaluate(c,data,[...run.selected]));const score=run.score;submit(run,evaluate(c,data,['J1b','ABR-A1']));ok(run.solved&&run.score===score);next(run);ok(run.challengeIndex===1);});
  test('unique-clicks-score-once',()=>{const run=createRun(data);begin(run);toggle(run,'J1b');toggle(run,'J1b');toggle(run,'J1b');ok(run.correct.size===1);});
  test('hint-and-restart-reset-run-state',()=>{const run=createRun(data);begin(run);hint(run);toggle(run,'J0');run.score=-5;restart(run);ok(run.view==='briefing'&&!run.hinted&&run.score===0&&run.challengeIndex===0&&run.selected.size===0);});
}
