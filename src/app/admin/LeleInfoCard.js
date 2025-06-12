/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CentangIcon } from '@/components/ui/ToastIcons';

const hariOptions = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

export default function LeleInfoCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [LeleInfo, setLeleInfo] = useState({
    type: '--',
    ikanHidup: '--:--',
    ikanMati: '--:--',
    protectedPins : []
  });

  const [isEditMode, setIsEditMode] = useState(false);

  const [jadwal, setJadwal] = useState([]);
  const [newHari, setNewHari] = useState("Senin");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [newPin, setNewPin] = useState("");
  const [newDeskripsi, setNewDeskripsi] = useState("");

  const [exceptions, setExceptions] = useState([]); 
  const [isSetiapHari, setIsSetiapHari] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === 'protectedPins') {
      updatedValue = value
        .split(',')
        .map((v) => v.trim())
        .filter((v) => v !== '')
        .map((v) => parseInt(v, 10))
        .filter((v) => !isNaN(v));
    }

    setLeleInfo((prev) => ({ ...prev, [name]: updatedValue }));
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
      [...prev, {
        hari: newHari,
        pengecualian: newHari === "Setiap Hari" ? exceptions : [],
        start: newStartTime,
        end: newEndTime,
        pin: newPin,
        deskripsi: newDeskripsi || ""
      }].sort((a, b) => {
        const hariA = hariOptions.indexOf(a.hari);
        const hariB = hariOptions.indexOf(b.hari);
        if (hariA !== hariB) return hariA - hariB;
        return a.start.localeCompare(b.start);
      })
    );
    // Reset form
    setNewStartTime("");
    setNewEndTime("");
    setNewHari("Senin");
    setNewPin("");
    setNewDeskripsi("");
    setExceptions([]);
    setIsSetiapHari(false);
    toast.success(`Jadwal berhasil dibuat`, { icon: <CentangIcon /> });
  }
};


  const hapusJadwal = (idx) => {
    setJadwal((prev) => prev.filter((_, i) => i !== idx));
    toast.success(`Jadwal ${idx + 1} berhasil dihapus`, { icon: <CentangIcon /> });
  };

  const data = {
    LeleInfo : {
      ...LeleInfo,
      jadwal : jadwal
    }
  }

  // menyimpan hasil edit dan menyimpan data
  const handleSave = () => {
    setIsEditing(false);
    setIsEditMode(false);
    sendToJson();
    toast.success(`Data berhasil dibuat`, { icon: <CentangIcon /> });
  };
  // fungsi simpan jadwal
  async function sendToJson() {
    const res = await fetch('/api/data-put?file=kolam-ikan', {
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
        const res = await fetch('/api/data-get?file=kolam-ikan');
        if (res.ok) {
          const data = await res.json();
          if (data["LeleInfo"]) {
            setLeleInfo(data["LeleInfo"]);
            setJadwal(data["LeleInfo"]["jadwal"]);
          }
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
      <div className="bg-blue-600 bg-opacity-50 p-4">
          <div className="flex items-center mb-1 text-white">
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
              className="lucide lucide-fish h-8 w-8 mr-3"
            >
              <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z" />
              <path d="M18 12v.5" />
              <path d="M16 17.93a9.77 9.77 0 0 1 0-11.86" />
              <path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33" />
              <path d="M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4" />
              <path d="M16.01 17.93l-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98" />
            </svg>

          <h1 className="text-white text-2xl font-semibold">Kolam Ikan Lele</h1>
        </div>
        <p className="text-white">Atur jadwal dan catat perkembangan ikan</p>
      </div>

      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex justify-between items-center">
          <h3 className="tracking-tight text-2xl font-semibold flex items-center gap-2">
              <img
                src="/dashboard-icon/calender.svg"
                alt=""
                className="h-6 w-6"
              />

            Info Ikan
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
                className="bg-green-600 text-white px-3 py-3 rounded-md text-sm hover:bg-green-700"
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
								  className="lucide lucide-save h-6 w-6"
								>
														
								  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />												
							 		<polyline points="17 21 17 13 7 13 7 21 17 21" />										
								  <polyline points="7 3 7 8 15 8 15 3" />
								</svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 pt-0 text-xl space-y-3">
        {/* Jenis Ikan */}
        <div>
          <label className="text-xl font-semibold block mb-1">Jenis Ikan:</label>
          {isEditing ? (
            <input
              type="text"
              name="type"
              value={LeleInfo.type}
              onChange={handleChange}
              className="px-3 py-2 w-full hover:bg-[#f7f7f7] rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.15)]"
            />
          ) : (
            <p>{LeleInfo.type}</p>
          )}
        </div>

        {/* Ikan hidup */}
        <div>
          <label className="text-xl font-semibold block mb-1">Ikan Hidup:</label>
          {isEditing ? (
            <input
              type="text"
              name="ikanHidup"
              value={LeleInfo.ikanHidup}
              onChange={handleChange}
              className="px-3 py-2 w-full hover:bg-[#f7f7f7] rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.15)]"
            />
          ) : (
            <p>{LeleInfo.ikanHidup}</p>
          )}
        </div>

        {/* Ikan Mati */}
        <div>
          <label className="text-xl font-semibold block mb-1">Ikan Mati:</label>
          {isEditing ? (
            <input
              type="text"
              name="ikanMati"
              value={LeleInfo.ikanMati}
              onChange={handleChange}
              className="px-3 py-2 w-full hover:bg-[#f7f7f7] rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.15)]"
            />
          ) : (
            <p>{LeleInfo.ikanMati}</p>
          )}
        </div>

        {/* Protect pins */}
        <div>
          <label className="text-xl font-semibold block mb-1">Proteksi Pin:</label>
          {isEditing ? (
            <input
              type="text"
              name="protectedPins"
              value={LeleInfo.protectedPins.join(', ')}
              onChange={handleChange}
              className="px-3 py-2 w-full hover:bg-[#f7f7f7] rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.15)]"
            />
          ) : (
            <p>{LeleInfo.protectedPins.join(', ')}</p>
          )}
        </div>

        <div className="space-y-3">
          {!isEditMode && (
            <div>
              <label className="text-xl leading-none font-semibold">
                Jadwal:
              </label>
              <ul className="list-disc list-inside ml-4 mt-1 text-base">
                {jadwal.length === 0 ? (
                  <li>Tidak ada jadwal</li>
                ) : (
                  jadwal.map((item, idx) => (
                    <li key={idx}>

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
                )}
              </ul>
            </div>
          )}

{/*================================================EDIT MODE=================================================================================*/}
          {isEditMode && (
            <div>
              <label className="text-xl leading-none font-semibold">
                Jadwal:
              </label>
              <div className="space-y-10 mt-1">
                {jadwal.map((item, idx) => (
                  <div key={idx} className="flex md:items-start space-x-2 flex-col md:flex-row gap-3 md:gap-0">

                  {/*==============================INPUT DESKRIPSI==================================================*/}

                    <input
                      type="text"
                      className="px-3 py-2 hover:bg-[#f7f7f7] rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.15)] md:h-16 md:w-48 w-full" 
                      value={item.deskripsi || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setJadwal((prev) => {
                          const newJadwal = [...prev];
                          newJadwal[idx].deskripsi = val;
                          return newJadwal;
                        });
                      }}
                      placeholder="Deskripsi jadwal"
                    />

                  {/*==============================INPUT HARI==================================================*/}
                    <select
                      className="px-3 py-2 hover:bg-[#f7f7f7] rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.15)] md:h-16 md:w-48 w-full"
                      value={item.hari}
                      onChange={(e) => {
                        const val = e.target.value;
                        setJadwal((prev) => {
                          const newJadwal = [...prev];
                          newJadwal[idx].hari = val;
                          if (val !== "Setiap Hari") {
                            newJadwal[idx].pengecualian = [];
                          }
                          return newJadwal;
                        });
                      }}
                    >
                      {hariOptions.map((h, i) => (
                        <option key={i} value={h}>
                          {h}
                        </option>
                      ))}
                      <option value="Setiap Hari">Setiap Hari</option>
                    </select>

                  {/*==============================INPUT PENGECUALIAN==================================================*/}
                    {item.hari === "Setiap Hari" && (
                      <div className=" px-3 py-1 max-h-16 md:max-h-16 overflow-y-auto md:w-48 w-full hover:bg-[#f7f7f7] rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.15)] overflow-hidden">
                        <p>Pengecualian:</p>
                        {hariOptions.map((h, i) => (
                          <label key={i} className="block">
                            <input
              
                              type="checkbox"
                              checked={jadwal[idx]?.pengecualian?.includes(h) || false}
                              onChange={() => {
                                setJadwal((prev) => {
                                  const newJadwal = [...prev];
                                  newJadwal[idx] = { ...newJadwal[idx] };
                                  const pengecualian = newJadwal[idx].pengecualian || [];
                                  const isIncluded = pengecualian.includes(h);
                                
                                  newJadwal[idx].pengecualian = isIncluded
                                    ? pengecualian.filter((day) => day !== h)
                                    : [...pengecualian, h];
                                
                                  return newJadwal;
                                });
                              }}
                            />
                            <span className="ml-2">{h}</span>
                          </label>
                        ))}
                      </div>
                    )}

                  {/*==============================INPUT WAKTU MULAI==================================================*/}
                  <div className='w-full md:w-auto flex items-center justify-between md:justify-start gap-1'>

                    <input
                      type="time"
                      step="1"
                      className="px-3 py-2 hover:bg-[#f7f7f7] rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.15)] md:h-16 w-34"
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

                  {/*==============================INPUT WAKTU SELESAI==================================================*/}
                    <input
                      type="time"
                      step="1"
                      className="px-3 py-2 hover:bg-[#f7f7f7] rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.15)] md:h-16 w-34"
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

                  </div>

                  {/*==============================INPUT PIN==================================================*/}
                    <input
                      type="number"
                      min={0}
                      max={40}
                      className="px-3 py-2 hover:bg-[#f7f7f7] rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.15)] md:h-16 md:w-48 w-full"
                      value={item.pin}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setJadwal((prev) => {
                          const newJadwal = [...prev];
                          newJadwal[idx].pin = val;
                          return newJadwal;
                        });

                      }}
                      onBlur={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (protectedPins.includes(val)) {
                          toast.error(`Pin ${val} diproteksi`);
                          setJadwal((prev) => {
                            const newJadwal = [...prev];
                            newJadwal[idx].pin = "";
                            return newJadwal;
                          });
                        } 
                      }}
                      placeholder="Pin"
                      title="Nomor Pin GPIO"
                    />

                    <button
                      onClick={() => hapusJadwal(idx)}
                      className="inline-flex items-center border-1 border-red-500 justify-center h-10 md:h-16 md:w-16 w-full rounded-xl text-red-500 hover:text-red-700 focus:outline-none focus:ring-1 focus:ring-red-500"
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
                        className="lucide lucide-trash2 h-6 w-6"
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

{/*================================================NEW MODE=================================================================================*/}
                <div className="flex space-x-2 mt-3 md:items-center flex-col md:flex-row gap-3 md:gap-0">

                  {/*==============================INPUT DEKSRIPSI==================================================*/}
                  <input
                    type="text"
                    className="px-3 py-2 hover:bg-[#f7f7f7] rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.15)] md:h-16 md:w-48 w-full" 
                    value={newDeskripsi}
                    onChange={(e) => setNewDeskripsi(e.target.value)}
                    placeholder="Deskripsi jadwal"
                  />

                  {/*==============================INPUT HARI==================================================*/}
                  <select
                   className="px-3 py-2 hover:bg-[#f7f7f7] rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.15)] md:h-16 md:w-48 w-full"
                    value={newHari}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewHari(val);
                      setIsSetiapHari(val === "Setiap Hari");
                      if (val !== "Setiap Hari") {
                        setExceptions([]);
                      }
                    }}
                  >
                    {hariOptions.map((h, i) => (
                      <option key={i} value={h}>
                        {h}
                      </option>
                    ))}
                    <option value="Setiap Hari">Setiap Hari</option>
                  </select>
                  
                  {/*==============================INPUT PENECUALIAN==================================================*/}         
                  {isSetiapHari && (
                    <div className=" px-3 py-1 max-h-16 md:max-h-16 overflow-y-auto md:w-48 w-full hover:bg-[#f7f7f7] rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.15)] overflow-hidden">
                      <p>Pengecualian:</p>
                      {hariOptions.map((h, i) => (
                        <label key={i} className="block">
                          <input
                            type="checkbox"
                            checked={exceptions.includes(h)}
                            onChange={() => {
                              setExceptions((prev) =>
                                prev.includes(h)
                                  ? prev.filter((day) => day !== h)
                                  : [...prev, h]
                              );
                            }}
                          />
                          <span className="ml-2">{h}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/*==============================INPUT WAKTU MULAI==================================================*/}  
                <div className='w-full md:w-auto flex items-center justify-between md:justify-start gap-1'>
                  <input
                    type="time"
                    step="1"
                    className="px-3 py-2 hover:bg-[#f7f7f7] rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.15)] md:h-16 w-34"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    placeholder="Jam Mulai"
                    title="Jam Mulai"
                  />

                  <h1>--</h1>

                  {/*==============================INPUT WAKTU SELESAI==================================================*/}  
                  <input
                    type="time"
                    step="1"
                    className="px-3 py-2 hover:bg-[#f7f7f7] rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.15)] md:h-16 w-34"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    placeholder="Jam Selesai"
                    title="Jam Selesai"
                  />
                  
                </div>

                  {/*==============================INPUT PIN==================================================*/}  
                  <input
                    type="number"
                    min={0}
                    max={40}
                    className="px-3 py-2 hover:bg-[#f7f7f7] rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.15)] md:h-16 md:w-48 w-full"
                    value={newPin}
                    onChange={(e) => {
                      setNewPin(e.target.value); // Selalu simpan input mentah dulu
                    }}
                    onBlur={(e) => {
                      // Jika kosong, biarin
                      const raw = e.target.value;
                      if (raw === "") return;
                    
                      const val = parseInt(raw, 10);
                    
                      // Jika bukan angka valid (NaN) atau di luar batas, keluar
                      if (isNaN(val) || val < 0 || val > 40) {
                        setNewPin("");
                        return;
                      }
                    
                      if (protectedPins.includes(val)) {
                        toast.error(`Pin ${val} diproteksi`);
                        // Tetap boleh nunjukin nilainya, tapi jangan dianggap valid
                        setNewPin("");
                        return;
                      }
                    
                      setNewPin(val);
                    }} 
                    placeholder="Pin"
                    title="Nomor Pin GPIO"
                  />
                                    
                  <button
                    onClick={tambahJadwal}
                    className="inline-flex items-center justify-center h-10 md:h-16 md:w-16 w-full rounded-xl border border-green-600 bg-background text-green-600 hover:bg-accent hover:text-green-700 hover:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
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
                      className="lucide lucide-circle-plus h-6 w-6"
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
