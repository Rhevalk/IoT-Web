"use client";

import InfoCard from "@/components/card/infoCard";
import Menu from "@/components/layout/menu"
import { useEffect, useState } from "react";

const menuOps = [
  { name: "Data", href: "/data", icon: "/nav-icon/log-f.svg" },
  { name: "Home", href: "/", icon: "/nav-icon/home-f.svg" },
  { name: "Admin", href: "/admin", icon: "/nav-icon/admin-f.svg" },
];

interface MyDataJsonType {
  type: string;
  plantingDate: string;
  harvestDate: string;
  hari : string
  start : string
  end : string
  pin : string
}

export default function Home() {

  /*===============================CEK STATUS CLIENT================================================*/
  const [data_H, setData_H] = useState<{status: boolean} | null>(null);
  const [data_N, setData_N] = useState<{status: boolean} | null>(null);
  const [data_L, setData_L] = useState<{status: boolean} | null>(null);
  useEffect(() => {
    const endpoints = [
      { url: "/api/hidroponik", setter: setData_H, label: "data_H" },
      { url: "/api/kolam-ikan-nila", setter: setData_N, label: "data_N" },
      { url: "/api/kolam-ikan-lele", setter: setData_L, label: "data_L" },
    ];
  
    const intervals = endpoints.map(({ url, setter, label }) => {
      const fetchData = () => {
        fetch(url)
          .then((res) => res.json())
          .then(setter)
          .catch((err) => console.error(`Gagal ambil ${label}:`, err));
      };
    
      fetchData();
      return setInterval(fetchData, 10000);
    });
  
    return () => intervals.forEach(clearInterval);
  }, []);

  /*===============================MENGAMBIL JADWAL================================================*/
  const [dataJson_H, setDataJson_H] = useState<MyDataJsonType | null>(null);
  const [dataJson_H_list, setDataJson_H_list] = useState<MyDataJsonType[]>([]);
  const [dataJson_N, setDataJson_N] = useState<MyDataJsonType[]>([]);
  const [dataJson_L, setDataJson_L] = useState<MyDataJsonType[]>([]);
  useEffect(() => {
    const fetchList = [
      { file: 'hidroponik', key: 'plantInfo', setter: setDataJson_H },
      { file: 'hidroponik', key: 'jadwal', setter: setDataJson_H_list },
      { file: 'kolam-ikan-nila', key: 'jadwal', setter: setDataJson_N },
      { file: 'kolam-ikan-lele', key: 'jadwal', setter: setDataJson_L },
    ];

    fetchList.forEach(async ({ file, key, setter }) => {
      try {
        const res = await fetch(`/api/data-get?file=${file}`);
        if (res.ok) {
          const json = await res.json();
          console.log(json[key]);
          setter(json[key]);
        } else {
          console.error(`Gagal fetch data dari ${file}`);
        }
      } catch (err) {
        console.error(`Error saat fetch ${file}:`, err);
      }
    });
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
            icon="/dashboard-icon/hidro.svg"
            color="green"
            subtitle="Monitoring kondisi tanaman hidroponik"
            infoTitle="Info Tanaman"
            status={data_H?.status ? "Aktif" : "Non-Aktif"}
            detailItems={[
              { label: "Jenis Tanam", value: dataJson_H?.type ?? "--:--"},
              { label: "Jadwal Tanam", value: dataJson_H?.harvestDate ?? "--:--" },
              { label: "Perkiraan Panen", value: dataJson_H?.plantingDate ?? "--:--" },
              {
                label: "Jadwal Pencahayaan",
                value: (
                  <ul className="list-disc pl-4 space-y-1">
                    {dataJson_H_list.map((item, i) => (
                      <li key={i}>
                        {item.hari}: {item.start} - {item.end} (Pin {item.pin})
                      </li>
                    ))}
                  </ul>
                ),
              }
            ]}
          />

          <InfoCard
            href="/dashboard/timelapse"
            title="Timelapse"
            icon="/dashboard-icon/cam.svg"
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
            icon="/dashboard-icon/ikan.svg"
            color="orange"
            subtitle="Monitoring kondisi ikan nila"
            infoTitle="Info & Jadwal Pakan"
            status={data_N?.status ? "Aktif" : "Non-Aktif"}
            detailItems={[
              { label: "Jenis Ikan", value: "Nila" },
              {
                label: "Jadwal Pencahayaan",
                value: (
                  <ul className="list-disc pl-4 space-y-1">
                    {dataJson_N.length > 0 ? (
                      dataJson_N.map((item, i) => (
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

          {/* InfoCard: Kolam Ikan Lele */}
          <InfoCard
            href="/dashboard/kolam-ikan-lele"
            title="Kolam Ikan Lele"
            icon="/dashboard-icon/ikan.svg"
            color="blue"
            subtitle="Monitoring kondisi ikan lele"
            infoTitle="Info & Jadwal Pakan"
            status={data_L?.status ? "Aktif" : "Non-Aktif"}
            detailItems={[
              { label: "Jenis Ikan", value: "Lele" },
              {
                label: "Jadwal Pakan",
                value: (
                  <ul className="list-disc pl-4 space-y-1">
                    {dataJson_L.length > 0 ? (
                      dataJson_L.map((item, i) => (
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
          
        </div>
      </div>
    </div>
  )
}
