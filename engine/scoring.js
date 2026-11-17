export const rankForScore = score => score >= 300 ? 'Master' : score >= 200 ? 'Knight' : score >= 100 ? 'Padawan' : 'Youngling';
export const roundAward = ({ correct, wrong, perfect, streak }) => {
  const nextStreak = perfect ? streak + 1 : 0;
  const multiplier = 1 + 0.1 * Math.min(nextStreak, 4);
  const raw = (correct * 10 - wrong * 5 + (perfect ? 20 : 0)) * multiplier;
  const points = raw < 0 ? -Math.floor(Math.abs(raw) + 0.5) : Math.floor(raw + 0.5);
  return { points, streak: nextStreak, multiplier };
};
