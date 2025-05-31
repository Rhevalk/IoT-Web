'use client';
import { useState } from "react";

const hariOptions = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

export default function JadwalPakan() {
  const [isEditMode, setIsEditMode] = useState(false);

  // Jadwal sekarang array objek { hari, waktu }
  const [jadwal, setJadwal] = useState([
  ]);
	console.log("Data jadwal sekarang:", jadwal);

  // State input baru hari & waktu
  const [newHari, setNewHari] = useState("Senin");
  const [newWaktu, setNewWaktu] = useState("");

  function toggleEdit() {
    setIsEditMode(!isEditMode);
  }

  function hapusJadwal(idx) {
    setJadwal((prev) => prev.filter((_, i) => i !== idx));
  }

  // Validasi apakah jadwal baru sudah ada
  function isDuplicate(hari, waktu) {
    return jadwal.some(
      (item) => item.hari === hari && item.waktu === waktu
    );
  }

  function tambahJadwal() {
    if (newWaktu && !isDuplicate(newHari, newWaktu)) {
      setJadwal((prev) =>
        [...prev, { hari: newHari, waktu: newWaktu }].sort((a, b) => {
          // Urutkan berdasarkan hari dulu, baru waktu
          const hariA = hariOptions.indexOf(a.hari);
          const hariB = hariOptions.indexOf(b.hari);
          if (hariA !== hariB) return hariA - hariB;
          return a.waktu.localeCompare(b.waktu);
        })
      );
      setNewWaktu("");
      setNewHari("Senin");
    }
  }

	// Tambahkan handleSave
	function handleSave() {
	  // Contoh: lakukan sesuatu untuk simpan data, lalu keluar dari mode edit
	  setIsEditMode(false);
	  // Bisa tambah logic simpan ke backend atau validasi di sini
	}


  return (
    <div className="hover:bg-[#f7f7f7] rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] w-full mx-auto overflow-hidden text-[#424242]">
        <div className={`bg-orange-600 bg-opacity-50 p-4`}>
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
            <h1 className="text-white text-2xl font-semibold">Kolam Ikan Nia</h1>
          </div>
          <p className="text-white">Atur jadwal pemberina pakan otomatis</p>
        </div>
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex justify-between items-center">
          <h3 className="tracking-tight text-md font-semibold flex items-center">
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
              className="lucide lucide-calendar-clock h-5 w-5 mr-2 text-blue-600"
            >
              <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"></path>
              <path d="M16 2v4"></path>
              <path d="M8 2v4"></path>
              <path d="M3 10h5"></path>
              <path d="M17.5 17.5 16 16.3V14"></path>
              <circle cx="16" cy="16" r="6"></circle>
            </svg>
            Info &amp; Jadwal Pakan
          </h3>

					<div className="flex gap-2">
					  {!isEditMode ? (
					    <button
					      onClick={toggleEdit}
					      className="h-10 w-10 text-green-600 hover:text-green-700"
					      aria-label="Edit Jadwal Pakan"
					    >
					      <svg
					        xmlns="http://www.w3.org/2000/svg"
					        className="h-5 w-5 mx-auto"
					        fill="none"
					        viewBox="0 0 24 24"
					        stroke="currentColor"
					      >
					        <path d="M12 20h9" />
					        <path d="M16.38 3.62a1 1 0 013 3L7.37 18.63a2 2 0 01-.86.51l-2.87.84a.5.5 0 01-.62-.62l.84-2.87a2 2 0 01.51-.86z" />
					      </svg>
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
      <div className="p-6 pt-0 text-sm space-y-3">
        <p>
          <strong>Jenis Ikan:</strong> Nila
        </p>

        {!isEditMode && (
          <div>
            <label className="text-sm leading-none font-semibold">
              Jadwal Pakan:
            </label>
            <ul className="list-disc list-inside ml-4 mt-1">
              {jadwal.length === 0 ? (
                <li>Tidak ada jadwal</li>
              ) : (
                jadwal.map((item, idx) => (
                  <li key={idx}>
                    <strong>{item.hari}:</strong> {item.waktu} (Otomatis)
                  </li>
                ))
              )}
            </ul>
          </div>
        )}

        {isEditMode && (
          <div>
            <label className="text-sm leading-none font-semibold">
              Jadwal Pakan:
            </label>
            <div className="space-y-2 mt-1">
              {jadwal.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <select
                    value={item.hari}
                    onChange={(e) => {
                      const val = e.target.value;
                      setJadwal((prev) => {
                        const copy = [...prev];
                        copy[idx].hari = val;
                        return copy.sort((a, b) => {
                          const hariA = hariOptions.indexOf(a.hari);
                          const hariB = hariOptions.indexOf(b.hari);
                          if (hariA !== hariB) return hariA - hariB;
                          return a.waktu.localeCompare(b.waktu);
                        });
                      });
                    }}
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {hariOptions.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>

                  <input
                    type="time"
                    value={item.waktu}
                    onChange={(e) => {
                      const val = e.target.value;
                      setJadwal((prev) => {
                        const copy = [...prev];
                        copy[idx].waktu = val;
                        return copy.sort((a, b) => {
                          const hariA = hariOptions.indexOf(a.hari);
                          const hariB = hariOptions.indexOf(b.hari);
                          if (hariA !== hariB) return hariA - hariB;
                          return a.waktu.localeCompare(b.waktu);
                        });
                      });
                    }}
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full"
                  />
                  <button
                    onClick={() => hapusJadwal(idx)}
                    className="inline-flex items-center justify-center h-10 w-10 rounded-md text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label={`Hapus jadwal ${item.hari} ${item.waktu}`}
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
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <select
                value={newHari}
                onChange={(e) => setNewHari(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {hariOptions.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>

              <input
                type="time"
                value={newWaktu}
                onChange={(e) => setNewWaktu(e.target.value)}
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full"
                placeholder="HH:MM"
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
        )}
      </div>
    </div>
  );
}
