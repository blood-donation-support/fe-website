import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import {
	Eye,
	AlertTriangle,
	Heart,
	Activity,
	Thermometer,
	User,
	Phone,
	CreditCard,
} from "lucide-react";
import { fetchDoctorRequests } from "@/api/doctorRequestService";
import { fetchRequestHealthProcess } from "@/api/requestHealthProcessService";
import type { DoctorRequest } from "@/api/doctorRequestService";
import type { RequestHealthProcess } from "@/api/requestHealthProcessService";
import bloodComponentVN from "@/utils/translateBloodComponentVN";

// Utility functions
const formatDateTime = (dateString: string) => {
	if (!dateString) return "Chưa cập nhật";
	const date = new Date(dateString);
	const options = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	} as const;
	return date.toLocaleString("vi-VN", options);
};

const statusVN = (status: string) => {
	const statusMap = {
		Pending: "Chờ duyệt",
		Approved: "Đã duyệt",
		Completed: "Hoàn thành",
		Rejected: "Từ chối",
	};
	return statusMap[status as keyof typeof statusMap] || status;
};

const requestTypeVN = (type: string) => {
	const typeMap = {
		Surgery: "Phẫu thuật",
		Treatment: "Điều trị",
		Emergency: "Cấp cứu",
		Transfusion: "Truyền máu",
	};
	return typeMap[type as keyof typeof typeMap] || type;
};

export default function RequestRegistrationsPage() {
	const [requests, setRequests] = useState<DoctorRequest[]>([]);
	const [filtered, setFiltered] = useState<DoctorRequest[]>([]);
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [emergencyFilter, setEmergencyFilter] = useState<string>("all");
	const [bloodGroupFilter, setBloodGroupFilter] = useState<string>("all");
	const [requestTypeFilter, setRequestTypeFilter] = useState<string>("all");
	const [searchText, setSearchText] = useState<string>("");
	const [selectedRequest, setSelectedRequest] = useState<DoctorRequest | null>(
		null,
	);
	const [healthProcessData, setHealthProcessData] =
		useState<RequestHealthProcess | null>(null);
	const [openDetail, setOpenDetail] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				const data = await fetchDoctorRequests();
				// Sort by request date, newest first
				const sorted = data.sort(
					(a, b) =>
						new Date(b.receive_date_request).getTime() -
						new Date(a.receive_date_request).getTime(),
				);
				setRequests(sorted);
				setFiltered(sorted);
			} catch (err) {
				console.error("Lỗi khi tải yêu cầu:", err);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const requestTypes = React.useMemo(
		() =>
			Array.from(
				new Set(
					requests
						.map((r) => r.request_type)
						.filter((t): t is string => Boolean(t)),
				),
			),
		[requests],
	);

	const bloodGroups = React.useMemo(
		() =>
			Array.from(
				new Set(
					requests
						.map((r) => r.blood_group_name)
						.filter((bg): bg is string => Boolean(bg)),
				),
			),
		[requests],
	);

	useEffect(() => {
		let curr = requests;

		if (statusFilter !== "all") {
			curr = curr.filter((r) => r.status === statusFilter);
		}
		if (emergencyFilter !== "all") {
			const isEmergency = emergencyFilter === "emergency";
			curr = curr.filter((r) => r.is_emergency === isEmergency);
		}
		if (bloodGroupFilter !== "all") {
			curr = curr.filter((r) => r.blood_group_name === bloodGroupFilter);
		}
		if (requestTypeFilter !== "all") {
			curr = curr.filter((r) => r.request_type === requestTypeFilter);
		}
		if (searchText.trim()) {
			const txt = searchText.toLowerCase();
			curr = curr.filter(
				(r) =>
					r.full_name?.toLowerCase().includes(txt) ||
					r.phone?.toLowerCase().includes(txt) ||
					r.citizen_id_number?.toLowerCase().includes(txt),
			);
		}

		setFiltered(curr);
	}, [
		requests,
		statusFilter,
		emergencyFilter,
		bloodGroupFilter,
		requestTypeFilter,
		searchText,
	]);

	const handleViewDetail = async (requestId: string) => {
		try {
			setLoading(true);
			const request = requests.find((r) => r._id === requestId);
			if (request) {
				const healthProcessList = await fetchRequestHealthProcess(requestId);

				setSelectedRequest(request);
				setHealthProcessData(healthProcessList[0] || null); // Get the first record
				setOpenDetail(true);
			}
		} catch (err) {
			console.error("Lỗi khi tải chi tiết:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
			<Card className="border-0 mb-8 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
					<CardTitle className="text-2xl text-center font-bold">
						Danh sách yêu cầu máu
					</CardTitle>
				</CardHeader>
				<CardContent className="p-6 space-y-6">
					{/* Enhanced Filter Section */}
					<Card className="border-0 mb-8 overflow-hidden">
						<div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1"></div>
						<CardContent className="p-6">
							<div className="space-y-6">
								{/* Search */}
								<div className="space-y-3">
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-purple-500 rounded-full" />
										<label className="text-sm font-semibold text-gray-700 tracking-wide">
											TÌM KIẾM
										</label>
									</div>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
											<svg
												className="h-5 w-5 text-gray-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
												/>
											</svg>
										</div>
										<Input
											placeholder="Tìm theo tên, SĐT hoặc CCCD..."
											value={searchText}
											onChange={(e) => setSearchText(e.target.value)}
											className="w-full h-12 pl-12 pr-4 bg-white border-gray-200 rounded-xl shadow-sm hover:border-gray-300 hover:shadow-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
										/>
										{searchText && (
											<button
												onClick={() => setSearchText("")}
												className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
											>
												<svg
													className="h-4 w-4"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M6 18L18 6M6 6l12 12"
													/>
												</svg>
											</button>
										)}
									</div>
								</div>

								{/* Filters */}
								<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
									{/* Status Filter */}
									<div className="space-y-3">
										<div className="flex items-center gap-2">
											<div className="w-2 h-2 bg-emerald-500 rounded-full" />
											<label className="text-sm font-semibold text-gray-700 tracking-wide">
												TRẠNG THÁI
											</label>
										</div>
										<Select
											value={statusFilter}
											onValueChange={setStatusFilter}
										>
                                            <SelectTrigger className="w-full h-12 bg-white border-gray-200 rounded-xl shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
												<SelectValue placeholder="Tất cả trạng thái" />
											</SelectTrigger>
											<SelectContent className="rounded-xl border-gray-200 shadow-xl">
												<SelectItem value="all">Tất cả</SelectItem>
												<SelectItem value="Pending">Chờ duyệt</SelectItem>
												<SelectItem value="Approved">Đã duyệt</SelectItem>
												<SelectItem value="Completed">Hoàn thành</SelectItem>
												<SelectItem value="Rejected">Từ chối</SelectItem>
											</SelectContent>
										</Select>
									</div>

									{/* Emergency Filter */}
									<div className="space-y-3">
										<div className="flex items-center gap-2">
											<div className="w-2 h-2 bg-orange-500 rounded-full" />
											<label className="text-sm font-semibold text-gray-700 tracking-wide">
												TÌNH TRẠNG
											</label>
										</div>
										<Select
											value={emergencyFilter}
											onValueChange={setEmergencyFilter}
										>
											<SelectTrigger className="w-full h-12 bg-white border-gray-200 rounded-xl shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500">
												<SelectValue placeholder="Tất cả tình trạng" />
											</SelectTrigger>
											<SelectContent className="rounded-xl border-gray-200 shadow-xl">
												<SelectItem value="all">Tất cả</SelectItem>
												<SelectItem value="emergency">Khẩn cấp</SelectItem>
												<SelectItem value="normal">Bình thường</SelectItem>
											</SelectContent>
										</Select>
									</div>

									{/* Request Type Filter */}
									<div className="space-y-3">
										<div className="flex items-center gap-2">
											<div className="w-2 h-2 bg-pink-500 rounded-full" />
											<label className="text-sm font-semibold text-gray-700 tracking-wide">
												LOẠI YÊU CẦU
											</label>
										</div>
										<Select
											value={requestTypeFilter}
											onValueChange={setRequestTypeFilter}
										>
											<SelectTrigger className="w-full h-12 bg-white border-gray-200 rounded-xl shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500">
												<SelectValue placeholder="Tất cả loại yêu cầu" />
											</SelectTrigger>
											<SelectContent className="rounded-xl border-gray-200 shadow-xl">
												<SelectItem value="all">Tất cả</SelectItem>
												{requestTypes.map((type) => (
													<SelectItem key={type} value={type}>
														{requestTypeVN(type)}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									{/* Blood Group Filter */}
									<div className="space-y-3">
										<div className="flex items-center gap-2">
											<div className="w-2 h-2 bg-red-500 rounded-full" />
											<label className="text-sm font-semibold text-gray-700 tracking-wide">
												NHÓM MÁU
											</label>
										</div>
										<Select
											value={bloodGroupFilter}
											onValueChange={setBloodGroupFilter}
										>
											<SelectTrigger className="w-full h-12 bg-white border-gray-200 rounded-xl shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500">
												<SelectValue placeholder="Tất cả nhóm máu" />
											</SelectTrigger>
											<SelectContent className="rounded-xl border-gray-200 shadow-xl">
												<SelectItem value="all">Tất cả</SelectItem>
												{bloodGroups.map((group) => (
													<SelectItem key={group} value={group}>
														{group}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>

								{/* Active Filters Display */}
								{(statusFilter !== "all" ||
									emergencyFilter !== "all" ||
									requestTypeFilter !== "all" ||
									bloodGroupFilter !== "all" ||
									searchText) && (
									<div className="pt-4 border-t border-gray-100">
										<span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
											Bộ lọc đang áp dụng
										</span>
										<div className="flex flex-wrap gap-2 mt-2">
											{statusFilter !== "all" && (
												<span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full border border-emerald-200">
													Trạng thái: {statusVN(statusFilter)}
												</span>
											)}
											{emergencyFilter !== "all" && (
												<span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 text-sm rounded-full border border-orange-200">
													Tình trạng:{" "}
													{emergencyFilter === "emergency"
														? "Khẩn cấp"
														: "Bình thường"}
												</span>
											)}
											{requestTypeFilter !== "all" && (
												<span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-50 text-pink-700 text-sm rounded-full border border-pink-200">
													Loại yêu cầu: {requestTypeVN(requestTypeFilter)}
												</span>
											)}
											{bloodGroupFilter !== "all" && (
												<span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 text-sm rounded-full border border-red-200">
													Nhóm máu: {bloodGroupFilter}
												</span>
											)}
											{searchText && (
												<span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full border border-purple-200">
													Tìm kiếm: "{searchText}"
												</span>
											)}
										</div>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Data Table */}
					<div className="rounded-2xl overflow-hidden shadow-lg border">
						<table className="w-full">
							<thead className="bg-gradient-to-r from-blue-600 to-purple-600">
								<tr>
									<th className="text-white font-semibold px-6 py-4 text-left">
										STT
									</th>
									<th className="text-white font-semibold px-6 py-4 text-left">
										Họ tên
									</th>
									<th className="text-white font-semibold px-6 py-4 text-left">
										SĐT
									</th>
									<th className="text-white font-semibold px-6 py-4 text-left">
										Nhóm máu
									</th>
									<th className="text-white font-semibold px-6 py-4 text-left">
										Loại yêu cầu
									</th>
									<th className="text-white font-semibold px-6 py-4 text-left">
										Ngày cần
									</th>
									<th className="text-white font-semibold px-6 py-4 text-left">
										Tình trạng
									</th>
									<th className="text-white font-semibold px-6 py-4 text-left">
										Trạng thái
									</th>
									<th className="text-white font-semibold px-6 py-4 text-center">
										Thao tác
									</th>
								</tr>
							</thead>
							<tbody>
								{ filtered.length > 0 ? (
									filtered.map((r, i) => (
										<tr
											key={r._id}
											className={`hover:bg-red-50 transition-all ${
												i % 2 === 0 ? "bg-white" : "bg-gray-50"
											}`}
										>
											<td className="px-6 py-4 font-medium text-gray-900">
												{i + 1}
											</td>
											<td className="px-6 py-4 font-medium text-gray-900">
												{r.full_name || "Chưa cập nhật"}
											</td>
											<td className="px-6 py-4 text-gray-600">
												{r.phone || "Chưa cập nhật"}
											</td>
											<td className="px-6 py-4">
												<span className="font-medium text-red-600">
													{r.blood_group_name || "Chưa cập nhật"}
												</span>
											</td>
											<td className="px-6 py-4 text-gray-600">
												{requestTypeVN(r.request_type || "Chưa cập nhật")}
											</td>
											<td className="px-6 py-4 text-gray-600">
												{formatDateTime(r.receive_date_request)}
											</td>
											<td className="px-6 py-4">
												{r.is_emergency ? (
													<span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
														<AlertTriangle size={12} />
														Khẩn cấp
													</span>
												) : (
													<span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
														Bình thường
													</span>
												)}
											</td>
											<td className="px-6 py-4">
												<span
													className={`px-3 py-1 rounded-full text-xs font-medium ${
														r.status === "Approved"
															? "bg-green-100 text-green-800"
															: r.status === "Rejected"
															? "bg-red-100 text-red-800"
															: r.status === "Completed"
															? "bg-blue-100 text-blue-800"
															: "bg-yellow-100 text-yellow-800"
													}`}
												>
													{statusVN(r.status) || "Chưa cập nhật"}
												</span>
											</td>
											<td className="px-6 py-4 text-center">
												<Button
													variant="outline"
													size="sm"
													className="rounded-lg border-blue-200 text-blue-600 hover:bg-red-50"
													onClick={() => handleViewDetail(r._id)}
													disabled={loading}
												>
													<Eye size={16} />
												</Button>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={9} className="text-center py-8 text-gray-500">
											Không tìm thấy dữ liệu phù hợp với bộ lọc hiện tại
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>

			{/* Detail Modal */}
			<Dialog open={openDetail} onOpenChange={setOpenDetail}>
				<DialogContent className="max-w-5xl rounded-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold text-gray-800 mb-4">
							Chi tiết yêu cầu máu và kiểm tra sức khỏe
						</DialogTitle>
						<DialogDescription className="text-gray-600">
							Thông tin chi tiết về yêu cầu máu và kết quả kiểm tra sức khỏe.
						</DialogDescription>
					</DialogHeader>

					{selectedRequest && (
						<div className="space-y-6">
							{/* Request Info Section */}
							<div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6">
								<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
									<div className="w-2 h-6 bg-gradient-to-b from-red-500 to-pink-500 rounded-full mr-3"></div>
									Thông tin yêu cầu
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div className="bg-white rounded-xl p-4 shadow-sm">
										<label className="text-sm font-medium text-gray-500 flex items-center gap-2">
											<User size={14} />
											Họ tên bệnh nhân
										</label>
										<p className="text-lg font-semibold text-gray-900 mt-1">
											{selectedRequest.full_name || "Chưa cập nhật"}
										</p>
									</div>
									<div className="bg-white rounded-xl p-4 shadow-sm">
										<label className="text-sm font-medium text-gray-500 flex items-center gap-2">
											<CreditCard size={14} />
											CCCD
										</label>
										<p className="text-lg text-gray-900 mt-1">
											{selectedRequest.citizen_id_number || "Chưa cập nhật"}
										</p>
									</div>
									<div className="bg-white rounded-xl p-4 shadow-sm">
										<label className="text-sm font-medium text-gray-500 flex items-center gap-2">
											<Phone size={14} />
											SĐT
										</label>
										<p className="text-lg text-gray-900 mt-1">
											{selectedRequest.phone || "Chưa cập nhật"}
										</p>
									</div>
									<div className="bg-white rounded-xl p-4 shadow-sm">
										<label className="text-sm font-medium text-gray-500 flex items-center gap-2">
											<Heart size={14} />
											Nhóm máu cần
										</label>
										<p className="text-lg font-semibold text-red-600 mt-1">
											{selectedRequest.blood_group_name || "Chưa cập nhật"}
										</p>
									</div>
									<div className="bg-white rounded-xl p-4 shadow-sm">
										<label className="text-sm font-medium text-gray-500">
											Loại yêu cầu
										</label>
										<p className="text-lg font-semibold text-blue-600 mt-1">
											{bloodComponentVN(selectedRequest.request_type || "") ||
												"Chưa cập nhật"}
										</p>
									</div>
									<div className="bg-white rounded-xl p-4 shadow-sm">
										<label className="text-sm font-medium text-gray-500">
											Ngày cần máu
										</label>
										<p className="text-lg text-gray-900 mt-1">
											{formatDateTime(selectedRequest.receive_date_request)}
										</p>
									</div>
									<div className="bg-white rounded-xl p-4 shadow-sm">
										<label className="text-sm font-medium text-gray-500">
											Tình trạng
										</label>
										<div className="mt-2">
											{selectedRequest.is_emergency ? (
												<span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
													<AlertTriangle size={14} />
													Khẩn cấp
												</span>
											) : (
												<span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
													Bình thường
												</span>
											)}
										</div>
									</div>
									<div className="bg-white rounded-xl p-4 shadow-sm">
										<label className="text-sm font-medium text-gray-500">
											Trạng thái
										</label>
										<div className="mt-2">
											<span
												className={`px-3 py-1 rounded-full text-sm font-medium ${
													selectedRequest.status === "Approved"
														? "bg-green-100 text-green-800"
														: selectedRequest.status === "Rejected"
														? "bg-red-100 text-red-800"
														: selectedRequest.status === "Completed"
														? "bg-blue-100 text-blue-800"
														: "bg-yellow-100 text-yellow-800"
												}`}
											>
												{statusVN(selectedRequest.status)}
											</span>
										</div>
									</div>
									{selectedRequest.note && (
										<div className="bg-white rounded-xl p-4 shadow-sm md:col-span-3">
											<label className="text-sm font-medium text-gray-500">
												Ghi chú
											</label>
											<p className="text-lg text-gray-900 mt-1">
												{selectedRequest.note}
											</p>
										</div>
									)}
								</div>
							</div>

							{/* Health Process Section */}
							{healthProcessData && (
								<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
									<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
										<div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full mr-3"></div>
										Thông tin kiểm tra sức khỏe
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												Cân nặng (kg)
											</label>
											<p className="text-lg font-semibold text-blue-600 mt-1">
												{healthProcessData.weight || "Chưa cập nhật"}
											</p>
										</div>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500 flex items-center gap-2">
												<Thermometer size={14} />
												Nhiệt độ (°C)
											</label>
											<p className="text-lg font-semibold text-orange-600 mt-1">
												{healthProcessData.temperature || "Chưa cập nhật"}
											</p>
										</div>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500 flex items-center gap-2">
												<Activity size={14} />
												Nhịp tim (bpm)
											</label>
											<p className="text-lg font-semibold text-green-600 mt-1">
												{healthProcessData.heart_rate || "Chưa cập nhật"}
											</p>
										</div>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												Huyết áp tâm thu (mmHg)
											</label>
											<p className="text-lg font-semibold text-red-600 mt-1">
												{healthProcessData.systolic_blood_pressure ||
													"Chưa cập nhật"}
											</p>
										</div>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												Huyết áp tâm trương (mmHg)
											</label>
											<p className="text-lg font-semibold text-red-600 mt-1">
												{healthProcessData.diastolic_blood_pressure ||
													"Chưa cập nhật"}
											</p>
										</div>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												Hemoglobin (g/dL)
											</label>
											<p className="text-lg font-semibold text-purple-600 mt-1">
												{healthProcessData.hemoglobin || "Chưa cập nhật"}
											</p>
										</div>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												Nhóm máu
											</label>
											<p className="text-lg font-semibold text-red-600 mt-1">
												{healthProcessData.blood_group || "Chưa cập nhật"}
											</p>
										</div>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												Trạng thái sức khỏe
											</label>
											<div className="mt-2">
												<span
													className={`px-3 py-1 rounded-full text-sm font-medium ${
														healthProcessData.status === "Approved"
															? "bg-green-100 text-green-800"
															: healthProcessData.status === "Rejected"
															? "bg-red-100 text-red-800"
															: "bg-yellow-100 text-yellow-800"
													}`}
												>
													{statusVN(healthProcessData.status)}
												</span>
											</div>
										</div>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												Ngày kiểm tra
											</label>
											<p className="text-lg text-gray-900 mt-1">
												{formatDateTime(healthProcessData.created_at)}
											</p>
										</div>
										{healthProcessData.blood_components &&
											healthProcessData.blood_components.length > 0 && (
												<div className="bg-white rounded-xl p-4 shadow-sm md:col-span-3">
													<label className="text-sm font-medium text-gray-500">
														Thành phần máu cần
													</label>
													<div className="flex flex-wrap gap-2 mt-2">
														{healthProcessData.blood_components.map(
															(component, index) => (
																<span
																	key={index}
																	className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
																>
																	{component}
																</span>
															),
														)}
													</div>
												</div>
											)}
										{healthProcessData.underlying_health_condition &&
											healthProcessData.underlying_health_condition.length >
												0 && (
												<div className="bg-white rounded-xl p-4 shadow-sm md:col-span-3">
													<label className="text-sm font-medium text-gray-500">
														Tình trạng sức khỏe nền
													</label>
													<div className="flex flex-wrap gap-2 mt-2">
														{healthProcessData.underlying_health_condition.map(
															(condition, index) => (
																<span
																	key={index}
																	className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
																>
																	{condition}
																</span>
															),
														)}
													</div>
												</div>
											)}
										{healthProcessData.description && (
											<div className="bg-white rounded-xl p-4 shadow-sm md:col-span-3">
												<label className="text-sm font-medium text-gray-500">
													Mô tả chi tiết
												</label>
												<p className="text-lg text-gray-900 mt-1">
													{healthProcessData.description}
												</p>
											</div>
										)}
									</div>
								</div>
							)}

							{/* System Info Section */}
							<div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6">
								<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
									<div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full mr-3"></div>
									Thông tin hệ thống
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="bg-white rounded-xl p-4 shadow-sm">
										<label className="text-sm font-medium text-gray-500">
											ID Yêu cầu
										</label>
										<p className="text-sm text-gray-600 font-mono">
											{selectedRequest._id}
										</p>
									</div>
									<div className="bg-white rounded-xl p-4 shadow-sm">
										<label className="text-sm font-medium text-gray-500">
											Ngày tạo yêu cầu
										</label>
										<p className="text-lg text-gray-900">
											{formatDateTime(selectedRequest.created_at)}
										</p>
									</div>
									{healthProcessData && (
										<>
											<div className="bg-white rounded-xl p-4 shadow-sm">
												<label className="text-sm font-medium text-gray-500">
													ID Kiểm tra sức khỏe
												</label>
												<p className="text-sm text-gray-600 font-mono">
													{healthProcessData._id}
												</p>
											</div>
											<div className="bg-white rounded-xl p-4 shadow-sm">
												<label className="text-sm font-medium text-gray-500">
													Cập nhật lần cuối
												</label>
												<p className="text-lg text-gray-900">
													{formatDateTime(selectedRequest.updated_at)}
												</p>
											</div>
										</>
									)}
								</div>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
