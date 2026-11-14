import {houseWorld} from './foundation-houses-data.js';

export const CALVINO_LENSES = ['memory', 'routes', 'measure'];
// Every reading uses the same safe mark, looking through the existing frames.
export function calvinoViewingPose(house) {
  return {...houseWorld(house, -2, -2), y: .13, yaw: house.turn + Math.PI / 2, pitch: -.04};
}
