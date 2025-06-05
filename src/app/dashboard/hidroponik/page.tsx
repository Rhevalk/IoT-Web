
"use client";

import InfoCard from "@/components/card/infoCard";
import SmallCard from "@/components/card/smallCard";
import MediumCard from "@/components/card/mediumCard";
import Menu from "@/components/layout/menu";
import ChartCard from "@/components/card/ChartCard";
import { useEffect, useState } from "react";

const menuOps = [
  { name: "Data", href: "/data", icon_f: "/nav-icon/log-f.svg", color: "bg-blue-400"     , icon_s: "/nav-icon/log-s.svg"},
  { name: "Home", href: "/", icon_f: "/nav-icon/home-f.svg", color: "bg-orange-400"      , icon_s: "/nav-icon/home-s.svg"},
  { name: "Admin", href: "/admin", icon_f: "/nav-icon/admin-f.svg", color: "bg-green-400", icon_s: "/nav-icon/admin-s.svg"},
];

interface MyDataType {
  status: boolean;
  suhu_udara: number;
  kelembapan_udara: number;
  suhu_air: number;
  tds: number;
  debit: number;
}

interface MyDataJsonType {
  type: string;
  plantingDate: string;
  harvestDate: string;
}

type ChartValue = { value: number };

type DataPoint = { name: string; value: number };
type ChartData = Record<"1d" | "1w" | "1m" | "6m", DataPoint[]>;

interface ApiDataItem {
  createdAt: string;
  value?: number;
  suhu_air?: number;
  tds?: number;
  // field lain sesuai API
}

export default function Log() {  
  /*===============================MENGAMBIL DATA================================================*/
  const [data, setData] = useState<MyDataType | null>(null);
  useEffect(() => {
    const fetchData = () => {
      fetch("/api/data-post?file=hidroponik")
        .then((res) => res.json())
        .then((json) => setData(json["HidroponikInfo"]))
        .catch((err) => console.error("Gagal ambil data:", err));

    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // setiap 5 detik
    return () => clearInterval(interval);
    
  }, []);

  /*===============================MENGAMBIL JADWAL================================================*/
  const [dataJson, setDataJson] = useState<MyDataJsonType | null>(null);
  useEffect(() => {
    async function fetchJadwal() {
      try {
        const res = await fetch('/api/data-get?file=hidroponik');
        if (res.ok) {
          const getJson = await res.json();
          setDataJson(getJson["plantInfo"]);
        } else {
          console.error('Gagal fetch data jadwal');
        }
      } catch (error) {
        console.error('Error saat fetch jadwal:', error);
      }
    }
    fetchJadwal();
  }, []);

  /*===============================MEMBUAT CHART================================================*/
  const [chartSuhu, setChartSuhu] = useState<ChartValue[]>([]);
  const [chartKelembapan, setChartKelembapan] = useState<ChartValue[]>([]);
  const [chartTds, setChartTds] = useState<ChartValue[]>([]);
  const [chartDebit, setChartDebit] = useState<ChartValue[]>([]);
  const [chartSuhuAir, setChartSuhuAir] = useState<ChartValue[]>([]);
  useEffect(() => {
    if (!data) return;

    if (data.suhu_udara !== undefined) {
      setChartSuhu((prev) => [{ value: data.suhu_udara as number }, ...prev].slice(0, 8));
    }

    if (data.kelembapan_udara !== undefined) {
      setChartKelembapan((prev) => [{ value: data.kelembapan_udara as number }, ...prev].slice(0, 8));
    }

    if (data.tds !== undefined) {
      setChartTds((prev) => [{ value: data.tds as number }, ...prev].slice(0, 8));
    }

    if (data.debit !== undefined) {
      setChartDebit((prev) => [{ value: data.debit as number }, ...prev].slice(0, 8));
    }
    if (data.suhu_air !== undefined) {
      setChartSuhuAir((prev) => [{ value: data.debit as number }, ...prev].slice(0, 8));
    }

  }, [data]);

    /*===============================MENGAMBIL DATA CHART================================================*/
  const [chartData, setChartData] = useState<ChartData>({
    "1d": [],
    "1w": [],
    "1m": [],
    "6m": [],
  });

  const fetchData = async (range: keyof ChartData) => {
    const file = "hidroponik";
    try {
      const res = await fetch(`/api/data-sql?file=${file}&range=${range}`);
      if (!res.ok) throw new Error("Failed to fetch data");
      const data: ApiDataItem[] = await res.json();

      if (!Array.isArray(data)) {
        console.error("API data is not an array");
        setChartData(prev => ({ ...prev, [range]: [] }));
        return;
      }

      const processedData: DataPoint[] = data.map(item => ({
        name: new Date(item.createdAt).toLocaleString(),
        value: item.tds ?? 0,
      }));

      setChartData(prev => ({ ...prev, [range]: processedData }));
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };
  
  return (
    <div className="flex flex-col h-auto pb-32 text-[#424242]">
      <Menu opsi={menuOps}/>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-white transition-all duration-200">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Box 1 - Info Tanaman */}
          <InfoCard
            href="/dashboard/hidroponik"
            title="Hidroponik"
            color="green"
            icon="/dashboard-icon/hidro.svg"
            subtitle="Monitoring kondisi tanaman hidroponik"
            infoTitle="Info Tanaman"
            status={data?.status ? "Aktif" : "Non-Aktif"}
            detailItems={[
              { label: "Jenis Tanam", value: dataJson?.type ?? "--:--"},
              { label: "Jadwal Tanam", value: dataJson?.plantingDate ?? "--:--" },
              { label: "Perkiraan Panen", value: dataJson?.harvestDate ?? "--:--" },
            ]}
          />
          
          {/* Box 2 & 3 & 4*/}
          <div className="col-span-1 flex flex-col gap-6 ">
            <div className="h-full flex gap-6">

              {/*===============================SUHU UDARA=================================== */}
              <SmallCard 
                title="Suhu Udara"
                value={data?.suhu_udara}
                unit="°C"
                icon="/mini-icon/suhu.svg"
                thresholds={{
                  low: 30,
                  high: 40,
                }}
                  lowColor="text-blue-500"
                  midColor="text-yellow-500"
                  highColor="text-red-500"

                  chartData={chartSuhu}
              />


              {/*===============================KELEMBAPAN UDARA=================================== */}
              <SmallCard 
                title="Kelembapan"
                value={data?.kelembapan_udara}
                unit="%"
                icon="/mini-icon/kelembapan.svg"
                thresholds={{
                  low: 30,
                  high: 80,
                }}
                  lowColor="text-red-500"
                  midColor="text-green-500"
                  highColor="text-blue-500"
                  
                  lowHEX="#ef4444"
                  midHEX="#22c55e"
                  highHEX="#3b82f6"

                  chartData={chartKelembapan}
              />
              
            </div>

            {/*===============================TDS=================================== */}
              <MediumCard 
                title="TDS"
                value={data?.tds}
                unit="ppm"
                icon="/mini-icon/air.svg"
                thresholds={{
                  low: 0, // masih blom tau
                  high: 100, // masih blom tau
                }}
                  lowColor="text-red-500"
                  midColor="text-green-500"
                  highColor="text-blue-500"

                  lowHEX="#ef4444"
                  midHEX="#22c55e"
                  highHEX="#3b82f6"

                  chartData={chartTds}
              />
          </div>

          {/* Box 4 & 5 */}
          <div className="col-span-1 flex flex-col gap-6">

            {/*===============================DEBIT=================================== */}
              <MediumCard 
                title="Debit"
                value={data?.debit}
                unit="L/menit"
                icon="/mini-icon/aliran-air.svg"
                thresholds={{
                  low: 2, // masih blom tau
                  high: 10, // masih blom tau
                }}
                  lowColor="text-red-500"
                  midColor="text-green-500"
                  highColor="text-blue-500"

                  lowHEX="#ef4444"
                  midHEX="#22c55e"
                  highHEX="#3b82f6"

                  chartData={chartDebit}
              />
            
            {/*===============================SUHU AIR=================================== */}
              <MediumCard 
                title="Suhu Air"
                value={data?.suhu_air}
                unit="°C"
                icon="/mini-icon/suhu-air.svg"
                thresholds={{
                  low: 20, // masih blom tau
                  high: 40, // masih blom tau
                }}
                  lowColor="text-blue-500"
                  midColor="text-yellow-500"
                  highColor="text-red-500"

                  lowHEX="#3b82f6"
                  midHEX="#eab308"
                  highHEX="#ef4444"

                  chartData={chartSuhuAir}
              />
          </div>

        </div>

        {/* Extra Full Width Boxes */}
        <div className="mt-6 space-y-6">
          <div className="w-full h-auto rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-200">
            <ChartCard
              label="Data TDS"
              data={chartData}
              onRangeChange={fetchData}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
