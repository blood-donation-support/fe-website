import React from "react";
// import type { ElementType } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
import { AnimatePresence, motion } from "framer-motion";

import { store } from "./redux/store";
import ScrollToTop from "./components/ScrollToTop";

import HomePage from "./pages/HomePage";
import Login from "./Auth/Login";
import { DonateBloodPage } from "./pages";
import BlogDetailPage from "./pages/BlogDetailPage";

import AdminLayout from "./components/layout/AdminLayout";
// import Dashboard from "./pages/admin/Dashboard";
import UserListPage from "./pages/admin/UserListPage";
import BloodPage from "./pages/BloodPage";
import DonationRegistrationsPage from "./pages/DonationRegistrationsPage";
import BlogAdminPage from "./pages/admin/BlogAdminPage";
import BlogEditPage from "./pages/admin/BlogEditPage";

import StaffLayout from "./components/layout/StaffLayout";
import { DonationRegisterPage } from "./pages/DonationRegisterPage";
import { DonationProcessPage } from "./pages/DonationProcessPage";
import { DoctorRequestPage } from "./pages/staff/DoctorRequestPage";
import { BloodRequestApprovedList } from "./pages/staff/BloodRequestApprovedList";
import { HealthCheckRequest } from "./pages/staff/HealthCheckRequest";

import StaffWarehouseLayout from "./components/layout/StaffWarehouseLayout";
import { BloodRequestListPage } from "./pages/staff/BloodRequestListPage";
import { BloodRequestApprovalPage } from "./pages/warehouse-staff/BloodRequestApprovalPage";
import { BloodStoragePage } from "./pages/warehouse-staff/BloodStoragePage";
import { BloodSeparationListPage } from "./pages/warehouse-staff/BloodSeparationListPage";
import { BloodSeparationProcessPage } from "./pages/warehouse-staff/BloodSeparationProcessPage";

import SupportPage from "./pages/SupportPage";
import PolicyPage from "./pages/PolicyPage";
import BloodHistoryPage from "./pages/BloodHistoryPage";
import DashBoardAdminPage from "./pages/admin/DashBoardAdminPage";
import WarehouseDashboardPage from "./pages/warehouse-staff/WarehouseDashboardPage";
import BlogPreviewPage from "./components/blogComponents/BlogPreviewPage";
import ProfileLayout from "./components/layout/ProfileLayout";
import ProfileInfo from "./components/profileComponents/ProfileInfo";
import ChangePasswordPage from "./components/profileComponents/ChangePasswordPage";
import BloodSummaryTable from "./pages/warehouse-staff/BloodSummaryTable";
import NotFoundPage from "./pages/NotFoundPage";

type PrivateRouteProps = {
  role: string;
  children: React.ReactNode;
};

function PrivateRoute({ role, children }: PrivateRouteProps) {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  if (!user) return <Navigate to="/login" />;
  if (user.role !== role) return <Navigate to="/" />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <div className="w-full max-w-[100vw] overflow-x-hidden">
        <BrowserRouter>
          <ScrollToTop />
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <HomePage />
                  </motion.div>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route
                path="/donateBlood"
                element={
                  <motion.div
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <DonateBloodPage />
                  </motion.div>
                }
              />
              <Route path="/policy" element={<PolicyPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/blood-history" element={<BloodHistoryPage />} />
              <Route path="/blogDetail/:id" element={<BlogDetailPage />} />
              <Route
                path="/dashboard-admin/blogs/:id/preview"
                element={<BlogPreviewPage />}
              />
              <Route path="/profile" element={<ProfileLayout />}>
                <Route path="info" element={<ProfileInfo />} />
                <Route path="blood-history" element={<BloodHistoryPage />} />
                <Route
                  path="blood-history/:donationRegistrationId"
                  element={<BloodHistoryPage />}
                />
                {/* <Route path="notifications" element={<NotificationList />} /> */}
                <Route
                  path="change-password"
                  element={<ChangePasswordPage />}
                />
                <Route index element={<ProfileInfo />} /> {/* default */}
              </Route>
              {/* Admin Routes */}
              <Route
                path="/dashboard-admin/*"
                element={
                  <PrivateRoute role="Admin">
                    <AdminLayout />
                  </PrivateRoute>
                }
              >
                <Route index element={<DashBoardAdminPage />} />

                <Route path="users" element={<UserListPage />} />
                <Route path="bloods" element={<BloodPage />} />
                <Route
                  path="donation-registers"
                  element={<DonationRegistrationsPage />}
                />
                <Route path="blogs" element={<BlogAdminPage />} />
                <Route path="blogs/:id/edit" element={<BlogEditPage />} />
              </Route>

              {/* Staff Routes */}
              <Route
                path="/dashboard-staff/*"
                element={
                  <PrivateRoute role="Admin">
                    <StaffLayout />
                  </PrivateRoute>
                }
              >

                <Route path="donation" element={<DonationRegisterPage />} />
                <Route path="donation/:id" element={<DonationProcessPage />} />
                <Route path="doctor-request" element={<DoctorRequestPage />} />
                <Route
                  path="doctor-request-approved"
                  element={<BloodRequestApprovedList />}
                />
                <Route
                  path="doctor-healthcheck-request-approved/:id"
                  element={<HealthCheckRequest />}
                />
              </Route>

              {/* Warehouse Staff Routes */}
              <Route
                path="/dashboard-staff-warehouse/*"
                element={
                  <PrivateRoute role="Admin">
                    <StaffWarehouseLayout />
                  </PrivateRoute>
                }
              >
                <Route index element={<WarehouseDashboardPage />} />

                <Route path="request-list" element={<BloodRequestListPage />} />
                <Route
                  path="request-list/:id"
                  element={<BloodRequestApprovalPage />}
                />
                <Route path="blood-storage" element={<BloodStoragePage />} />
                <Route
                  path="blood-storage-summary"
                  element={<BloodSummaryTable />}
                />
                <Route
                  path="blood-separation-list"
                  element={<BloodSeparationListPage />}
                />
                <Route
                  path="blood-separation-process/:id"
                  element={<BloodSeparationProcessPage />}
                />
              </Route>
                <Route path="*" element={<NotFoundPage />} />

            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </div>
      {/* </PersistGate> */}
    </Provider>
  );
}
