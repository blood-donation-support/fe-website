import type { Question } from "@/types/question";
import { apiClient } from "./apiClient";
import type { ApiResponse } from "./apiClient";

export const fetchQuestion = async (): Promise<Question[]> => {
  const response = await apiClient.get<ApiResponse<Question[]>>("/questions");
  return response.data.result;
};

export const createQuestion = async (payload: Partial<Question>): Promise<Question> => {
  const response = await apiClient.post<ApiResponse<Question>>("/questions", payload);
  return response.data.result;
};

export const deleteQuestion = async (id: string): Promise<Question> => {
  const response = await apiClient.delete<ApiResponse<Question>>(`/questions/${id}`);
  return response.data.result;
};

export const questionService = {
  fetchQuestions: async (): Promise<Question[]> => {
    const res = await apiClient.get<ApiResponse<Question[]>>(`/questions`);
    return res.data.result;
  },
};
