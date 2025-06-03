import fs from 'fs';
import path from 'path';
import { URL } from 'url';

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const fileParam = searchParams.get('file');

    if (!fileParam) {
      return new Response(
        JSON.stringify({ error: 'Parameter "file" wajib diisi (contoh: ?file=kolam-ikan atau ?file=hidroponik)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const allowedFiles = ['kolam-ikan', 'hidroponik'];
    if (!allowedFiles.includes(fileParam)) {
      return new Response(
        JSON.stringify({ error: `Nama file tidak diizinkan: ${fileParam}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const fileName = `${fileParam}.json`;
    const filePath = path.join(process.cwd(), 'data', fileName);
    const dirPath = path.dirname(filePath);

    // Buat folder jika belum ada
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const body = await req.json();

    // Baca data lama dari file jika ada
    let existingData = {};
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8').trim();
      if (content) {
        existingData = JSON.parse(content);
      }
    }

    // Gabungkan data dengan benar
    let newData = { ...existingData };

    if (body.plantInfo) {
      newData.plantInfo = {
        ...existingData.plantInfo,
        ...body.plantInfo,
      };
    }

    if (body.jadwal) {
      newData.plantInfo = {
        ...(newData.plantInfo || {}),
        jadwal: body.jadwal,
      };
    }

    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));

    return new Response(
      JSON.stringify({ message: `Data berhasil disimpan ke ${fileName}` }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error saat menyimpan data:', error);
    return new Response(
      JSON.stringify({ error: 'Terjadi kesalahan saat menyimpan data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
