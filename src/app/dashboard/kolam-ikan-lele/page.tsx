
"use client";

import InfoCard from "@/components/card/infoCard";
import MediumCard from "@/components/card/mediumCard";
import Menu from "@/components/layout/menu";
import { useEffect, useState } from "react";

const menuOps = [
  { name: "Data", href: "/data", icon: "/nav-icon/log-f.svg" },
  { name: "Home", href: "/", icon: "/nav-icon/home-f.svg" },
  { name: "Admin", href: "/admin", icon: "/nav-icon/admin-f.svg" },
];

interface MyDataJsonType {
  hari : string
  start : string
  end : string
  pin : string
}

export default function Log() {
  type ChartValue = { value: number };

  interface MyDataType {
    status: boolean;
    suhu_air: number;
    debit: number;
  }
  const [data, setData] = useState<MyDataType | null>(null);


  const [chartDebit, setChartDebit] = useState<ChartValue[]>([]);
  const [chartSuhuAir, setChartSuhuAir] = useState<ChartValue[]>([]);

  useEffect(() => {
    const fetchData = () => {
      fetch("/api/kolam-ikan-lele")
        .then((res) => res.json())
        .then((json) => setData(json))
        .catch((err) => console.error("Gagal ambil data:", err));
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // setiap 5 detik
    return () => clearInterval(interval);
    
  }, []);

  useEffect(() => {
    if (!data) return;

    if (data.debit !== undefined) {
      setChartDebit((prev) => [{ value: data.debit as number }, ...prev].slice(0, 8));
    }
    if (data.suhu_air !== undefined) {
      setChartSuhuAir((prev) => [{ value: data.debit as number }, ...prev].slice(0, 8));
    }

  }, [data]);
  
  const [dataJson, setDataJson] = useState<MyDataJsonType[]>([]);
  useEffect(() => {
    async function fetchJadwal() {
      try {
        const res = await fetch('/api/data-get?file=kolam-ikan-lele');
        if (res.ok) {
          const getJson = await res.json();
          console.log(getJson["jadwal"]);
          setDataJson(getJson["jadwal"]);
        } else {
          console.error('Gagal fetch data jadwal');
        }
      } catch (error) {
        console.error('Error saat fetch jadwal:', error);
      }
    }
    fetchJadwal();
  }, []);

  return (
    <div className="flex flex-col h-screen text-[#424242]">
      <Menu opsi={menuOps}/>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-white transition-all duration-200">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* InfoCard: Kolam Ikan Lele */}
          <InfoCard
            href="/dashboard/kolam-ikan-lele"
            title="Kolam Ikan Lele"
            color="blue"
            subtitle="Monitoring kondisi ikan lele"
            infoTitle="Info & Jadwal Pakan"
            status={data?.status ? "Aktif" : "Non-Aktif"}
            detailItems={[
              { label: "Jenis Ikan", value: "Lele" },
              {
                label: "Jadwal Pakan",
                value: (
                  <ul className="list-disc pl-4 space-y-1">
                    {dataJson.length > 0 ? (
                      dataJson.map((item, i) => (
                        <li key={i}>
                          {item.hari}: {item.start} - {item.end} (Pin {item.pin}) (Otomatis)
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
                //icon={DropletIcon}
                thresholds={{
                  low: 20, // masih blom tau
                  high: 40, // masih blom tau
                }}
                  lowColor="text-blue-500"
                  midColor="text-yellow-500"
                  highColor="text-red-500"

                  chartData={chartSuhuAir}
              />

            {/*===============================DEBIT=================================== */}
              <MediumCard 
                title="Debit"
                value={data?.debit}
                unit="L/menit"
                //icon={DropletIcon}
                thresholds={{
                  low: 0, // masih blom tau
                  high: 100, // masih blom tau
                }}
                  lowColor="text-red-500"
                  midColor="text-green-500"
                  highColor="text-blue-500"

                  chartData={chartDebit}
              />
    
          </div>

        </div>

        {/* Extra Full Width Boxes */}
        <div className="mt-6 space-y-6">
          <div className="w-full h-44 rounded-xl bg-amber-400 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-[#f9f8f8] transition-all duration-200"></div>
          <div className="w-full h-44 rounded-xl bg-amber-400 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-[#f9f8f8] transition-all duration-200"></div>
        </div>
      </main>
    </div>
  );
}
