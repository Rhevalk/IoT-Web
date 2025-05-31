import fs from 'fs';
import path from 'path';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get('file');

  if (!fileName) {
    return new Response(JSON.stringify({ error: 'File name is required' }), { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'data', `${fileName}.json`);

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return new Response(data, {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch {
    return new Response(JSON.stringify({ error: 'File not found or cannot be read' }), { status: 404 });
  }
}
