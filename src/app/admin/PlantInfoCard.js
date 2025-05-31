'use client';

import { useState } from 'react';

export default function PlantInfoCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [plantInfo, setPlantInfo] = useState({
    type: '--',
    plantingDate: '--:--',
    harvestDate: '--:--',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlantInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Bisa tambahkan fungsi simpan ke backend di sini
  };

  return (
    <div className="hover:bg-[#f7f7f7] rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] w-full mx-auto overflow-hidden text-[#424242]">
        <div className={`bg-green-600 bg-opacity-50 p-4`}>
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
          <p className="text-white">Monitoring kondisi tanaman hidroponik</p>
        </div>

      {/* Header */}
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex justify-between items-center">
          <h3 className="tracking-tight text-md font-semibold flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M8 2v4M16 2v4M3 10h18M3 4a2 2 0 012-2h14a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V4z" />
            </svg>
            Info Tanaman
          </h3>
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="h-10 w-10 text-green-600 hover:text-green-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 20h9M16.38 3.62a1 1 0 013 3L7.37 18.63a2 2 0 01-.86.51l-2.87.84a.5.5 0 01-.62-.62l.84-2.87a2 2 0 01.51-.86z" />
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

      {/* Content */}
      <div className="p-6 pt-0 text-sm space-y-3">
        {/* Jenis Tanaman */}
        <div>
          <label className="text-sm font-semibold block mb-1">Jenis Tanaman:</label>
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
          <label className="text-sm font-semibold block mb-1">Jadwal Tanam:</label>
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
          <label className="text-sm font-semibold block mb-1">Perkiraan Panen:</label>
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
      </div>
    </div>
  );
}
