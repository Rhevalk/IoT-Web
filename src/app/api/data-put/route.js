import fs from 'fs';
import path from 'path';

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get('file');

    if (!fileName) {
      return new Response(
        JSON.stringify({ error: 'Parameter file wajib diisi' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const filePath = path.join(process.cwd(), 'data', `${fileName}.json`);

    // Pastikan folder 'data' ada
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const body = await req.json();

    fs.writeFileSync(filePath, JSON.stringify(body, null, 2));

    return new Response(
      JSON.stringify({ message: `Data ${fileName}.json disimpan` }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error saat menyimpan data:', error);
    return new Response(
      JSON.stringify({ error: 'Gagal menyimpan data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
