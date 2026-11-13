import bpy
import math
import os

# Reset scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE'
scene.render.resolution_x = 1280
scene.render.resolution_y = 720
scene.render.resolution_percentage = 100
scene.render.fps = 24
scene.frame_start = 1
scene.frame_end = 120

# Materials
def material(name, color):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Roughness"].default_value = 1
    return mat

black = material("Character Black", (0.015, 0.02, 0.03))
white = material("Background", (0.95, 0.95, 0.92))

# Background
bpy.ops.mesh.primitive_plane_add(size=200, location=(0, 0, -1))
bpy.context.object.name = "Background"
bpy.context.object.data.materials.append(white)

# Create a line using a beveled curve
def line(name, points, parent=None, radius=0.045):
    curve = bpy.data.curves.new(name, 'CURVE')
    curve.dimensions = '3D'
    curve.bevel_depth = radius
    curve.bevel_resolution = 3
    spline = curve.splines.new('POLY')
    spline.points.add(len(points) - 1)
    for p, co in zip(spline.points, points):
        p.co = (co[0], co[1], co[2], 1)
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(black)
    if parent:
        obj.parent = parent
    return obj

def pivot(name, location):
    obj = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    return obj

# Root/body
root = pivot("Character Root", (0, 0, 0))

line("Torso", [(0, 0.9, 0), (0, 0.15, 0)], root, 0.065)
line("Neck", [(0, 0.9, 0), (0, 1.05, 0)], root, 0.04)

# Head
bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=0.25, location=(0, 1.35, 0))
head = bpy.context.object
head.name = "Head"
head.scale = (1, 1.15, 0.35)
head.data.materials.append(black)
head.parent = root

# Arms: pivots at shoulders
for side, label in [(-1, "Left"), (1, "Right")]:
    shoulder = pivot(label + " Shoulder", (side * 0.03, 0.85, 0))
    shoulder.parent = root
    line(label + " Upper Arm", [(0, 0, 0), (side * 0.28, -0.28, 0)], shoulder, 0.045)
    line(label + " Forearm", [(side * 0.28, -0.28, 0), (side * 0.48, -0.58, 0)], shoulder, 0.04)

# Legs: pivots at hips
for side, label in [(-1, "Left"), (1, "Right")]:
    hip = pivot(label + " Hip", (side * 0.04, 0.15, 0))
    hip.parent = root
    line(label + " Leg", [(0, 0, 0), (side * 0.12, -0.42, 0), (side * 0.05, -0.85, 0)], hip, 0.05)

# Animate walking motion through pivot rotations
for frame in range(1, 121, 12):
    phase = (frame - 1) / 120 * math.tau * 2
    scene.frame_set(frame)

    root.location.z = 0
    root.keyframe_insert(data_path="location", frame=frame)

    for obj in bpy.data.objects:
        if "Shoulder" in obj.name:
            side = -1 if "Left" in obj.name else 1
            obj.rotation_euler.z = math.sin(phase) * 0.35 * side
            obj.keyframe_insert(data_path="rotation_euler", frame=frame)
        elif "Hip" in obj.name:
            side = -1 if "Left" in obj.name else 1
            obj.rotation_euler.z = math.sin(phase + math.pi) * 0.45 * side
            obj.keyframe_insert(data_path="rotation_euler", frame=frame)

# Camera
bpy.ops.object.camera_add(location=(0, 0.3, 8))
camera = bpy.context.object
camera.name = "Camera"
camera.data.type = 'ORTHO'
camera.data.ortho_scale = 4.5
camera.rotation_euler = (0, 0, 0)
scene.camera = camera

# Lighting
bpy.ops.object.light_add(type='AREA', location=(0, 0, 5))
light = bpy.context.object
light.data.energy = 500
light.data.shape = 'DISK'
light.data.size = 8

# Render settings
scene.render.image_settings.file_format = 'FFMPEG'
scene.render.ffmpeg.format = 'MPEG4'
scene.render.ffmpeg.codec = 'H264'
scene.render.filepath = '/tmp/blender_test.mp4'
scene.render.resolution_percentage = 100

# Render and verify
bpy.ops.render.render(animation=True)

output = '/tmp/blender_test.mp4'
if not os.path.exists(output) or os.path.getsize(output) == 0:
    raise RuntimeError("Render failed: output video was not created")

print("SUCCESS: Video created at", output)
print("File size:", os.path.getsize(output))
