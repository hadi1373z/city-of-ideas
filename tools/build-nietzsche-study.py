"""Blender head-and-shoulders construction study for Nietzsche concept A.

blender --background --python tools/build-nietzsche-study.py -- --output DIR
This builds real editable mesh geometry, not a portrait pasted on a plane.
The study is intentionally separate from the production character and voice.
"""
import argparse
import json
import hashlib
import math
import random
import subprocess
from pathlib import Path
import sys

import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree

args = argparse.ArgumentParser()
args.add_argument('--output', required=True, type=Path)
args.add_argument('--render', action='store_true')
args.add_argument('--reference', type=Path)
opt = args.parse_args(sys.argv[sys.argv.index('--')+1:])
opt.output = opt.output.resolve()
opt.output.mkdir(parents=True, exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
model = bpy.data.collections.new('Nietzsche A - editable construction study')
bpy.context.scene.collection.children.link(model)


def material(name, color, roughness=.55, metal=0):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1)
    m.use_nodes = True
    shader = m.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = (*color, 1)
    shader.inputs['Roughness'].default_value = roughness
    shader.inputs['Metallic'].default_value = metal
    return m


skin = material('Warm skin', (.61, .355, .235))
lip = material('Muted natural lip', (.38, .16, .115))
hair = material('Dark chestnut', (.022, .011, .006), .68)
hairlight = material('Chestnut lock highlights', (.035, .018, .009), .65)
hairdark = material('Chestnut lowlights', (.013, .006, .003), .72)
white = material('Warm eye white', (.74, .72, .65), .3)
iris = material('Brown iris', (.10, .055, .024), .26)
pupil = material('Pupil', (.006, .004, .003), .18)
bronze = material('Fine bronze spectacles', (.24, .16, .075), .32, .7)
wool = material('Brown wool', (.075, .044, .029), .91)
lapel = material('Lapel weave', (.11, .065, .040), .87)
linen = material('Ivory linen', (.71, .64, .49), .85)
cravat = material('Dark cravat', (.031, .022, .017), .82)


def own(obj, mat):
    for collection in list(obj.users_collection):
        collection.objects.unlink(obj)
    model.objects.link(obj)
    obj.data.materials.append(mat)
    for face in obj.data.polygons:
        face.use_smooth = True
    return obj


def mesh(name, positions, triangles, mat):
    data = bpy.data.meshes.new(name)
    data.from_pydata(positions, [], triangles)
    data.update()
    obj = bpy.data.objects.new(name, data)
    model.objects.link(obj)
    data.materials.append(mat)
    for face in data.polygons:
        face.use_smooth = True
    return obj


def ellipsoid(name, center, size, mat):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=20, location=center)
    obj = bpy.context.object
    obj.name = name
    obj.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return own(obj, mat)


def smooth(t):
    t = max(0, min(1, t))
    return t*t*(3-2*t)


def spline(points, t):
    t = max(0, min(.999999, t))*(len(points)-1)
    i = int(t)
    u = t-i
    a, b, c, d = [Vector(points[min(len(points)-1, max(0, k))]) for k in [i-1, i, i+1, i+2]]
    return .5*((2*b)+(-a+c)*u+(2*a-5*b+4*c-d)*u*u+(-a+3*b-3*c+d)*u*u*u)


def sweep(name, path, width, depth, mat, steps=36, sides=10):
    positions, faces = [], []
    for i in range(steps+1):
        t = i/steps
        center = spline(path, t)
        tangent = (spline(path, min(1, t+.001))-spline(path, max(0, t-.001))).normalized()
        axis = tangent.cross(Vector((0, 1, .1))).normalized()
        if axis.length < .01:
            axis = tangent.cross(Vector((1, 0, 0))).normalized()
        other = tangent.cross(axis).normalized()
        taper = .025+.975*math.sin(math.pi*t)**.40
        for j in range(sides):
            angle = 2*math.pi*j/sides
            positions.append(center+axis*(math.cos(angle)*width*taper)+other*(math.sin(angle)*depth*taper))
            if i < steps:
                a = i*sides+j
                b = i*sides+(j+1)%sides
                faces.extend([(a, b, a+sides), (b, b+sides, a+sides)])
    faces.append(tuple(reversed(range(sides))))
    faces.append(tuple(steps*sides+j for j in range(sides)))
    return mesh(name, positions, faces, mat)


# Horizontal skull/neck sections: height, half-width, depth center, half-depth.
sections = [(.335,.069,.025,.062),(.43,.067,.022,.064),(.51,.069,.016,.067),
            (.56,.076,.007,.087),(.60,.108,.005,.115),(.65,.124,.006,.131),
            (.71,.134,.010,.141),(.77,.144,.012,.146),(.83,.145,.014,.148),
            (.90,.141,.019,.145),(.97,.129,.022,.132),(1.025,.099,.025,.104),
            (1.064,.055,.026,.060),(1.079,.001,.026,.001)]


def profile(z):
    for i in range(len(sections)-1):
        if z <= sections[i+1][0]:
            lo, hi = sections[i], sections[i+1]
            u = (z-lo[0])/(hi[0]-lo[0])
            p0, p1, p2, p3 = [Vector(sections[min(len(sections)-1,max(0,k))][1:]) for k in [i-1,i,i+1,i+2]]
            return .5*((2*p1)+(-p0+p2)*u+(2*p0-5*p1+4*p2-p3)*u*u+(-p0+3*p1-3*p2+p3)*u*u*u)
    return Vector(sections[-1][1:])


def face_depth(x, z, base, front):
    # Continuous sculpted volumes; the nose is part of the facial surface.
    g = lambda a, b: math.exp(-a*a-b*b)
    base -= front*(.047*g(x/.024,(z-.766)/.075)+.032*g(x/.030,(z-.716)/.023))
    base += front*.017*g((abs(x)-.061)/.028,(z-.808)/.025)
    base -= front*.012*g((abs(x)-.097)/.032,(z-.738)/.043)
    base -= front*.012*g(x/.048,(z-.596)/.028)
    base -= front*.007*g((abs(x)-.056)/.043,(z-.853)/.016)
    return base


positions, faces = [], []
rows, sides = 170, 192
for r in range(rows+1):
    z = sections[0][0]+(sections[-1][0]-sections[0][0])*r/rows
    rx, cy, ry = profile(z)
    for c in range(sides):
        angle = 2*math.pi*c/sides
        x = rx*math.sin(angle)
        y = cy+ry*math.cos(angle)
        y = face_depth(x, z, y, max(0,-math.cos(angle))**8)
        positions.append((x,y,z))
        if r < rows:
            a = r*sides+c; b = r*sides+(c+1)%sides
            faces.extend([(a,a+sides,b),(b,a+sides,b+sides)])
head = mesh('Continuous sculpted head and neck', positions, faces, skin)
head['purpose'] = 'Editable construction study; facial likeness and animation need further artist review.'

# Ears with an outer rim, concha and tragus, kept small against the skull.
for side in [-1,1]:
    ellipsoid('Ear volume', (side*.147,.016,.771), (.023,.015,.044), skin)
    sweep('Ear helix',[(side*.155,.005,.735),(side*.167,.005,.768),(side*.160,.006,.805),(side*.148,.003,.802)],.004,.004,skin)
    ellipsoid('Ear concha shadow',(side*.160,-.002,.768),(.008,.002,.016),lip)
    ellipsoid('Tragus',(side*.146,-.008,.764),(.008,.005,.010),skin)

for side in [-1,1]:
    x = side*.061
    ellipsoid('Eye sclera',(x,-.143,.808),(.025,.012,.0085),white)
    ellipsoid('Iris',(x,-.155,.808),(.009,.0018,.008),iris)
    ellipsoid('Pupil',(x,-.1565,.808),(.0045,.0011,.005),pupil)
    ellipsoid('Eye highlight',(x-.002,-.1575,.811),(.0017,.0008,.0017),white)
    sweep('Upper eyelid',[(x-.026,-.145,.807),(x-.012,-.158,.817),(x+.010,-.158,.817),(x+.026,-.145,.807)],.0037,.0032,skin)
    sweep('Lower eyelid',[(x-.026,-.145,.807),(x-.010,-.157,.801),(x+.012,-.156,.801),(x+.026,-.145,.807)],.0027,.0027,skin)
    sweep('Expressive brow',[(side*.027,-.153,.846),(side*.055,-.150,.858),(side*.082,-.139,.856),(side*.108,-.117,.844)],.0042,.005,hair)
    # An unobtrusive bronze frame with a real sidearm.
    ring=[]
    for i in range(49):
        a=i/48*2*math.pi
        ring.append((x+.034*math.cos(a),-.177+side*.003*math.cos(a),.809+.030*math.sin(a)))
    sweep('Round bronze spectacle rim',ring,.00135,.00135,bronze,steps=96,sides=6)
    sweep('Spectacle temple',[(side*.095,-.175,.812),(side*.136,-.118,.815),(side*.154,-.002,.802),(side*.154,.021,.787)],.0014,.0014,bronze)
sweep('Spectacle bridge',[(-.027,-.177,.817),(0,-.191,.826),(.027,-.177,.817)],.0014,.0014,bronze)

# Lips sit on the underlying muzzle; hair grows outward from that surface.
sweep('Upper lip',[(-.036,-.132,.661),(0,-.148,.665),(.036,-.132,.661)],.0017,.002,lip)
sweep('Lower lip',[(-.033,-.132,.656),(0,-.148,.651),(.033,-.132,.656)],.0025,.002,lip)
ellipsoid('Moustache connected center',(0,-.159,.690),(.049,.017,.022),hair)
for side in [-1,1]:
    for row in range(8):
        t=row/7
        sweep('Moustache tapered lock',[(side*(.006+t*.012),-.163,.705-t*.013),
            (side*(.040+t*.014),-.177,.691-t*.024),
            (side*(.074+t*.016),-.160,.671-t*.022),
            (side*(.094+t*.010),-.130,.644-t*.014)],.009,.011,[hair,hairlight,hairdark][row%3],steps=28,sides=8)

# A close scalp under coherent swept-back locks: no sphere/pompadour silhouette.
hp, hf = [], []
for r in range(25):
    for c in range(65):
        phi=c/64*math.pi*2;theta=r/24*(1.80+.35*math.cos(phi))
        hp.append((.153*math.sin(phi)*math.sin(theta),.020+.160*math.cos(phi)*math.sin(theta),.94+.160*math.cos(theta)))
        if r<24 and c<64:
            a=r*65+c;hf.extend([(a,a+1,a+65),(a+1,a+66,a+65)])
mesh('Fitted scalp under swept locks',hp,hf,hair)
for i in range(29):
    t=(i-14)/14; x=t*.139
    sweep('Swept hair lock %02d'%i,[(x,-.159+abs(t)*.035,.971+abs(t)*.026+math.sin(i*.8)*.005),
        (x*.98-.020,-.112,1.046+math.sin(i*.43)*.010-abs(t)*.014),
        (x*.91-.015,.014,1.087+math.sin(i*.5)*.006-abs(t)*.024),
        (x*.83,.132,1.005-abs(t)*.022)],.010,.0055,[hair,hairlight,hair,hairdark][i%4],steps=44,sides=8)
for side in [-1,1]:
    for i in range(10):
        sweep('Temple swept lock',[(side*(.122+i*.002),-.077+i*.003,.983-i*.009),
            (side*(.152+i*.0006),.010,.998-i*.010),(side*.145,.105,.956-i*.010),
            (side*.103,.157,.884-i*.008)],.008,.0045,[hair,hairdark,hairlight][i%3],steps=32,sides=8)

def panel(name,points,mat):
    indices=tuple(range(len(points)))
    if (Vector(points[1])-Vector(points[0])).cross(Vector(points[2])-Vector(points[0])).y>0:
        indices=tuple(reversed(indices))
    ob=mesh(name,points,[indices],mat)
    solid=ob.modifiers.new('Tailored cloth thickness','SOLIDIFY');solid.thickness=.004
    bevel=ob.modifiers.new('Soft garment edges','BEVEL');bevel.width=.003;bevel.segments=3
    return ob

# Compress the initial long blockout into adult portrait proportions.
for ob in model.objects:
    if ob.type != 'MESH':
        continue
    inverse = ob.matrix_world.inverted()
    for vertex in ob.data.vertices:
        point = ob.matrix_world @ vertex.co
        if point.z > .40:
            point.z = .40+(point.z-.40)*.78
        if 'jacket' in ob.name.lower() or 'lapel' in ob.name.lower() or 'wool' in ob.name.lower():
            point.x *= 1.08
        vertex.co = inverse @ point
    ob.data.update()


# Use the project's CC0-derived anatomical topology as a sculpting base instead
# of keeping the initial analytic facial blockout. Existing characters are not edited.
base_file = Path(__file__).resolve().parents[1]/'src/ramsey-film/assets/turing.glb'
base_commit = '760f74100be29b07ca24cf94a7b1d8959ab225ea'
base_sha256 = 'cceb1c939cddf5da42428ae149a041a063ed6ad1aa6efe854f3720604bd80e3c'
if hashlib.sha256(base_file.read_bytes()).hexdigest()!=base_sha256:
    # Later city wardrobe revisions must not silently change this study's base.
    raw_base=subprocess.run(['git','show',base_commit+':src/ramsey-film/assets/turing.glb'],
        cwd=Path(__file__).resolve().parents[1],check=True,capture_output=True,
        creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0)).stdout
    if hashlib.sha256(raw_base).hexdigest()!=base_sha256:
        raise RuntimeError('Pinned anatomical base did not match its recorded checksum')
    base_file=opt.output/'cc0-anatomical-base.glb';base_file.write_bytes(raw_base)
remove_prefixes = ['Continuous sculpted head','Ear volume','Ear helix','Ear concha','Tragus',
                   'Eye sclera','Iris','Pupil','Eye highlight','Upper eyelid','Lower eyelid',
                   'Expressive brow','Upper lip','Lower lip','Fitted scalp','Swept hair lock','Temple swept lock']
for ob in list(model.objects):
    if any(ob.name.startswith(prefix) for prefix in remove_prefixes):
        bpy.data.objects.remove(ob,do_unlink=True)
existing=set(bpy.data.objects)
bpy.ops.import_scene.gltf(filepath=str(base_file))
bpy.context.view_layer.update()
imported=set(bpy.data.objects)-existing
sources=[ob for ob in imported if ob.type=='MESH' and (ob.name.startswith('Mesh_0') or any(k in ob.name for k in ['anatomical-eye','tapered-brow','sculpted-continuous-hair']))]
for source in sorted(sources,key=lambda ob:ob.name):
    evaluated=source.evaluated_get(bpy.context.evaluated_depsgraph_get())
    data=bpy.data.meshes.new_from_object(evaluated,preserve_all_data_layers=True,depsgraph=bpy.context.evaluated_depsgraph_get())
    is_hair='hair'in source.name
    for vertex in data.vertices:
        point=source.matrix_world@vertex.co
        x=-point.x*.94; y=-point.y*.75+.004; z=.718+(point.z-1.732)*.90
        if is_hair:
            z+=.035*math.exp(-((x+.035)/.120)**2-((y+.085)/.110)**2)*smooth((z-.79)/.065)
        elif source.name.startswith('Mesh_0'):
            y-=.009*math.exp(-(x/.026)**2-((z-.665)/.047)**2)
            x*=1+.055*math.exp(-((z-.575)/.045)**2)
            if z<.49:z-=.055*(1-smooth((z-.435)/.055))
        vertex.co=(x,y,z)
    data.update()
    if is_hair:
        data.materials.clear();data.materials.append(hair)
    ob=bpy.data.objects.new('Nietzsche A anatomical '+source.name,data);model.objects.link(ob)
    ob['source']='Project MakeHuman CC0-derived anatomical base, reshaped for this construction study'
for ob in imported:
    bpy.data.objects.remove(ob,do_unlink=True)
for ob in model.objects:
    if ob.name.startswith('Moustache'):
        for vertex in ob.data.vertices:
            vertex.co.y-=.028
# Rebuild the torso around the actual anatomical neck. The former narrow,
# six-ring chest and flat collar cards did not share the head's proportions.
for ob in list(model.objects):
    if any(ob.name.startswith(prefix) for prefix in ['Tailored wool','Ivory shirt','Shirt collar',
            'Notched jacket','Cravat','Continuous standing shirt','Removable study base']):
        bpy.data.objects.remove(ob,do_unlink=True)
wool.diffuse_color=(.065,.043,.030,1)
wool.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=wool.diffuse_color
lapel.diffuse_color=(.078,.051,.036,1)
lapel.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=lapel.diffuse_color
linen.diffuse_color=(.65,.60,.50,1)
linen.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=linen.diffuse_color

torso_sections=[(.02,.270,.123),(.10,.285,.130),(.22,.318,.137),(.31,.347,.135),
                (.37,.347,.123),(.406,.285,.106),(.434,.160,.085),(.452,.080,.060)]
positions,faces=[],[]
for row in range(57):
    z,rx,ry=spline(torso_sections,row/56)
    for col in range(96):
        angle=col/96*2*math.pi
        positions.append((rx*math.sin(angle),.010+ry*math.cos(angle),z))
        if row<56:
            a=row*96+col;b=row*96+(col+1)%96
            faces.extend([(a,a+96,b),(b,a+96,b+96)])
mesh('Tailored wool shoulders - anatomical proportions',positions,faces,wool)

# A fitted closed collar surrounds the same neck cross-section on every side.
# Its bottom overlaps the jacket; the rear remains visible in the back view.
positions,faces=[],[]
for row in range(6):
    t=row/5;z=.423+t*.060
    for col in range(96):
        angle=col/96*2*math.pi
        positions.append(((.083-.009*t)*math.sin(angle),.005+(.066-.011*t)*math.cos(angle),z))
        if row<5:
            a=row*96+col;b=row*96+(col+1)%96
            faces.extend([(a,a+96,b),(b,a+96,b+96)])
collar=mesh('Fitted ivory neck collar',positions,faces,linen)
thickness=collar.modifiers.new('Folded collar thickness','SOLIDIFY');thickness.thickness=.002
panel('Fitted shirt under jacket',[(-.071,-.061,.449),(.071,-.061,.449),(.065,-.136,.270),
                                   (0,-.143,.205),(-.065,-.136,.270)],linen)
for side in [-1,1]:
    panel('Folded collar point',[(side*.007,-.053,.476),(side*.066,-.044,.478),
                                (side*.077,-.073,.445),(side*.030,-.086,.423)],linen)
    panel('Curved notched lapel',[(side*.075,-.063,.449),(side*.210,-.100,.396),
          (side*.181,-.117,.355),(side*.208,-.128,.338),(side*.049,-.145,.174),
          (side*.044,-.123,.365)],lapel)
ellipsoid('Cravat fitted knot',(0,-.080,.438),(.018,.011,.013),cravat)
panel('Cravat fitted fall',[(-.012,-.081,.433),(.012,-.081,.433),(.020,-.142,.291),
                           (0,-.145,.268),(-.020,-.142,.291)],cravat)

def torso_front(x,z):
    low,high=0.,1.
    for _ in range(18):
        t=(low+high)/2
        if spline(torso_sections,t).x<z:low=t
        else:high=t
    _,rx,ry=spline(torso_sections,(low+high)/2)
    return .010-ry*math.sqrt(max(.001,1-(x/rx)**2))

# Conform the shirt, lapels and tie over the curved chest. Flat polygon cards
# cut into the shoulder surface when viewed obliquely.
for ob in list(model.objects):
    if not any(ob.name.startswith(prefix) for prefix in ['Fitted shirt','Curved notched lapel','Cravat fitted fall']):continue
    bpy.ops.object.select_all(action='DESELECT');ob.select_set(True);bpy.context.view_layer.objects.active=ob
    bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.quads_convert_to_tris();bpy.ops.mesh.subdivide(number_cuts=5)
    bpy.ops.object.mode_set(mode='OBJECT')
    offset=.004 if ob.name.startswith('Fitted shirt') else .010 if 'lapel' in ob.name else .016
    for vertex in ob.data.vertices:
        vertex.co.y=torso_front(vertex.co.x,vertex.co.z)-offset
    ob.data.update()
button_mat=material('Horn jacket buttons',(.025,.019,.013),.55)
for z in [.159,.080]:
    ellipsoid('Jacket horn button',(.019,-.127,z),(.006,.003,.006),button_mat)
bpy.ops.mesh.primitive_cylinder_add(vertices=96,radius=.285,depth=.024,location=(0,.012,.006))
plinth=own(bpy.context.object,material('Study base revised',(.028,.023,.019),.8))
plinth.name='Removable study base';plinth.scale.y=.48

# Groomed mesh fibres survive GLB export and work without a hair simulator.
# A fixed seed keeps revisions and screenshots reproducible.
rng = random.Random(1427)
groom_counts = {'eyebrow': 0, 'moustache': 0, 'scalp': 0}
groom_parts = []

def fibre(kind, points, radius, steps=10):
    mat = rng.choices([hair, hairlight, hairdark], weights=[6, 1, 3])[0]
    ob = sweep(kind+' tapered fibres', points, radius, radius*.8, mat, steps=steps, sides=3)
    groom_parts.append(ob)
    return ob

# Follow the actual brow surface, then remove the old smooth strip completely.
for brow in [ob for ob in list(model.objects) if 'tapered-brow' in ob.name]:
    brow.data.calc_loop_triangles()
    tris = list(brow.data.loop_triangles)
    weights = [max(t.area, 1e-12) for t in tris]
    side = 1 if sum(v.co.x for v in brow.data.vertices)>0 else -1
    for i in range(240):
        tri = rng.choices(tris, weights=weights)[0]
        a,b,c = [brow.data.vertices[j].co for j in tri.vertices]
        u,v = rng.random(),rng.random()
        if u+v>1:u,v=1-u,1-v
        root = a+(b-a)*u+(c-a)*v
        root.y -= .0005
        along = max(0,min(1,(abs(root.x)-.02)/.075))
        length = rng.uniform(.006,.012)*(1-.35*along)
        # Inner hairs stand up; outer hairs gradually lie toward the temple.
        direction = Vector((side*(.30+.8*along), .03, .92-.75*along)).normalized()
        jitter = Vector((rng.uniform(-.001,.001),0,rng.uniform(-.0007,.0007)))
        fibre('Eyebrow', [root,root+direction*length*.48+Vector((0,-.0015,0)),
                          root+direction*length+jitter+Vector((0,-.0004,-.001))],
              rng.uniform(.00028,.00049),steps=7)
        groom_counts['eyebrow']+=1
    bpy.data.objects.remove(brow,do_unlink=True)

# Replace the thick paired lobes with overlapping fine hairs, rooted across
# the upper lip. Layered roots give volume without two solid hanging shapes.
for ob in [ob for ob in list(model.objects) if ob.name.startswith('Moustache')]:
    bpy.data.objects.remove(ob,do_unlink=True)
for side in [-1,1]:
    for i in range(260):
        row=rng.random(); column=rng.random()
        root_x=.003+.052*column
        root_z=.641-.012*row-.008*column
        root_y=-.198+.024*column**1.6+rng.uniform(-.0015,.0015)
        reach=rng.uniform(.042,.063)*(1-.35*column)
        fall=.025+.020*row+rng.uniform(-.003,.004)
        path=[(side*root_x,root_y,root_z),
              (side*(root_x+reach*.32),root_y-.009,root_z-.006),
              (side*(root_x+reach*.75),root_y-.005,root_z-fall*.62),
              (side*(root_x+reach),root_y+.010,root_z-fall)]
        fibre('Moustache',path,rng.uniform(.00038,.00076),steps=12)
        groom_counts['moustache']+=1

scalp=next(ob for ob in model.objects if 'sculpted-continuous-hair' in ob.name)
bpy.context.view_layer.objects.active=scalp
scalp.select_set(True)
soften=scalp.modifiers.new('Relax old cap grooves','SMOOTH');soften.factor=.65;soften.iterations=9
bpy.ops.object.modifier_apply(modifier=soften.name)
scalp.data.update();scalp.data.calc_loop_triangles()
tree=BVHTree.FromPolygons([v.co for v in scalp.data.vertices],[p.vertices[:] for p in scalp.data.polygons])
tris=[t for t in scalp.data.loop_triangles if sum(scalp.data.vertices[v].co.z for v in t.vertices)/3>.775]
areas=[max(t.area,1e-12) for t in tris]
for i in range(720):
    tri=rng.choices(tris,weights=areas)[0]
    a,b,c=[scalp.data.vertices[j].co for j in tri.vertices]
    u,v=rng.random(),rng.random()
    if u+v>1:u,v=1-u,1-v
    p=a+(b-a)*u+(c-a)*v
    length=rng.uniform(.045,.105)
    path=[]
    for j in range(15):
        nearest,normal,_,_=tree.find_nearest(p)
        if nearest is None:break
        # Sweep back and across the crown, with a softer side part.
        comb=Vector((-.30 if p.x<.075 else .14,1,.28))
        tangent=(comb-normal*comb.dot(normal)).normalized()
        lift=.0012+.0038*math.sin(math.pi*j/14)
        path.append(nearest+normal*lift)
        p=nearest+tangent*(length/14)
    if len(path)>2:
        fibre('Scalp hair',path,rng.uniform(.00038,.00065),steps=14)
        groom_counts['scalp']+=1

# Merge fibres by material and groom so the web viewer needs nine draw calls,
# rather than one draw call for every hair. The actual tapered geometry remains.
for kind in ['Eyebrow','Moustache','Scalp hair']:
    for mat in [hair,hairlight,hairdark]:
        parts=[ob for ob in groom_parts if ob.name.startswith(kind) and ob.data.materials[0]==mat]
        if not parts:continue
        groom_parts=[ob for ob in groom_parts if ob not in parts]
        bpy.ops.object.select_all(action='DESELECT')
        for ob in parts:ob.select_set(True)
        bpy.context.view_layer.objects.active=parts[0]
        bpy.ops.object.join()
        parts[0].name=kind+' groom - '+mat.name

# Bake skin detail into portable PBR maps. Blender-only procedural shaders
# would otherwise disappear in the browser's GLB renderer.
face=next(ob for ob in model.objects if ob.name=='Nietzsche A anatomical Mesh_0')
face_mat=face.data.materials[0].copy();face_mat.name='Skin - baked complexion and pores'
face.data.materials.clear();face.data.materials.append(face_mat)
nodes=face_mat.node_tree.nodes;links=face_mat.node_tree.links
shader=nodes.get('Principled BSDF');color=next(n for n in nodes if n.type=='VERTEX_COLOR')
complexion=face.data.color_attributes.new(name='Complexion',type='FLOAT_COLOR',domain='CORNER')
original=face.data.color_attributes['Color']
for i,loop in enumerate(face.data.loops):
    x,y,z=face.data.vertices[loop.vertex_index].co
    front=smooth((-y-.02)/.08)
    warm=front*(.65*math.exp(-((abs(x)-.084)/.045)**2-((z-.67)/.045)**2)
                  +.45*math.exp(-(x/.027)**2-((z-.668)/.040)**2))
    r,g,b,alpha=original.data[i].color
    complexion.data[i].color=(r*(1+.045*warm),g*(1-.055*warm),b*(1-.035*warm),alpha)
color.layer_name='Complexion'
texcoord=nodes.new('ShaderNodeTexCoord')
noise=nodes.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=90
noise.inputs['Detail'].default_value=3
links.new(texcoord.outputs['Object'],noise.inputs['Vector'])
variation=nodes.new('ShaderNodeMapRange');variation.inputs['To Min'].default_value=.95;variation.inputs['To Max'].default_value=1.035
links.new(noise.outputs['Fac'],variation.inputs['Value'])
mix=nodes.new('ShaderNodeMixRGB');mix.blend_type='MULTIPLY';mix.inputs[0].default_value=1
links.new(color.outputs['Color'],mix.inputs[1]);links.new(variation.outputs['Result'],mix.inputs[2]);links.new(mix.outputs['Color'],shader.inputs['Base Color'])
pores=nodes.new('ShaderNodeTexNoise');pores.inputs['Scale'].default_value=1200;pores.inputs['Detail'].default_value=2
links.new(texcoord.outputs['Object'],pores.inputs['Vector'])
bump=nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.30;bump.inputs['Distance'].default_value=.00035
links.new(pores.outputs['Fac'],bump.inputs['Height']);links.new(bump.outputs['Normal'],shader.inputs['Normal'])
rough=nodes.new('ShaderNodeMapRange');rough.inputs['To Min'].default_value=.43;rough.inputs['To Max'].default_value=.57
links.new(noise.outputs['Fac'],rough.inputs['Value']);links.new(rough.outputs['Result'],shader.inputs['Roughness'])
bpy.ops.object.select_all(action='DESELECT');face.select_set(True);bpy.context.view_layer.objects.active=face
bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.uv.smart_project(angle_limit=1.15,island_margin=.004)
bpy.ops.object.mode_set(mode='OBJECT')
bake_scene=bpy.context.scene;bake_scene.render.engine='CYCLES';bake_scene.cycles.samples=8
bake_scene.render.bake.margin=8
maps={}
target=nodes.new('ShaderNodeTexImage');nodes.active=target
for name,size,kind in [('Skin complexion',1024,'DIFFUSE'),('Skin pores normal',2048,'NORMAL')]:
    img=bpy.data.images.new(name,width=size,height=size,alpha=False)
    if kind=='NORMAL':img.colorspace_settings.name='Non-Color'
    target.image=img;nodes.active=target
    if kind=='DIFFUSE':
        bake_scene.render.bake.use_pass_direct=False;bake_scene.render.bake.use_pass_indirect=False;bake_scene.render.bake.use_pass_color=True
    bpy.ops.object.bake(type=kind)
    img.filepath_raw=str(opt.output/(name.lower().replace(' ','-')+'.png'));img.file_format='PNG';img.save();img.pack()
    maps[kind]=img
links.new(target.outputs['Color'],shader.inputs['Base Color'])
target.image=maps['DIFFUSE']
normal_tex=nodes.new('ShaderNodeTexImage');normal_tex.image=maps['NORMAL']
normal_map=nodes.new('ShaderNodeNormalMap');links.new(normal_tex.outputs['Color'],normal_map.inputs['Color']);links.new(normal_map.outputs['Normal'],shader.inputs['Normal'])
for link in list(shader.inputs['Roughness'].links):links.remove(link)
shader.inputs['Roughness'].default_value=.51

# Shorten the exposed neck while moving the whole head assembly together.
# Blend into the collar instead of leaving a stretched cylindrical neck.
for ob in model.objects:
    if not any(key in ob.name.lower() for key in ['anatomical','spectacle','eyebrow','moustache','scalp hair']):continue
    inverse=ob.matrix_world.inverted()
    for vertex in ob.data.vertices:
        point=ob.matrix_world@vertex.co
        point.z-=.028*smooth((point.z-.448)/.075)
        vertex.co=inverse@point
    ob.data.update()

scene=bpy.context.scene
world=bpy.data.worlds.new('Warm neutral studio');scene.world=world;world.use_nodes=True
world.node_tree.nodes['Background'].inputs[0].default_value=(.20,.21,.23,1)
world.node_tree.nodes['Background'].inputs[1].default_value=.45

def light(name,position,power,size,color):
    data=bpy.data.lights.new(name,'AREA');data.energy=power;data.shape='DISK';data.size=size;data.color=color
    ob=bpy.data.objects.new(name,data);scene.collection.objects.link(ob);ob.location=position
    ob.rotation_euler=(Vector((0,0,.70))-ob.location).to_track_quat('-Z','Y').to_euler()

light('Large soft key',(-1.8,-2.6,2.7),140,2.0,(1,.88,.74))
light('Cool fill',(1.8,-1.3,1.8),85,2.0,(.76,.85,1))
light('Hair rim',(.8,1.4,2.2),170,1.5,(1,.78,.52))
camdata=bpy.data.cameras.new('Study camera');cam=bpy.data.objects.new('Study camera',camdata);scene.collection.objects.link(cam);scene.camera=cam
camdata.type='ORTHO';camdata.ortho_scale=1.10
scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=32
scene.cycles.use_denoising=True
scene.render.resolution_x=800;scene.render.resolution_y=1000;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.render.film_transparent=False
scene.view_settings.view_transform='AgX'
scene.render.threads_mode='FIXED';scene.render.threads=8

def camera_at(position,target=(0,0,.53)):
    cam.location=position;cam.rotation_euler=(Vector(target)-cam.location).to_track_quat('-Z','Y').to_euler()

camera_at((1.6,-3.2,1.2))
bpy.ops.object.select_all(action='DESELECT')
for ob in model.objects:ob.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(opt.output/'nietzsche-a.glb'),export_format='GLB',use_selection=True,export_apply=True,export_animations=False,export_yup=True,export_tangents=True)
if opt.reference:
    reference=bpy.data.images.load(str(opt.reference.resolve()));reference.pack()
    guide=bpy.data.objects.new('Concept A reference · viewport only',None)
    scene.collection.objects.link(guide);guide.empty_display_type='IMAGE';guide.data=reference
    guide.location=(.85,.25,.60);guide.empty_display_size=.70;guide.rotation_euler=(math.pi/2,0,0);guide.hide_render=True
bpy.ops.wm.save_as_mainfile(filepath=str(opt.output/'nietzsche-a.blend'))
raw=(opt.output/'nietzsche-a.glb').read_bytes()
exported=json.loads(raw[20:20+int.from_bytes(raw[12:16],'little')])
triangles=sum(exported['accessors'][p.get('indices',p['attributes']['POSITION'])]['count']//3 for mesh in exported['meshes'] for p in mesh['primitives'])
report = {
    'name':'Nietzsche A - groom and proportion study',
    'status':'Real mesh prototype; likeness and animation remain in progress',
    'revision':2,'triangles':triangles,'objects':len(model.objects),'blenderVersion':bpy.app.version_string,
    'anatomicalBase':{'file':'src/ramsey-film/assets/turing.glb',
        'gitCommit':base_commit,
        'sha256':hashlib.sha256(base_file.read_bytes()).hexdigest(),
        'credit':'Existing project MakeHuman CC0-derived base, reshaped for the prototype'},
    'voice':'am_fenrir (existing, unchanged)',
    'groom':groom_counts,
    'materials':{'skin':'Embedded baked complexion and tangent-space pore normal maps',
                 'hair':'Tapered mesh fibres, merged by material for web review'},
    'proportions':{'shoulderSpan':max(v.co.x for v in bpy.data.objects['Tailored wool shoulders - anatomical proportions'].data.vertices)-min(v.co.x for v in bpy.data.objects['Tailored wool shoulders - anatomical proportions'].data.vertices),'headSpanIncludingEars':.323,
                   'collarBottom':.423,'collarTop':.483,'jacketNeckline':.452,'neckReduction':.028},
    'references':[{'url':'https://cults3d.com/en/3d-model/art/friedrich-nietzsche-bust-german-philosopher',
                    'use':'GLB reference candidate only; no mesh purchased, downloaded or incorporated'}],
    'features':['Continuous anatomical head and neck','Fitted bronze spectacles',
                '480 individually tapered eyebrow hairs','Swept scalp and moustache mesh grooms',
                'Portable baked skin detail','Rounded adult shoulders and fitted overlapping collar'],
    'limitations':['Anatomical base reshaped from the existing CC0-derived project mesh; likeness still needs sculpting',
                   'No facial animation or full body rig yet','Bust proportions and hair remain an iterative study'],
    'source':'tools/build-nietzsche-study.py'
}
(opt.output/'model-study.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
if opt.render:
    for name,position in [('front',(0,-3.2,1.0)),('three-quarter',(1.6,-3.2,1.2)),('profile',(3.2,-.12,1.0))]:
        camera_at(position)
        scene.render.filepath=str(opt.output/(name+'.png'))
        bpy.ops.render.render(write_still=True)
    camdata.ortho_scale=.45
    camera_at((1.6,-3.2,1.0),target=(0,-.035,.734))
    scene.render.filepath=str(opt.output/'face-detail.png')
    bpy.ops.render.render(write_still=True)
