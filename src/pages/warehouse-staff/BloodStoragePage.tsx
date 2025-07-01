import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BloodInventoryTable } from './BloodInventoryTable';
// import { BloodIntakeForm } from './BloodIntakeForm';
import { BloodReleaseForm } from './BloodReleaseForm';
import { BloodDiscardForm } from './BloodDiscardForm';
import { BloodStorageProcessPage } from './BloodStorageProcessPage';

export const BloodStoragePage = () => {
  const [tab, setTab] = useState('inventory');

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <h2 className="text-3xl font-semibold text-[#236afe] text-center mb-8">
          Quản lý kho máu
        </h2>

        <div className="flex justify-center flex-wrap gap-4 mb-8">
          <Button
            className={`px-6 py-3 rounded-xl text-lg ${tab === 'inventory' ? 'bg-[#236afe] text-white' : 'bg-white border border-[#236afe] text-[#236afe]'}`}
            onClick={() => setTab('inventory')}
          >
            Tồn kho hiện tại
          </Button>

          <Button
            className={`px-6 py-3 rounded-xl text-lg ${tab === 'intake' ? 'bg-[#236afe] text-white' : 'bg-white border border-[#236afe] text-[#236afe]'}`}
            onClick={() => setTab('intake')}
          >
            Nhập kho
          </Button>

          <Button
            className={`px-6 py-3 rounded-xl text-lg ${tab === 'release' ? 'bg-[#236afe] text-white' : 'bg-white border border-[#236afe] text-[#236afe]'}`}
            onClick={() => setTab('release')}
          >
            Xuất kho
          </Button>

          <Button
            className={`px-6 py-3 rounded-xl text-lg ${tab === 'discard' ? 'bg-[#236afe] text-white' : 'bg-white border border-[#236afe] text-[#236afe]'}`}
            onClick={() => setTab('discard')}
          >
            Hủy máu
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            {tab === 'inventory' && <BloodInventoryTable />}
            {/* {tab === 'intake' && <BloodIntakeForm />} */}
            {tab === 'intake' && <BloodStorageProcessPage />}
            {tab === 'release' && <BloodReleaseForm />}
            {tab === 'discard' && <BloodDiscardForm />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
