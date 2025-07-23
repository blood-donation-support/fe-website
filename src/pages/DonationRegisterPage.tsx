import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/components/ui/table";
import type { DonationRegistration } from "../types/donation";
import { fetchDonationRegistrations } from "../api/donationRegistrationService";
import statusVN from "@/utils/statusVN";
import bloodComponentVN from "@/utils/translateBloodComponentVN";

export const DonationRegisterPage: React.FC = () => {
	const navigate = useNavigate();
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		new Date(),
	);
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [search, setSearch] = useState<string>("");
	const [registrations, setRegistrations] = useState<DonationRegistration[]>(
		[],
	);

	useEffect(() => {
		(async () => {
			try {
				const data = await fetchDonationRegistrations();
        const sorted = data.sort(
					(a, b) =>
						new Date(b.start_date_donation).getTime() -
						new Date(a.start_date_donation).getTime(),
				);
				setRegistrations(sorted);
			} catch (err) {
				console.error(err);
			}
		})();
	}, []);

	const filtered = registrations.filter((r) => {
		const dateOK =
			!selectedDate ||
			new Date(r.start_date_donation).toDateString() ===
				selectedDate.toDateString();
		const statusOK = statusFilter === "all" || r.status === statusFilter;
		const text = search.toLowerCase();
		const searchOK =
			r._id.toLowerCase().includes(text) ||
			r.user_id.toLowerCase().includes(text) ||
			r.citizen_id_number.toLowerCase().includes(text) ||
			r.full_name.toLowerCase().includes(text);
		return dateOK && statusOK && searchOK;
	});

	return (
		<div className="p-4 bg-[#f9fafb] min-h-screen flex flex-col items-center">
			<div className="w-full max-w-8xl">
				<h2 className="text-3xl font-semibold text-[#236afe] text-center mb-6">
					Danh sách đăng ký hiến máu
				</h2>
				<Card className="g-gradient-to-r from-indigo-600 to-blue-500 border-0 mb-8 overflow-hidden">
					<div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1"></div>
					<CardContent className="p-8">
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
							{/* CHỌN NGÀY */}
							<div className="space-y-3">
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

							{/* TÌM KIẾM */}
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
										value={search}
										onChange={(e) => setSearch(e.target.value)}
										className="w-full h-12 pl-12 pr-4 bg-white border-gray-200 rounded-xl shadow-sm hover:border-gray-300 hover:shadow-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
									/>
									{search && (
										<button
											onClick={() => setSearch("")}
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

							{/* TRẠNG THÁI */}
							<div className="space-y-3">
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 bg-emerald-500 rounded-full" />
									<label className="text-sm font-semibold text-gray-700 tracking-wide">
										TRẠNG THÁI
									</label>
								</div>
								<Select value={statusFilter} onValueChange={setStatusFilter}>
									<SelectTrigger className="w-full h-12 bg-white border-gray-200 rounded-xl shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
										<SelectValue placeholder="Tất cả trạng thái" />
									</SelectTrigger>
									<SelectContent className="rounded-xl border-gray-200 shadow-xl">
										<SelectItem value="all">Tất cả</SelectItem>
										<SelectItem value="Pending">Chưa đến</SelectItem>
										<SelectItem value="Checked In">Đã đến</SelectItem>
										<SelectItem value="Approved">Đã duyệt</SelectItem>
										<SelectItem value="Completed">Hoàn tất</SelectItem>
										<SelectItem value="Rejected">Từ chối</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Active Filters */}
						{(selectedDate || statusFilter !== "all" || search) && (
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
									{search && (
										<span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full border border-purple-200">
											"{search}"
										</span>
									)}
									{statusFilter !== "all" && (
										<span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-700 text-sm rounded-full border border-gray-200">
											{statusFilter}
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
									<TableHead className="text-white px-4 py-3 text-center ">
										CCCD
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Họ tên
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Số điện thoại
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Loại hiến
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Ngày hẹn
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Trạng thái
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Thao tác
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filtered.length > 0 ? (
									filtered.map((r, index) => {
										const actionText = (() => {
											switch (r.status) {
												case "Approved":
													return "Check In";
												case "Checked In":
													return "Sàng lọc & Lấy máu";
												case "Rejected":
													return "Xem Chi tiết";
												// case "Approved":
												// 	return "Lấy máu";
												default:
													return "Xem chi tiết";
											}
										})();

										return (
											<TableRow key={r._id} className="hover:bg-[#f3f4f6]">
												<TableCell className="text-center">
													{index + 1}
												</TableCell>
												<TableCell className="text-center">
													{r.citizen_id_number}
												</TableCell>
												<TableCell className="text-center">
													{r.full_name}
												</TableCell>
												<TableCell className="text-center">{r.phone}</TableCell>
												<TableCell className="text-center">
													{bloodComponentVN(r.donation_type || "Không có")}
												</TableCell>
											
                        <TableCell className="text-center">
                                                {new Date(r.start_date_donation).toLocaleString(
                                                  "vi-VN",
                                                )}
                                              </TableCell>
												<TableCell className="text-center">
													<span
														className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
															r.status === "Checked In"
																? "bg-green-100 text-green-800 border border-green-200"
																: r.status === "Pending"
																? "bg-yellow-100 text-yellow-800 border border-yellow-200"
																: r.status === "Collected"
																? "bg-blue-100 text-blue-800 border border-blue-200"
																: "bg-blue-100 text-gray-800 border border-gray-200"
														}`}
													>
														{statusVN(r.status)}
													</span>
												</TableCell>
												<TableCell className="text-center">
													<Button
														size="sm"
														className="bg-[#236afe] hover:bg-[#4338ca] text-white"
														onClick={() =>
															navigate(`/dashboard-staff/donation/${r._id}`)
														}
													>
														{actionText}
													</Button>
												</TableCell>
											</TableRow>
										);
									})
								) : (
									<TableRow>
										<TableCell
											colSpan={8}
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
