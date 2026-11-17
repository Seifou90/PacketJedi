import { validateContent } from '../engine/content.js';
import { fixtures } from './fixtures.js';
import { registerRuleTests } from './rules.test.js';
import { registerLevelTests } from './levels.test.js';
import { registerStateTests } from './state.test.js';
import { registerScoringTests } from './scoring.test.js';
import { registerLeaderboardTests } from './leaderboard.test.js';

const results=[];
const test=(id,fn)=>{try{fn();results.push({id,ok:true});}catch(e){results.push({id,ok:false,error:e.message});}};
const ok=(condition,message='assertion failed')=>{if(!condition)throw new Error(message);};
const data=await(await fetch('../data/levels.json')).json();
registerRuleTests(test,ok,data,fixtures);
registerLevelTests(test,ok,data,fixtures);
registerStateTests(test,ok,data);
registerScoringTests(test,ok);
registerLeaderboardTests(test,ok,data);
test('complete-content-and-fixtures',()=>{validateContent(data,{complete:true});});
const list=document.querySelector('#results');
for(const r of results){const li=document.createElement('li');li.textContent=`${r.ok?'PASS':'FAIL'} ${r.id}${r.error?`: ${r.error}`:''}`;li.className=r.ok?'pass':'fail';list.append(li);}
const passed=results.filter(x=>x.ok).length,failed=results.length-passed;
document.querySelector('#summary').textContent=`${results.length} discovered · ${passed} passed · ${failed} failed${results.length===0?' · SUITE FAILED: no tests discovered':''}`;
document.title=`${failed||!results.length?'FAIL':'PASS'} — PacketJedi checks`;
if(!results.length||failed)document.body.dataset.failed='true';
