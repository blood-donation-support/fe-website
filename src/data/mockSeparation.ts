export interface SeparationJob {
  _id: string;
  donation_process_id: string;
  blood_group_name: string;
  blood_component_name: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Rejected';
  created_at: string;
}

export interface SeparationStepData {
  step: number;
  note?: string;
  timestamp: string;
  infectiousPassed?: boolean;
  sterileNote?: string;
  rpm?: string;
  duration?: string;
  temp?: string;
  leuko?: boolean;
  microStatus?: 'Pass' | 'Fail';
  microNote?: string;
  hematocrit?: string;
  ph?: string;
  pathogenNote?: string;
  isbt?: string;
  expiry?: string;
  location?: string;
  storageTemp?: string;
}

export const mockSeparationJobs: SeparationJob[] = [
  {
    _id: 'job1',
    donation_process_id: 'proc1',
    blood_group_name: 'A+',
    blood_component_name: 'Red Blood Cells',
    status: 'Pending',
    created_at: '2025-07-01T08:00:00Z',
  },
  {
    _id: 'job2',
    donation_process_id: 'proc2',
    blood_group_name: 'O-',
    blood_component_name: 'Plasma',
    status: 'Processing',
    created_at: '2025-07-01T07:30:00Z',
  },
   {
    _id: 'job3',
    donation_process_id: 'proc2',
    blood_group_name: 'O-',
    blood_component_name: 'Whole Blood',
    status: 'Processing',
    created_at: '2025-07-01T07:30:00Z',
  },
];

export const mockSeparationSteps: Record<string, SeparationStepData[]> = {
  job1: [
    { step: 1, timestamp: '2025-07-01T08:10:00Z', note: 'Sample received' },
  ],
  job2: [
    { step: 1, timestamp: '2025-07-01T07:40:00Z' },
    { step: 2, timestamp: '2025-07-01T08:00:00Z', note: 'Centrifuge completed' },
  ],
};


