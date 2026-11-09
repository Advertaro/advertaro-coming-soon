# ADV-8 hero reel

The finished edit uses orange silk, hands shaping clay, navy fabric, and warm reflected light.
The six shots use 80% playback speed. The cut lengths change from 3 seconds to 1.5 seconds.
The footage contains no added text or camera controls.

## Files

| File in `apps/web/public/video/` | Format | Size |
| --- | --- | --- |
| `hero-reel.mp4` | H.264 High, 1920×1080, 24 fps, 16 s, no audio | 3,506,249 bytes |
| `hero-reel.webm` | VP9, 1920×1080, 24 fps, 16 s, no audio | 2,840,619 bytes |
| `hero-reel-poster.jpg` | First decoded MP4 frame, 1920×1080 | 58,599 bytes |
| `CREDITS.md` | Source URLs, contributors, commercial-use licences, and edit notes | Markdown |

All sizes meet the decimal byte limits. The MP4 has its metadata at the start for web playback.

## Loop and visual checks

The final second blends into the first second of the opening source shot.
The edit then removes that first second from the head.
The wrap continues into the next source frame. It has no reversed motion or still-frame hold.

`contact-sheet.jpg` shows one frame per second, in reading order.
`loop-boundary.jpg` shows frames 380–383 on the top row, then frames 0–3 on the bottom row.
Visual inspection shows continuous silk motion across this boundary.
The frame samples contain no text, watermark, camera UI, REC overlay, or timecode.

`verification.json` records the format, size, full-decode, poster, and loop checks.
Both videos contain all 384 frames. The poster matches the first MP4 frame byte for byte after JPEG encoding.
The luma change at the wrap is comparable to nearby frame changes.
The MP4 wrap RMSE is 8.57; the nearby maximum is 8.33. The WebM values are 8.33 and 8.36.
These values support the frame review. They do not replace a real-time playback review.

The optional browser playback check could not run. Chrome exited before it exposed its DevTools port in this environment.
The frontend integration task can check real browser playback with the page overlay.

## Preview frames

- `frame-01-orange-silk.jpg`: 1.00 s.
- `frame-02-hands-and-clay.jpg`: 4.50 s.
- `frame-03-navy-texture.jpg`: 7.25 s.

These three full-resolution frame captures are also saved as task attachments on ADV-8.

## Build and verification

Requirements: Python 3, curl, FFmpeg with libx264 and libvpx-vp9, and ffprobe.

```sh
python3 docs/creative/hero-reel/build.py
python3 docs/creative/hero-reel/verify.py
```

The build script downloads four source clips to `.reel-work/sources/` and checks their SHA-256 hashes.
It stops if a source hash changes. Check the source and its licence before you accept a changed file.
The script normalizes colour metadata before joining the shots. This prevents dropped frames at colour-profile changes.
The output uses two-pass encoding within the size limits.

`sources.json` records the downloaded source hashes and their licence URLs.
The source pages and the Mixkit Stock Video Free License permit commercial use for all four clips.
The source clips are production inputs. The repository contains the finished edit and its evidence.
