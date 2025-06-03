let dataMap = new Map(); // Menyimpan data per post

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const post = searchParams.get("file");

  if (!post) {
    return Response.json({ error: "Parameter 'file' wajib disediakan" }, { status: 400 });
  }

  const data = await request.json();
  dataMap.set(post, data); // Simpan data berdasarkan post

  return Response.json({ status: "OK", post });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const post = searchParams.get("file");

  if (!post) {
    return Response.json({ error: "Parameter 'file' wajib disediakan" }, { status: 400 });
  }

  const data = dataMap.get(post);

  if (!data) {
    return Response.json({ status: null }, { status: 404 });
  }

  return Response.json(data);
}
