import { validateContent } from './engine/content.js';
import { createRun } from './engine/state.js';
import { createLeaderboard } from './engine/leaderboard.js';
import { rankForScore } from './engine/scoring.js';
import { render } from './ui/render.js';
import { bind } from './ui/controls.js';

const app=document.querySelector('#app');
try {
  const response=await fetch('./data/levels.json'); if(!response.ok) throw new Error(`Could not load game content (${response.status}).`);
  const data=await response.json(); validateContent(data,{complete:true});
  const run=createRun(data);
  let board; try { board=createLeaderboard(globalThis.localStorage); } catch { board=createLeaderboard(null); }
  const repaint=()=>{
    if(run.view==='summary'&&!run.leaderboardSaved){
      run.leaderboardSaved=true;
      board.add({sequence:Date.now(),score:run.score,rank:rankForScore(run.score),completedAt:new Date().toISOString()});
    }
    render(app,run,board);app.setAttribute('aria-busy','false');
  };
  bind(app,run,board,repaint); repaint();
} catch(error) {
  app.setAttribute('aria-busy','false');app.innerHTML=`<section class="panel"><h1>Holomap unavailable</h1><p>${String(error.message).replace(/[<>]/g,'')}</p><p>Reload after checking that the game is served over HTTP.</p></section>`;
}
