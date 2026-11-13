export const FREUD_PHASES = ['report', 'context', 'limits'];
export function freudLayers(phase) {
  if (!FREUD_PHASES.includes(phase)) throw new RangeError('Choose one of the three reading stages.');
  return {report: true, context: phase !== 'report', question: phase === 'limits'};
}
