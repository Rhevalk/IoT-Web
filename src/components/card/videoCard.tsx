/* eslint-disable @next/next/no-img-element */
'use client';
import { useState } from 'react';

interface VideoCardProps {
  title: string;
  videoSrc: string;
  thumbnailSrc?: string;
}

export default function VideoCard({ title, videoSrc, thumbnailSrc }: VideoCardProps) {
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <>
      {/* Preview Card */}
      <div
        onClick={() => setShowPlayer(true)}
        className="bg-gray-50 flex items-center justify-center rounded-2xl h-full w-38 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-[#f9f8f8] transition-all duration-200"
      >
        {thumbnailSrc ? (
          <img
            src={thumbnailSrc}
            alt={title}
            className="w-full h-full object-cover rounded-2xl"
          />
          
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg"
               width="100%" height="100%"
               viewBox="0 0 24 24"
               fill="none"
               stroke="currentColor"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
               className="lucide lucide-circle-play h-10 w-10">
            <circle cx="12" cy="12" r="10" />
            <polygon points="10 8 16 12 10 16 10 8" />
          </svg>
        )}
      </div>

      {/* Fullscreen Overlay Player */}
      {showPlayer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl overflow-hidden relative w-full max-w-3xl shadow-lg">
            {/* Tombol Close */}
            <button
              onClick={() => setShowPlayer(false)}
              className="absolute top-4 right-4 text-black bg-white border border-black rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-200 z-10"
            >
              ✕
            </button>

            {/* Video Player */}
            <video
              controls
              autoPlay
              className="w-full h-auto rounded-b-xl"
              src={videoSrc}
            />
          </div>
        </div>
      )}
    </>
  );
}
