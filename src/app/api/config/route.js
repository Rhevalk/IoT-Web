import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// Simpan status terakhir di memori (bisa upgrade pakai DB nanti)
const statusLog = new Map(); // key: camId, value: { status, updatedAt }

// POST: ESP32 kirim status dan minta config
export async function POST(req) {
  try {
    const body = await req.json();
    const { camId, status } = body;

    if (!camId || !status) {
      return NextResponse.json(
        { error: 'camId dan status wajib dikirim' },
        { status: 400 }
      );
    }

    // Simpan status ke log
    statusLog.set(camId, {
      status,
      updatedAt: new Date().toISOString(),
    });

    const cfgPath = path.join(process.cwd(), 'configs', `${camId}.json`);
    if (!fs.existsSync(cfgPath)) {
      return NextResponse.json({ error: 'Config tidak ditemukan' }, { status: 404 });
    }

    const data = fs.readFileSync(cfgPath, 'utf-8');
    const configJson = JSON.parse(data);

    return NextResponse.json({
      message: 'Status diterima, ini config-nya',
      statusDiterima: status,
      config: configJson,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

// GET: Ambil config satu kamera (pakai query) atau semua kamera (tanpa query)
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const camId = searchParams.get('camId');

  const configDir = path.join(process.cwd(), 'configs');

  if (camId) {
    // Mode: ambil config kamera tertentu
    const cfgPath = path.join(configDir, `${camId}.json`);

    if (!fs.existsSync(cfgPath)) {
      return NextResponse.json({ error: 'Config tidak ditemukan' }, { status: 404 });
    }

    const data = fs.readFileSync(cfgPath, 'utf-8');
    const configJson = JSON.parse(data);

    return NextResponse.json({
      config: configJson.config,
      cam: configJson.cam,
      status: statusLog.get(camId) || null,
    });
  } else {
    // Mode: ambil semua config kamera
    const files = fs.readdirSync(configDir).filter(f => f.endsWith('.json'));

    const allConfigs = files.map(filename => {
      const camId = path.basename(filename, '.json');
      const data = fs.readFileSync(path.join(configDir, filename), 'utf-8');
      const configJson = JSON.parse(data);

      return {
        camId,
        config: configJson.config,
        cam: configJson.cam,
        status: statusLog.get(camId) || null,
      };
    });

    return NextResponse.json(allConfigs);
  }
}
