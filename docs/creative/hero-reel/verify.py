"""Check the encoded hero assets. Run from any directory with Python 3 and FFmpeg."""
from pathlib import Path
import hashlib
import json
import math
import statistics
import subprocess

root = Path(__file__).resolve().parents[3]
assets = root / 'apps/web/public/video'
report = {'videos': {}, 'checks': {}}
for extension, codec in [('mp4', 'h264'), ('webm', 'vp9')]:
    path = assets / f'hero-reel.{extension}'
    data = json.loads(subprocess.check_output([
        'ffprobe', '-v', 'error', '-count_frames', '-show_streams', '-show_format', '-of', 'json', str(path)
    ]))
    streams = data['streams']
    assert len(streams) == 1 and streams[0]['codec_type'] == 'video', 'Unexpected stream or audio track'
    video = streams[0]
    assert video['codec_name'] == codec
    assert (video['width'], video['height']) == (1920, 1080)
    assert video['r_frame_rate'] == '24/1'
    assert int(video['nb_read_frames']) == 384
    assert float(data['format']['duration']) == 16.0
    assert path.stat().st_size <= 4_000_000
    subprocess.run(['ffmpeg', '-v', 'error', '-xerror', '-i', str(path), '-an', '-f', 'null', '-'], check=True)
    pixels = subprocess.check_output([
        'ffmpeg', '-v', 'error', '-i', str(path), '-vf', 'scale=320:180,format=gray',
        '-f', 'rawvideo', '-pix_fmt', 'gray', '-'
    ])
    size = 320 * 180
    frames = [pixels[i:i + size] for i in range(0, len(pixels), size)]
    def delta(a, b):
        return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)) / size)
    wrap = delta(frames[-1], frames[0])
    nearby = [delta(frames[i - 1], frames[i]) for i in list(range(1, 13)) + list(range(372, 384))]
    assert wrap <= 1.5 * max(nearby), 'Unexpected jump at the loop boundary'
    report['videos'][extension] = {
        'codec': codec, 'width': 1920, 'height': 1080, 'fps': 24, 'frames': 384,
        'durationSeconds': 16, 'audioTracks': 0, 'bytes': path.stat().st_size,
        'sha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'fullDecode': 'passed',
        'wrapLumaRmse': round(wrap, 4), 'nearbyMaximumLumaRmse': round(max(nearby), 4),
        'nearbyMedianLumaRmse': round(statistics.median(nearby), 4)
    }
poster = assets / 'hero-reel-poster.jpg'
assert poster.stat().st_size <= 200_000
first = subprocess.check_output([
    'ffmpeg', '-v', 'error', '-i', str(assets / 'hero-reel.mp4'),
    '-frames:v', '1', '-q:v', '3', '-f', 'image2pipe', '-'
])
assert first == poster.read_bytes(), 'Poster must use the first MP4 frame'
report['poster'] = {'bytes': poster.stat().st_size, 'matchesFirstMp4Frame': True,
                    'sha256': hashlib.sha256(poster.read_bytes()).hexdigest()}
credits = (assets / 'CREDITS.md').read_text()
sources = json.loads((Path(__file__).parent / 'sources.json').read_text())
assert len(sources) == 4
for source in sources:
    assert source['sourcePage'] in credits
    assert source['licence'] == 'https://mixkit.co/license/#videoFree'
    assert source['licence'] in credits
report['checks'] = {'requiredFilesAndBudgets': 'passed', 'sourceCreditCoverage': 'passed',
                    'posterFirstFrame': 'passed', 'loopBoundaryMetric': 'passed'}
print(json.dumps(report, indent=2))
