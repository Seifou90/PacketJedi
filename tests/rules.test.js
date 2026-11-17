import { evaluate } from '../engine/rules.js';
import { validateContent } from '../engine/content.js';
export function registerRuleTests(test,ok,data,fixtures) {
  for (const f of fixtures.slice(0,3)) test(f.id,()=>{const c=data.challenges.find(x=>x.id===f.challenge);const r=evaluate(c,data,f.selected);ok(r.status===f.status,`${r.status} != ${f.status}`);ok(JSON.stringify(r.expectedReceiverIds)===JSON.stringify(f.expected),`fixture mismatch: ${r.expectedReceiverIds}`);});
  test('empty-is-not-attempt',()=>ok(evaluate(data.challenges[0],data,[]).status==='invalid-input'));
  test('unknown-router-rejected',()=>ok(evaluate(data.challenges[0],data,['NOT-A-ROUTER']).status==='invalid-input'));
  test('feedback-cites-rule',()=>ok(evaluate(data.challenges[0],data,['J1b','ABR-A1','J0']).evidence.rule.includes('RFC 2328 §12.4.1')));
  test('malformed-content-rejected',()=>{const bad=structuredClone(data);bad.routers[0].id='bad id';let rejected=false;try{validateContent(bad);}catch{rejected=true;}ok(rejected);});
}
