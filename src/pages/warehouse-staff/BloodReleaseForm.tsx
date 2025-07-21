import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Giả lập kho tồn
const warehouseMock = [
  { id: 'B001', bloodGroup: 'A+', productType: 'Whole', expiryDate: '2025-07-06' },
  { id: 'B002', bloodGroup: 'O-', productType: 'Platelet', expiryDate: '2025-06-25' },
  { id: 'B003', bloodGroup: 'B+', productType: 'Plasma', expiryDate: '2025-06-20' },
];

export const BloodReleaseForm = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleRelease = () => {
    console.log('Xuất kho các túi:', selected);
    setSelected([]);
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold text-[#236afe] text-center mb-8">Xuất kho máu</h3>
 <Card className="shadow-md">
           <CardContent className="overflow-x-auto p-0">

        <Table>
          <TableHeader className="bg-[#f3f4f6]">
            <TableRow>
            <TableHead>Chọn</TableHead>
            <TableHead>Mã túi</TableHead>
            <TableHead>Nhóm máu</TableHead>
            <TableHead>Thành phần</TableHead>
            <TableHead>Hạn sử dụng</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {warehouseMock.map(item => (
            <TableRow key={item.id}>
              <TableCell>
                <input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggleSelect(item.id)} />
              </TableCell>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.bloodGroup}</TableCell>
              <TableCell>{item.productType}</TableCell>
              <TableCell>{item.expiryDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </CardContent>
      </Card>

      <div className="mt-4">
        <Button className="bg-green-600 text-white" disabled={selected.length === 0} onClick={handleRelease}>
          Xuất kho
        </Button>
      </div>
    </div>
  );
};
