import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from 'recharts';

interface BloodPieStatisticsProps {
  title: string;
  data: { label: string; value: number }[];
}

const COLORS = ['#2563eb', '#f59e0b', '#10b981', '#dc2626', '#9333ea', '#f43f5e', '#0ea5e9', '#eab308'];

export const BloodPieStatistics = ({ title, data }: BloodPieStatisticsProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="p-4 rounded-2xl shadow bg-white">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-gray-800">{total}</div>
        <div className="text-sm text-gray-500">Total Units</div>
      </div>
      <div className="h-48 mb-4">
        {total > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Units']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            No blood data available
          </div>
        )}
      </div>
    </Card>
  );
};
