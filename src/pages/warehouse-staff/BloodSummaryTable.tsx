import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// Giả lập dữ liệu tổng hợp kho máu (đếm số lượng)
const summaryMock = [
  { bloodGroup: 'A+', productType: 'Whole', quantity: 10, threshold: 5 },
  { bloodGroup: 'O-', productType: 'Whole', quantity: 2, threshold: 3 },
  { bloodGroup: 'B+', productType: 'Plasma', quantity: 8, threshold: 4 },
  { bloodGroup: 'AB-', productType: 'Platelet', quantity: 0, threshold: 1 },
];

export const BloodSummaryTable = () => {
  const [data, setData] = useState(summaryMock);

  const updateThreshold = (index: number, value: string) => {
    const updated = [...data];
    updated[index].threshold = parseInt(value) || 0;
    setData(updated);
  };

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-semibold text-[#236afe] text-center mb-8">
          Quản lý tổng hợp nhóm máu & thành phần
        </h2>

        <Card className="shadow-md">
               <CardContent className="overflow-x-auto p-0">
                 <Table>
                   <TableHeader className="bg-[#f3f4f6]">
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
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      {item.quantity <= item.threshold ? (
                        <Badge className="bg-red-500 text-white">⚠ Dưới ngưỡng</Badge>
                      ) : (
                        <Badge className="bg-green-500 text-white">Ổn định</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-8 text-center">
              <Button className="bg-[#236afe] text-white px-6 py-3 rounded-xl text-lg">
                Lưu thay đổi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
