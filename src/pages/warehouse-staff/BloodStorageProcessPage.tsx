import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Stepper } from '@/components/ui/stepper';

export const BloodStorageProcessPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const steps = ['Xác nhận hiến máu', 'Gắn mã túi', 'Lưu kho'];

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardContent  className="space-y-4 p-6">
          <h2 className="text-2xl font-semibold text-[#236afe] text-center mb-8">Nhập kho máu</h2>
          <Stepper steps={steps} currentStep={currentStep} />

          {currentStep === 1 && (
            <div className="mt-8 space-y-4">
              <h3 className="font-semibold text-blue-600">Bước 1: Xác nhận thông tin người hiến</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Mã hiến máu (QR scan hoặc nhập tay)" />
                <Input placeholder="Họ tên người hiến" disabled value="Nguyen Van A" />
                <Input placeholder="Thời gian hiến" disabled value={new Date().toLocaleString()} />
                <Select>
                  <SelectTrigger><SelectValue placeholder="Loại máu hiến" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Whole">Toàn phần</SelectItem>
                    <SelectItem value="Plasma">Huyết tương</SelectItem>
                    <SelectItem value="Platelet">Tiểu cầu</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Lượng máu thu (ml)" />
                <Select>
                  <SelectTrigger><SelectValue placeholder="Tình trạng sau hiến" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ổn định">Ổn định</SelectItem>
                    <SelectItem value="Chóng mặt">Chóng mặt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => setCurrentStep(2)}>Tiếp tục</Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="mt-8 space-y-4">
              <h3 className="font-semibold text-blue-600">Bước 2: Gắn mã túi máu & xét nghiệm</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Mã túi máu (Barcode/RFID)" />
                <Select>
                  <SelectTrigger><SelectValue placeholder="Loại máu (ABO & Rh)" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Ngày lấy" type="date" />
                <Input placeholder="Ngày hết hạn" type="date" />
                <Input placeholder="Mã nhân viên lấy máu" />
                <Input placeholder="Ghi chú (nếu có sự cố)" />
              </div>
              <Button onClick={() => setCurrentStep(3)}>Tiếp tục</Button>
            </div>
          )}

          {currentStep === 3 && (
            <div className="mt-8 space-y-4">
              <h3 className="font-semibold text-blue-600">Bước 3: Lưu kho máu</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Mã túi máu" disabled value="AUTO123456" />
                <Select>
                  <SelectTrigger><SelectValue placeholder="Kho lưu trữ" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Trung tâm">Kho Trung tâm</SelectItem>
                    <SelectItem value="Tủ 1">Tủ lạnh số 1</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Ngăn/Lô (nếu có)" />
                <Input placeholder="Thời gian nhập kho" type="datetime-local" />
                <Input placeholder="Nhiệt độ lưu trữ (°C)" />
                <Select>
                  <SelectTrigger><SelectValue placeholder="Trạng thái lưu kho" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đang lưu kho">Đang lưu kho</SelectItem>
                    <SelectItem value="Hủy">Hủy</SelectItem>
                    <SelectItem value="Xuất đi">Đã xuất đi bệnh viện</SelectItem>
                    <SelectItem value="Đang kiểm tra">Đang kiểm tra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="link">Lưu vào kho</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
