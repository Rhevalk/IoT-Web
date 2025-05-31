export async function GET() {
  return Response.json({
    timer: [
        {
        hari: 1,
        pin: null,
        jam_N: 8,
        jam_L: 15,
        Menit_N: 0,
        Menit_L: 0,
        detik_N: 0,
        detik_L: 0
      }
    ]
  });
}