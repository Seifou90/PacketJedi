export function feedbackFor(result, challenge) {
  if (result.status === 'invalid-input') return { title: 'Choose at least one router', text: 'An empty set is guidance only; it does not count as an attempt.' };
  if (result.status === 'content-error') return { title: 'Challenge data needs review', text: 'This challenge could not be evaluated safely.' };
  if (result.status === 'correct') return { title: 'The Force is with you', text: `Every selected router receives this LSA. ${result.evidence.rule}` };
  const extras = result.extraRouterIds.length ? `Extra: ${result.extraRouterIds.join(', ')}. ` : '';
  const missing = result.missingRouterIds.length ? `Still needed: ${result.missingRouterIds.join(', ')}. ` : '';
  const reason = challenge.misconceptionsByReasonCode['extra-or-missing-receiver'] || 'Check which routers belong to the LSA flooding scope.';
  return { title: 'Recheck the flooding scope', text: `${extras}${missing}${reason} ${result.evidence.rule}` };
}
