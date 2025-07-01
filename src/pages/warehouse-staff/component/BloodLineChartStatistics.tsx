import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface BloodLineChartStatisticsProps {
  data: { month: string; collected: number; used: number; available: number }[];
}

export const BloodLineChartStatistics = ({ data }: BloodLineChartStatisticsProps) => {
  return (
    <Card className="bg-white p-4 rounded-2xl shadow-xl">
      <h2 className="text-lg font-semibold mb-2">Blood Storage Trends</h2>
      <div className="h-72 bg-red-50 rounded-2xl shadow">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line type="monotone" dataKey="collected" stroke="#dc2626" strokeWidth={2} dot={{ r: 4 }} name="Collected" />
            <Line type="monotone" dataKey="used" stroke="#f59e0b" strokeWidth={2} name="Used" />
            <Line type="monotone" dataKey="available" stroke="#10b981" strokeDasharray="5 5" strokeWidth={2} name="Available" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
