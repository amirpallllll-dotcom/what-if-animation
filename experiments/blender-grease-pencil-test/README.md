# Blender 2D Character Animation Test

## Goal
Test Blender as an independent 2D-style character animation renderer.
The experiment is isolated from the main Remotion episodes.

## Environment
- Blender: Installed through GitHub Actions.
- Rendering: Background mode.
- Output: MP4 (H.264).
- Resolution: 1280x720.
- Frame rate: 24 FPS.
- Duration: 5 seconds.

## Animation
The test creates a simple character using curves and meshes.
Shoulder and hip pivots are animated to create a basic walking motion.

## Output
The workflow renders:

`/tmp/blender_test.mp4`

The video is uploaded as a GitHub Actions artifact named:

`blender-character-test`

## Status
The Blender installation was verified.
The render script and workflow have been updated.
A successful workflow run and playable video artifact are still required before considering the test complete.

## Safety
This experiment must not modify:
- Rewind
- CopyPaste
- VisualDeenTest
- The main branch
