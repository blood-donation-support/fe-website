import { apiClient, type ApiResponse } from "./apiClient";
export interface Question {
  _id: string;
  name: string;
  created_at?: string;
  update_by?: string;
}
export const questionService = {
  fetchQuestions: async (): Promise<Question[]> => {
    const res = await apiClient.get<ApiResponse<Question[]>>(`/questions`);
    return res.data.result;
  },
};