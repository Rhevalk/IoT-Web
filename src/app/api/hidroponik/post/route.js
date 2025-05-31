let latestData = null; // Variabel global sementara untuk simpan data

export async function POST(request) {
  const data = await request.json();

  latestData = data; // Simpan data agar bisa diakses frontend

  return Response.json({ status: "OK" });
}

export async function GET() {
  if (!latestData) {
    return Response.json({ status: null }, { status: 404 });
  }

  return Response.json(latestData);
}
