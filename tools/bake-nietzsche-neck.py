"""Bake a short, skin-coloured neck transition from the supplied portrait maps.

Requires numpy and Pillow. No new portrait or external image is generated.
"""
import io
import json
from pathlib import Path
import struct
import sys
import numpy as np
from PIL import Image

source,roots_file,out_dir=map(Path,sys.argv[1:])
out_dir.mkdir(parents=True,exist_ok=True)
b=source.read_bytes();length=struct.unpack_from('<I',b,12)[0]
d=json.loads(b[20:20+length]);binary=b[28+length:]
node=next(n for n in d['nodes'] if n.get('name')=='nietzsche-supplied-head-neck')
primitive=d['meshes'][node['mesh']]['primitives'][0]
material=d['materials'][primitive['material']]

def accessor(index):
    a=d['accessors'][index];v=d['bufferViews'][a['bufferView']]
    return np.frombuffer(binary,dtype='<f4',count=a['count']*{'VEC2':2,'VEC3':3}[a['type']],
                         offset=v.get('byteOffset',0)+a.get('byteOffset',0)).reshape(a['count'],-1)

p=accessor(primitive['attributes']['POSITION']);uv=accessor(primitive['attributes']['TEXCOORD_0'])
# The exposed side of the original neck, above its clothing, supplies the tone.
skin=(p[:,1]>1.56)&(p[:,1]<1.61)&(abs(p[:,0])>.05)&(abs(p[:,0])<.08)&(p[:,2]>-.04)&(p[:,2]<.02)
if skin.sum()<20:raise RuntimeError('Insufficient original neck skin samples')
roots=np.array(json.loads(roots_file.read_text()),dtype=float)
width,height=1024,256
u=np.arange(width)/width*len(roots)
lo=u.astype(int)%len(roots);hi=(lo+1)%len(roots);fraction=(u%1)[:,None]
delta=roots[hi]-roots[lo]
fraction[np.linalg.norm(delta,axis=1)>.15]=0 # Never interpolate across UV islands.
sample_uv=roots[lo]+delta*fraction
t=np.arange(height)/(height-1);fade=np.clip(t/.23,0,1);fade=fade*fade*(3-2*fade)

for name,index in [('base',material['pbrMetallicRoughness']['baseColorTexture']['index']),
                   ('emission',material['emissiveTexture']['index']),
                   ('roughness',material['pbrMetallicRoughness']['metallicRoughnessTexture']['index'])]:
    image=d['images'][d['textures'][index]['source']];v=d['bufferViews'][image['bufferView']]
    image=np.array(Image.open(io.BytesIO(binary[v['byteOffset']:v['byteOffset']+v['byteLength']])).convert('RGB'),dtype=float)
    h,w=image.shape[:2]
    def sample(coords):
        x=np.clip(coords[:,0]*w,0,w-1).astype(int);y=np.clip(coords[:,1]*h,0,h-1).astype(int)
        return image[y,x]
    top=sample(sample_uv)
    tone=np.median(sample(uv[skin]),axis=0)
    atlas=top[None,:,:]*(1-fade[:,None,None])+tone[None,None,:]*fade[:,None,None]
    Image.fromarray(np.rint(np.clip(atlas,0,255)).astype(np.uint8)).save(out_dir/(name+'.png'))
