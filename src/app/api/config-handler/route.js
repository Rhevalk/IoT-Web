import fs from 'fs';
import path from 'path';
import { URL } from 'url';

const configsDir = path.join(process.cwd(), 'configs');

// Pastikan folder ada
if (!fs.existsSync(configsDir)) {
  fs.mkdirSync(configsDir, { recursive: true });
}

function getFilePath(fileParam) {
  return path.join(configsDir, `${fileParam}.json`);
}

// Utility validasi nama file
function isValidFileName(name) {
  return /^[a-zA-Z0-9_-]+$/.test(name);
}

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const fileParam = searchParams.get('file');

    if (!fileParam || !isValidFileName(fileParam)) {
      return new Response(
        JSON.stringify({ error: 'Parameter \"file\" tidak valid' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const filePath = getFilePath(fileParam);
    const body = await req.json();

    // Baca data lama jika ada
    let existingData = {};
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8').trim();
      if (content) existingData = JSON.parse(content);
    }

    const newData = {
      ...existingData,
      ...(body.config && { config: { ...(existingData.config || {}), ...body.config } }),
      ...(body.cam && { cam: { ...(existingData.cam || {}), ...body.cam } })
    };

    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));

    return new Response(
      JSON.stringify({ message: `Config '${fileParam}' berhasil disimpan.` }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Gagal menyimpan config.' }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const fileParam = searchParams.get('file');

    if (!fileParam || !isValidFileName(fileParam)) {
      return new Response(
        JSON.stringify({ error: 'Parameter \"file\" tidak valid' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const filePath = getFilePath(fileParam);
    if (!fs.existsSync(filePath)) {
      return new Response(
        JSON.stringify({ error: 'File tidak ditemukan' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    fs.unlinkSync(filePath);

    return new Response(
      JSON.stringify({ message: `Config '${fileParam}' berhasil dihapus.` }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Gagal menghapus config.' }), { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const fileParam = searchParams.get('file');

    if (!fileParam) {
      // Ambil semua daftar file
      const files = fs.readdirSync(configsDir).filter(f => f.endsWith('.json'));
      const cams = files.map(f => f.replace('.json', ''));
      return new Response(JSON.stringify({ cams }), { status: 200 });
    }

    if (!isValidFileName(fileParam)) {
      return new Response(
        JSON.stringify({ error: 'Parameter \"file\" tidak valid' }),
        { status: 400 }
      );
    }

    const filePath = getFilePath(fileParam);
    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ error: 'Config tidak ditemukan' }), { status: 404 });
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    return new Response(content, { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Gagal mengambil config.' }), { status: 500 });
  }
}
