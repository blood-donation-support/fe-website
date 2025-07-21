import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, addDays } from 'date-fns';

export const BloodIntakeForm = () => {
  const [form, setForm] = useState({
    bloodBagCode: '',
    bloodGroup: '',
    productType: '',
    collectionDate: '',
    expiryDate: '',
  });

  const handleChange = (field: string, value: string) => {
    const newForm = { ...form, [field]: value };
    // Auto calculate expiry date
    if (field === 'collectionDate' && form.productType) {
      const expiryDays = form.productType === 'Whole' ? 35 : form.productType === 'Platelet' ? 5 : 365;
      newForm.expiryDate = format(addDays(new Date(value), expiryDays), 'yyyy-MM-dd');
    }
    setForm(newForm);
  };

  return (
    <div>
      <h3 className="font-bold text-lg mb-4 text-blue-600">Nhập kho máu</h3>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div>
            <label>Mã túi máu</label>
            <Input value={form.bloodBagCode} onChange={e => handleChange('bloodBagCode', e.target.value)} />
          </div>
          <div>
            <label>Nhóm máu</label>
            <Select onValueChange={v => handleChange('bloodGroup', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhóm máu" />
              </SelectTrigger>
              <SelectContent>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label>Thành phần máu</label>
            <Select onValueChange={v => handleChange('productType', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn thành phần" />
              </SelectTrigger>
              <SelectContent>
                {['Whole', 'Plasma', 'Platelet'].map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label>Ngày lấy máu</label>
            <Input type="date" value={form.collectionDate} onChange={e => handleChange('collectionDate', e.target.value)} />
          </div>
          <div>
            <label>Ngày hết hạn (tự động)</label>
            <Input type="date" value={form.expiryDate} readOnly />
          </div>
          <div className="pt-4">
            <Button className="bg-blue-600 text-white">Nhập kho</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
