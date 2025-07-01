import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Stepper } from '@/components/ui/stepper';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import {
  fetchSeparationJobById,
  fetchSeparationSteps,
  updateSeparationStep,
} from '../../api/bloodSeparationService';
import type {  SeparationStepData, SeparationJob } from '../../data/mockSeparation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FLOWS: Record<string, string[]> = {
 'Whole Blood': [
    'Tiếp nhận mẫu',
    'Xét nghiệm truyền nhiễm',
    'Vô khuẩn & thanh trùng',
    'Ly tâm tách hồng cầu',
    'Ly tâm tách tiểu cầu',
    'Giảm bạch cầu',
    'Kiểm định vi sinh',
    'Định lượng & hiệu chuẩn',
    'Pathogen reduction',
    'Ghi nhãn & dán tem',
    'Nhập kho',
  ],
  'Red Blood Cells': [
    'Tiếp nhận mẫu',
    'Xét nghiệm truyền nhiễm',
    'Vô khuẩn & thanh trùng',
    'Ly tâm tách hồng cầu',
    'Kiểm định hồng cầu',
    'Giảm bạch cầu',
    'Ghi nhãn & dán tem',
    'Nhập kho',
  ],
  'Plasma': [
    'Tiếp nhận mẫu',
    'Xét nghiệm truyền nhiễm',
    'Vô khuẩn & thanh trùng',
    'Ly tâm tách plasma',
    'Kiểm định huyết tương',
    'Pathogen reduction',
    'Ghi nhãn & dán tem',
    'Nhập kho',
  ],
  'Platelets': [
    'Tiếp nhận mẫu',
    'Xét nghiệm truyền nhiễm',
    'Vô khuẩn & thanh trùng',
    'Ly tâm tách tiểu cầu',
    'Kiểm định tiểu cầu',
    'Giảm bạch cầu',
    'Pathogen reduction',
    'Ghi nhãn & dán tem',
    'Nhập kho',
  ],
};

export const BloodSeparationProcessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<SeparationJob | null>(null);
  const [doneSteps, setDoneSteps] = useState<SeparationStepData[]>([]);
  const [current, setCurrent] = useState(0);

  const [note, setNote] = useState('');
  const [infectiousPassed, setInfectiousPassed] = useState(false);
  const [sterileNote, setSterileNote] = useState('');
  const [rpm, setRpm] = useState('');
  const [duration, setDuration] = useState('');
  const [temp, setTemp] = useState('');
  const [leuko, setLeuko] = useState(false);
  const [microStatus, setMicroStatus] = useState<'Pass'|'Fail'>('Pass');
  const [microNote, setMicroNote] = useState('');
  const [hematocrit, setHematocrit] = useState('');
  const [ph, setPh] = useState('');
  const [pathogenNote, setPathogenNote] = useState('');
  const [isbt, setIsbt] = useState('');
  const [expiry, setExpiry] = useState('');
  const [location, setLocation] = useState('');
  const [storageTemp, setStorageTemp] = useState('');

  const steps = job ? FLOWS[job.blood_component_name] || [] : [];

  useEffect(() => {
    if (!id) return;
    (async () => {
      const j = await fetchSeparationJobById(id);
      setJob(j);
      const s = await fetchSeparationSteps(id);
      setDoneSteps(s);
      setCurrent(s.length);
    })();
  }, [id]);

  const handleNext = async () => {
    if (!job) return;
    const stepIndex = current;
    const base = { step: stepIndex + 1, note };
    const name = steps[stepIndex];

    const data =
      name === 'Xét nghiệm truyền nhiễm'
        ? { ...base, infectiousPassed }
      : name === 'Vô khuẩn & thanh trùng'
        ? { ...base, sterileNote }
      : name.includes('Ly tâm')
        ? { ...base, rpm, duration, temp }
      : name === 'Giảm bạch cầu'
        ? { ...base, leuko }
      : name === 'Kiểm định vi sinh'
        ? { ...base, microStatus, microNote }
      : name === 'Định lượng & hiệu chuẩn'
        ? { ...base, hematocrit, ph }
      : name === 'Pathogen reduction'
        ? { ...base, pathogenNote }
      : name === 'Ghi nhãn & dán tem'
        ? { ...base, isbt, expiry }
      : name === 'Nhập kho'
        ? { ...base, location, storageTemp }
      : base;

    await updateSeparationStep(job._id, data);
    const s = await fetchSeparationSteps(job._id);
    setDoneSteps(s);
    setCurrent(s.length);

    setNote(''); setInfectiousPassed(false); setSterileNote('');
    setRpm(''); setDuration(''); setTemp(''); setLeuko(false);
    setMicroStatus('Pass'); setMicroNote(''); setHematocrit(''); setPh('');
    setPathogenNote(''); setIsbt(''); setExpiry(''); setLocation(''); setStorageTemp('');

    if (s.length >= steps.length) navigate('/separation');
  };

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-[#4f46e5] mb-6">
        Phân tách: {job?.blood_component_name}
      </h2>
      {job && (
        <Card className="w-full shadow-lg">
          <CardContent className="p-6 space-y-4">
            <div><b>ID mẫu:</b> {job._id}</div>
            <Stepper steps={steps} currentStep={current + 1} />
            {current < steps.length && (
              <div className="space-y-4">
                <div><b>Bước {current+1}:</b> {steps[current]}</div>
                {steps[current] === 'Xét nghiệm truyền nhiễm' && (
                  <label className="flex items-center space-x-2">
                    <Checkbox checked={infectiousPassed} onCheckedChange={v=>setInfectiousPassed(v===true)} />
                    <span>Đã qua xét nghiệm truyền nhiễm</span>
                  </label>
                )}
                {steps[current] === 'Vô khuẩn & thanh trùng' && (
                  <Textarea value={sterileNote} onChange={e=>setSterileNote(e.target.value)} placeholder="Ghi chú vô khuẩn" />
                )}
                {steps[current].includes('Ly tâm') && (
                  <div className="grid grid-cols-3 gap-4">
                    <Input type="number" placeholder="RPM" value={rpm} onChange={e=>setRpm(e.target.value)} />
                    <Input type="number" placeholder="Thời gian (ph)" value={duration} onChange={e=>setDuration(e.target.value)} />
                    <Input type="number" placeholder="Nhiệt độ (°C)" value={temp} onChange={e=>setTemp(e.target.value)} />
                  </div>
                )}
                {steps[current] === 'Giảm bạch cầu' && (
                  <label className="flex items-center space-x-2">
                    <Checkbox checked={leuko} onCheckedChange={v=>setLeuko(v===true)} />
                    <span>Thực hiện giảm bạch cầu</span>
                  </label>
                )}
                {steps[current] === 'Kiểm định vi sinh' && (
                  <div className="space-y-2">
                    <Select value={microStatus} onValueChange={v=>setMicroStatus(v as any)}>
                      <SelectTrigger><SelectValue placeholder="Kết quả vi sinh" /></SelectTrigger>
                      <SelectContent><SelectItem value="Pass">Pass</SelectItem><SelectItem value="Fail">Fail</SelectItem></SelectContent>
                    </Select>
                    <Textarea value={microNote} onChange={e=>setMicroNote(e.target.value)} placeholder="Ghi chú vi sinh" />
                  </div>
                )}
                {steps[current] === 'Định lượng & hiệu chuẩn' && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="number" placeholder="Hematocrit (%)" value={hematocrit} onChange={e=>setHematocrit(e.target.value)} />
                    <Input type="number" placeholder="pH" value={ph} onChange={e=>setPh(e.target.value)} />
                  </div>
                )}
                {steps[current] === 'Pathogen reduction' && (
                  <Textarea value={pathogenNote} onChange={e=>setPathogenNote(e.target.value)} placeholder="Ghi chú P. Reduction" />
                )}
                {steps[current] === 'Ghi nhãn & dán tem' && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Mã ISBT128" value={isbt} onChange={e=>setIsbt(e.target.value)} />
                    <Input type="date" placeholder="Hạn dùng" value={expiry} onChange={e=>setExpiry(e.target.value)} />
                  </div>
                )}
                {steps[current] === 'Nhập kho' && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Vị trí (Tủ/Ngăn)" value={location} onChange={e=>setLocation(e.target.value)} />
                    <Input placeholder="Nhiệt độ lưu (°C)" value={storageTemp} onChange={e=>setStorageTemp(e.target.value)} />
                  </div>
                )}
                <Textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Ghi chú chung (tuỳ chọn)" />
                <div className="text-right"><Button onClick={handleNext}>Hoàn thành bước</Button></div>
              </div>
            )}
            {current >= steps.length && (
              <div className="text-center text-green-600 font-bold">Đã hoàn tất quy trình phân tách.</div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
