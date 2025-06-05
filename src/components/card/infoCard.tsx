/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";

function InfoCard({
  href,
  title,
  icon,
  color,
  subtitle,
  infoTitle,
  status,
  detailItems,
}: {
  href: string;
  title: string;
  icon: string;
  color: string;
  subtitle: string;
  infoTitle: string;
  status: string;
  detailItems: { label: string; value: React.ReactNode }[];
}) {
  const colorClass = {
    green: "bg-green-500",
    orange: "bg-orange-500",
    blue: "bg-blue-500",
    gray: "bg-gray-500",
  }[color];

  return (
    <Link href={href}>
      <div className="w-full h-full bg-white border-1 border-[#e1e1e1] hover:bg-[#f7f7f7] rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-200 overflow-hidden">
        <div className={`${colorClass} bg-opacity-50 p-4`}>
          <div className="flex items-center mb-1">
              <img src={icon} alt="" className="h-8 w-8 mr-2"/>
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
