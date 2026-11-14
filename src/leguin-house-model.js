// Three original everyday objects, not objects from a Le Guin story.
export const LEGUIN_OBJECTS = ['seeds', 'thread', 'cup'];
export function leguinContents(selected) {
  if (!Array.isArray(selected) || selected.some(id => !LEGUIN_OBJECTS.includes(id))) throw new RangeError('Choose only the three courtyard objects.');
  return LEGUIN_OBJECTS.filter(id => selected.includes(id));
}
export function leguinToggle(selected, id) {
  if (!LEGUIN_OBJECTS.includes(id)) throw new RangeError('Unknown courtyard object.');
  const contents = leguinContents(selected);
  return contents.includes(id) ? contents.filter(key => key !== id) : leguinContents([...contents, id]);
}
export function leguinObjectPose(id, gathered) {
  const i = LEGUIN_OBJECTS.indexOf(id);
  if (i < 0) throw new RangeError('Unknown courtyard object.');
  return {x: gathered ? -.58 + i * .58 : -1.35 + i * 1.35, y: gathered ? .055 : .015, z: gathered ? -.4 : .5};
}
