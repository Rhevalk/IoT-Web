/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';

const hariOptions = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

export default function PlantInfoCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [plantInfo, setPlantInfo] = useState({
    type: '--',
    plantingDate: '--:--',
    harvestDate: '--:--',
  });

  const [isEditMode, setIsEditMode] = useState(false);

  const [jadwal, setJadwal] = useState([]);
  const [newHari, setNewHari] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [newPin, setNewPin] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlantInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Cek jadwal duplikat hari + start + end + pin
  const isDuplicate = (hari, start, end, pin) => {
    return jadwal.some(
      (item) =>
        item.hari === hari &&
        item.start === start &&
        item.end === end &&
        item.pin === pin
    );
  };

  // fungsi menambahkan jadwal
  const tambahJadwal = () => {
    if (
      newStartTime &&
      newEndTime &&
      newPin !== "" &&
      !isDuplicate(newHari, newStartTime, newEndTime, newPin)
    ) {
      setJadwal((prev) =>
        [...prev, { hari: newHari, start: newStartTime, end: newEndTime, pin: newPin }].sort((a, b) => {
          const hariA = hariOptions.indexOf(a.hari);
          const hariB = hariOptions.indexOf(b.hari);
          if (hariA !== hariB) return hariA - hariB;
          return a.start.localeCompare(b.start);
        })
      );
      setNewStartTime("");
      setNewEndTime("");
      setNewHari("");
      setNewPin("");
    }
  };

  const hapusJadwal = (idx) => {
    setJadwal((prev) => prev.filter((_, i) => i !== idx));
  };

  const data = {
    plantInfo : plantInfo,
    jadwal : jadwal
  }

  // menyimpan hasil edit dan menyimpan data
  const handleSave = () => {
    setIsEditing(false);
    setIsEditMode(false);
    sendToJson();
    console.log("Data disimpan:", { data });
  };
  // fungsi simpan jadwal
  async function sendToJson() {
    const res = await fetch('/api/data-put?file=hidroponik', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
      
    })
    const result = await res.json();
    console.log(result.message);
  }

  // sinkronasi jadwal
  useEffect(() => {
    async function fetchJadwal() {
      try {
        const res = await fetch('/api/data-get?file=hidroponik');
        if (res.ok) {
          const data = await res.json();
          setPlantInfo(data["plantInfo"]);
          setJadwal(data["jadwal"]);
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
    <div className="hover:bg-[#f7f7f7] rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] w-full mx-auto overflow-hidden text-[#424242]">
      <div className="bg-green-600 bg-opacity-50 p-4">
        <div className="flex items-center mb-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 mr-3 stroke-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
          <h1 className="text-white text-2xl font-semibold">Hidroponik</h1>
        </div>
        <p className="text-white">Atur jadwal pencahayaan dan catat perkembangan tanaman</p>
      </div>

      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex justify-between items-center">
          <h3 className="tracking-tight text-2xl font-semibold flex items-center gap-2">
            <img
              src="/dashboard-icon/calender.svg"
              alt=""
              className="h-6 w-6"
            />
            Info Tanaman
          </h3>
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={() => {
                  setIsEditing(true);
                  setIsEditMode(true);
                }}
                className="h-10 w-10 text-green-600 hover:text-green-700"
              >
                <img
                  src="/dashboard-icon/pensil.svg"
                  alt=""
                  className="h-6 w-6"
                />
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
              >
                Simpan
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 pt-0 text-xl space-y-3">
        {/* Jenis Tanaman */}
        <div>
          <label className="text-xl font-semibold block mb-1">Jenis Tanaman:</label>
          {isEditing ? (
            <input
              type="text"
              name="type"
              value={plantInfo.type}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full"
            />
          ) : (
            <p>{plantInfo.type}</p>
          )}
        </div>

        {/* Jadwal Tanam */}
        <div>
          <label className="text-xl font-semibold block mb-1">Jadwal Tanam:</label>
          {isEditing ? (
            <input
              type="text"
              name="plantingDate"
              value={plantInfo.plantingDate}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full"
            />
          ) : (
            <p>{plantInfo.plantingDate}</p>
          )}
        </div>

        {/* Perkiraan Panen */}
        <div>
          <label className="text-xl font-semibold block mb-1">Perkiraan Panen:</label>
          {isEditing ? (
            <input
              type="text"
              name="harvestDate"
              value={plantInfo.harvestDate}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full"
            />
          ) : (
            <p>{plantInfo.harvestDate}</p>
          )}
        </div>

        <div className="space-y-3">
          {!isEditMode && (
            <div>
              <label className="text-xl leading-none font-semibold">
                Jadwal Pencahayaan:
              </label>
              <ul className="list-disc list-inside ml-4 mt-1 text-base">
                {jadwal.length === 0 ? (
                  <li>Tidak ada jadwal</li>
                ) : (
                  jadwal.map((item, idx) => (
                    <li key={idx}>
                      <strong>{item.hari}:</strong> {item.start} -- {item.end} (Pin: {item.pin})
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}

          {isEditMode && (
            <div>
              <label className="text-xl leading-none font-semibold">
                Jadwal Pencahayaan:
              </label>
              <div className="space-y-2 mt-1">
                {jadwal.map((item, idx) => (
                  <div key={idx} className="flex md:items-center space-x-2 flex-col md:flex-row gap-2 md:gap-0">
                    <select
                      className="border rounded px-2 py-1"
                      value={item.hari}
                      onChange={(e) => {
                        const val = e.target.value;
                        setJadwal((prev) => {
                          const newJadwal = [...prev];
                          newJadwal[idx].hari = val;
                          return newJadwal;
                        });
                      }}
                    >
                      {hariOptions.map((h, i) => (
                        <option key={i} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>

                    <input
                      type="time"
                      className="border rounded px-2 py-1 w-28"
                      value={item.start}
                      onChange={(e) => {
                        const val = e.target.value;
                        setJadwal((prev) => {
                          const newJadwal = [...prev];
                          newJadwal[idx].start = val;
                          return newJadwal;
                        });
                      }}
                      title="Jam Mulai"
                    />

                    <h1>--</h1>

                    <input
                      type="time"
                      className="border rounded px-2 py-1 w-28"
                      value={item.end}
                      onChange={(e) => {
                        const val = e.target.value;
                        setJadwal((prev) => {
                          const newJadwal = [...prev];
                          newJadwal[idx].end = val;
                          return newJadwal;
                        });
                      }}
                      title="Jam Selesai"
                    />

                    <input
                      type="number"
                      min={0}
                      max={40}
                      className="border rounded px-2 py-1 w-28"
                      value={item.pin}
                      onChange={(e) => {
                        const val = e.target.value;
                        setJadwal((prev) => {
                          const newJadwal = [...prev];
                          newJadwal[idx].pin = val;
                          return newJadwal;
                        });
                      }}
                      placeholder="Pin"
                      title="Nomor Pin GPIO"
                    />

                    <button
                      onClick={() => hapusJadwal(idx)}
                      className="inline-flex items-center border-1 border-red-500 justify-center h-10 w-10 rounded-md text-red-500 hover:text-red-700 focus:outline-none focus:ring-1 focus:ring-red-500"
                      title="Hapus Jadwal"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-trash2 h-4 w-4"
                      >
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        <line x1="10" x2="10" y1="11" y2="17"></line>
                        <line x1="14" x2="14" y1="11" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                ))}

                <div className="flex space-x-2 mt-3 md:items-center flex-col md:flex-row gap-2 md:gap-0">
                  <select
                    className="border rounded px-2 py-1"
                    value={newHari}
                    onChange={(e) => setNewHari(e.target.value)}
                  >
                    {hariOptions.map((h, i) => (
                      <option key={i} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>

                  <input
                    type="time"
                    className="border rounded px-2 py-1 w-28"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    placeholder="Jam Mulai"
                    title="Jam Mulai"
                  />

                  <h1>--</h1>

                  <input
                    type="time"
                    className="border rounded px-2 py-1 w-28"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    placeholder="Jam Selesai"
                    title="Jam Selesai"
                  />

                  <input
                    type="number"
                    min={0}
                    max={40}
                    className="border rounded px-2 py-1 w-28"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="Pin"
                    title="Nomor Pin GPIO"
                  />

                  <button
                    onClick={tambahJadwal}
                    className="inline-flex items-center justify-center h-10 w-10 rounded-md border border-green-600 bg-background text-green-600 hover:bg-accent hover:text-green-700 hover:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
                    aria-label="Tambah jadwal pakan"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-circle-plus h-4 w-4"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M8 12h8"></path>
                      <path d="M12 8v8"></path>
                    </svg>
                  </button>

                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
