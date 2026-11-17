import { evaluate } from '../engine/rules.js';
export function registerLevelTests(test,ok,data,fixtures) {
  for (const f of fixtures.slice(3)) test(f.id,()=>{const c=data.challenges.find(x=>x.id===f.challenge);const r=evaluate(c,data,f.selected);ok(r.status===f.status,`${r.status} != ${f.status}`);ok(JSON.stringify(r.expectedReceiverIds)===JSON.stringify(f.expected),`fixture mismatch: ${r.expectedReceiverIds}`);});
}
