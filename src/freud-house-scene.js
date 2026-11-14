import {FREUD_PHASES, freudLayers} from './freud-house-model.js';

export function buildFreudStudy(T, {feature, own, mat, box, canvas, wood, paper, brass, red, furniture}) {
  const green = mat(0x526a59);
  // New furnishings surround the original couch; none of its geometry is replaced.
  box(feature, 5.9, .018, 4.7, -4.6, .012, -2.6, red);
  for (const x of [-7.35, -1.85]) box(feature, .055, .022, 4.3, x, .026, -2.6, paper);
  for (const z of [-4.75, -.45]) box(feature, 5.5, .022, .055, -4.6, .026, z, paper);
  for (const x of [-7.4, -2.2]) box(feature, .16, 3.2, .55, x, 1.6, -7.4, wood);
  for (const y of [.15, 1.2, 2.25, 3.2]) box(feature, 5.3, .12, .6, -4.8, y, -7.4, wood);
  for (let row = 0; row < 3; row++) for (let i = 0; i < 15; i++) box(feature, .24, .6 + i % 3 * .08, .35, -6.95 + i * .3, .51 + row * 1.05, -7.35, [paper, green, red][(i + row) % 3]);
  furniture(-4.8, -7.4, 5.4, .65);
  box(feature, .95, .1, 1.05, -7.35, .82, -1.1, wood);
  for (const x of [-7.7, -7]) for (const z of [-1.47, -.73]) box(feature, .08, .77, .08, x, .385, z, wood);
  box(feature, .5, .07, .65, -7.35, .91, -1.1, paper); furniture(-7.35, -1.1, 1, 1.1);
  box(feature, 4.4, .12, 2.6, 4.8, 1.05, -3.3, wood);
  for (const x of [2.9, 6.7]) for (const z of [-4.3, -2.3]) box(feature, .12, .99, .12, x, .495, z, wood);
  furniture(4.8, -3.3, 4.4, 2.6);
  box(feature, 1.3, .14, 1.1, 4.8, .5, -.7, wood); box(feature, 1.3, .85, .13, 4.8, 1.05, -.21, wood);
  for (const x of [4.3, 5.3]) for (const z of [-1.1, -.3]) box(feature, .1, .43, .1, x, .215, z, wood);
  furniture(4.8, -.7, 1.4, 1.25);
  box(feature, .55, .04, .55, 6.45, 1.14, -4.15, brass); box(feature, .045, .82, .045, 6.45, 1.57, -4.15, brass);
  const shade = new T.Mesh(own(new T.CylinderGeometry(.18, .35, .32, 16)), mat(0xe3c98f, {emissive: 0x493820})); shade.position.set(6.45, 2, -4.15); feature.add(shade);
  box(feature, .25, .18, .25, 2.95, 1.22, -4.15, green);
  const pen = box(feature, .025, .48, .025, 3.05, 1.45, -4.12, brass); pen.rotation.z = -.45;
  const folio = new T.Group(); folio.name = 'Freud reading folio'; folio.position.set(4.8, 1.11, -3.3); feature.add(folio);
  function illustratedSheet(kind, x) {
    const sheet = new T.Group(); sheet.name = 'Freud folio · ' + kind; sheet.position.set(x, .015, 0); folio.add(sheet);
    const c = canvas(); c.width = 640; c.height = 800; const ctx = c.getContext('2d');
    ctx.fillStyle = '#f2e8d1'; ctx.fillRect(0, 0, 640, 800); ctx.strokeStyle = '#7b5344'; ctx.lineWidth = 10;
    const envelope = (x, y, w, h) => {ctx.strokeRect(x, y, w, h); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w / 2, y + h * .55); ctx.lineTo(x + w, y); ctx.stroke();};
    if (kind === 'report') {
      for (const [x, y] of [[60, 380], [220, 330], [380, 380]]) envelope(x, y, 155, 120);
      ctx.beginPath(); ctx.moveTo(55, 560); ctx.quadraticCurveTo(320, 650, 585, 560); ctx.stroke();
      ctx.beginPath(); ctx.arc(320, 200, 85, 0, Math.PI * 2); ctx.stroke();
    } else {
      envelope(70, 100, 210, 150); ctx.beginPath(); ctx.arc(460, 180, 80, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(70, 480); ctx.bezierCurveTo(220, 340, 420, 620, 570, 480); ctx.moveTo(70, 540); ctx.bezierCurveTo(220, 400, 420, 680, 570, 540); ctx.stroke();
    }
    const map = own(new T.CanvasTexture(c)); map.colorSpace = T.SRGBColorSpace;
    const image = new T.Mesh(own(new T.BoxGeometry(1.35, .025, 1.75)), own(new T.MeshBasicMaterial({map, toneMapped: false}))); sheet.add(image); return sheet;
  }
  const report = illustratedSheet('report', -.8), context = illustratedSheet('context', .65);
  const question = new T.Group(); question.name = 'Open question frame'; question.position.set(1.3, 0, -1); folio.add(question);
  for (const x of [-.35, .35]) box(question, .055, .75, .06, x, .375, 0, wood);
  for (const y of [.03, .75]) box(question, .75, .055, .06, 0, y, 0, wood);
  box(question, .9, .06, .3, 0, .03, 0, brass);
  let phase = 'report';
  const exhibit = {folio, report, context, question, get phase() {return phase;}, setPhase(id) {
    if (!FREUD_PHASES.includes(id)) return false;
    const layers = freudLayers(id); report.visible = layers.report; context.visible = layers.context; question.visible = layers.question; phase = id; return true;
  }};
  exhibit.setPhase(phase); return exhibit;
}
