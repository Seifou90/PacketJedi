import { createLeaderboard,STORAGE_KEY } from '../engine/leaderboard.js';
import { createRun,begin,toggle,submit,currentChallenge } from '../engine/state.js';
import { evaluate } from '../engine/rules.js';
const entry=(sequence,score)=>({sequence,score,rank:score>=300?'Master':'Youngling',completedAt:'2026-11-17T00:00:00.000Z'});
export function registerLeaderboardTests(test,ok,data) {
  test('storage-read-write-top-five-tie-order-and-reload',()=>{const data=new Map();const storage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};const b=createLeaderboard(storage);for(let i=1;i<=7;i++)b.add(entry(i,100));const reloaded=createLeaderboard(storage);ok(b.entries.length===5&&b.entries[0].sequence===1&&b.entries[4].sequence===5&&JSON.parse(data.get(STORAGE_KEY)).length===5&&reloaded.entries[0].sequence===1);});
  test('malformed-storage-fallback',()=>{const b=createLeaderboard({getItem:()=>'{bad',setItem(){}});ok(!b.persistent&&b.entries.length===0);});
  test('thrown-read-and-write-do-not-block',()=>{const b=createLeaderboard({getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}});b.add(entry(1,10));ok(b.entries.length===1&&!b.persistent);});
  test('storage-failure-does-not-block-gameplay',()=>{const b=createLeaderboard({getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}});const run=createRun(data);begin(run);for(const id of ['J1b','ABR-A1'])toggle(run,id);submit(run,evaluate(currentChallenge(run),data,[...run.selected]));ok(run.solved&&run.score>0&&!b.persistent);});
}
