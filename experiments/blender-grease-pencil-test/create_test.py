
import bpy
import math
import os

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

scene = bpy.context.scene
scene.render.engine = 'BLENDER_WORKBENCH'
scene.render.resolution_x = 640
scene.render.resolution_y = 360
scene.render.resolution_percentage = 100
scene.render.fps = 24
scene.frame_start = 1
scene.frame_end = 48

shading = scene.display.shading
shading.light = 'FLAT'
shading.color_type = 'MATERIAL'
shading.background_type = 'WORLD'
shading.show_shadows = False
shading.show_cavity = False
scene.world.color = (1, 1, 1)

def material(name, color):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    return mat

black = material("Character Black", (0.015, 0.02, 0.03))
white = material("Background", (0.95, 0.95, 0.92))

bpy.ops.mesh.primitive_plane_add(size=200, location=(0, 0, -1))
background = bpy.context.object
background.name = "Background"
background.data.materials.append(white)

def pivot(name, location):
    obj = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    return obj

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

root = pivot("Character Root", (0, 0, 0))

line("Torso", [(0, 0.9, 0), (0, 0.15, 0)], root, 0.065)
line("Neck", [(0, 0.9, 0), (0, 1.05, 0)], root, 0.04)

bpy.ops.mesh.primitive_uv_sphere_add(
    segments=16, ring_count=8, radius=0.25,
    location=(0, 1.35, 0)
)
head = bpy.context.object
head.name = "Head"
head.scale = (1, 1.15, 0.35)
head.data.materials.append(black)
head.parent = root

shoulders = []
for side, label in [(-1, "Left"), (1, "Right")]:
    shoulder = pivot(label + " Shoulder", (side * 0.03, 0.85, 0))
    shoulder.parent = root
    shoulders.append((shoulder, side))

    line(label + " Upper Arm",
         [(0, 0, 0), (side * 0.28, -0.28, 0)],
         shoulder, 0.045)
    line(label + " Forearm",
         [(side * 0.28, -0.28, 0),
          (side * 0.48, -0.58, 0)],
         shoulder, 0.04)

hips = []
for side, label in [(-1, "Left"), (1, "Right")]:
    hip = pivot(label + " Hip", (side * 0.14, 0.15, 0))
    hip.parent = root
    hips.append((hip, side))

    line(label + " Leg",
         [(0, 0, 0), (side * 0.035, -0.40, 0),
          (0, -0.82, 0)],
         hip, 0.05)

# Camera with margin around the full character
bpy.ops.object.camera_add(location=(0, 0.35, 8))
camera = bpy.context.object
camera.name = "Camera"
camera.data.type = 'ORTHO'
camera.data.ortho_scale = 5.0
camera.rotation_euler = (0, 0, 0)
scene.camera = camera

# 2-second walk cycle; camera follows the character
for frame in range(1, 50, 6):
    phase = (frame - 1) / 48.0 * math.tau
    progress = (frame - 1) / 48.0
    scene.frame_set(frame)

    root.location.x = progress * 1.8
    root.location.z = 0.025 * (1 - math.cos(phase * 2))
    root.keyframe_insert(data_path="location", frame=frame)

    camera.location.x = progress * 1.8
    camera.keyframe_insert(data_path="location", frame=frame)

    for shoulder, side in shoulders:
        shoulder.rotation_euler.z = math.sin(phase) * 0.30 * side
        shoulder.keyframe_insert(
            data_path="rotation_euler", frame=frame
        )

    for hip, side in hips:
        hip.rotation_euler.z = math.sin(phase + math.pi) * 0.12 * side
        hip.keyframe_insert(
            data_path="rotation_euler", frame=frame
        )

scene.render.image_settings.media_type = 'VIDEO'
scene.render.image_settings.file_format = 'FFMPEG'
scene.render.ffmpeg.format = 'MPEG4'
scene.render.ffmpeg.codec = 'H264'
scene.render.filepath = '/tmp/blender_test.mp4'

bpy.ops.render.render(animation=True)

output = '/tmp/blender_test.mp4'
if not os.path.exists(output) or os.path.getsize(output) == 0:
    raise RuntimeError("Render failed: video file missing or empty")

print("SUCCESS: 2-second walk cycle created")
print("File size:", os.path.getsize(output))
