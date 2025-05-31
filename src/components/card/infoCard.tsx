/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";

function InfoCard({
  href,
  title,
  color,
  subtitle,
  infoTitle,
  status,
  detailItems,
}: {
  href: string;
  title: string;
  color: string;
  subtitle: string;
  infoTitle: string;
  status: string;
  detailItems: { label: string; value: React.ReactNode }[];
}) {
  const colorClass = {
    green: "bg-green-600",
    orange: "bg-orange-500",
    blue: "bg-blue-600",
    gray: "bg-gray-600",
  }[color];

  return (
    <Link href={href}>
      <div className="w-full bg-white hover:bg-[#f7f7f7] rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-200 overflow-hidden">
        <div className={`${colorClass} bg-opacity-50 p-4`}>
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
            <h1 className="text-white text-2xl font-semibold">{title}</h1>
          </div>
          <p className="text-white">{subtitle}</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <img
              src="/dashboard-icon/calender.svg"
              alt=""
              className="h-6 w-6"
            />
            <h2 className="text-xl md:text-2xl font-medium">{infoTitle}:</h2>
          </div>

          <div>
            <h3 className="text-lg font-medium">Status:</h3>
            <div className="flex items-center gap-2">
              <div
                className={`${
                  status === "Aktif" ? "bg-green-400" : "bg-red-400"
                } h-4 w-4 rounded-full`}
              ></div>
              <p className="text-lg">{status}</p>
            </div>
          </div>

          {detailItems.map(({ label, value }, idx) => (
            <div key={idx}>
              <h3 className="text-lg font-medium">{label}:</h3>
              <div className="text-base">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default InfoCard;
