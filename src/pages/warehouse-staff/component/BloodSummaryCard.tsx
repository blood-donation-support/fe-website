import React from 'react';
import { Card } from '@/components/ui/card';
import type { IconType } from 'react-icons';

interface BloodSummaryCardProps {
  title: string;
  value: string | number;
  colorFrom: string;
  colorTo: string;
  icon: IconType;
}

export const BloodSummaryCard = ({ title, value, colorFrom, colorTo, icon: Icon }: BloodSummaryCardProps) => {
  return (
    <Card className={`p-4 rounded-2xl shadow-lg bg-gradient-to-r from-${colorFrom} to-${colorTo} 
        text-gray-800 flex items-center gap-4 hover:shadow-2xl hover:scale-105 hover:cursor-pointer 
        transition-all duration-300`}>
      <Icon className="w-10 h-10" />
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </Card>
  );
};
