import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BloodPieStatistics } from './component/BloodPieStatistics';
import { BloodSummaryCard } from './component/BloodSummaryCard';
import { BloodLineChartStatistics } from './component/BloodLineChartStatistics';
import { BloodStockStatusBox } from './component/BloodStockStatusBox';
import { FaDroplet, FaUser, FaUserTie, FaCalendarCheck } from 'react-icons/fa6';

// Mock dữ liệu tổng kho máu (thực tế sẽ từ API)
const summaryMock = [
  { bloodGroup: 'A+', productType: 'Whole', quantity: 10, threshold: 5 },
  { bloodGroup: 'O-', productType: 'Whole', quantity: 2, threshold: 3 },
  { bloodGroup: 'B+', productType: 'Plasma', quantity: 8, threshold: 4 },
  { bloodGroup: 'AB-', productType: 'Platelet', quantity: 0, threshold: 1 },
];

// Dữ liệu tổng quan tổng hợp cho thẻ
const totalSummary = {
  totalBloodUnits: 20,
  totalDonors: 1200,
  totalStaff: 50,
  totalDonations: 580,
};

// Mock dữ liệu Line Chart
const monthlyData = [
  { month: 'Jan', collected: 100, used: 80, available: 20 },
  { month: 'Feb', collected: 120, used: 100, available: 40 },
  { month: 'Mar', collected: 90, used: 80, available: 10 },
  { month: 'Apr', collected: 150, used: 140, available: 10 },
  { month: 'May', collected: 130, used: 120, available: 10 },
];

export const BloodInventoryDashboard = () => {
  const [data, setData] = useState(summaryMock);

  const updateThreshold = (index: number, value: string) => {
    const updated = [...data];
    updated[index].threshold = parseInt(value) || 0;
    setData(updated);
  };

  // Chuẩn hóa dữ liệu Pie Chart từ bảng
  const pieData = data.map(item => ({
    label: `${item.bloodGroup} - ${item.productType}`,
    value: item.quantity,
  }));

  return (
    <div className="space-y-8">

      {/* Tổng quan thẻ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <BloodSummaryCard title="Total Blood Units" value={totalSummary.totalBloodUnits} colorFrom="red-100" colorTo="rose-100" icon={FaDroplet} />
        <BloodSummaryCard title="Total Donors" value={totalSummary.totalDonors} colorFrom="green-100" colorTo="emerald-100" icon={FaUser} />
        <BloodSummaryCard title="Total Staff" value={totalSummary.totalStaff} colorFrom="blue-100" colorTo="cyan-100" icon={FaUserTie} />
        <BloodSummaryCard title="Total Donations" value={totalSummary.totalDonations} colorFrom="purple-100" colorTo="violet-100" icon={FaCalendarCheck} />
      </div>

      {/* Pie Chart */}
      <BloodPieStatistics title="Blood Inventory Breakdown" data={pieData} />

      {/* Line Chart biến động kho */}
      <BloodLineChartStatistics data={monthlyData} />

      {/* Quản lý ngưỡng */}
      <div className="bg-white p-6 rounded-2xl shadow-xl">
        <h3 className="font-bold text-lg mb-4 text-blue-600">Quản lý ngưỡng an toàn máu & thành phần</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nhóm máu</TableHead>
              <TableHead>Thành phần</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Ngưỡng an toàn</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, idx) => (
              <TableRow key={`${item.bloodGroup}-${item.productType}`}>
                <TableCell>{item.bloodGroup}</TableCell>
                <TableCell>{item.productType}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.threshold}
                    min={0}
                    onChange={e => updateThreshold(idx, e.target.value)}
                    className="w-20"
                  />
                </TableCell>
                <TableCell>
                  {item.quantity <= item.threshold ? (
                    <Badge variant="destructive">⚠ Dưới ngưỡng</Badge>
                  ) : (
                    <Badge variant="success">Ổn định</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4">
          <Button className="bg-blue-600 text-white">Lưu thay đổi</Button>
        </div>
      </div>

    </div>
  );
};
