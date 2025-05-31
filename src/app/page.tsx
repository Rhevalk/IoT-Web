"use client";

import InfoCard from "@/components/card/infoCard";
import Menu from "@/components/layout/menu"
import { useEffect, useState } from "react";

const menuOps = [
  { name: "Data", href: "/data", icon: "/nav-icon/log-f.svg" },
  { name: "Home", href: "/", icon: "/nav-icon/home-f.svg" },
  { name: "Admin", href: "/admin", icon: "/nav-icon/admin-f.svg" },
];

export default function Home() {
  const [data_H, setData_H] = useState<{status: boolean} | null>(null);
  const [data_N, setData_N] = useState<{status: boolean} | null>(null);
  const [data_L, setData_L] = useState<{status: boolean} | null>(null);
  
  useEffect(() => {
    const endpoints = [
      { url: "/api/hidroponik/post", setter: setData_H, label: "data_H" },
      { url: "/api/kolam-ikan-nila/post", setter: setData_N, label: "data_N" },
      { url: "/api/kolam-ikan-lel/post", setter: setData_L, label: "data_L" },
    ];
  
    const intervals = endpoints.map(({ url, setter, label }) => {
      const fetchData = () => {
        fetch(url)
          .then((res) => res.json())
          .then(setter)
          .catch((err) => console.error(`Gagal ambil ${label}:`, err));
      };
    
      fetchData();
      return setInterval(fetchData, 5000);
    });
  
    return () => intervals.forEach(clearInterval);
  }, []);


  return (
    <div className="overflow-y-auto h-full w-full pb-18 text-[#424242]">
      <Menu opsi={menuOps}/>

      <div className="flex flex-col gap-8 px-4 py-6 md:px-8 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* InfoCard: Hidroponik */}
          <InfoCard
            href="/dashboard/hidroponik"
            title="Hidroponik"
            color="green"
            subtitle="Monitoring kondisi tanaman hidroponik"
            infoTitle="Info Tanaman"
            status={data_H?.status ? "Aktif" : "Non-Aktif"}
            detailItems={[
              { label: "Jenis Tanam", value: "--:--" },
              { label: "Jadwal Tanam", value: "--:--" },
              { label: "Perkiraan Panen", value: "--:--" },
            ]}
          />

          <InfoCard
            href="/dashboard/timelapse"
            title="Timelapse"
            color="gray"
            subtitle="Monitoring kondisi tanaman hidroponik"
            infoTitle="Info Timelapse"
            status="Non-Aktif"
            detailItems={[
              { label: "Durasi Video", value: "--:--" },
              { label: "Tanggal Awal", value: "--:--" },
              { label: "Tanggak Akhir", value: "--:--" },
            ]}
          />

          {/* InfoCard: Kolam Ikan Nila */}
          <InfoCard
            href="/dashboard/kolam-ikan-nila"
            title="Kolam Ikan"
            color="orange"
            subtitle="Monitoring kondisi ikan nila"
            infoTitle="Info & Jadwal Pakan"
            status={data_N?.status ? "Aktif" : "Non-Aktif"}
            detailItems={[
              { label: "Jenis Ikan", value: "--:--" },
              {
                label: "Jadwal Pakan",
                value: (
                  <ul className="list-disc pl-4 space-y-1">
                    {Array(7)
                      .fill("--:--")
                      .map((v, i) => (
                        <li key={i}>{v}</li>
                      ))}
                  </ul>
                ),
              },
            ]}
          />

          {/* InfoCard: Kolam Ikan Lele */}
          <InfoCard
            href="/dashboard/kolam-ikan-lele"
            title="Kolam Ikan Lele"
            color="blue"
            subtitle="Monitoring kondisi ikan lele"
            infoTitle="Info & Jadwal Pakan"
            status={data_L?.status ? "Aktif" : "Non-Aktif"}
            detailItems={[
              { label: "Jenis Ikan", value: "--:--" },
              {
                label: "Jadwal Pakan",
                value: (
                  <ul className="list-disc pl-4 space-y-1">
                    {Array(7)
                      .fill("--:--")
                      .map((v, i) => (
                        <li key={i}>{v}</li>
                      ))}
                  </ul>
                ),
              },
            ]}
          />
          
        </div>
      </div>
    </div>
  )
}
