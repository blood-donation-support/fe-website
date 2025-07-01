import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const BloodAlertPage = () => {
  const alertMock = [
    { bloodGroup: 'O-', productType: 'Whole', quantity: 2, threshold: 3 },
    { bloodGroup: 'AB-', productType: 'Platelet', quantity: 0, threshold: 1 },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-red-600 mb-6">Danh sách cảnh báo kho máu</h2>
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nhóm máu</TableHead>
                <TableHead>Thành phần</TableHead>
                <TableHead>Số lượng hiện tại</TableHead>
                <TableHead>Ngưỡng an toàn</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alertMock.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.bloodGroup}</TableCell>
                  <TableCell>{item.productType}</TableCell>
                  <TableCell className="text-red-600 font-bold">{item.quantity}</TableCell>
                  <TableCell>{item.threshold}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
