import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

/*-----------------------------------------
# URL GET
# /api/video-get
-----------------------------------------*/

export async function GET() {
  const videosDir = path.join(process.cwd(), 'public', 'videos');

  if (!fs.existsSync(videosDir)) {
    return NextResponse.json({ error: 'Folder videos tidak ditemukan' }, { status: 404 });
  }

  const camFolders = fs.readdirSync(videosDir)
    .filter(f => fs.statSync(path.join(videosDir, f)).isDirectory());

  const result = camFolders.map(camId => {
    const camPath = path.join(videosDir, camId);
    const files = fs.readdirSync(camPath)
      .filter(f => !f.toLowerCase().includes('frames'))
      .filter(f => f.endsWith('.mp4') || f.endsWith('.jpeg'));

    const videos = files.filter(f => f.endsWith('.mp4')).map(f => `/videos/${camId}/${f}`);
    const thumbnails = files.filter(f => f.endsWith('.jpeg')).map(f => `/videos/${camId}/${f}`);

    return {
      camId,
      videos,
      thumbnails
    };
  });

  return NextResponse.json(result);
}
