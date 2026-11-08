import {BABEL} from './babel-library-model.js?v=two-faces2';

// The existing open book and the reservoir share one physical contact point.
const offset=.255,leafTilt=.10,leafThickness=.035,leafY=BABEL.base+.805;
export const BABEL_READING_BOOK=Object.freeze({
 offset,leafTilt,leafThickness,leafY,leafWidth:.52,leafDepth:.76,
 contact:Object.freeze({x:0,y:leafY+offset*Math.tan(leafTilt)+leafThickness/(2*Math.cos(leafTilt)),z:0})
});
