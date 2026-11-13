// An original two-card teaching example, not an Analytical Engine emulator.
export const ADA_PROGRAMS = {
  'double-add': ['double', 'add'],
  'add-double': ['add', 'double']
};
export function adaTrace(order, completed = 2) {
  if (!Object.hasOwn(ADA_PROGRAMS, order) || !Number.isInteger(completed) || completed < 0 || completed > 2) {
    throw new RangeError('Choose an existing two-card order and zero, one or two completed cards.');
  }
  const values = [2];
  for (const op of ADA_PROGRAMS[order].slice(0, completed)) {
    const value = values.at(-1);
    values.push(op === 'double' ? value * 2 : value + 3);
  }
  return values;
}
