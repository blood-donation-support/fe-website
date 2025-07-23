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
import Dashboard from "./pages/admin/Dashboard";
import SupportPage from "./pages/SupportPage";
import PolicyPage from "./pages/PolicyPage";
import BloodHistoryPage from "./pages/BloodHistoryPage";
import BlogPreviewPage from "./components/blogComponents/BlogPreviewPage";
import ProfileLayout from "./components/layout/ProfileLayout";
import ProfileInfo from "./components/profileComponents/ProfileInfo";
import ChangePasswordPage from "./components/profileComponents/ChangePasswordPage";

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
		<BrowserRouter>
			<Routes>
				{/* Public routes */}
				<Route path="/" element={<HomePage />} />
				<Route path="/login" element={<Login />} />
				<Route path="/donateBlood" element={<DonateBloodPage />} />
				<Route path="/blogDetail/:id" element={<BlogDetailPage />}/>
				<Route path="/support" element={<SupportPage />} />
				<Route path="/policy" element={<PolicyPage />} />
				<Route path="/dashboard-admin/blogs/:id/preview" element={<BlogPreviewPage />} />
				<Route path="/profile" element={<ProfileLayout />}>
					<Route path="info" element={<ProfileInfo />} />
					<Route path="blood-history" element={<BloodHistoryPage />} />
					<Route path="blood-history/:donationRegistrationId" element={<BloodHistoryPage />} />
					{/* <Route path="notifications" element={<NotificationList />} /> */}
					<Route path="change-password" element={<ChangePasswordPage />} />
					<Route index element={<ProfileInfo />} /> {/* default */}
				</Route>
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
					/>*/}
					<Route path="blogs" element={<BlogAdminPage />} /> 
					<Route path="blogs/:id/edit" element={<BlogEditPage />} />
					{/* <Route
						path="/dashboard-admin/request-list"
						element={<BloodRequestListPage />}
					/>  */}
				</Route>

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
					<Route path="doctor-request" element={<DoctorRequestPage />} />
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
					<Route path="request-list" element={<BloodRequestListPage />} />
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
			</Routes>
		</BrowserRouter>
	);
}
