"use client";

import InfoCard from "@/components/card/infoCard";
import Menu from "@/components/layout/menu"
import { useEffect, useState } from "react";

const menuOps = [
  { name: "Data", href: "/data", icon_f: "/nav-icon/log-f.svg", color: "bg-blue-400"     , icon_s: "/nav-icon/log-s.svg"},
  { name: "Home", href: "/", icon_f: "/nav-icon/home-f.svg", color: "bg-orange-400"      , icon_s: "/nav-icon/home-s.svg"},
  { name: "Admin", href: "/admin", icon_f: "/nav-icon/admin-f.svg", color: "bg-green-400", icon_s: "/nav-icon/admin-s.svg"},
];

type MyDataJsonType = {
  // definisi tipe objek json kamu
  type: string;
  plantingDate: string;
  harvestDate: string;
  ikanHidup: string;
  ikanMati: string;
  jadwal: JadwalItem[];
};

type JadwalItem = {
  hari: string;
  start: string;
  end: string;
  pin: number;
  deskripsi: number;
  pengecualian: [];
};

export default function Home() {

  /*===============================CEK STATUS CLIENT================================================*/
  const [data_H, setData_H] = useState<{status: boolean} | null>(null);
  const [data_N, setData_N] = useState<{status: boolean} | null>(null);
  const [data_L, setData_L] = useState<{status: boolean} | null>(null);

 useEffect(() => {
    const endpoints = [
      { url: "/api/data-post?file=hidroponik", key: "HidroponikInfo", setter: setData_H, label: "data_H" },
      { url: "/api/data-post?file=kolam-ikan", key: "NilaInfo", setter: setData_N, label: "data_N" },
      { url: "/api/data-post?file=kolam-ikan", key: "LeleInfo", setter: setData_L, label: "data_L" },
    ];

    const intervals = endpoints.map(({ url, key, setter, label }) => {
      const fetchData = () => {
      fetch(url)
        .then(res => {
          if (!res.ok) {
            console.warn(`Gagal fetch dari ${url}: status ${res.status}`);
            return null;
          }
          return res.json();
        })
        .then(data => {
          if (data) setter(data[key]);
          else setter(null);
        })
        .catch(err => {
          console.error(`Gagal ambil ${label}:`, err.message || err);
          setter(null);
        });
      
      
      };

      fetchData();
      return setInterval(fetchData, 10000);
    });

    return () => intervals.forEach(clearInterval);
  }, []);



  /*===============================MENGAMBIL JADWAL================================================*/
  const [dataJson_H, setDataJson_H] = useState<MyDataJsonType | null>(null);
  const [dataJson_H_list, setDataJson_H_list] = useState<JadwalItem[]>([]);

  const [dataJson_N, setDataJson_N] = useState<MyDataJsonType | null>(null);
  const [dataJson_N_list, setDataJson_N_list] = useState<JadwalItem[]>([]);

  const [dataJson_L, setDataJson_L] = useState<MyDataJsonType | null>(null);
  const [dataJson_L_list, setDataJson_L_list] = useState<JadwalItem[]>([]);

  useEffect(() => {
    const fetchAndSetJadwal = async (
      file: string,
      key: string,
      setInfo: (data: MyDataJsonType) => void,
      setList: (data: JadwalItem[]) => void
    ) => {
      try {
        const res = await fetch(`/api/data-get?file=${file}`);
        if (res.ok) {
          const data = await res.json();
          const info = data[key];
          if (data[key]) {
            setInfo(info);
            setList(info.jadwal || data.jadwal); // fallback kalau struktur beda
          } else {
            console.error(`Json kosong dari ${file}`);
          }
        } else {
          console.error(`Gagal fetch data jadwal dari ${file}`);
        }
      } catch (error) {
        console.error(`Error saat fetch jadwal dari ${file}:`, error);
      }
    };

    fetchAndSetJadwal('hidroponik', 'plantInfo', setDataJson_H, setDataJson_H_list);
    fetchAndSetJadwal('kolam-ikan', 'NilaInfo', setDataJson_N, setDataJson_N_list);
    fetchAndSetJadwal('kolam-ikan', 'LeleInfo', setDataJson_L, setDataJson_L_list);
  }, []);

  return (
    <div className="overflow-y-auto h-full w-full pb-18 text-[#424242">
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
                label: "Jadwal",
                value: (
                  <ul className="list-disc pl-4 space-y-1">
                    {dataJson_H_list.length > 0 ? (
                      dataJson_H_list.map((item, i) => (
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
            title="Kolam Ikan Nila"
            icon="/dashboard-icon/ikan.svg"
            color="orange"
            subtitle="Monitoring kondisi ikan nila"
            infoTitle="Info & Jadwal"
            status={data_N?.status ? "Aktif" : "Non-Aktif"}
            detailItems={[
              { label: "Jenis Ikan", value: dataJson_N?.type ?? "--:--" },
              { label: "Ikan Hidup", value: dataJson_N?.ikanHidup ?? "--:--" },
              { label: "Ikan Mati", value: dataJson_N?.ikanMati ?? "--:--" },
              {
                label: "Jadwal",
                value: (
                  <ul className="list-disc pl-4 space-y-1">
                    {dataJson_N_list.length > 0 ? (
                      dataJson_N_list.map((item, i) => (
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

          {/* InfoCard: Kolam Ikan Lele */}
          <InfoCard
            href="/dashboard/kolam-ikan-lele"
            title="Kolam Ikan Lele"
            icon="/dashboard-icon/ikan.svg"
            color="blue"
            subtitle="Monitoring kondisi ikan lele"
            infoTitle="Info & Jadwal"
            status={data_L?.status ? "Aktif" : "Non-Aktif"}
            detailItems={[
              { label: "Jenis Ikan", value: dataJson_L?.type ?? "--:--" },
              { label: "Ikan Hidup", value: dataJson_L?.ikanHidup ?? "--:--" },
              { label: "Ikan Mati", value: dataJson_L?.ikanMati ?? "--:--" },
              {
                label: "Jadwal",
                value: (
                  <ul className="list-disc pl-4 space-y-1">
                    {dataJson_L_list.length > 0 ? (
                      dataJson_L_list.map((item, i) => (
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
          
        </div>
      </div>
    </div>
  )
}
