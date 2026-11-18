// One park-green authority for the existing coastal lawn and its map.
export const PARK_GRASS_HEX = 0x9aaf86;
export const PARK_GRASS_CSS = '#9aaf86';
export const COURT_GRASS_HEX = [0x72865f, 0x899871, 0x7b8f66];
export const isCoastalLawnCell = cell => cell.vertices.some(([x, z]) => Math.hypot(x, z) >= 390);
export const courtGrassIndex = cell => ((cell.q - cell.r) % 3 + 3) % 3;
export const lawnMapColour = cell => isCoastalLawnCell(cell)
  ? PARK_GRASS_CSS : '#' + COURT_GRASS_HEX[courtGrassIndex(cell)].toString(16).padStart(6, '0');

export function createParkGrassMaterial(T, source) {
  const material = source?.clone ? source.clone()
    : new T.MeshStandardMaterial({color: PARK_GRASS_HEX, roughness: 1, metalness: 0});
  material.color.setHex(PARK_GRASS_HEX);
  material.vertexColors = false;
  return material;
}
