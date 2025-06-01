// components/ui/card.tsx
import React, { ReactNode } from "react";

export const Card = ({ children, className }: { children: ReactNode; className?: string }) => {
  return <div className={`rounded-xl p-2 border-[#e1e1e1] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-[#f9f8f8]${className}`}>{children}</div>;
};

export const CardContent = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};
