import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const videosDir = path.join(process.cwd(), 'public', 'videos');

  if (!fs.existsSync(videosDir)) {
    return NextResponse.json({ error: 'Folder videos tidak ditemukan' }, { status: 404 });
  }

  const camFolders = fs.readdirSync(videosDir)
    .filter(f => fs.statSync(path.join(videosDir, f)).isDirectory());

  const result = camFolders.map(camId => {
    const camPath = path.join(videosDir, camId);
    const allFiles = fs.readdirSync(camPath);

    // File video dan thumbnail
    const videoFiles = allFiles.filter(f => f.endsWith('.mp4'));
    const thumbFiles = allFiles.filter(f => f.endsWith('.jpeg'));

    // Folder frames
    const framesPath = path.join(camPath, 'frames');
    let frames = [];
    if (fs.existsSync(framesPath)) {
      frames = fs.readdirSync(framesPath);
    }

    return {
      camId,
      videos: videoFiles.map(f => `/videos/${camId}/${f}`),
      thumbnails: thumbFiles.map(f => `/videos/${camId}/${f}`),
      frames: {
        count: frames.length,
      }
    };
  });

  return NextResponse.json(result);
}
