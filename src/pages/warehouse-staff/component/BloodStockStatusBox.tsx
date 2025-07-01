import React from 'react';

interface BloodStockStatusBoxProps {
  label: string;
  value: number;
  bgColor: string;
  textColor: string;
}

export const BloodStockStatusBox = ({ label, value, bgColor, textColor }: BloodStockStatusBoxProps) => {
  return (
    <div className={`p-3 rounded-xl shadow-xl bg-${bgColor} text-${textColor} hover:scale-105 cursor-pointer`}>
      <div className="font-semibold">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
};
