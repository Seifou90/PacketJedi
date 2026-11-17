export const STORAGE_KEY = 'packetjedi.leaderboard.v1';
const valid = entry => entry && Number.isInteger(entry.sequence) && Number.isInteger(entry.score) && ['Youngling','Padawan','Knight','Master'].includes(entry.rank) && typeof entry.completedAt === 'string';
export function createLeaderboard(storage = globalThis.localStorage) {
  let entries = [];
  let persistent = true;
  try { const parsed = JSON.parse(storage.getItem(STORAGE_KEY) || '[]'); if (!Array.isArray(parsed) || !parsed.every(valid)) throw new Error('invalid board'); entries = parsed.sort((a,b) => b.score-a.score || a.sequence-b.sequence).slice(0,5); }
  catch { persistent = false; }
  return {
    get entries() { return [...entries]; }, get persistent() { return persistent; },
    add(entry) { entries = [...entries, entry].sort((a,b) => b.score-a.score || a.sequence-b.sequence).slice(0,5); try { if (!storage) throw new Error('unavailable'); storage.setItem(STORAGE_KEY, JSON.stringify(entries)); } catch { persistent = false; } return [...entries]; }
  };
}
