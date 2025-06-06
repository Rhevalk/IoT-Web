/* eslint-disable @next/next/no-img-element */
import React from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

interface SmallCardProps {
  title: string;
  icon: string;
  value?: number | string | null;
  unit?: string;
  lowColor?: string;
  midColor?: string;
  highColor?: string;
  lowHEX?:string;
  midHEX?:string;
  highHEX?:string;
  thresholds?: {
    low: number;
    high: number;
  };
  chartData?: { value: number }[]; // grafik data
}

const SmallCard: React.FC<SmallCardProps> = ({
  icon,
  title,
  value,
  unit = "",
  lowColor = "text-blue-500",
  midColor = "text-yellow-500",
  highColor = "text-red-500",

  lowHEX = "#3b82f6",     // text-blue-500
  midHEX = "#eab308",     // text-yellow-500
  highHEX = "#ef4444",    // text-red-500

  thresholds = { low: 0, high: 100 },
  chartData,
}) => {
  const getValueColor = () => {
    if (typeof value !== "number") return "text-gray-400";
    if (value <= thresholds.low) return lowColor;
    if (value <= thresholds.high) return midColor;
    return highColor;
  };

  const getValueHEX = () => {
    if (typeof value !== "number") return "#9ca3af";
    if (value <= thresholds.low) return lowHEX;
    if (value <= thresholds.high) return midHEX;
    return highHEX;
  };

  return (
    <div className="p-4 h-full w-1/2 rounded-xl border-1 border-[#e1e1e1] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-[#f9f8f8] transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">{title}</h1>
          <img src={icon} alt="" className="h-6 w-6"/>
        </div>
        <div className="flex mt-6 gap-1 items-end">
          <h1 className={`text-4xl font-semibold ${getValueColor()}`}>
            {value ?? "--"}
          </h1>
          {unit && <span className="text-[#929292] text-xl">{unit}</span>}
        </div>
      </div>

      {chartData && chartData.length > 1 && (
        <ResponsiveContainer width="100%" height={30}>
          <LineChart data={chartData}>
            <Line type="monotone" dataKey="value" stroke={getValueHEX()} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default SmallCard;
