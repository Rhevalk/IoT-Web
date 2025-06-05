import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const post = searchParams.get("file");

  if (!post) {
    return Response.json({ error: "Parameter 'file' wajib disediakan" }, { status: 400 });
  }

  const data = await request.json();
  const now = new Date();

  const entries = [];

  for (const [tipe, info] of Object.entries(data)) {
    const entry = {
      file: post,
      tipe,
      status: info.status,
      suhu_air: info.suhu_air,
      suhu_udara: info.suhu_udara ?? null,
      kelembapan_udara: info.kelembapan_udara ?? null,
      tds: info.tds ?? null,
      debit: info.debit,
      createdAt: now
    };
    entries.push(entry);
  }

  await prisma.sensorEntry.createMany({
    data: entries
  });

  return Response.json({ status: "OK", disimpan: entries.length });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const post = searchParams.get("file");
  const range = searchParams.get("range");

  if (!post) {
    return Response.json({ error: "Parameter 'file' wajib disediakan" }, { status: 400 });
  }

  if (!range) {
    // Ambil data terbaru per tipe
    // 1. Cari tipe apa saja yang ada di file tersebut
    const tipeList = await prisma.sensorEntry.findMany({
      where: { file: post },
      select: { tipe: true },
      distinct: ["tipe"],
    });

    // 2. Untuk setiap tipe, ambil data terbaru
    const latestDataPromises = tipeList.map(async ({ tipe }) => {
      const latest = await prisma.sensorEntry.findFirst({
        where: { file: post, tipe },
        orderBy: { createdAt: "desc" },
      });
      return latest;
    });

    const latestData = await Promise.all(latestDataPromises);

    return Response.json(latestData.filter(Boolean));
  }

  // Jika ada range, filter berdasarkan waktu
  let whereClause = { file: post };
  const now = new Date();
  let startDate;

  if (range === "1d") {
    startDate = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
  } else if (range === "1w") {
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (range === "1m") {
    startDate = new Date(now.setMonth(now.getMonth() - 1));
  } else if (range === "6m") {
    startDate = new Date(now.setMonth(now.getMonth() - 6));
  } else {
    return Response.json({ error: "range tidak valid" }, { status: 400 });
  }

  whereClause.createdAt = { gte: startDate };

  const data = await prisma.sensorEntry.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });

  return Response.json(data);
}
