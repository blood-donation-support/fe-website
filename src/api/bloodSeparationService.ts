import apiClient from './apiClient';

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
}

export const fetchSeparationJobs = async (): Promise<SeparationJob[]> => {
  const res = await apiClient.get<{ result: SeparationJob[] }>('/separation/jobs');
  return res.data.result;
};

export const fetchSeparationJobById = async (id: string): Promise<SeparationJob> => {
  const res = await apiClient.get<{ result: SeparationJob }>(`/separation/jobs/${id}`);
  return res.data.result;
};

export const fetchSeparationSteps = async (jobId: string): Promise<SeparationStepData[]> => {
  const res = await apiClient.get<{ result: SeparationStepData[] }>(`/separation/jobs/${jobId}/steps`);
  return res.data.result;
};

export const updateSeparationStep = async (
  jobId: string,
  stepData: { step: number; note?: string }
): Promise<SeparationStepData> => {
  const res = await apiClient.post<{ result: SeparationStepData }>(
    `/separation/jobs/${jobId}/steps`,
    stepData
  );
  return res.data.result;
};



