import { begin, toggle, submit, retry, next, hint, restart, currentChallenge } from '../engine/state.js';
import { evaluate } from '../engine/rules.js';
export function bind(app, run, board, repaint) {
  app.addEventListener('click', event => {
    const router=event.target.closest('[data-router]'); if(router){toggle(run,router.dataset.router); repaint(); app.querySelector(`[data-router="${router.dataset.router}"]`)?.focus(); return;}
    const action=event.target.closest('[data-action]')?.dataset.action; if(!action)return;
    if(action==='begin')begin(run);
    if(action==='submit') { const c=currentChallenge(run); submit(run,evaluate(c,run.data,[...run.selected])); }
    if(action==='retry')retry(run);
    if(action==='next')next(run);
    if(action==='hint')hint(run);
    if(action==='restart'){if(globalThis.confirm('Restart this run? Saved leaderboard scores will stay.'))restart(run);}
    repaint(); app.querySelector('[data-focus]')?.focus();
  });
}
