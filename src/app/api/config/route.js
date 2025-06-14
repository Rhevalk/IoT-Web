import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const CONFIG_DIR = path.join(process.cwd(), 'configs');

function getConfigFilePath(camId) {
  return path.join(CONFIG_DIR, `${camId}.json`);
}
function getKondisi(updatedAtStr) {
  const updatedAt = new Date(updatedAtStr);
  const now = new Date();
  const selisihMs = now - updatedAt;

  if (selisihMs < 5000) return 'Aktif';
  if (selisihMs < 60000) return 'Pending';
  return 'Non-Aktif';
}


// ✅ POST: ESP32 kirim status dan minta config
export async function POST(req) {
  try {
    const body = await req.json();
    const { camId, status } = body;

    if (!camId || typeof status !== 'boolean') {
      return NextResponse.json({ error: 'camId dan status wajib dikirim' }, { status: 400 });
    }

    const cfgPath = getConfigFilePath(camId);
    if (!fs.existsSync(cfgPath)) {
      return NextResponse.json({ error: 'Config tidak ditemukan' }, { status: 404 });
    }

    const data = fs.readFileSync(cfgPath, 'utf-8');
    const configJson = JSON.parse(data);

    // Simpan status ke dalam file
    configJson.status = {
      status,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(cfgPath, JSON.stringify(configJson, null, 2));

  return NextResponse.json({
      config : configJson.config,
      cam: configJson.cam,
  });
  
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

// ✅ GET: Ambil satu config atau semua config
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const camId = searchParams.get('camId');

    if (camId) {
      const filePath = getConfigFilePath(camId);
      if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: 'Config tidak ditemukan' }, { status: 404 });
      }

      const data = fs.readFileSync(filePath, 'utf-8');
      const configJson = JSON.parse(data);

      const updatedAt = configJson?.status?.updatedAt;
      const kondisi = updatedAt ? getKondisi(updatedAt) : 'Non-Aktif';

      if (!configJson.status) {
        configJson.status = {
          status: false,
          updatedAt: null,
          kondisi
        };
      } else {
        configJson.status.kondisi = kondisi;
      }

      configJson.camId = camId;

      return NextResponse.json(configJson);
    } else {
      // GET all
      const files = fs.readdirSync(CONFIG_DIR).filter(f => f.endsWith('.json'));
      const configs = files.map(file => {
        const data = fs.readFileSync(path.join(CONFIG_DIR, file), 'utf-8');
        const json = JSON.parse(data);

        const updatedAt = json?.status?.updatedAt;
        const kondisi = updatedAt ? getKondisi(updatedAt) : 'Non-Aktif';

        if (!json.status) {
          json.status = {
            status: false,
            updatedAt: null,
            kondisi
          };
        } else {
          json.status.kondisi = kondisi;
        }

        json.camId = path.basename(file, '.json');
        return json;
      });

      return NextResponse.json(configs);
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Gagal membaca config.' }, { status: 500 });
  }
}



// ✅ PUT: Simpan update config dan status
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const camId = searchParams.get('camId');
    if (!camId) {
      return NextResponse.json({ error: 'Parameter camId wajib ada' }, { status: 400 });
    }

    const body = await req.json();
    const { config, cam, status } = body;

    const newData = { config, cam };
    if (status) newData.status = status;

    const filePath = getConfigFilePath(camId);
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));

    return NextResponse.json({ message: `Config '${camId}' berhasil disimpan.` });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Gagal menyimpan config.' }, { status: 500 });
  }
}

// ✅ DELETE: Hapus file config
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const camId = searchParams.get('camId');
    if (!camId) {
      return NextResponse.json({ error: 'Parameter camId wajib ada' }, { status: 400 });
    }

    const filePath = getConfigFilePath(camId);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 404 });
    }

    fs.unlinkSync(filePath);
    return NextResponse.json({ message: `Config '${camId}' dihapus.` });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Gagal menghapus config.' }, { status: 500 });
  }
}
