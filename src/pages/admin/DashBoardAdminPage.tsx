import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadDashboardOverview } from "@/redux/slices/dashboardOverviewSlice";
import type { RootState, AppDispatch } from "@/redux/store";
import BloodDonationTable from "@/components/BloodDonationTable";
import {
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	ResponsiveContainer,
	Legend,
} from "recharts";
import {
	faDroplet,
	faUser,
	faUserTie,
	faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import bloodComponentVN from "@/utils/translateBloodComponentVN";
import statusVN from "@/utils/statusVN";
import genderVN from "@/utils/genderVN";
import roleVN from "@/utils/roleVN";
import type { DonationForm } from "@/types/dashboard";

const COLORS_REQUESTS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b"];
const COLORS_USERS = ["#10b981", "#3b82f6", "#ef4444"];
const COLORS_STAFF = ["#059669", "#dc2626"];

type RawDonationForm = {
	id: string;
	donor_name: string;
	blood_group_name: string;
	donation_type: string;
	register_date: string;
	status: string;
};
export default function DashBoardAdminPage() {
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		dispatch(loadDashboardOverview());
	}, [dispatch]);

	const overviewState = useSelector(
		(state: RootState) => state.dashboardOverview,
	);
	if (!overviewState)
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-pulse text-slate-600">
					Đang tải dữ liệu cửa hàng…
				</div>
			</div>
		);

	const { data: overview, loading, error } = overviewState;

	if (loading)
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-pulse text-slate-600">Đang tải…</div>
			</div>
		);
	if (error)
		return (
			<div className="flex items-center justify-center min-h-screen p-4">
				<div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl shadow-sm">
					Lỗi: {error}
				</div>
			</div>
		);
	if (!overview) return null;
	const { inventory, users, staff, donations, requests } = overview;

	const chartDataInventory = Object.entries(
		inventory.by_blood_component_name,
	).map(([component, units]) => ({
		component: bloodComponentVN(component),
		units,
	}));

	const chartDataDonationsStatus = Object.entries(donations.by_status).map(
		([status, count]) => ({
			status: statusVN(status),
			count,
		}),
	);

	const chartDataRequestsStatus = Object.entries(requests.by_status).map(
		([status, count]) => ({
			status: statusVN(status),
			count,
		}),
	);

	const chartDataUsersGender = Object.entries(users.by_gender).map(
		([gender, count]) => ({
			name: genderVN(gender),
			value: count,
		}),
	);

	const chartDataStaffRole = Object.entries(staff.by_role).map(
		([role, count]) => ({
			name: roleVN(role),
			value: count,
		}),
	);
	const rawForms: RawDonationForm[] = donations.recent_forms;

	const displayForms: DonationForm[] = rawForms.map(
		(item: RawDonationForm) => ({
			id: item.id,
			donorName: item.donor_name,
			bloodGroupName: item.blood_group_name,
			donationType: item.donation_type,
			registerDate: item.register_date,
			status: item.status,
		}),
	);
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
			{/* Header với gradient */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
					Dashboard Admin
				</h1>
				<p className="text-slate-600">Tổng quan và thống kê toàn bộ hệ thống</p>
			</div>

			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-6">
				<div className="flex flex-col gap-6">
					<div className="flex flex-row gap-6">
						{/* Bên trái: 2/3 chiều rộng */}
						<div className="w-2/3 space-y-6">
							{/* Thẻ tóm tắt */}
							<div className="grid grid-cols-2 gap-4">
								<Card
									className="group p-6 rounded-3xl shadow-sm bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100/50 text-slate-700 flex items-center gap-5 hover:shadow-lg hover:scale-[1.02] transition-all duration-500 ease-out backdrop-blur-sm"
									title="Tổng số đơn vị máu"
									value={formatBloodUnits(inventory.total)}
									icon={faDroplet}
									iconColor="text-rose-500"
									bgColor="bg-rose-100/70"
								/>
								<Card
									className="group p-6 rounded-3xl shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100/50 text-slate-700 flex items-center gap-5 hover:shadow-lg hover:scale-[1.02] transition-all duration-500 ease-out backdrop-blur-sm"
									title="Tổng số người dùng"
									value={users.total.toLocaleString()}
									icon={faUser}
									iconColor="text-emerald-500"
									bgColor="bg-emerald-100/70"
								/>
								<Card
									className="group p-6 rounded-3xl shadow-sm bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100/50 text-slate-700 flex items-center gap-5 hover:shadow-lg hover:scale-[1.02] transition-all duration-500 ease-out backdrop-blur-sm"
									title="Tổng số nhân viên"
									value={staff.total.toLocaleString()}
									icon={faUserTie}
									iconColor="text-blue-500"
									bgColor="bg-blue-100/70"
								/>
								<Card
									className="group p-6 rounded-3xl shadow-sm bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100/50 text-slate-700 flex items-center gap-5 hover:shadow-lg hover:scale-[1.02] transition-all duration-500 ease-out backdrop-blur-sm"
									title="Tổng số lần hiến"
									value={donations.total.toLocaleString()}
									icon={faCalendarCheck}
									iconColor="text-violet-500"
									bgColor="bg-violet-100/70"
								/>
							</div>

							{/* Đơn vị máu theo thành phần */}
							<div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-white/50 hover:shadow-md transition-all duration-300">
								<div className="flex justify-between items-center mb-6">
									<h2 className="text-xl font-semibold text-slate-800 flex items-center gap-3">
										<div className="w-2 h-6 bg-gradient-to-b from-rose-400 to-rose-600 rounded-full"></div>
										Đơn vị máu theo thành phần
									</h2>
								</div>
								<div className="h-80 -mx-2 bg-gradient-to-br from-rose-50/50 to-pink-50/50 rounded-3xl p-4 border border-rose-100/30">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart
											data={chartDataInventory}
											margin={{ left: 10, right: 20, top: 20, bottom: 20 }}
										>
											<defs>
												<linearGradient
													id="bloodGradient"
													x1="0"
													y1="0"
													x2="0"
													y2="1"
												>
													<stop offset="0%" stopColor="#f43f5e" />
													<stop offset="100%" stopColor="#dc2626" />
												</linearGradient>
											</defs>
											<CartesianGrid
												strokeDasharray="3 3"
												stroke="#f1f5f9"
												vertical={false}
											/>
											<XAxis
												dataKey="component"
												tick={{ fill: "#64748b", fontSize: 12 }}
											/>
											<YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
											<Tooltip
												formatter={(value: number) => [
													formatBloodUnits(value),
													"Đơn vị",
												]}
												contentStyle={{
													backgroundColor: "rgba(255, 255, 255, 0.95)",
													border: "1px solid #e2e8f0",
													borderRadius: "16px",
													boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
												}}
											/>
											<Bar
												dataKey="units"
												fill="url(#bloodGradient)"
												radius={[8, 8, 0, 0]}
											/>
										</BarChart>
									</ResponsiveContainer>
								</div>
							</div>

							{/* Lượt hiến theo trạng thái */}
							<div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-white/50">
								<div className="flex justify-between items-center mb-6">
									<h2 className="text-xl font-semibold text-slate-800 flex items-center gap-3">
										<div className="w-2 h-6 bg-gradient-to-b from-violet-400 to-purple-600 rounded-full"></div>
										Lượt hiến theo trạng thái
									</h2>
								</div>
								<div className="h-64 -ml-2 rounded-3xl bg-gradient-to-br from-violet-50/50 to-purple-50/50 p-4 border border-violet-100/30">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart
											data={chartDataDonationsStatus}
											margin={{ top: 20, bottom: 20 }}
										>
											<defs>
												<linearGradient
													id="donationGradient"
													x1="0"
													y1="0"
													x2="0"
													y2="1"
												>
													<stop offset="0%" stopColor="#8b5cf6" />
													<stop offset="100%" stopColor="#7c3aed" />
												</linearGradient>
											</defs>
											<CartesianGrid
												strokeDasharray="3 3"
												stroke="#f1f5f9"
												vertical={false}
											/>
											<XAxis
												dataKey="status"
												tick={{ fill: "#64748b", fontSize: 12 }}
											/>
											<YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
											<Tooltip
												formatter={(value: number) => [
													value.toLocaleString(),
													"Lần hiến",
												]}
												contentStyle={{
													backgroundColor: "rgba(255, 255, 255, 0.95)",
													border: "1px solid #e2e8f0",
													borderRadius: "16px",
													boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
												}}
											/>
											<Bar
												dataKey="count"
												fill="url(#donationGradient)"
												radius={[8, 8, 0, 0]}
											/>
										</BarChart>
									</ResponsiveContainer>
								</div>
								<div className="mt-6 grid grid-cols-2 gap-4 text-sm">
									{chartDataDonationsStatus.map((item) => (
										<div
											key={item.status}
											className="bg-gradient-to-r from-violet-50 to-purple-50 p-4 rounded-2xl border border-violet-100/50 hover:shadow-sm transition-all duration-300"
										>
											<div className="font-medium text-slate-600">
												{item.status}
											</div>
											<div className="text-lg font-bold text-violet-600 mt-1">
												{item.count.toLocaleString()}
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Bảng mẫu hiến gần đây */}
							<div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-white/50">
								<div className="flex justify-between items-center mb-6">
									<h2 className="text-xl font-semibold text-slate-800 flex items-center gap-3">
										<div className="w-2 h-6 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
										Mẫu hiến gần đây
									</h2>
								</div>
								<div className="rounded-2xl overflow-hidden border border-slate-100">
									<BloodDonationTable data={displayForms} />
								</div>
							</div>
						</div>

						{/* Bên phải: 1/3 chiều rộng */}
						<div className="w-1/3 space-y-6">
							{/* Yêu cầu theo trạng thái */}
							<div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-white/50">
								<div className="flex justify-between items-center mb-6">
									<h2 className="text-lg font-semibold text-slate-800 flex items-center gap-3">
										<div className="w-2 h-5 bg-gradient-to-b from-indigo-400 to-indigo-600 rounded-full"></div>
										Yêu cầu theo trạng thái
									</h2>
								</div>
								<div className="h-52 mb-6 bg-gradient-to-br from-indigo-50/30 to-blue-50/30 rounded-2xl p-2">
									<ResponsiveContainer width="100%" height="100%">
										<PieChart>
											<Pie
												data={chartDataRequestsStatus}
												cx="50%"
												cy="50%"
												innerRadius={45}
												outerRadius={85}
												paddingAngle={2}
												dataKey="count"
											>
												{chartDataRequestsStatus.map((entry, idx) => (
													<Cell
														key={`cell-req-${idx}`}
														fill={COLORS_REQUESTS[idx % COLORS_REQUESTS.length]}
													/>
												))}
											</Pie>
											<Tooltip
												formatter={(value: number) => [value, "Yêu cầu"]}
												contentStyle={{
													backgroundColor: "rgba(255, 255, 255, 0.95)",
													border: "1px solid #e2e8f0",
													borderRadius: "12px",
													fontSize: "14px",
												}}
											/>
											<Legend />
										</PieChart>
									</ResponsiveContainer>
								</div>
								<div className="space-y-3 text-sm">
									{chartDataRequestsStatus.map((item, idx) => (
										<div
											key={item.status}
											className="flex justify-between items-center p-3 bg-gradient-to-r from-slate-50 to-slate-50/50 rounded-xl border border-slate-100"
										>
											<div className="flex items-center gap-3">
												<div
													className="w-3 h-3 rounded-full"
													style={{
														backgroundColor:
															COLORS_REQUESTS[idx % COLORS_REQUESTS.length],
													}}
												></div>
												<span className="text-slate-600 font-medium">
													{item.status}
												</span>
											</div>
											<span className="font-bold text-slate-700">
												{item.count.toLocaleString()}
											</span>
										</div>
									))}
								</div>
							</div>

							{/* Người dùng theo giới tính */}
							<div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-white/50">
								<div className="flex justify-between items-center mb-6">
									<h2 className="text-lg font-semibold text-slate-800 flex items-center gap-3">
										<div className="w-2 h-5 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full"></div>
										Người dùng theo giới tính
									</h2>
								</div>
								<div className="text-center mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100/50">
									<div className="text-3xl font-bold text-slate-700">
										{users.total.toLocaleString()}
									</div>
									<div className="text-sm text-slate-500 font-medium">
										Tổng số người dùng
									</div>
								</div>
								<div className="h-52 mb-4 bg-gradient-to-br from-emerald-50/30 to-teal-50/30 rounded-2xl p-2">
									<ResponsiveContainer width="100%" height="100%">
										<PieChart>
											<Pie
												data={chartDataUsersGender}
												cx="50%"
												cy="50%"
												innerRadius={45}
												outerRadius={85}
												paddingAngle={2}
												dataKey="value"
											>
												{chartDataUsersGender.map((entry, idx) => (
													<Cell
														key={`cell-user-${idx}`}
														fill={COLORS_USERS[idx % COLORS_USERS.length]}
													/>
												))}
											</Pie>
											<Tooltip
												contentStyle={{
													backgroundColor: "rgba(255, 255, 255, 0.95)",
													border: "1px solid #e2e8f0",
													borderRadius: "12px",
													fontSize: "14px",
												}}
											/>
											<Legend />
										</PieChart>
									</ResponsiveContainer>
								</div>
							</div>

							{/* Nhân viên theo vai trò */}
							<div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-white/50">
								<div className="flex justify-between items-center mb-6">
									<h2 className="text-lg font-semibold text-slate-800 flex items-center gap-3">
										<div className="w-2 h-5 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
										Nhân viên theo vai trò
									</h2>
								</div>
								<div className="text-center mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100/50">
									<div className="text-3xl font-bold text-slate-700">
										{staff.total.toLocaleString()}
									</div>
									<div className="text-sm text-slate-500 font-medium">
										Tổng số nhân viên
									</div>
								</div>
								<div className="h-52 mb-4 bg-gradient-to-br from-blue-50/30 to-cyan-50/30 rounded-2xl p-2">
									<ResponsiveContainer width="100%" height="100%">
										<PieChart>
											<Pie
												data={chartDataStaffRole}
												cx="50%"
												cy="50%"
												innerRadius={45}
												outerRadius={85}
												paddingAngle={2}
												dataKey="value"
											>
												{chartDataStaffRole.map((entry, idx) => (
													<Cell
														key={`cell-staff-${idx}`}
														fill={COLORS_STAFF[idx % COLORS_STAFF.length]}
													/>
												))}
											</Pie>
											<Tooltip
												formatter={(value: number) => [value, "Nhân viên"]}
												contentStyle={{
													backgroundColor: "rgba(255, 255, 255, 0.95)",
													border: "1px solid #e2e8f0",
													borderRadius: "12px",
													fontSize: "14px",
												}}
											/>
											<Legend />
										</PieChart>
									</ResponsiveContainer>
								</div>
							</div>

							{/* Sắp hết hạn */}
							<div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-white/50">
								<div className="flex justify-between items-center mb-6">
									<h2 className="text-lg font-semibold text-slate-800 flex items-center gap-3">
										<div className="w-2 h-5 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full"></div>
										Sắp hết hạn
									</h2>
								</div>
								<div className="space-y-3">
									{inventory.expiring_soon.map((item) => (
										<div
											key={item.blood_bag_id}
											className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100/50 hover:shadow-sm transition-all duration-300"
										>
											<div className="flex justify-between items-start text-sm">
												<div className="flex-1 mr-3">
													<div className="font-semibold text-slate-700 mb-1">
														{item.blood_bag_id}
													</div>
													<div className="text-slate-500 text-xs">
														{bloodComponentVN(item.blood_component_name)} •{" "}
														{item.blood_group_name}
													</div>
												</div>
												<div className="text-right">
													<div className="font-bold text-orange-600">
														{item.days_left}
													</div>
													<div className="text-xs text-slate-500">ngày</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

const formatBloodUnits = (value: number) => {
	if (value >= 1_000_000) {
		return `${(value / 1_000_000).toFixed(1)}M đơn vị`;
	} else if (value >= 1_000) {
		return `${(value / 1_000).toFixed(1)}K đơn vị`;
	}
	return `${value} đơn vị`;
};

const Card = ({
	className,
	title,
	value,
	icon,
	iconColor = "text-slate-500",
	bgColor = "bg-slate-100/70",
	...props
}: {
	className?: string;
	title: string;
	value: string;
	icon: any;
	iconColor?: string;
	bgColor?: string;
	[key: string]: any;
}) => (
	<div className={className} {...props}>
		<div className="flex items-center gap-5">
			<div
				className={`p-4 ${bgColor} rounded-2xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}
			>
				<FontAwesomeIcon icon={icon} className={`text-2xl ${iconColor}`} />
			</div>
			<div className="flex-1">
				<div className="text-sm font-medium text-slate-600 mb-1">{title}</div>
				<div className="text-2xl font-bold text-slate-800">{value}</div>
			</div>
		</div>
	</div>
);
