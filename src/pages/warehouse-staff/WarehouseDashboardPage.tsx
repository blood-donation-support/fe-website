import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadWarehouseOverview } from "@/redux/slices/warehouseOverviewSlice";
import type { RootState, AppDispatch } from "@/redux/store";
import {
	PieChart,
	Pie,
	Cell,
	BarChart,
	Bar,
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	ResponsiveContainer,
	Legend,
} from "recharts";
import bloodComponentVN from "@/utils/translateBloodComponentVN";
import { format } from "date-fns";

export default function WarehouseDashboardPage() {
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		dispatch(loadWarehouseOverview());
	}, [dispatch]);

	const warehouseState = useSelector(
		(state: RootState) => state.warehouseOverview,
	);
	const { data, loading, error } = warehouseState;

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
				<div className="flex flex-col items-center space-y-4">
					<div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
					<div className="text-slate-600 font-medium">Đang tải dữ liệu...</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-50 to-red-50">
				<div className="bg-white border border-red-200 text-red-700 px-8 py-6 rounded-2xl shadow-lg max-w-md">
					<div className="flex items-center space-x-3">
						<div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
							<span className="text-red-600 text-sm font-bold">!</span>
						</div>
						<div>
							<div className="font-semibold">Có lỗi xảy ra</div>
							<div className="text-sm text-red-600 mt-1">{error}</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!data) return null;

	const {
		total_units,
		by_blood_type,
		by_component,
		expiring_soon,
		import_export_status,
		donations_per_month,
		blood_usage_per_month,
		donation_process_ratio,
		chart: { blood_import_export_per_day, expiring_per_month },
	} = data;

	const pieDataBloodType = Object.entries(by_blood_type).map(
		([name, value]) => ({ name, value }),
	);
	const barDataComponents = Object.entries(by_component).map(
		([component, count]) => ({
			component: bloodComponentVN(component),
			count,
		}),
	);
	const lineData = blood_import_export_per_day.map(
		({ date, imported, exported }) => ({ date, imported, exported }),
	);
	const barExpiringMonthly = expiring_per_month.map(
		({ month, expiring_units }) => ({ month, expiring_units }),
	);
	const donationData = donations_per_month.map(({ month, donations }) => ({
		month,
		donations,
	}));
	const usageData = blood_usage_per_month.map(({ month, units_used }) => ({
		month,
		unitsUsed: units_used,
	}));
	const processRatioData = Object.entries(donation_process_ratio).map(
		([status, count]) => ({
			status,
			count,
			name:
				status === "Pending"
					? "Chờ xử lý"
					: status === "Checked In" || status === "CheckedIn"
					? "Đã check-in"
					: status === "Approved"
					? "Đã duyệt"
					: "Từ chối",
		}),
	);
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
			{/* Header với gradient */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
					Dashboard Kho Máu
				</h1>
				<p className="text-slate-600">Tổng quan và thống kê hệ thống kho máu</p>
			</div>

			{/* Thẻ tóm tắt với gradient và icons */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
				<MetricCard
					title="Tổng đơn vị trong kho"
					value={total_units.toLocaleString()}
					gradient="from-blue-500 to-blue-600"
					icon="📦"
				/>
				<MetricCard
					title="Nhập hôm nay"
					value={import_export_status.today.imported.toString()}
					gradient="from-emerald-500 to-emerald-600"
					icon="📥"
				/>
				<MetricCard
					title="Xuất hôm nay"
					value={import_export_status.today.exported.toString()}
					gradient="from-rose-500 to-rose-600"
					icon="📤"
				/>
				<MetricCard
					title="Nhập tháng này"
					value={import_export_status.this_month.imported.toString()}
					gradient="from-violet-500 to-violet-600"
					icon="📈"
				/>
				<MetricCard
					title="Xuất tháng này"
					value={import_export_status.this_month.exported.toString()}
					gradient="from-amber-500 to-amber-600"
					icon="📊"
				/>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
				{/* Phân bố theo nhóm máu */}
				<ChartCard title="Phân bố theo nhóm máu" icon="🩸">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={pieDataBloodType}
								dataKey="value"
								nameKey="name"
								cx="50%"
								cy="50%"
								outerRadius={90}
								innerRadius={40}
								label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
								labelLine={false}
							>
								{pieDataBloodType.map((entry, idx) => (
									<Cell
										key={entry.name}
										fill={COLORS_BLOOD_TYPES[idx % COLORS_BLOOD_TYPES.length]}
									/>
								))}
							</Pie>
							<Tooltip
								formatter={(v: number) => [v.toLocaleString(), "Đơn vị"]}
								contentStyle={{
									backgroundColor: "white",
									border: "1px solid #e2e8f0",
									borderRadius: "12px",
									boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
								}}
							/>
							<Legend />
						</PieChart>
					</ResponsiveContainer>
				</ChartCard>

				{/* Tỷ lệ xử lý hiến máu */}
				<ChartCard title="Tỷ lệ xử lý hiến máu" icon="📋">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={processRatioData}
								dataKey="count"
								nameKey="name"
								cx="50%"
								cy="50%"
								outerRadius={90}
								innerRadius={40}
								label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
								labelLine={false}
							>
								{processRatioData.map((entry, idx) => (
									<Cell
										key={entry.status}
										fill={
											COLORS_PROCESS_RATIO[idx % COLORS_PROCESS_RATIO.length]
										}
									/>
								))}
							</Pie>
							<Tooltip
								formatter={(v: number) => [v.toLocaleString(), "Lượt"]}
								contentStyle={{
									backgroundColor: "white",
									border: "1px solid #e2e8f0",
									borderRadius: "12px",
									boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
								}}
							/>
							<Legend />
						</PieChart>
					</ResponsiveContainer>
				</ChartCard>

				{/* Đơn vị theo thành phần */}
				<ChartCard title="Đơn vị theo thành phần" icon="🧪">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={barDataComponents} margin={{ top: 20, bottom: 20 }}>
							<CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
							<XAxis
								dataKey="component"
								tick={{ fontSize: 12, fill: "#64748b" }}
								axisLine={{ stroke: "#e2e8f0" }}
							/>
							<YAxis
								tick={{ fontSize: 12, fill: "#64748b" }}
								axisLine={{ stroke: "#e2e8f0" }}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: "white",
									border: "1px solid #e2e8f0",
									borderRadius: "12px",
									boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
								}}
							/>
							<Bar dataKey="count" radius={[6, 6, 0, 0]}>
								{barDataComponents.map((_, idx) => (
									<Cell
										key={idx}
										fill={COLORS_COMPONENTS[idx % COLORS_COMPONENTS.length]}
									/>
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</ChartCard>

				{/* Lượng máu sử dụng theo tháng */}
				<ChartCard title="Lượng máu sử dụng theo tháng" icon="🏥">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={usageData} margin={{ top: 20, bottom: 20 }}>
							<CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
							<XAxis
								dataKey="month"
								tick={{ fontSize: 12, fill: "#64748b" }}
								axisLine={{ stroke: "#e2e8f0" }}
							/>
							<YAxis
								tick={{ fontSize: 12, fill: "#64748b" }}
								axisLine={{ stroke: "#e2e8f0" }}
							/>
							<Tooltip
								formatter={(v: number) => [
									v.toLocaleString(),
									"Đơn vị sử dụng",
								]}
								contentStyle={{
									backgroundColor: "white",
									border: "1px solid #e2e8f0",
									borderRadius: "12px",
									boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
								}}
							/>
							<Bar
								dataKey="unitsUsed"
								name="Đơn vị sử dụng"
								radius={[6, 6, 0, 0]}
								fill="#ef4444"
							/>
						</BarChart>
					</ResponsiveContainer>
				</ChartCard>

				{/* Nhập/Xuất theo ngày */}
				<ChartCard title="Nhập/Xuất theo ngày" icon="📈">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={lineData} margin={{ top: 20, bottom: 20 }}>
							<CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
							<XAxis
								dataKey="date"
								tick={{ fontSize: 12, fill: "#64748b" }}
								axisLine={{ stroke: "#e2e8f0" }}
							/>
							<YAxis
								tick={{ fontSize: 12, fill: "#64748b" }}
								axisLine={{ stroke: "#e2e8f0" }}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: "white",
									border: "1px solid #e2e8f0",
									borderRadius: "12px",
									boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
								}}
							/>
							<Legend />
							<Line
								type="monotone"
								dataKey="imported"
								name="Nhập"
								stroke="#10b981"
								strokeWidth={3}
								dot={{ r: 5 }}
								activeDot={{ r: 7 }}
							/>
							<Line
								type="monotone"
								dataKey="exported"
								name="Xuất"
								stroke="#ef4444"
								strokeWidth={3}
								dot={{ r: 5 }}
								activeDot={{ r: 7 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</ChartCard>

				{/* Lượt hiến máu theo tháng */}
				<ChartCard title="Lượt hiến máu theo tháng" icon="❤️">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={donationData} margin={{ top: 20, bottom: 20 }}>
							<CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
							<XAxis
								dataKey="month"
								tick={{ fontSize: 12, fill: "#64748b" }}
								axisLine={{ stroke: "#e2e8f0" }}
							/>
							<YAxis
								tick={{ fontSize: 12, fill: "#64748b" }}
								axisLine={{ stroke: "#e2e8f0" }}
							/>
							<Tooltip
								formatter={(v: number) => [v.toLocaleString(), "Lượt hiến"]}
								contentStyle={{
									backgroundColor: "white",
									border: "1px solid #e2e8f0",
									borderRadius: "12px",
									boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
								}}
							/>
							<Bar
								dataKey="donations"
								name="Lượt hiến máu"
								radius={[6, 6, 0, 0]}
								fill="#10b981"
							/>
						</BarChart>
					</ResponsiveContainer>
				</ChartCard>

				{/* Sắp hết hạn theo tháng */}
				<ChartCard title="Sắp hết hạn (theo tháng)" icon="⚠️">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={barExpiringMonthly}
							margin={{ top: 20, bottom: 20 }}
						>
							<CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
							<XAxis
								dataKey="month"
								tick={{ fontSize: 12, fill: "#64748b" }}
								axisLine={{ stroke: "#e2e8f0" }}
							/>
							<YAxis
								tick={{ fontSize: 12, fill: "#64748b" }}
								axisLine={{ stroke: "#e2e8f0" }}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: "white",
									border: "1px solid #e2e8f0",
									borderRadius: "12px",
									boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
								}}
							/>
							<Bar
								dataKey="expiring_units"
								name="Sắp hết hạn"
								radius={[6, 6, 0, 0]}
							>
								{barExpiringMonthly.map((_, idx) => (
									<Cell
										key={idx}
										fill={COLORS_MONTHLY[idx % COLORS_MONTHLY.length]}
									/>
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</ChartCard>
			</div>

			{/* Bảng túi sắp hết hạn */}
			<div className="mt-8">
				<div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
					<div className="flex items-center space-x-3 mb-6">
						<span className="text-2xl">⏰</span>
						<h2 className="text-xl font-bold text-slate-800">
							Danh sách túi sắp hết hạn
						</h2>
					</div>

				<div className="overflow-x-auto rounded-xl border border-slate-200">
	<table className="w-full">
		<thead>
			<tr className="bg-gradient-to-r from-slate-100 to-slate-200">
				<th className="p-4 text-center font-semibold text-slate-700 border-b border-slate-300">
					Mã túi
				</th>
				<th className="p-4 text-center font-semibold text-slate-700 border-b border-slate-300">
					Nhóm máu
				</th>
				<th className="p-4 text-center font-semibold text-slate-700 border-b border-slate-300">
					Thành phần
				</th>
				<th className="p-4 text-center font-semibold text-slate-700 border-b border-slate-300">
					Ngày hết hạn
				</th>
				<th className="p-4 text-center font-semibold text-slate-700 border-b border-slate-300">
					Còn lại (ngày)
				</th>
				{/* <th className="p-4 text-left font-semibold text-slate-700 border-b border-slate-300">
					Vị trí
				</th> */}
			</tr>
		</thead>
		<tbody>
			{expiring_soon.map((item, index) => (
				<tr
					key={item.blood_bag_id}
					className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
				>
					<td className="p-4 text-center font-mono text-sm">
						{item.blood_bag_id}
					</td>
					<td className="p-4 text-center">
						<span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
							{item.blood_group_name}
						</span>
					</td>
					<td className="p-4 text-center">
						<span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
							{bloodComponentVN(item.blood_component_name)}
						</span>
					</td>
					<td className="p-4 text-center text-sm text-slate-700">
						{item.expired_date
							? format(new Date(item.expired_date), "dd/MM/yyyy HH:mm")
							: "Chưa cập nhật"}
					</td>
					<td className="p-4 text-center">
						<span
							className={`px-3 py-1 rounded-full text-sm font-medium ${
								item.days_left <= 3
									? "bg-red-100 text-red-800"
									: item.days_left <= 7
									? "bg-yellow-100 text-yellow-800"
									: "bg-green-100 text-green-800"
							}`}
						>
							{item.days_left} ngày
						</span>
					</td>
					{/* <td className="p-4 text-slate-600">—</td> */}
				</tr>
			))}
		</tbody>
	</table>
</div>

				</div>
			</div>
		</div>
	);
}

const COLORS_BLOOD_TYPES = [
	"#ef4444",
	"#10b981",
	"#3b82f6",
	"#f59e0b",
	"#6366f1",
	"#8b5cf6",
	"#ec4899",
	"#14b8a6",
];

const COLORS_COMPONENTS = [
	"#f472b6",
	"#60a5fa",
	"#34d399",
	"#fbbf24",
	"#a78bfa",
];

const COLORS_MONTHLY = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

const COLORS_PROCESS_RATIO = ["#f59e0b", "#10b981", "#3b82f6", "#ef4444"];

type MetricCardProps = {
	title: string;
	value: string;
	gradient: string;
	icon: string;
};

const MetricCard = ({ title, value, gradient, icon }: MetricCardProps) => (
	<div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group">
		<div className="flex items-center justify-between mb-3">
			<div
				className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-300`}
			>
				{icon}
			</div>
		</div>
		<div className="text-sm text-slate-600 mb-1">{title}</div>
		<div className="text-2xl font-bold text-slate-800">{value}</div>
	</div>
);

type ChartCardProps = {
	title: string;
	icon: string;
	children: React.ReactNode;
};

const ChartCard = ({ title, icon, children }: ChartCardProps) => (
	<div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
		<div className="flex items-center space-x-3 mb-6">
			<span className="text-2xl">{icon}</span>
			<h2 className="text-lg font-bold text-slate-800">{title}</h2>
		</div>
		<div className="h-80">{children}</div>
	</div>
);
