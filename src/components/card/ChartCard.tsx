import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type DataPoint = { name: string; value: number };
type ChartData = Record<"1d" | "1w" | "1m" | "6m", DataPoint[]>;

type ChartCardProps = {
  label?: string;
  color?: string;
  data: ChartData;
  onRangeChange?: (range: keyof ChartData) => void;
};

const ChartCard = ({
  color = "#3b82f6",
  data,
  label = "",
  onRangeChange,
}: ChartCardProps) => {
  const [range, setRange] = useState<keyof ChartData>("1w");

  const handleRangeChange = (r: keyof ChartData) => {
    setRange(r);
    onRangeChange?.(r);
  };

  // Helper untuk menampilkan label range yang user friendly
  const labelMap: Record<keyof ChartData, string> = {
    "1d": "1 Hari",
    "1w": "1 Minggu",
    "1m": "1 Bulan",
    "6m": "6 Bulan",
  };

  return (
    <Card className="p-4 shadow-lg w-full max-w-full overflow-x-auto">
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 px-4 pt-4">
          <h2 className="text-lg font-semibold mb-2 sm:mb-0">{label}</h2>
          <div className="flex flex-wrap gap-2">
            {(["1d", "1w", "1m", "6m"] as const).map((r) => (
              <Button
                key={r}
                variant={range === r ? "default" : "outline"}
                onClick={() => handleRangeChange(r)}
                className="text-xs px-3 py-1"
              >
                {labelMap[r]}
              </Button>
            ))}
          </div>
        </div>

        <div className="w-full h-[250px] sm:h-[250px] px-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data[range]}
              margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={10} tick={{ dx: 0 }} />
              <YAxis fontSize={10} tick={{ dx: -4 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
