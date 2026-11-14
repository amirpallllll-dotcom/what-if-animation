
import bpy
import math
import os

# Reset scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

scene = bpy.context.scene

# Fast flat renderer
scene.render.engine = 'BLENDER_WORKBENCH'

scene.render.resolution_x = 640
scene.render.resolution_y = 360
scene.render.resolution_percentage = 100
scene.render.fps = 24
scene.frame_start = 1
scene.frame_end = 24

# Workbench appearance
shading = scene.display.shading
shading.light = 'FLAT'
shading.color_type = 'MATERIAL'
shading.background_type = 'WORLD'
shading.show_shadows = False
shading.show_cavity = False

scene.world.color = (1, 1, 1)

# Materials
def material(name, color):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    return mat

black = material("Character Black", (0.015, 0.02, 0.03))
white = material("Background", (0.95, 0.95, 0.92))

# Background
bpy.ops.mesh.primitive_plane_add(
    size=200,
    location=(0, 0, -1)
)
background = bpy.context.object
background.name = "Background"
background.data.materials.append(white)

# Create line
def line(name, points, parent=None, radius=0.045):
    curve = bpy.data.curves.new(name, 'CURVE')
    curve.dimensions = '3D'
    curve.bevel_depth = radius
    curve.bevel_resolution = 1

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

# Character
root = pivot("Character Root", (0, 0, 0))

line("Torso", [(0, 0.9, 0), (0, 0.15, 0)], root, 0.065)
line("Neck", [(0, 0.9, 0), (0, 1.05, 0)], root, 0.04)

# Head
bpy.ops.mesh.primitive_uv_sphere_add(
    segments=16,
    ring_count=8,
    radius=0.25,
    location=(0, 1.35, 0)
)
head = bpy.context.object
head.name = "Head"
head.scale = (1, 1.15, 0.35)
head.data.materials.append(black)
head.parent = root

# Arms
shoulders = []

for side, label in [(-1, "Left"), (1, "Right")]:
    shoulder = pivot(label + " Shoulder", (side * 0.03, 0.85, 0))
    shoulder.parent = root
    shoulders.append((shoulder, side))

    line(
        label + " Upper Arm",
        [(0, 0, 0), (side * 0.28, -0.28, 0)],
        shoulder,
        0.045
    )

    line(
        label + " Forearm",
        [(side * 0.28, -0.28, 0), (side * 0.48, -0.58, 0)],
        shoulder,
        0.04
    )

# Legs
hips = []

for side, label in [(-1, "Left"), (1, "Right")]:
    hip = pivot(label + " Hip", (side * 0.04, 0.15, 0))
    hip.parent = root
    hips.append((hip, side))

    line(
        label + " Leg",
        [(0, 0, 0), (side * 0.12, -0.42, 0),
         (side * 0.05, -0.85, 0)],
        hip,
        0.05
    )

# Walking animation
for frame in range(1, 25, 3):
    phase = (frame - 1) / 24 * math.tau

    scene.frame_set(frame)

    for shoulder, side in shoulders:
        shoulder.rotation_euler.z = math.sin(phase) * 0.35 * side
        shoulder.keyframe_insert(
            data_path="rotation_euler",
            frame=frame
        )

    for hip, side in hips:
        hip.rotation_euler.z = math.sin(phase + math.pi) * 0.45 * side
        hip.keyframe_insert(
            data_path="rotation_euler",
            frame=frame
        )

# Camera
bpy.ops.object.camera_add(location=(0, 0.3, 8))
camera = bpy.context.object
camera.name = "Camera"
camera.data.type = 'ORTHO'
camera.data.ortho_scale = 4.5
camera.rotation_euler = (0, 0, 0)
scene.camera = camera

# Video output
scene.render.image_settings.media_type = 'VIDEO'
scene.render.image_settings.file_format = 'FFMPEG'
scene.render.ffmpeg.format = 'MPEG4'
scene.render.ffmpeg.codec = 'H264'
scene.render.filepath = '/tmp/blender_test.mp4'

# Render
bpy.ops.render.render(animation=True)

# Verify
output = '/tmp/blender_test.mp4'

if not os.path.exists(output) or os.path.getsize(output) == 0:
    raise RuntimeError("Render failed: video file missing or empty")

print("SUCCESS: Video created at", output)
print("File size:", os.path.getsize(output))
