/* eslint-disable @next/next/no-img-element */
'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function CamConfigManager() {
  const [configs, setConfigs] = useState([]);
  const [selectedCam, setSelectedCam] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [config, setConfig] = useState({});
  const [cam, setCam] = useState({});

  const fetchConfigList = async () => {
    const res = await fetch('/api/config-handler');
    const data = await res.json();
    setConfigs(data.cams);
  };

  const fetchCamConfig = async (camId) => {
    const res = await fetch(`/api/config-handler?file=${camId}`);
    const data = await res.json();
    setSelectedCam(camId);
    setConfig(data.config || {});
    setCam(data.cam || {});
    setIsEditing(false);
  };

  const handleSave = async () => {
    const payload = { config, cam };
    await fetch(`/api/config-handler?file=${selectedCam}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    fetchConfigList();
    setIsEditing(false);
		toast.error(`Config ${selectedCam} disimpan`);
  };

  const handleCreateNew = async () => {
    const nextId = configs.length + 1;
    const newCamId = `cam${nextId}`;
    const payload = {
      config: {
        fps: 1,
        max_images: 10,
        interval_seconds: 10,
        start_hour: 0,
        end_hour: 24,
        start_date: '',
        end_date: '',
        flash: false
      },
      cam: {
        power: true,
        id: newCamId,
        name: `Kamera ${nextId}`
      }
    };
    await fetch(`/api/config-handler?file=${newCamId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    fetchConfigList();
		toast.error(`Config ${newCamId} ditambahkan`);
  };

  const handleDelete = async () => {
    if (!selectedCam) return;
    await fetch(`/api/config-handler?file=${selectedCam}`, { method: 'DELETE' });
    setSelectedCam(null);
    setConfig({});
    setCam({});
    fetchConfigList();
		toast.error(`Config ${selectedCam} dihapus`);
  };

  const handleChange = (e, isCam = false) => {
    const { name, value, type, checked } = e.target;
    const update = type === 'checkbox' ? checked : value;
    if (isCam) {
      setCam(prev => ({ ...prev, [name]: update }));
    } else {
      setConfig(prev => ({ ...prev, [name]: type === 'number' ? parseInt(update) : update }));
    }
  };

  useEffect(() => {
    fetchConfigList();
  }, []);

  return (
    <div className="hover:bg-[#f7f7f7] rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] w-full mx-auto overflow-hidden text-[#424242]">
			<div className="bg-gray-600 bg-opacity-50 p-4">
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
					  className="lucide lucide-camera h-8 w-8 mr-3"
					>
					  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
					  <circle cx="12" cy="13" r="3" />
					</svg>

          <h1 className="text-white text-2xl font-semibold">Timelapse</h1>
        </div>
        <p className="text-white">Sesuaikan konfigurasi dan pengaturan multi perangkat</p>
      </div>

      <div className="flex gap-2 flex-wrap p-6">
        <select
          className="px-3 py-2 hover:bg-[#f7f7f7] rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.15)] md:w-48 w-auto"
          value={selectedCam || ''}
          onChange={(e) => fetchCamConfig(e.target.value)}
        >
          <option value="">-- Pilih Kamera --</option>
          {configs.map((camId) => (
            <option key={camId} value={camId}>{camId}</option>
          ))}
        </select>


        <button onClick={() => handleCreateNew() } className="inline-flex items-center justify-center h-10 w-10 rounded-md border border-green-600 bg-background text-green-600 hover:bg-accent hover:text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 transition-all duration-200"
          aria-label="Tambah jadwal pakan">
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

        {selectedCam && (
          <>
          	<button
          	  onClick={() => handleDelete()}
          	  className="inline-flex items-center border-1 border-red-500 justify-center h-10 w-10 rounded-md text-red-500 hover:text-white hover:bg-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all duration-200"
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
            {isEditing ? (
              <button onClick={handleSave} className="bg-green-600 text-white px-3 py-1 rounded">
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
								  class="lucide lucide-save h-5 w-5"
								>
														
								  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
																								
							 		<polyline points="17 21 17 13 7 13 7 21 17 21" />
																							
								  <polyline points="7 3 7 8 15 8 15 3" />
								</svg>
														
							</button>
            ) : (
              <button onClick={() => setIsEditing(true)} className="flex not-last:h-10 w-10 border items-center justify-center rounded-md border-green-600 text-green-600 hover:text-green-700">                
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
								  className="lucide lucide-pen-line h-5 w-5"
								>
								  <path d="M12 20h9" />
								  <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
								</svg>

							</button>
            )}
          </>
        )}
      </div>

      {selectedCam && (
        <div className="space-y-3 p-6">
          <h2 className="text-xl font-semibold">Konfigurasi: {selectedCam}</h2>

          <h3 className="font-semibold">Config</h3>
          {Object.entries(config).map(([key, val]) => (
            <div key={key} className='hover:bg-[#f7f7f7] rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.15)] flex items-center justify-between px-3 py-2'>
              <label className="block capitalize">{key}:</label>
              {typeof val === 'boolean' ? (
							<label className="relative inline-block w-[48px] h-[28px]">
							  <input
							    type="checkbox"
							    className="peer opacity-0 w-0 h-0"
							    name={key}
							    checked={val}
							    disabled={!isEditing}	
							    onChange={handleChange}
							  />
							  <span
							    className="absolute top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition
							               peer-checked:bg-blue-500
							               peer-focus:ring-2 peer-focus:ring-blue-300
							               before:content-[''] before:absolute before:left-1 before:bottom-1
							               before:bg-white before:h-[20px] before:w-[20px] before:rounded-full
							               before:transition peer-checked:before:translate-x-[22px]"
							  ></span>
							</label>

								
              ) : (
                <input
                  name={key}
                  value={val}
                  type={typeof val === 'number' ? 'number' : 'text'}
                  disabled={!isEditing}
                  onChange={handleChange}
                  className="px-2 py-1 rounded w-26 text-right"
                />
              )}
            </div>
          ))}

          <h3 className="font-semibold">Cam</h3>
          {Object.entries(cam).map(([key, val]) => (
            <div key={key} className='hover:bg-[#f7f7f7] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.15)] g flex items-center justify-between px-3 py-2'>
              <label className="block capitalize">{key}:</label>
              {typeof val === 'boolean' ? (
							<label className="relative inline-block w-[48px] h-[28px]">
							  <input
							    type="checkbox"
							    className="peer opacity-0 w-0 h-0"
							    name={key}
							    checked={val}
							    disabled={!isEditing}	
							    onChange={handleChange}
							  />
							  <span
							    className="absolute top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition
							               peer-checked:bg-blue-500
							               peer-focus:ring-2 peer-focus:ring-blue-300
							               before:content-[''] before:absolute before:left-1 before:bottom-1
							               before:bg-white before:h-[20px] before:w-[20px] before:rounded-full
							               before:transition peer-checked:before:translate-x-[22px]"
							  ></span>
							</label>

              ) : (
                <input
                  name={key}
                  value={val}
                  type="text"
                  disabled={!isEditing || key === 'id'}
                  onChange={(e) => handleChange(e, true)}
                  className="px-2 py-1 rounded max-w-32 w-26 text-right"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
