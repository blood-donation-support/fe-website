import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, addDays, isBefore } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';

// Giả lập dữ liệu kho máu
const inventoryMock = [
  { id: 'B001', bloodGroup: 'A+', productType: 'Whole', collectionDate: '2025-06-01', expiryDate: '2025-07-06', status: 'Available' },
  { id: 'B002', bloodGroup: 'O-', productType: 'Platelet', collectionDate: '2025-06-15', expiryDate: '2025-06-25', status: 'Available' },
  { id: 'B003', bloodGroup: 'B+', productType: 'Plasma', collectionDate: '2025-05-25', expiryDate: '2025-06-20', status: 'Available' },
];

export const BloodInventoryTable = () => {
  const today = new Date();

  const checkExpiry = (expiry: string) => {
    const exp = new Date(expiry);
    if (isBefore(exp, today)) return <Badge variant="destructive">Hết hạn</Badge>;
    if (isBefore(exp, addDays(today, 5))) return <Badge variant="warning">Sắp hết hạn</Badge>;
    return <Badge variant="success">An toàn</Badge>;
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#236afe] text-center mb-8">
        Danh sách tồn kho</h2>
      <Card className="shadow-md">
         <CardContent className="overflow-x-auto p-0">
        <Table>
          <TableHeader className="bg-[#f3f4f6]">
            <TableRow>
              <TableHead>Mã túi</TableHead>
              <TableHead>Nhóm máu</TableHead>
              <TableHead>Thành phần</TableHead>
              <TableHead>Ngày lấy</TableHead>
              <TableHead>Ngày hết hạn</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryMock.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.bloodGroup}</TableCell>
                <TableCell>{item.productType}</TableCell>
                <TableCell>{format(new Date(item.collectionDate), 'dd/MM/yyyy')}</TableCell>
                <TableCell>{format(new Date(item.expiryDate), 'dd/MM/yyyy')}</TableCell>
                <TableCell>{checkExpiry(item.expiryDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
       </CardContent>
      </Card>

    </div>
  );
};
