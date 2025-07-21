import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const BloodDiscardForm = () => {
  const [form, setForm] = useState({
    bloodBagCode: '',
    reason: '',
  });

  return (
    <div>
      <h3 className="text-2xl font-semibold text-[#236afe] text-center mb-8">Hủy túi máu</h3>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div>
            <label>Mã túi máu</label>
            <Input value={form.bloodBagCode} onChange={e => setForm({ ...form, bloodBagCode: e.target.value })} />
          </div>
          <div>
            <label>Lý do hủy</label>
            <Select onValueChange={v => setForm({ ...form, reason: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn lý do" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Expired">Hết hạn</SelectItem>
                <SelectItem value="Leak">Rò rỉ túi</SelectItem>
                <SelectItem value="Infection">Nghi nhiễm khuẩn</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="pt-4">
            <Button className="bg-red-600 text-white">Hủy máu</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
