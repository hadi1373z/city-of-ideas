export const PLATO_POSES = ['front', 'turned'];
export function platoAngle(pose) {
  if (!PLATO_POSES.includes(pose)) throw new RangeError('Choose a front or turned circle.');
  return pose === 'front' ? 0 : Math.PI / 3;
}
export function platoCircle(pose) {
  const angle = platoAngle(pose);
  return Array.from({length: 64}, (_, i) => {
    const t = i * Math.PI / 32, x = Math.cos(t);
    return {x: x * Math.cos(angle), y: Math.sin(t), z: -x * Math.sin(angle)};
  });
}
export function platoDiagram(pose) {
  const path = platoCircle(pose).map((p, i) => (i ? 'L' : 'M') + (750 + 180 * p.x) + ' ' + (256 - 180 * p.y)).join(' ') + 'Z';
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 512"><rect width="1024" height="512" fill="#f2e9d5"/><g fill="none" stroke="#3c6256" stroke-width="7"><circle cx="250" cy="256" r="180"/><path d="' + path + '"/></g><g stroke="#a37230" stroke-width="5"><path d="M250 256H430 M750 256H' + (750 + 180 * Math.cos(platoAngle(pose))) + '"/></g><g fill="#a37230"><circle cx="250" cy="256" r="7"/><circle cx="750" cy="256" r="7"/></g></svg>';
}
