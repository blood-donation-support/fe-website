import Layout from "./components/Layout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

// import ReviewPage from "./pages/ReviewPage";
// import SchedulePage from "./pages/SchedulePage";
// import DashboardAdminPage from "./pages/DashBoardAdminPage";
// import ServicePage from "./pages/ServicePage";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import HomePage from "./pages/HomePage";

export default function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<div className="w-full max-w-[100vw] overflow-x-hidden">
					<BrowserRouter>
						<Routes>
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />


							{/* Route không có layout (ví dụ: trang chủ) */}
							<Route path="/" element={<HomePage />} />



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
					</BrowserRouter>
				</div>
			</PersistGate>
		</Provider>
	);
}
