from flask import Flask, request, jsonify
import os, json
from datetime import datetime
from glob import glob
from moviepy import ImageSequenceClip
from PIL import Image

app = Flask(__name__)


#//////////////////////////
# URL POST(UPLOAD)
# /upload/<index != 0>

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
CONFIG_DIR = os.path.join(BASE_DIR, 'configs')
PUBLIC_DIR = os.path.join(BASE_DIR, 'public', 'videos')

def get_config(cam_id):
    config_path = os.path.join(CONFIG_DIR, f'cam{cam_id}.json')
    if not os.path.exists(config_path):
        return None
    with open(config_path) as f:
        return json.load(f)

def is_within_date_range(config):
    now = datetime.now()
    start = datetime.strptime(config['start_date'], "%d-%m-%Y")
    end = datetime.strptime(config['end_date'], "%d-%m-%Y")
    return start <= now <= end

def create_video_and_thumbnail(cam_dir, fps):
    frames_dir = os.path.join(cam_dir, 'frames')
    frames = sorted(glob(os.path.join(frames_dir, 'frame_*.jpg')))
    if not frames:
        return

    video_count = len(glob(os.path.join(cam_dir, 'video_*.mp4')))
    video_path = os.path.join(cam_dir, f'video_{video_count}.mp4')
    thumbnail_path = os.path.join(cam_dir, f'thumbnail_{video_count}.jpeg')

    # Buat video dari urutan gambar
    try:
        clip = ImageSequenceClip(frames, fps=fps)
        clip.write_videofile(video_path, codec='libx264', audio=False, logger=None)
    except Exception as e:
        print("[ERROR] Gagal membuat video dengan moviepy:", e)
        return

    # Buat thumbnail dari frame tengah atau pertama
    try:
        mid_frame_path = frames[len(frames)//2] if len(frames) > 2 else frames[0]
        img = Image.open(mid_frame_path)
        img.save(thumbnail_path, format='JPEG')
    except Exception as e:
        print("[ERROR] Gagal membuat thumbnail:", e)

    # Hapus semua frame setelah video dibuat
    for f in frames:
        try:
            os.remove(f)
        except Exception as e:
            print(f"[WARNING] Tidak bisa hapus {f}: {e}")

@app.route('/upload/<int:cam_id>', methods=['POST'])
def upload(cam_id):
    config_json = get_config(cam_id)
    if not config_json:
        return jsonify({'error': 'Config not found'}), 404

    config = config_json['config']
    cam_name = f"cam{cam_id}"
    fps = config.get("fps", 1)
    max_images = config.get("max_images", 15)

    cam_dir = os.path.join(PUBLIC_DIR, cam_name)
    frames_dir = os.path.join(cam_dir, 'frames')
    os.makedirs(frames_dir, exist_ok=True)

    # Baca image dari raw body (karena ESP32 kirim image/jpeg langsung)
    if not request.data:
        return jsonify({'error': 'No image data'}), 400

    frame_count = len(glob(os.path.join(frames_dir, 'frame_*.jpg')))
    img_path = os.path.join(frames_dir, f'frame_{frame_count}.jpg')

    with open(img_path, 'wb') as f:
        f.write(request.data)

    frame_count += 1

    # Cek apakah perlu buat video
    if max_images != -1 and frame_count >= max_images:
        create_video_and_thumbnail(cam_dir, fps)
    elif max_images == -1 and not is_within_date_range(config):
        create_video_and_thumbnail(cam_dir, fps)

    return jsonify({'status': 'Image received'}), 200

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
