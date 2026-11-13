import bpy
import math
from mathutils import Vector

# Reset scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE_NEXT'
scene.render.resolution_x = 1280
scene.render.resolution_y = 720
scene.render.resolution_percentage = 100
scene.render.fps = 24
scene.frame_start = 1
scene.frame_end = 120

# White background
scene.world.color = (1, 1, 1)

# Camera
bpy.ops.object.camera_add(location=(0, 0, 12))
camera = bpy.context.object
camera.data.type = 'ORTHO'
camera.data.ortho_scale = 12
scene.camera = camera

# Lighting
bpy.ops.object.light_add(type='AREA', location=(0, 0, 8))
light = bpy.context.object
light.data.energy = 1500
light.data.shape = 'DISK'
light.data.size = 10

# Materials
def material(name, color):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    return mat

black = material("Character Black", (0.01, 0.01, 0.01))
white = material("Background White", (1, 1, 1))

# Draw a line between points
def make_line(name, points, radius=0.045):
    curve = bpy.data.curves.new(name, 'CURVE')
    curve.dimensions = '3D'
    curve.bevel_depth = radius
    curve.bevel_resolution = 3
    spline = curve.splines.new('POLY')
    spline.points.add(len(points) - 1)
    for p, co in zip(spline.points, points):
        p.co = (*co, 1)
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(black)
    return obj

# Head
bpy.ops.mesh.primitive_uv_sphere_add(
    segments=32, ring_count=16, radius=0.42,
    location=(0, 1.55, 0)
)
head = bpy.context.object
head.name = "Head"
head.data.materials.append(black)

# Body
body = make_line("Body", [(0, 1.1, 0), (0, -0.4, 0)])

# Arms and legs
left_arm = make_line("Left Arm", [(0, 0.8, 0), (-0.65, 0.2, 0)])
right_arm = make_line("Right Arm", [(0, 0.8, 0), (0.65, 0.2, 0)])
left_leg = make_line("Left Leg", [(0, -0.4, 0), (-0.5, -1.3, 0)])
right_leg = make_line("Right Leg", [(0, -0.4, 0), (0.5, -1.3, 0)])

# Animate the whole character
for frame, x in [(1, -2), (40, 0), (80, 0), (120, 0)]:
    for obj in [head, body, left_arm, right_arm, left_leg, right_leg]:
        obj.location.x = x
        obj.keyframe_insert(data_path="location", frame=frame)

# Walk-like leg movement
for frame, angle in [(1, -0.5), (20, 0.5), (40, -0.5), (60, 0)]:
    left_leg.rotation_euler.z = angle
    left_leg.keyframe_insert(data_path="rotation_euler", frame=frame)
    right_leg.rotation_euler.z = -angle
    right_leg.keyframe_insert(data_path="rotation_euler", frame=frame)

# Pointing action
right_arm.rotation_euler.z = 0
right_arm.keyframe_insert(data_path="rotation_euler", frame=80)
right_arm.rotation_euler.z = -1.2
right_arm.keyframe_insert(data_path="rotation_euler", frame=120)

# Smooth animation
for obj in bpy.context.scene.objects:
    if obj.animation_data and obj.animation_data.action:
        for fc in obj.animation_data.action.fcurves:
            for key in fc.keyframe_points:
                key.interpolation = 'BEZIER'

# Output
scene.render.image_settings.file_format = 'FFMPEG'
scene.render.ffmpeg.format = 'MPEG4'
scene.render.filepath = '/tmp/blender_test.mp4'

bpy.ops.wm.save_as_mainfile(filepath='/tmp/blender_test.blend')
bpy.ops.render.render(animation=True)
