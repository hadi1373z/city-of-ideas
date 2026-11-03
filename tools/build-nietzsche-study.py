"""Blender head-and-shoulders construction study for Nietzsche concept A.

blender --background --python tools/build-nietzsche-study.py -- --output DIR
This builds real editable mesh geometry, not a portrait pasted on a plane.
The study is intentionally separate from the production character and voice.
"""
import argparse
import json
import hashlib
import math
from pathlib import Path
import sys

import bpy
from mathutils import Vector

args = argparse.ArgumentParser()
args.add_argument('--output', required=True, type=Path)
args.add_argument('--render', action='store_true')
args.add_argument('--reference', type=Path)
opt = args.parse_args(sys.argv[sys.argv.index('--')+1:])
opt.output = opt.output.resolve()
opt.output.mkdir(parents=True, exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
model = bpy.data.collections.new('Nietzsche A Â· editable construction study')
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
hair = material('Dark chestnut', (.052, .026, .014), .75)
hairlight = material('Chestnut lock highlights', (.066, .034, .018), .78)
hairdark = material('Chestnut lowlights', (.040, .020, .011), .76)
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

# Tailored chest and collar; separate pieces remain editable for later rigging.
chest=[];cf=[]
chest_sections=[(.02,.22,.11),(.15,.235,.12),(.27,.265,.117),(.34,.253,.10),(.39,.170,.08),(.405,.083,.068)]
for row,(z,rx,ry) in enumerate(chest_sections):
    for col in range(64):
        a=col/64*math.pi*2;chest.append((rx*math.sin(a),.016+ry*math.cos(a),z))
        if row<len(chest_sections)-1:
            i=row*64+col;j=row*64+(col+1)%64;cf.extend([(i,i+64,j),(j,i+64,j+64)])
mesh('Tailored wool bust',chest,cf,wool)

def panel(name,points,mat):
    ob=mesh(name,points,[tuple(range(len(points)))],mat)
    solid=ob.modifiers.new('Tailored cloth thickness','SOLIDIFY');solid.thickness=.004
    bevel=ob.modifiers.new('Soft garment edges','BEVEL');bevel.width=.003;bevel.segments=3
    return ob

panel('Ivory shirt front',[(-.07,-.074,.399),(.07,-.074,.399),(.047,-.114,.110),(-.047,-.114,.110)],linen)
for side in [-1,1]:
    panel('Shirt collar',[(side*.006,-.080,.498),(side*.065,-.055,.503),(side*.073,-.083,.427),(side*.036,-.108,.410)],linen)
    panel('Notched jacket lapel',[(side*.079,-.070,.398),(side*.160,-.068,.340),(side*.132,-.098,.300),(side*.152,-.106,.276),(side*.038,-.122,.151),(side*.043,-.107,.329)],lapel)
    ellipsoid('Cravat folded wing',(side*.026,-.118,.395),(.034,.010,.016),cravat)
panel('Cravat fall',[(-.016,-.123,.389),(.016,-.123,.389),(.022,-.129,.190),(0,-.133,.157),(-.018,-.129,.190)],cravat)

# Small bevelled plinth only supports the study, separate from character geometry.
bpy.ops.mesh.primitive_cylinder_add(vertices=64, radius=.23, depth=.025, location=(0,.012,.006))
plinth=own(bpy.context.object,material('Study base',(.028,.023,.019),.8))
plinth.name='Removable study base';plinth.scale.y=.59

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
for source in sources:
    evaluated=source.evaluated_get(bpy.context.evaluated_depsgraph_get())
    data=bpy.data.meshes.new_from_object(evaluated,preserve_all_data_layers=True,depsgraph=bpy.context.evaluated_depsgraph_get())
    is_hair='hair'in source.name
    for vertex in data.vertices:
        point=source.matrix_world@vertex.co
        x=-point.x*.94; y=-point.y*.75+.004; z=.718+(point.z-1.732)*.90
        if is_hair:
            z+=.064*math.exp(-((x+.025)/.120)**2-((y+.085)/.110)**2)*smooth((z-.79)/.065)
            y-=.006*math.sin(x*45+z*8)*smooth((z-.79)/.1)
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
# A continuous collar joins the neck to the jacket for this bust study.
cp,cf=[],[]
for row,z in enumerate([.402,.465]):
    for col in range(64):
        angle=col/64*2*math.pi
        cp.append((.073*math.sin(angle),.013+.067*math.cos(angle),z))
        if row==0:
            a=col;b=(col+1)%64;cf.extend([(a,a+64,b),(b,a+64,b+64)])
mesh('Continuous standing shirt collar',cp,cf,linen)
for ob in model.objects:
    if ob.name.startswith('Cravat'):
        for vertex in ob.data.vertices:
            point=ob.matrix_world@vertex.co
            if point.z>.30:
                point.z+=.035*smooth((point.z-.30)/.08)
            vertex.co=ob.matrix_world.inverted()@point

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
bpy.ops.export_scene.gltf(filepath=str(opt.output/'nietzsche-a.glb'),export_format='GLB',use_selection=True,export_apply=True,export_animations=False,export_yup=True)
if opt.reference:
    reference=bpy.data.images.load(str(opt.reference.resolve()));reference.pack()
    guide=bpy.data.objects.new('Concept A reference · viewport only',None)
    scene.collection.objects.link(guide);guide.empty_display_type='IMAGE';guide.data=reference
    guide.location=(.85,.25,.60);guide.empty_display_size=.70;guide.rotation_euler=(math.pi/2,0,0);guide.hide_render=True
bpy.ops.wm.save_as_mainfile(filepath=str(opt.output/'nietzsche-a.blend'))
raw=(opt.output/'nietzsche-a.glb').read_bytes()
exported=json.loads(raw[20:20+int.from_bytes(raw[12:16],'little')])
triangles=sum(exported['accessors'][p.get('indices',p['attributes']['POSITION'])]['count']//3 for mesh in exported['meshes'] for p in mesh['primitives'])
(opt.output/'model-study.json').write_text(json.dumps({'name':'Nietzsche A â€” first construction study','status':'Real mesh prototype; not yet approved likeness or animation-ready character','triangles':triangles,'objects':len(model.objects),'blenderVersion':bpy.app.version_string,'anatomicalBase':{'file':'src/ramsey-film/assets/turing.glb','sha256':hashlib.sha256(base_file.read_bytes()).hexdigest(),'credit':'Existing project MakeHuman CC0-derived base, reshaped for the prototype'},'voice':'am_fenrir (existing, unchanged)','features':['Continuous modeled head and neck','Separate fitted bronze spectacles','Reshaped anatomical hair base with swept quiff layers','Connected tapered moustache locks','Editable jacket and collar'],'limitations':['Anatomical base reshaped from the existing CC0-derived project mesh; likeness still needs sculpting','No facial animation or full body rig yet','Hair and material detail still need refinement'],'source':'tools/build-nietzsche-study.py'},indent=2)+'\n',encoding='utf-8')
if opt.render:
    for name,position in [('front',(0,-3.2,1.0)),('three-quarter',(1.6,-3.2,1.2)),('profile',(3.2,-.12,1.0))]:
        camera_at(position)
        scene.render.filepath=str(opt.output/(name+'.png'))
        bpy.ops.render.render(write_still=True)
