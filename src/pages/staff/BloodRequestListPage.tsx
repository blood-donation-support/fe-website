import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
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
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table";

import { fetchDoctorRequests } from "../../api/doctorRequestService";
import type { DoctorRequest } from "../../api/doctorRequestService";
import statusVN from "@/utils/statusVN";
import { Calendar } from "@/components/ui/calendar";
import bloodComponentVN from "@/utils/translateBloodComponentVN";

export const BloodRequestListPage: React.FC = () => {
	const navigate = useNavigate();
	const userData = localStorage.getItem("user");
	const user = userData ? JSON.parse(userData) : null;
	const role = user?.role;

	const [requests, setRequests] = useState<DoctorRequest[]>([]);
	const [statusFilter, setStatusFilter] = useState<
		"all" | "Pending" | "Approved" | "Rejected"
	>("Pending");
	const [urgencyFilter, setUrgencyFilter] = useState<
		"all" | "Emergency" | "Normal"
	>("Emergency");
	const [searchText, setSearchText] = useState<string>("");
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		new Date(),
	);
	useEffect(() => {
		(async () => {
			try {
				const data = await fetchDoctorRequests();

				const sorted = data.sort(
					(a, b) =>
						new Date(b.receive_date_request).getTime() -
						new Date(a.receive_date_request).getTime(),
				);

				setRequests(sorted);
			} catch (err) {
				console.error(err);
			}
		})();
	}, [fetchDoctorRequests]);

	const filtered = requests.filter((r) => {
		const matchesStatus =
			statusFilter === "all" ? true : r.status === statusFilter;
		const matchesUrgency =
			urgencyFilter === "all"
				? true
				: (r.is_emergency ? "Emergency" : "Normal") === urgencyFilter;

		const text = searchText.toLowerCase();
		const matchesSearch =
			r._id.toLowerCase().includes(text) ||
			r.note?.toLowerCase().includes(text) ||
			false;

		return matchesStatus && matchesUrgency && matchesSearch;
	});

	return (
		<div className="p-4 bg-[#f9fafb] min-h-screen flex flex-col items-center">
			<div className="w-full max-w-8xl">
				<h2 className="text-3xl font-semibold text-[#236afe] text-center mb-6">
					Danh sách đơn xin máu
				</h2>
				<Card className="g-gradient-to-r from-indigo-600 to-blue-500 border-0 mb-8 overflow-hidden">
					<div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1"></div>
					<CardContent className="p-8">
						<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
							{/* CHỌN NGÀY: 4/12 */}
							<div className="space-y-3 lg:col-span-4">
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 bg-blue-500 rounded-full" />
									<label className="text-sm font-semibold text-gray-700 tracking-wide">
										CHỌN NGÀY
									</label>
								</div>
								<div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
									<Calendar
										mode="single"
										selected={selectedDate}
										onSelect={setSelectedDate}
										className="w-full"
									/>
								</div>
							</div>

							{/* SEARCH + FILTERS: 8/12 */}
							<div className="lg:col-span-8 space-y-8">
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
											placeholder="Tên, CCCD, SĐT hoặc ghi chú..."
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

								{/* Filters (2 columns) */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
									{/* Trạng thái */}
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
												<SelectItem value="Completed">Hoàn tất</SelectItem>
												<SelectItem value="Rejected">Từ chối</SelectItem>
											</SelectContent>
										</Select>
									</div>

									{/* Khẩn cấp */}
									<div className="space-y-3">
										<div className="flex items-center gap-2">
											<div className="w-2 h-2 bg-red-500 rounded-full" />
											<label className="text-sm font-semibold text-gray-700 tracking-wide">
												KHẨN CẤP
											</label>
										</div>
										<Select
											value={urgencyFilter}
											onValueChange={setUrgencyFilter}
										>
											<SelectTrigger className="w-full h-12 bg-white border-gray-200 rounded-xl shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
												<SelectValue placeholder="Tất cả mức độ" />
											</SelectTrigger>
											<SelectContent className="rounded-xl border-gray-200 shadow-xl">
												<SelectItem value="all">Tất cả</SelectItem>
												<SelectItem value="Emergency">Khẩn cấp</SelectItem>
												<SelectItem value="Normal">Bình thường</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>
						</div>

						{/* Active Filters */}
						{(selectedDate ||
							statusFilter !== "all" ||
							urgencyFilter !== "all" ||
							searchText) && (
							<div className="mt-6 pt-6 border-t border-gray-100">
								<span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
									Bộ lọc đang áp dụng
								</span>
								<div className="flex flex-wrap gap-2 mt-2">
									{selectedDate && (
										<span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200">
											{selectedDate.toLocaleDateString("vi-VN")}
										</span>
									)}
									{statusFilter !== "all" && (
										<span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-700 text-sm rounded-full border border-gray-200">
											{statusFilter}
										</span>
									)}
									{urgencyFilter !== "all" && (
										<span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 text-sm rounded-full border border-red-200">
											{urgencyFilter === "Emergency"
												? "Khẩn cấp"
												: "Bình thường"}
										</span>
									)}
									{searchText && (
										<span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full border border-purple-200">
											"{searchText}"
										</span>
									)}
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				<Card className="shadow-lg">
					<CardContent className="p-6">
						<Table className="border rounded-xl overflow-hidden">
							<TableHeader className="bg-[#236afe] text-white">
								<TableRow>
									<TableHead className="text-white px-4 py-3 text-center">
										STT
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Họ Tên
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Số điện thoại
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										CMND/CCCD
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Nhóm Máu
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Loại Máu
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Ngày yêu cầu
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Tình trạng
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Trạng thái
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Ghi chú
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Cập nhật bởi
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Thao tác
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filtered.length > 0 ? (
									filtered.map((r, i) => (
										<TableRow key={r._id} className="hover:bg-[#f3f4f6]">
											<TableCell className="text-center">{i + 1}</TableCell>
											<TableCell className="text-center">
												{r.full_name|| "Chưa cập nhật"}
											</TableCell>
											<TableCell className="text-center">{r.phone|| "Chưa cập nhật"}</TableCell>
											<TableCell className="text-center">
												{r.citizen_id_number|| "Chưa cập nhật"}
											</TableCell>
											<TableCell className="text-center">
												<span className="font-medium text-blue-600">
													{r.blood_group_name|| "Chưa cập nhật"}
												</span>
											</TableCell>
											<TableCell className="text-center">
												{bloodComponentVN(r.request_type || "Chưa cập nhật")}
											</TableCell>
											<TableCell className="text-center">
												{new Date(r.receive_date_request).toLocaleString(
													"vi-VN",
												)}
											</TableCell>
											<TableCell className="text-center">
												<span
													className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
														r.is_emergency
															? "bg-red-100 text-red-800 border border-red-200"
															: "bg-green-100 text-green-800 border border-green-200"
													}`}
												>
													{r.is_emergency ? "Khẩn cấp" : "Bình thường"}
												</span>
											</TableCell>
											<TableCell className="text-center">
												<span
													className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
														r.status === "Approved"
															? "bg-blue-100 text-blue-800"
															: r.status === "Completed"
															? "bg-green-100 text-green-800"
															: r.status === "Pending"
															? "bg-yellow-100 text-yellow-800"
															: "bg-red-100 text-red-800"
													}`}
												>
													{statusVN(r.status|| "Chưa cập nhật")}
												</span>
											</TableCell>
											<TableCell className="text-center">
												<div className="truncate max-w-xs" title={r.note}>
													{r.note || "Không có"}
												</div>
											</TableCell>
											<TableCell>{r.updated_by || "Chưa cập nhật"}</TableCell>

											<TableCell className="text-center">
												{r.status === "Pending" ? (
													<Button
														size="sm"
														className="bg-[#236afe] hover:bg-[#4338ca] text-white"
														onClick={() =>
															navigate(
																`/dashboard-staff-warehouse/request-list/${r._id}`,
															)
														}
													>
														Duyệt
													</Button>
												) : (
													<Button
														size="sm"
														className="bg-[#8DD0F8] hover:bg-[#4338ca] text-white"
														onClick={() =>
															navigate(
																`/dashboard-staff-warehouse/request-list/${r._id}`,
															)
														}
													>
														Xem chi tiết
													</Button>
												)}
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={12}
											className="text-center py-8 text-gray-500"
										>
											Không tìm thấy dữ liệu phù hợp
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};
