
"use client";

import InfoCard from "@/components/card/infoCard";
import MediumCard from "@/components/card/mediumCard";
import Menu from "@/components/layout/menu";
import ChartCard from "@/components/card/ChartCard";
import { useEffect, useState } from "react";

const menuOps = [
  { name: "Data", href: "/data", icon_f: "/nav-icon/log-f.svg", color: "bg-blue-400"     , icon_s: "/nav-icon/log-s.svg"},
  { name: "Home", href: "/", icon_f: "/nav-icon/home-f.svg", color: "bg-orange-400"      , icon_s: "/nav-icon/home-s.svg"},
  { name: "Admin", href: "/admin", icon_f: "/nav-icon/admin-f.svg", color: "bg-green-400", icon_s: "/nav-icon/admin-s.svg"},
];


interface MyDataJsonType {
  hari : string
  start : string
  end : string
  pin : string
  deskripsi : string
  pengecualian : []
}

type ChartValue = { value: number };

interface MyDataType {
  status: boolean;
  suhu_air: number;
  debit: number;
}

type DataPoint = { name: string; value: number };
type ChartData = Record<"1d" | "1w" | "1m" | "6m", DataPoint[]>;

interface ApiDataItem {
  tipe: string;
  createdAt: string;
  value?: number;
  suhu_air?: number;
  tds?: number;
  // field lain sesuai API
}


export default function Log() {
  
  /*===============================CEK STATUS CLIENT================================================*/
  const [data, setData] = useState<MyDataType | null>(null);
  useEffect(() => {
    const fetchData = () => {
      fetch("/api/data-post?file=kolam-ikan")
        .then((res) => res.json())
        .then((json) => setData(json["NilaInfo"]))
        .catch((err) => console.error("Gagal ambil data:", err));
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // setiap 5 detik
    return () => clearInterval(interval);
    
  }, []);

  /*===============================GRAFIK KECIL================================================*/
  const [chartSuhuAir, setChartSuhuAir] = useState<ChartValue[]>([]);
  const [chartDebit, setChartDebit] = useState<ChartValue[]>([]);
  useEffect(() => {
    if (!data) return;

    if (data.debit !== undefined) {
      setChartDebit((prev) => [{ value: data.debit as number }, ...prev].slice(0, 8));
    }
    if (data.suhu_air !== undefined) {
      setChartSuhuAir((prev) => [{ value: data.debit as number }, ...prev].slice(0, 8));
    }

  }, [data]);

  /*===============================MENGAMBIL JADWAL================================================*/
  const [dataJson, setDataJson] = useState<MyDataJsonType[]>([]);
  useEffect(() => {
    async function fetchJadwal() {
      try {
        const res = await fetch('/api/data-get?file=kolam-ikan');
        if (res.ok) {
          const getJson = await res.json();
          setDataJson(getJson["NilaInfo"]["jadwal"]);
        } else {
          console.error('Gagal fetch data jadwal');
        }
      } catch (error) {
        console.error('Error saat fetch jadwal:', error);
      }
    }
    fetchJadwal();
  }, []);

    /*===============================MENGAMBIL DATA CHART================================================*/
  const [chartData, setChartData] = useState<ChartData>({
    "1d": [],
    "1w": [],
    "1m": [],
    "6m": [],
  });

const fetchData = async (range: keyof ChartData) => {
  const file = "kolam_ikan";
  try {
    const res = await fetch(`/api/data-sql?file=${file}&range=${range}`);
    if (!res.ok) throw new Error("Failed to fetch data");
    const data: ApiDataItem[] = await res.json();

    if (!Array.isArray(data)) {
      console.error("API data is not an array");
      setChartData(prev => ({ ...prev, [range]: [] }));
      return;
    }

    // Filter hanya data tipe LeleInfo, atau ganti sesuai kebutuhan kamu
    const filtered = data.filter(item => item.tipe === "NilaInfo");

    const processedData: DataPoint[] = filtered.map(item => ({
      name: new Date(item.createdAt).toLocaleString(),
      value: item.suhu_air ?? 0,
    }));

    setChartData(prev => ({ ...prev, [range]: processedData }));
  } catch (error) {
    console.error("Error fetching chart data:", error);
  }
};

  return (
    <div className="flex flex-col h-auto pb-32 text-[#424242] ">
      <Menu opsi={menuOps}/>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-white transition-all duration-200">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* InfoCard: Kolam Ikan Nila */}
          <InfoCard
            href="/dashboard/kolam-ikan-nila"
            title="Kolam Ikan Nila"
            icon="/dashboard-icon/ikan.svg"
            color="orange"
            subtitle="Monitoring kondisi ikan nila"
            infoTitle="Info & Jadwal Pakan"
            status={data?.status ? "Aktif" : "Non-Aktif"}
            detailItems={[
              { label: "Jenis Ikan", value: "Nila" },
              {
                label: "Jadwal",
                value: (
                  <ul className="list-disc pl-4 space-y-1">
                    {dataJson.length > 0 ? (
                      dataJson.map((item, i) => (
                        <li key={i}>
                           
                      <strong>{item?.deskripsi ?? ""}</strong> : <strong>(
                      {item.hari === "Setiap Hari" 
                        ? (item.pengecualian && item.pengecualian.length > 0
                            ? `Setiap Hari,  <${item.pengecualian.join(", ")}>`
                            : "Setiap Hari")
                        : item.hari
                      }
                    )</strong> {item.start} -- {item.end} [Pin: {item.pin}]

                        </li>
                      ))
                    ) : (
                      <li>Tidak ada jadwal</li>
                    )}
                  </ul>
                ),
              },
            ]}
          />

          {/* Box 4 & 5 */}
          <div className="col-span-1 w-full flex flex-col gap-6">

              {/*===============================SUHU AIR=================================== */}
              <MediumCard 
                title="Suhu Air"
                value={data?.suhu_air}
                unit="°C"
                icon="/mini-icon/suhu-air.svg"
                thresholds={{
                  low: 20, 
                  high: 40, 
                }}
                  lowColor="text-blue-500"
                  midColor="text-yellow-500"
                  highColor="text-red-500"

                  lowHEX = "#3b82f6"   
                  midHEX = "#eab308" 
                  highHEX = "#ef4444"

                  chartData={chartSuhuAir}

              />

            {/*===============================DEBIT=================================== */}
              <MediumCard 
                title="Debit"
                value={data?.debit}
                unit="L/menit"
                icon="/mini-icon/aliran-air.svg"
                thresholds={{
                  low: 0, 
                  high: 12, 
                }}
                  lowColor="text-red-500"
                  midColor="text-green-500"
                  highColor="text-blue-500"

                  lowHEX="#ef4444"
                  midHEX="#22c55e"
                  highHEX="#3b82f6"

                  chartData={chartDebit}

              />
    
          </div>

        </div>

        {/* Extra Full Width Boxes */}
        <div className="mt-6 space-y-6">
          <div className="w-full h-auto rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-200">
            <ChartCard
              label="Data Suhu Air"
              data={chartData}
              onRangeChange={fetchData}
            />
          </div>
        </div>
      </main>
    </div>
  );
}