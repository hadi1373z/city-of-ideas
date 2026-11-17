/**
 * Planar-camera and oblique-clipping approach adapted from three.js Reflector.
 * Copyright 2010-2026 Three.js Authors. SPDX-License-Identifier: MIT.
 * License: city-source-assets/home-tools/vendor/LICENSE-three.txt.
 * Floor-plane discovery and the world-frame integration are original here.
 */
// The host has already placed its camera and floor in the physical world frame.
export const MIRROR_READING_FLOOR=Object.freeze({innerRadius:19,outerRadius:58,floorY:.13,desktopSize:512,mobileSize:256,clipBias:.0005,movingInterval:90,stillInterval:300});
export function reflectPoint(T,point,plane,target=new T.Vector3()){
 return target.copy(point).addScaledVector(plane.normal,-2*plane.distanceToPoint(point));
}
export function reflectDirection(T,direction,plane,target=new T.Vector3()){
 return target.copy(direction).addScaledVector(plane.normal,-2*plane.normal.dot(direction));
}
/** Derive the real plane from the borrowed mesh, not from an assumed world Y. */
export function readingFloorPlane(T,floor,target=new T.Plane()){
 floor.updateWorldMatrix(true,false);const p=new T.Vector3().fromBufferAttribute(floor.geometry.attributes.position,0).applyMatrix4(floor.matrixWorld),normal=new T.Vector3().fromBufferAttribute(floor.geometry.attributes.normal,0).applyNormalMatrix(new T.Matrix3().getNormalMatrix(floor.matrixWorld));
 return target.setFromNormalAndCoplanarPoint(normal,p);
}
/** Reflect a camera in world space, then clip away the back of the mirror. */
export function reflectionCamera(T,source,plane,target=new T.PerspectiveCamera(),textureMatrix=new T.Matrix4()){
 source.updateWorldMatrix(true,false);const eye=source.getWorldPosition(new T.Vector3()),orientation=source.getWorldQuaternion(new T.Quaternion()),forward=new T.Vector3(0,0,-1).applyQuaternion(orientation),up=new T.Vector3(0,1,0).applyQuaternion(orientation);
 target.copy(source,false);target.matrixAutoUpdate=true;target.position.copy(reflectPoint(T,eye,plane));target.up.copy(reflectDirection(T,up,plane));target.scale.set(1,1,1);target.lookAt(reflectPoint(T,eye.clone().add(forward),plane));target.updateMatrixWorld(true);target.projectionMatrix.copy(source.projectionMatrix);
 textureMatrix.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1).multiply(target.projectionMatrix).multiply(target.matrixWorldInverse);
 const local=plane.clone().applyMatrix4(target.matrixWorldInverse),clip=new T.Vector4(local.normal.x,local.normal.y,local.normal.z,local.constant),p=target.projectionMatrix.elements,q=new T.Vector4((Math.sign(clip.x)+p[8])/p[0],(Math.sign(clip.y)+p[9])/p[5],-1,(1+p[10])/p[14]),denominator=clip.dot(q);
 if(Math.abs(denominator)<1e-10)throw Error('The mirror clipping plane is degenerate.');clip.multiplyScalar(2/denominator);p[2]=clip.x;p[6]=clip.y;p[10]=clip.z+1-MIRROR_READING_FLOOR.clipBias;p[14]=clip.w;target.projectionMatrixInverse.copy(target.projectionMatrix).invert();return{camera:target,textureMatrix,eye,forward};
}
