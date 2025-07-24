import type { DashboardOverview } from "@/types/dashboard";
import { apiClient } from "./apiClient";
import type { ApiResponse } from "./apiClient";

export const fetchDashboardOverview = async (): Promise<DashboardOverview> => {
  const response = await apiClient.get<ApiResponse<DashboardOverview>>(
    "/dashboards/overview-admin"
  );
  return response.data.result;
};


// import mockDashboardOverview from "@/mock/dashboardOverviewMock";

// export const fetchDashboardOverview = async (): Promise<DashboardOverview> => {
//   if (import.meta.env.DEV) {

//     return Promise.resolve(mockDashboardOverview);
//   }
//   const response = await apiClient.get<DashboardOverview>("/dashboard/overview");
//   return response.data;
// };



