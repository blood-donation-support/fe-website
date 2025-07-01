// import apiClient from './apiClient';

// export interface SeparationJob {
//   _id: string;
//   donation_process_id: string;
//   blood_group_name: string;
//   blood_component_name: string;
//   status: 'Pending' | 'Processing' | 'Completed' | 'Rejected';
//   created_at: string;
// }

// export interface SeparationStepData {
//   step: number;
//   note?: string;
//   timestamp: string;
// }

// export const fetchSeparationJobs = async (): Promise<SeparationJob[]> => {
//   const res = await apiClient.get<{ result: SeparationJob[] }>('/separation/jobs');
//   return res.data.result;
// };

// export const fetchSeparationJobById = async (id: string): Promise<SeparationJob> => {
//   const res = await apiClient.get<{ result: SeparationJob }>(`/separation/jobs/${id}`);
//   return res.data.result;
// };

// export const fetchSeparationSteps = async (jobId: string): Promise<SeparationStepData[]> => {
//   const res = await apiClient.get<{ result: SeparationStepData[] }>(`/separation/jobs/${jobId}/steps`);
//   return res.data.result;
// };

// export const updateSeparationStep = async (
//   jobId: string,
//   stepData: { step: number; note?: string }
// ): Promise<SeparationStepData> => {
//   const res = await apiClient.post<{ result: SeparationStepData }>(
//     `/separation/jobs/${jobId}/steps`,
//     stepData
//   );
//   return res.data.result;
// };


import type { SeparationJob, SeparationStepData } from '../data/mockSeparation';
import { mockSeparationJobs, mockSeparationSteps } from '../data/mockSeparation';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchSeparationJobs = async (): Promise<SeparationJob[]> => {
  await delay(200);
  return [...mockSeparationJobs].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

export const fetchSeparationJobById = async (id: string): Promise<SeparationJob> => {
  await delay(200);
  const job = mockSeparationJobs.find(j => j._id === id);
  if (!job) throw new Error('Job not found');
  return job;
};

export const fetchSeparationSteps = async (jobId: string): Promise<SeparationStepData[]> => {
  await delay(200);
  return mockSeparationSteps[jobId] ?? [];
};

export const updateSeparationStep = async (
  jobId: string,
  stepData: Partial<SeparationStepData> & { step: number }
): Promise<SeparationStepData> => {
  await delay(200);
  const newStep: SeparationStepData = {
    step: stepData.step,
    note: stepData.note,
    timestamp: new Date().toISOString(),
    infectiousPassed: stepData.infectiousPassed,
    sterileNote: stepData.sterileNote,
    rpm: stepData.rpm,
    duration: stepData.duration,
    temp: stepData.temp,
    leuko: stepData.leuko,
    microStatus: stepData.microStatus,
    microNote: stepData.microNote,
    hematocrit: stepData.hematocrit,
    ph: stepData.ph,
    pathogenNote: stepData.pathogenNote,
    isbt: stepData.isbt,
    expiry: stepData.expiry,
    location: stepData.location,
    storageTemp: stepData.storageTemp,
  };
  if (!mockSeparationSteps[jobId]) mockSeparationSteps[jobId] = [];
  mockSeparationSteps[jobId].push(newStep);
  const job = mockSeparationJobs.find(j => j._id === jobId);
  if (job) job.status = newStep.step >= 11 ? 'Completed' : 'Processing';
  return newStep;
};
