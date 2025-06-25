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
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import { PrivateRoute, ScrollToTop } from "@/components";
import { DonateBloodPage, HomePage } from "@/pages";


export default function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<div className="w-full max-w-[100vw] overflow-x-hidden">
					<BrowserRouter>
						<ScrollToTop />
						<AnimatePresence mode="wait">

						<Routes >
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />


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
								</AnimatePresence>
					</BrowserRouter>
				</div>
			</PersistGate>
		</Provider>
	);
}
