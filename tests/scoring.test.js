import { rankForScore, roundAward } from '../engine/scoring.js';
export function registerScoringTests(test,ok) {
  test('negative-score-rank-bands',()=>ok(rankForScore(-20)==='Youngling'&&rankForScore(99)==='Youngling'&&rankForScore(100)==='Padawan'&&rankForScore(200)==='Knight'&&rankForScore(300)==='Master'));
  test('perfect-round-multiplier',()=>{const a=roundAward({correct:2,wrong:0,perfect:true,streak:0});ok(a.points===44&&a.streak===1&&a.multiplier===1.1);});
  test('imperfect-resets-streak-and-can-go-negative',()=>{const a=roundAward({correct:0,wrong:3,perfect:false,streak:3});ok(a.points===-15&&a.streak===0);});
  test('half-away-from-zero-rounding',()=>{const positive=roundAward({correct:0,wrong:1,perfect:true,streak:0});const negative=roundAward({correct:1,wrong:7,perfect:true,streak:0});ok(positive.points===17&&negative.points===-6);});
}
