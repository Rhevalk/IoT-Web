import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Contoh data dummy
const dummyData = {
  "1hari": [
    { name: "00:00", value: 12 },
    { name: "06:00", value: 19 },
    { name: "12:00", value: 23 },
    { name: "18:00", value: 18 }
  ],
  "1minggu": [
    { name: "Sen", value: 20 },
    { name: "Sel", value: 22 },
    { name: "Rab", value: 18 },
    { name: "Kam", value: 25 },
    { name: "Jum", value: 27 },
    { name: "Sab", value: 19 },
    { name: "Min", value: 24 }
  ],
  "1bulan": Array.from({ length: 30 }, (_, i) => ({ name: `${i + 1}`, value: Math.floor(Math.random() * 30) + 10 })),
  "6bulan": Array.from({ length: 6 }, (_, i) => ({ name: `Bulan ${i + 1}`, value: Math.floor(Math.random() * 100) + 20 })),
};

type ChartCardProps = {
  label?: string;
  color?: string;
  data?: typeof dummyData;
};

const ChartCard = ({ color = "#3b82f6", data = dummyData, label = "" }: ChartCardProps) => {
  const [range, setRange] = useState<"1hari" | "1minggu" | "1bulan" | "6bulan">("1minggu");

  return (
    <Card className="p-4 shadow-lg w-full max-w-full overflow-x-auto">
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 px-4 pt-4">
          <h2 className="text-lg font-semibold mb-2 sm:mb-0">{label}</h2>
          <div className="flex flex-wrap gap-2">
            {(["1hari", "1minggu", "1bulan", "6bulan"] as const).map((r) => (
              <Button
                key={r}
                variant={range === r ? "default" : "outline"}
                onClick={() => setRange(r)}
                className="text-xs px-3 py-1"
              >
                {r}
              </Button>
            ))}
          </div>
        </div>

        <div className="w-full h-[250px] sm:h-[250px] px-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data[range]} margin={{ top: 0, right: 0, left: -35, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={10} tick={{ dx: 0 }} />
              <YAxis fontSize={10} tick={{ dx: -4 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
