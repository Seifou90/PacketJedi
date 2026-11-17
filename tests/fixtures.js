export const fixtures = [
  { id: 'T1-correct', challenge: 'type-1-hermit', selected: ['J1b','ABR-A1'], expected:['ABR-A1','J1b'], status: 'correct' },
  { id: 'T1-plausible-wrong-extra-J0', challenge: 'type-1-hermit', selected: ['J1b','ABR-A1','J0'], expected:['ABR-A1','J1b'], status: 'incorrect' },
  { id: 'T5-stub-boundary', challenge: 'type-5-crier', selected: ['J0','ABR-A1','ABR-A2','J2','J2b'], expected:['ABR-A1','ABR-A2','J0','J2','J2b'], status: 'correct' },
  { id: 'T2-area-flood', challenge: 'type-2-admin', selected: ['J2b','ABR-A2','ASBR-A2'], expected:['ABR-A2','ASBR-A2','J2b'], status: 'correct' },
  { id: 'T3-area-instance', challenge: 'type-3-diplomat', selected: ['J0','ABR-A2'], expected:['ABR-A2','J0'], status: 'correct' },
  { id: 'T4-area-instance', challenge: 'type-4-tour-guide', selected: ['J0','ABR-A1'], expected:['ABR-A1','J0'], status: 'correct' }
];
