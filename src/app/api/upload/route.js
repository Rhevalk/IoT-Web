import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import sizeOf from 'image-size';


export const config = { api: { bodyParser: false } };

function loadConfig(camId) {
  const cfgPath = path.join(process.cwd(), 'configs', `${camId}.json`);
  if (!fs.existsSync(cfgPath)) throw new Error(`Config for ${camId} not found`);
  const raw = fs.readFileSync(cfgPath, 'utf-8');
  return JSON.parse(raw).config;
}

function ensureDirs(camId) {
  const base = path.join(process.cwd(), 'public/videos', camId);
  const frames = path.join(base, 'frames');
  const thumb = path.join(base, 'thumbnail');
  [base, frames, thumb].forEach(dir => fs.mkdirSync(dir, { recursive: true }));
  return { base, frames, thumb };
}

function convertToVideo(camId, config) {
  const { frames, base, thumb } = ensureDirs(camId);
  const imgs = fs.readdirSync(frames).filter((file) => file.endsWith('.jpg'));
  
  if (!imgs || imgs.length === 0) {
    console.error(`❌ Tidak ada frame ditemukan di folder ${frames}`);
    return;
  }
  
	const firstFramePath = path.resolve(frames, imgs[0]);

	
	const filePath = firstFramePath;

	const data = fs.readFileSync(filePath);
	let dims;
	try {
	  dims = sizeOf(data); // bisa juga test pakai buffer
	} catch (err) {
	  console.error(`[${camId}] ❌ Error saat membaca dimensi dari buffer`, err);
	}

  const rawPath = path.join(base, `${camId}_raw.avi`);
  const finalPath = path.join(base, `${camId}.mp4`);
  const thumbPath = path.join(thumb, `${camId}.jpg`);

	const result1 = spawnSync('ffmpeg', [
	  '-y',
	  '-f', 'image2',
	  '-framerate', `${config.fps}`,
	  '-start_number', '0', // tambahkan ini kalau frame mulai dari 0
	  '-i', path.join(frames, 'frame_%d.jpg'),
	  '-s', `${dims.width}x${dims.height}`,
	  rawPath
	], { encoding: 'utf8', stdio: 'pipe' }); // <= penting

	console.log(`[${camId}] FFmpeg RAW -> AVI stderr:\n${result1.stderr}`);
	console.log(`[${camId}] FFmpeg RAW -> AVI stdout:\n${result1.stdout}`);

	const result2 = spawnSync('ffmpeg', [
	  '-y',
	  '-i', rawPath,
	  '-c:v', 'libx264',
	  '-preset', 'slow',
	  '-crf', '23',
	  '-c:a', 'aac',
	  '-b:a', '128k',
	  '-movflags', 'faststart',
	  finalPath
	], { encoding: 'utf8', stdio: 'pipe' });

	console.log(`[${camId}] FFmpeg AVI -> MP4 stderr:\n${result2.stderr}`);
	console.log(`[${camId}] FFmpeg AVI -> MP4 stdout:\n${result2.stdout}`);



	try {
	  if (fs.existsSync(rawPath)) {
	    fs.unlinkSync(rawPath);
	  }
	} catch (err) {
	  console.warn(`[${camId}] ⚠️ Gagal menghapus file lama: ${rawPath}`, err.message);
	}


  spawnSync('ffmpeg', [
    '-y',
    '-i', finalPath,
    '-ss', '00:00:01.000',
    '-vframes', '1',
    thumbPath
  ], { stdio: 'ignore' });

  imgs.forEach(f => fs.unlinkSync(path.join(frames, f)));
	console.log(`[${camId}] Final MP4 path: ${finalPath}`);
	console.log(`[${camId}] File exists?`, fs.existsSync(finalPath));

  console.log(`🎞️ [${camId}] Video selesai dibuat`);
}

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const camId = searchParams.get('camId');
  if (!camId) return new Response('Missing camId', { status: 400 });

  let config;
  try {
    config = loadConfig(camId);
  } catch (err) {
    console.error(err);
    return new Response('Config not found', { status: 404 });
  }

  const { frames } = ensureDirs(camId);
  const currentCount = fs.readdirSync(frames).filter(f => f.endsWith('.jpg')).length;

  // Mode 1: max_images > 0
  const maxImagesReached = config.max_images > 0 && currentCount >= config.max_images;

  // Mode 2: date range mode
  const now = new Date();
  const startDate = config.start_date && config.start_date !== '--:--' ? new Date(config.start_date) : null;
  const endDate = config.end_date && config.end_date !== '--:--' ? new Date(config.end_date) : null;
  const inRange = (!startDate || now >= startDate) && (!endDate || now <= endDate);
  const allowCapture = inRange && config.status === 1;

  if (!allowCapture) {
    return new Response('Out of capture window or disabled', { status: 403 });
  }

  if (maxImagesReached) {
    // Panggil video converter kalau belum dibuat
    const base = path.join(process.cwd(), 'public/videos', camId);
    const finalPath = path.join(base, `${camId}.mp4`);
    if (!fs.existsSync(finalPath)) {
      console.log(`🎬 [${camId}] Memulai konversi karena frame penuh`);
      convertToVideo(camId, config);
    }
		return new Response({ message: 'Menunggu konversi' }, { status: 429 });
  }

  // Ambil data buffer
  const chunks = [];
  for await (const chunk of req.body) chunks.push(chunk);
  const buffer = Buffer.concat(chunks);

  const frameName = `frame_${currentCount}.jpg`;
  const framePath = path.join(frames, frameName);
  fs.writeFileSync(framePath, buffer);

  console.log(`📸 [${camId}] Frame ${currentCount + 1} disimpan`);

  const newCount = currentCount + 1;
  if (config.max_images > 0 && newCount >= config.max_images) {
    convertToVideo(camId, config);
  }

  return new Response('OK', { status: 200 });
}
