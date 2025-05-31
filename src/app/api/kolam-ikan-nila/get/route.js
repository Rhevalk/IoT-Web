export async function GET() {
  return Response.json({
    timer: [
        {
        jam_N: 8,
        jam_L: 11,
        Menit_N: 0,
        Menit_L: 0,
        detik_N: 0,
        detik_L: 0
      }
    ]
  });
}