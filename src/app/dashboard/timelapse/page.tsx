
"use client";

import InfoCard from "@/components/card/infoCard";
import Menu from "@/components/layout/menu";
import VideoCard from "@/components/card/videoCard";
import { useEffect, useState } from "react";

const menuOps = [
  { name: "Data", href: "/data", icon_f: "/nav-icon/log-f.svg", color: "bg-blue-400"     , icon_s: "/nav-icon/log-s.svg"},
  { name: "Home", href: "/", icon_f: "/nav-icon/home-f.svg", color: "bg-orange-400"      , icon_s: "/nav-icon/home-s.svg"},
  { name: "Admin", href: "/admin", icon_f: "/nav-icon/admin-f.svg", color: "bg-green-400", icon_s: "/nav-icon/admin-s.svg"},
];

type ConfigItem = {
  status: boolean;
  cam: {
    id: string;
    name: string;
  };
  config: {
    start_date: string;
    end_date: string;
  };
};

type videosItems = {
  camId: string;
  videos: string[];
  thumbnails: string[];
}

export default function Log() {  
  
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
    useEffect(() => {
      fetch('/api/config')
        .then(res => res.json())
        .then(data => setConfigs(data))
        .catch(err => console.error('Gagal ambil semua config:', err));
    }, []);

  const [videos, setVideos] = useState<videosItems[]>([]);
    useEffect(() => {
      fetch('/api/video-get')
        .then(res => res.json())
        .then(data => {
          setVideos(data);
          console.log(data);
        })
        .catch(err => console.error('Gagal ambil semua video:', err));
    }, []);

  
  return (
    <div className="flex flex-col h-auto pb-32 text-[#424242]">
      <Menu opsi={menuOps}/>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-white transition-all duration-200">

				<div className="flex flex-col md:flex-row gap-6">

          {/* Box 1 - Info Tanaman */}
					<div className="h-auto w-full md:w-[48rem]">
          <InfoCard
            href="/dashboard/timelapse"
            title="Timelapse"
            icon="/dashboard-icon/cam.svg"
            color="gray"
            subtitle="Lihat perkembangan tumbuhan"
            infoTitle="Info Timelapse"
            detailItems={[
              { label: "Jumlah Perangkat", value: configs.length },
              {
                label: "Perangkat",
                value: (
                  <ul className="pl-4 space-y-1">
                    {configs.length > 0 ? (
                      configs.map((item, i) => (
                        <li key={i} className="flex items-center">
                          <span className={`w-4 h-4 ${item.status ? "bg-green-400" : "bg-red-400"} inline-block mt-1 mr-2 rounded-sm`}></span>

                          <h1><strong>{item.cam.name}</strong> {`(${item.config.start_date} -- ${item.config.end_date})`}</h1>
                        </li>
                      ))
                    ) : (
                      <li>Tidak ada perangkat</li>
                    )}
                  </ul>
                ),
              },
            ]}
          />
					</div>

          <div className="flex flex-col gap-6 w-full">

            {configs && configs.length > 0 ? (  
              configs.map((item, idx) => (

                  <div key={idx} className="h-full w-full rounded-xl border-1 border-[#e1e1e1] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-[#f9f8f8] transition-all duration-200 flex flex-col justify-between overflow-hidden">
                      
                      <div className={`bg-gray-500 bg-opacity-50 p-4`}>
                        <div className="flex items-center mb-1">
                          <h1 className="text-white text-2xl font-semibold">{item.cam.name}</h1>
                        </div>
                        <p className="text-white">{item.cam.id}</p>
                      </div>


                    <div className="flex flex-col gap-4 h-full p-4">

                      {videos && videos.length > 0 ? (
                        videos.map((camera) =>
                          camera.videos.map((video, vidIndex) => (
                            <VideoCard
                            key={`${camera.camId}-${vidIndex}`}
                            title={`Timelapse ${camera.camId} - ${vidIndex + 1}`}
                              videoSrc={video}
                              thumbnailSrc={camera.thumbnails[vidIndex] || ""} // fallback jika tidak ada
                            />
                          ))
                        )
                      ) : (
                        <div>Tidak ada video</div>
                      )}

                    </div>
                  </div>
              ))
            ) : (
              <div className="border-t-90 border-gray-500 h-full w-full p-6 rounded-lg cursor-pointer overflow-hidden flex flex-col items-center justify-center hover:text-[#424242] text-gray-500 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-[#f9f8f8] transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg"
                     width="64" height="64"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     className="mx-auto mb-2">
                    
                  <rect x="5" y="5" width="14" height="14" rx="2" />
                            
                            
                  <line x1="9" y1="1" x2="9" y2="5" />
                  <line x1="15" y1="1" x2="15" y2="5" />
                            
                            
                  <line x1="9" y1="19" x2="9" y2="23" />
                  <line x1="15" y1="19" x2="15" y2="23" />
                            
                            
                  <line x1="1" y1="9" x2="5" y2="9" />
                  <line x1="1" y1="15" x2="5" y2="15" />
                            
                            
                  <line x1="19" y1="9" x2="23" y2="9" />
                  <line x1="19" y1="15" x2="23" y2="15" />
                            
                </svg>


                <p className="font-semibold">Tidak ada perangkat yang dipasang</p>
                <p className="text-sm">Pasang perangkat untuk melihat video</p>
              </div>
            )}
          </div>


        </div>

      </main>
    </div>
  );
}
