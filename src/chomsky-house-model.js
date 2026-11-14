// An original, deliberately tiny English grouping example, not a language parser.
export const CHOMSKY_GROUPINGS = ['both', 'birds'];
const word = (text, role) => ({kind: 'word', text, role});
const group = (kind, ...children) => ({kind, children});
export function chomskyTree(id) {
  const small = () => word('small', 'adjective'), birds = () => word('birds', 'noun');
  const and = () => word('and', 'link'), butterflies = () => word('butterflies', 'noun');
  if (id === 'both') return group('phrase', small(), group('coordination', birds(), and(), butterflies()));
  if (id === 'birds') return group('coordination', group('phrase', small(), birds()), and(), butterflies());
  throw new RangeError('Choose one of the two illustrated groupings.');
}
export const chomskyWords = tree => tree.kind === 'word' ? [tree.text] : tree.children.flatMap(chomskyWords);
const nouns = tree => tree.kind === 'word' ? (tree.role === 'noun' ? [tree.text] : []) : tree.children.flatMap(nouns);
export function chomskyScope(id) {
  const visit = tree => {
    if (tree.kind === 'word') return [];
    if (tree.kind === 'phrase' && tree.children.some(c => c.role === 'adjective')) return nouns(tree);
    return tree.children.flatMap(visit);
  };
  return visit(chomskyTree(id));
}
export function chomskyBrackets(id) {
  const print = tree => tree.kind === 'word' ? tree.text : '[' + tree.children.map(print).join(' ') + ']';
  return print(chomskyTree(id));
}
export function chomskyLayout(id) {
  const nodes = [], edges = []; let leaf = 0, serial = 0;
  function place(tree, depth) {
    const key = serial++;
    if (tree.kind === 'word') {const n = {...tree, key, x: 110 + 265 * leaf++, y: 410}; nodes.push(n); return n;}
    const children = tree.children.map(c => place(c, depth + 1));
    const n = {key, kind: tree.kind, x: (children[0].x + children.at(-1).x) / 2, y: 65 + depth * 125};
    nodes.push(n); children.forEach(child => edges.push({from: n, to: child})); return n;
  }
  place(chomskyTree(id), 0); return {nodes, edges};
}
export function chomskyDiagram(id) {
  const {nodes, edges} = chomskyLayout(id), scope = chomskyScope(id);
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 512"><rect width="1024" height="512" fill="#f6f0df"/><g stroke="#687d6e" stroke-width="6">' +
    edges.map(e => '<path d="M' + e.from.x + ' ' + e.from.y + ' L' + e.to.x + ' ' + (e.to.kind === 'word' ? 365 : e.to.y) + '"/>').join('') +
    '</g><g font-family="Tahoma,Arial,sans-serif" text-anchor="middle" font-size="48">' + nodes.map(n => n.kind === 'word' ? '<text x="' + n.x + '" y="425" fill="' + (scope.includes(n.text) ? '#285a49' : '#4b554d') + '">' + n.text + '</text>' : '<circle cx="' + n.x + '" cy="' + n.y + '" r="10" fill="#285a49"/>').join('') + '</g></svg>';
}
export function paintChomskyDiagram(ctx, id) {
  const {nodes, edges} = chomskyLayout(id), scope = chomskyScope(id);
  ctx.fillStyle = '#f6f0df'; ctx.fillRect(0, 0, 1024, 512); ctx.strokeStyle = '#687d6e'; ctx.lineWidth = 6;
  for (const e of edges) {ctx.beginPath(); ctx.moveTo(e.from.x, e.from.y); ctx.lineTo(e.to.x, e.to.kind === 'word' ? 365 : e.to.y); ctx.stroke();}
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = 'ltr'; ctx.font = '48px Tahoma';
  for (const n of nodes) {
    ctx.fillStyle = scope.includes(n.text) ? '#285a49' : '#4b554d';
    if (n.kind === 'word') ctx.fillText(n.text, n.x, 410, 235);
    else {ctx.beginPath(); ctx.arc(n.x, n.y, 10, 0, Math.PI * 2); ctx.fill();}
  }
  ctx.fillStyle = '#285a49'; ctx.font = 'bold 48px Tahoma'; ctx.fillText(id === 'both' ? 'A' : 'B', 45, 45);
}
