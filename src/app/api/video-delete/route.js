import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);

  const camId = searchParams.get('camId');
  const target = searchParams.get('target'); // 'frames' atau 'file'
  const fileName = searchParams.get('file'); // hanya untuk target=file

  if (!camId || !target) {
    return NextResponse.json(
      { error: 'camId dan target harus disediakan' },
      { status: 400 }
    );
  }

  const basePath = path.join(process.cwd(), 'public', 'videos', camId);

  if (!fs.existsSync(basePath)) {
    return NextResponse.json({ error: 'Folder kamera tidak ditemukan' }, { status: 404 });
  }

  if (target === 'frames') {
    const framesPath = path.join(basePath, 'frames');

    if (!fs.existsSync(framesPath)) {
      return NextResponse.json({ error: 'Folder frames tidak ditemukan' }, { status: 404 });
    }

    const frameFiles = fs.readdirSync(framesPath);
    frameFiles.forEach(file => {
      fs.unlinkSync(path.join(framesPath, file));
    });

    return NextResponse.json({ success: true, deletedFrames: frameFiles.length });
  }

if (target === 'file') {
  if (!fileName) {
    return NextResponse.json({ error: 'Nama file harus disediakan untuk menghapus file' }, { status: 400 });
  }

  const filePath = path.join(basePath, fileName);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 404 });
  }

  fs.unlinkSync(filePath);

  // Hapus thumbnail berdasarkan index
  const match = fileName.match(/video_(\d+)\.mp4$/);
  let thumbnailDeleted = false;

  if (match) {
    const index = match[1]; // dari video_0.mp4 → '0'
    const thumbnailName = `thumbnail_${index}.jpeg`;
    const thumbnailPath = path.join(basePath, thumbnailName);

    if (fs.existsSync(thumbnailPath)) {
      fs.unlinkSync(thumbnailPath);
      thumbnailDeleted = true;
    }
  }

  return NextResponse.json({
    success: true,
    deletedFile: `/videos/${camId}/${fileName}`,
    ...(thumbnailDeleted && { deletedThumbnail: `/videos/${camId}/thumbnail_${match?.[1]}.jpeg` })
  });
}


  return NextResponse.json({ error: 'Target tidak dikenali. Gunakan "frames" atau "file".' }, { status: 400 });
}
