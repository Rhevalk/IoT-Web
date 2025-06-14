import fs from 'fs';
import path from 'path';
import { URL } from 'url';

/*-----------------------------------------
# URL PUT
# /api/data-put?file=<kolam-ikan | hidroponik>
-----------------------------------------*/

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

    // Cari key utama secara dinamis (yang berakhiran "Info")
    const infoKey = Object.keys(body).find((key) => key.endsWith("Info"));

    if (infoKey && typeof body[infoKey] === "object") {
      newData[infoKey] = {
        ...(existingData[infoKey] || {}),
        ...body[infoKey],
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
