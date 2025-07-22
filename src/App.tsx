//import Layout from "./components/Layout";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { AnimatePresence, motion } from "framer-motion";
// import ReviewPage from "./pages/ReviewPage";
// import SchedulePage from "./pages/SchedulePage";
// import DashboardAdminPage from "./pages/DashBoardAdminPage";
// import ServicePage from "./pages/ServicePage";
import {
	BrowserRouter,
	Routes,
	Route,
	Navigate,
	Outlet,
} from "react-router-dom";

// import { useUser } from "../hooks/useUser";
import HomePage from "./pages/HomePage";
import Login from "./Auth/Login";
import AdminLayout from "./components/layout/AdminLayout";
import StaffLayout from "./components/layout/StaffLayout";
// import DashboardAdmin from "./pages/admin/DashboardAdmin";
// import StaffListPage from "./pages/StaffListPage";
import BloodPage from "./pages/BloodPage";
import DonationRegistrationsPage from "./pages/DonationRegistrationsPage";
import { DonateBloodPage } from "./pages";
import { DonationRegisterPage } from "./pages/DonationRegisterPage";
import { BloodStorageProcessPage } from "./pages/warehouse-staff/BloodStorageProcessPage";
import { DonationProcessPage } from "./pages/DonationProcessPage";
import { DoctorRequestPage } from "./pages/staff/DoctorRequestPage";
import { BloodRequestListPage } from "./pages/staff/BloodRequestListPage";
import { BloodRequestApprovalPage } from "./pages/warehouse-staff/BloodRequestApprovalPage";
import { BloodStoragePage } from "./pages/warehouse-staff/BloodStoragePage";
import { BloodSummaryTable } from "./pages/warehouse-staff/BloodSummaryTable";
import StaffWarehouseLayout from "./components/layout/StaffWarehouseLayout";
import { BloodInventoryDashboard } from "./pages/warehouse-staff/BloodInventoryDashboard";
import { BloodSeparationListPage } from "./pages/warehouse-staff/BloodSeparationListPage";
import { BloodSeparationProcessPage } from "./pages/warehouse-staff/BloodSeparationProcessPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import BlogAdminPage from "./pages/admin/BlogAdminPage";
import BlogEditPage from "./pages/admin/BlogEditPage";
import UserListPage from "./pages/admin/UserListPage";
<<<<<<< HEAD
import { BloodRequestApprovedList } from "./pages/staff/BloodRequestApprovedList";
import { HealthCheckRequest } from "./pages/staff/HealthCheckRequest";
=======
import Dashboard from "./pages/admin/Dashboard";
import SupportPage from "./pages/SupportPage";
import PolicyPage from "./pages/PolicyPage";
import BloodHistoryPage from "./pages/BloodHistoryPage";
>>>>>>> thanhnt/dashboard

function PrivateRoute({
	role,
	children,
}: {
	role: string;
	children: React.ReactNode;
}) {
	const userData = localStorage.getItem("user");
	const user = userData ? JSON.parse(userData) : null;

	if (!user) return <Navigate to="/login" />;
	if (user.role !== role) return <Navigate to="/" />;

	return <>{children}</>;
}


export default function App() {
	return (
<<<<<<< HEAD

		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<div className="w-full max-w-[100vw] overflow-x-hidden">
					<BrowserRouter>
						<ScrollToTop />
						<AnimatePresence mode="wait">

						<Routes >

							


							{/* Route không có layout (ví dụ: trang chủ) */}
							<Route path="/" element={
								<motion.div
								initial={{ x: 0, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								exit={{ x: 300, opacity: 0 }}
								transition={{ duration: 0.5 }}
								>
									<HomePage />
								</motion.div>
								
							} />

							<Route
								path="/donateBlood"
								element={
									//<PrivateRoute requiredRole="Customer">
									<motion.div
									initial={{ x: 300, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									exit={{ x: -300, opacity: 0 }}
									transition={{ duration: 0.5 }}
									>
									<DonateBloodPage />
									</motion.div>
								//</PrivateRoute>
							}
							/>

							{/* Route có layout dùng Outlet */}
							{/* <Route element={<Layout />}>
								<Route
								path="/dashboard-admin"
								element={<DashboardAdminPage />}
								/>
								
								<Route path="/reviews" element={<ReviewPage />} />
								<Route
								path="/staffs/:id/schedule"
								element={<SchedulePage />}
								/>
								<Route path="/services" element={<ServicePage />} />
								</Route> */}
						</Routes>
							
// 		<BrowserRouter>
// 			<Routes>
// 				{/* Public routes */}
// 				<Route path="/" element={<HomePage />} />
// 				<Route path="/login" element={<Login />} />
// 				<Route path="/donateBlood" element={<DonateBloodPage />} />
// 				<Route path="/blogDetail/:id" element={<BlogDetailPage />}/>
// 				<Route
// 					path="/donateBlood"
// 					element={
// 						<PrivateRoute role="custuomer">
// 							<DonateBloodPage />
// 						</PrivateRoute>
// 					}
// 				></Route>

// 				{/* Admin routes */}
// 				<Route
// 					path="/dashboard-admin"
// 					element={
// 						<PrivateRoute role="Admin">
// 							<AdminLayout />
// 						</PrivateRoute>
// 					}
// 				>
// 					{/* <Route index element={<DashboardAdmin />} /> */}
// 					{/* <Route path="staffs" element={<StaffListPage />} /> */}
// 					<Route path="users" element={<UserListPage />} />

// 					<Route path="bloods" element={<BloodPage />} />
// 					<Route
// 						path="donation-registers"
// 						element={<DonationRegistrationsPage />}
// 					/>
// 					<Route path="blogs" element={<BlogAdminPage />} /> 
// 					<Route path="blogs/:id/edit" element={<BlogEditPage />} />
// 					<Route
// 						path="/dashboard-admin/request-list"
// 						element={<BloodRequestListPage />}
// 					/>
// 				</Route>
=======
		<BrowserRouter>
			<Routes>
				{/* Public routes */}
				<Route path="/" element={<HomePage />} />
				<Route path="/login" element={<Login />} />
				<Route path="/donateBlood" element={<DonateBloodPage />} />
				<Route path="/blogDetail/:id" element={<BlogDetailPage />}/>
				<Route path="/support" element={<SupportPage />} />
				<Route path="/policy" element={<PolicyPage />} />
				<Route path="/blood-history" element={<BloodHistoryPage />} />
				<Route
					path="/donateBlood"
					element={
						<PrivateRoute role="custuomer">
							<DonateBloodPage />
						</PrivateRoute>
					}
				></Route>

				{/* Admin routes */}
				<Route
					path="/dashboard-admin"
					element={
						<PrivateRoute role="Admin">
							<AdminLayout />
						</PrivateRoute>
					}
				>
					{/* <Route index element={<DashboardAdmin />} /> */}
					{/* <Route path="staffs" element={<StaffListPage />} /> */}
					<Route path="users" element={<UserListPage />} />
					<Route path="" element={<Dashboard />} />
					{/* <Route path="bloods" element={<BloodPage />} />
					<Route
						path="donation-registers"
						element={<DonationRegistrationsPage />}
					/>
					<Route path="blogs" element={<BlogAdminPage />} /> 
					<Route path="blogs/:id/edit" element={<BlogEditPage />} />
					<Route
						path="/dashboard-admin/request-list"
						element={<BloodRequestListPage />}
					/> */}
				</Route>
>>>>>>> thanhnt/dashboard

				{/* staff routes */}
				<Route
					path="/dashboard-staff"
					element={
						// <PrivateRoute role="Staff">
						<PrivateRoute role="Admin">
							<StaffLayout />
						</PrivateRoute>
					}
				>
					<Route path="donation" element={<DonationRegisterPage />} />
					<Route path="donation/:id" element={<DonationProcessPage />} />

					{/* page tạo đơn xin máu */}
					<Route path="doctor-request" element={<DoctorRequestPage />} />
					{/* page danh sách đơn xin máu đã approved */}
					<Route
						path="doctor-request-approved"
						element={<BloodRequestApprovedList />}
					/>
					{/* healthcheck của xin máu */}
					<Route
						path="doctor-healthcheck-request-approved/:id"
						element={<HealthCheckRequest />}
					/>
				</Route>

				{/* staff warehouse routes */}
				<Route
					path="/dashboard-staff-warehouse"
					element={
						<PrivateRoute role="Admin">
							<StaffWarehouseLayout />
						</PrivateRoute>
					}
				>
					{/* page danh sách đơn xin máu */}
					<Route path="request-list" element={<BloodRequestListPage />} />
					{/* page chi tiết đơn xin máu */}
					<Route
						path="request-list/:id"
						element={<BloodRequestApprovalPage />}
					/>

					<Route path="blood-storage" element={<BloodStoragePage />} />
					<Route path="blood-storage-summary" element={<BloodSummaryTable />} />
					{/* <Route
						path="blood-storage-dashboard"
						element={<BloodInventoryDashboard />}
					/> */}
					<Route
						path="blood-separation-list"
						element={<BloodSeparationListPage />}
					/>
					<Route
						path="blood-separation-process/:id"
						element={<BloodSeparationProcessPage />}
					/>
				</Route>
// 			</Routes>
// 		</BrowserRouter>
            
            	</AnimatePresence>
					</BrowserRouter>
				</div>
			</PersistGate>
		</Provider>
	);
}
