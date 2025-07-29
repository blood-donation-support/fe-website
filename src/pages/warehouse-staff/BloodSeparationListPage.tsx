import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { fetchDonationProcessAll } from "../../api/donationProcessService";
import type { DonationProcess } from "../../types/donation";
import statusVN from "@/utils/statusVN";
import bloodComponentVN from "@/utils/translateBloodComponentVN";

export const BloodSeparationListPage: React.FC = () => {
	const navigate = useNavigate();
	const [jobs, setJobs] = useState<DonationProcess[]>([]);

	const userData = localStorage.getItem("user");
	const user = userData ? JSON.parse(userData) : null;
	const role = user?.role;

	const [statusFilter, setStatusFilter] = useState<
		"all" | "Pending" | "Approved" | "Rejected"
	>("Pending");

	const [searchText, setSearchText] = useState<string>("");
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		new Date(),
	);
	const [volumeFilter, setVolumeFilter] = useState<string>("all");
	const [bloodTypeFilter, setBloodTypeFilter] = useState<string>("all");
	const [donationTypeFilter, setDonationTypeFilter] = useState<string>("all");

	useEffect(() => {
		(async () => {
			const data = await fetchDonationProcessAll();
			const sorted = data.sort(
				(a, b) =>
					new Date(b.donation_date).getTime() -
					new Date(a.donation_date).getTime(),
			);
			setJobs(sorted);
		})();
	}, []);

	const filtered = jobs.filter((r) => {
		const matchesStatus =
			statusFilter === "all" ? true : r.status === statusFilter;

		const matchesDate = selectedDate
			? new Date(r.donation_date).toDateString() === selectedDate.toDateString()
			: true;

		const matchesVolume =
			volumeFilter === "all"
				? true
				: String(r.volume_collected) === volumeFilter;

		const matchesBloodType =
			bloodTypeFilter === "all" ? true : r.blood_group_name === bloodTypeFilter;

		const matchesDonationType =
			donationTypeFilter === "all"
				? true
				: r.donation_type === donationTypeFilter;

		const text = searchText.toLowerCase();
		const matchesSearch =
			r._id.toLowerCase().includes(text) ||
			r.note?.toLowerCase().includes(text) ||
			false;

		return (
			matchesStatus &&
			matchesDate &&
			matchesVolume &&
			matchesBloodType &&
			matchesDonationType &&
			matchesSearch
		);
	});

	return (
		<div className="p-4 bg-[#f9fafb] min-h-screen flex flex-col items-center">
			<div className="w-full max-w-8xl">
				<h2 className="text-3xl font-semibold text-[#236afe] text-center mb-6">
					Danh sách mẫu cần phân tách
				</h2>
				<Card className="g-gradient-to-r from-indigo-600 to-blue-500 border-0 mb-8 overflow-hidden">
					<div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1"></div>
					<CardContent className="p-8">
						<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
							{/* CHỌN NGÀY */}
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

							{/* SEARCH + FILTERS */}
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

								{/* Filters */}
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

									{/* Nhóm máu */}
									<div className="space-y-3">
										<div className="flex items-center gap-2">
											<div className="w-2 h-2 bg-red-500 rounded-full" />
											<label className="text-sm font-semibold text-gray-700 tracking-wide">
												NHÓM MÁU
											</label>
										</div>
										<Select
											value={bloodTypeFilter}
											onValueChange={setBloodTypeFilter}
										>
											<SelectTrigger className="w-full h-12 bg-white border-gray-200 rounded-xl shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
												<SelectValue placeholder="Tất cả nhóm máu" />
											</SelectTrigger>
											<SelectContent className="rounded-xl border-gray-200 shadow-xl">
												<SelectItem value="all">Tất cả</SelectItem>
												<SelectItem value="A+">A+</SelectItem>
												<SelectItem value="A-">A-</SelectItem>
												<SelectItem value="B+">B+</SelectItem>
												<SelectItem value="B-">B-</SelectItem>
												<SelectItem value="AB+">AB+</SelectItem>
												<SelectItem value="AB-">AB-</SelectItem>
												<SelectItem value="O+">O+</SelectItem>
												<SelectItem value="O-">O-</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
									{/* Loại hiến */}
									<div className="space-y-3">
										<div className="flex items-center gap-2">
											<div className="w-2 h-2 bg-emerald-500 rounded-full" />
											<label className="text-sm font-semibold text-gray-700 tracking-wide">
												LOẠI HIẾN
											</label>
										</div>
										<Select
											value={donationTypeFilter}
											onValueChange={setDonationTypeFilter}
										>
											<SelectTrigger className="w-full h-12 bg-white border-gray-200 rounded-xl shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
												<SelectValue placeholder="Tất cả loại hiến" />
											</SelectTrigger>
											<SelectContent className="rounded-xl border-gray-200 shadow-xl max-h-60 overflow-y-auto">
												<SelectItem value="all">Tất cả</SelectItem>
												<SelectItem value="Whole Blood">Toàn phần</SelectItem>
												<SelectItem value="Red Blood Cells">
													Tế bào hồng cầu
												</SelectItem>
												<SelectItem value="Platelets">Tiểu cầu</SelectItem>
												<SelectItem value="Plasma">Huyết tương</SelectItem>
												<SelectItem value="White Blood Cells">
													Tế bào bạch cầu
												</SelectItem>
												<SelectItem value="Platelets - Plasma">
													Tiểu cầu + Huyết tương
												</SelectItem>
												<SelectItem value="Plasma - Red Blood Cells">
													Huyết tương + Hồng cầu
												</SelectItem>
												<SelectItem value="Platelets - Red Blood Cells">
													Tiểu cầu + Hồng cầu
												</SelectItem>
											</SelectContent>
										</Select>
									</div>

									{/* Số lượng*/}
									<div className="space-y-3">
										<div className="flex items-center gap-2">
											<div className="w-2 h-2 bg-red-500 rounded-full" />
											<label className="text-sm font-semibold text-gray-700 tracking-wide">
												SỐ LƯỢNG
											</label>
										</div>
										<Select
											value={volumeFilter}
											onValueChange={setVolumeFilter}
										>
											<SelectTrigger>
												{" "}
												<SelectValue placeholder="Tất cả số lượng" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">Tất cả</SelectItem>
												<SelectItem value="250">250</SelectItem>
												<SelectItem value="350">350</SelectItem>
												<SelectItem value="450">450</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>
						</div>

						{/* Bộ lọc đang áp dụng */}
						{(selectedDate ||
							statusFilter !== "all" ||
							bloodTypeFilter !== "all" ||
							donationTypeFilter !== "all" ||
							volumeFilter !== "all" ||
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
											{statusVN(statusFilter)}
										</span>
									)}
									{bloodTypeFilter !== "all" && (
										<span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 text-sm rounded-full border border-red-200">
											Nhóm máu: {bloodTypeFilter}
										</span>
									)}
									{donationTypeFilter !== "all" && (
										<span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full border border-green-200">
											Loại hiến: {bloodComponentVN(donationTypeFilter)}
										</span>
									)}
									{volumeFilter !== "all" && (
										<span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 text-sm rounded-full border border-yellow-200">
											Số lượng: {volumeFilter} ml
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
					</CardContent>
				</Card>

				<Card className="shadow-lg">
					<CardContent className="p-6">
						<Table className="border rounded-xl overflow-hidden">
							<TableHeader className="bg-[#236afe] text-white">
								<TableRow>
									<TableHead className="text-white text-center">STT</TableHead>
									<TableHead className="text-white text-center">
										Tên người hiến
									</TableHead>
									<TableHead className="text-white text-center">
										Nhóm máu
									</TableHead>
									<TableHead className="text-white text-center">
										Loại hiến
									</TableHead>
									<TableHead className="text-white text-center">
										Số lượng
									</TableHead>
									<TableHead className="text-white text-center">
										Ngày hiến
									</TableHead>
									<TableHead className="text-white text-center">
										Trạng thái
									</TableHead>
									<TableHead className="text-white text-center">
										Thao tác
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filtered.length > 0 ? (
									filtered.map((job, i) => (
										<TableRow key={job._id}>
											<TableCell className="text-center">{i + 1}</TableCell>
											<TableCell className="text-center">
												{job.full_name || "Chưa cập nhật"}
											</TableCell>
											<TableCell className="text-center">
												{job.blood_group_name || "Chưa cập nhật"}
											</TableCell>
											<TableCell className="text-center">
												{bloodComponentVN(job.donation_type || "")}
											</TableCell>
											<TableCell className="text-center">
												{job.volume_collected || "Chưa cập nhật"}
											</TableCell>
											<TableCell className="text-center">
												{job.donation_date
													? new Date(job.donation_date).toLocaleString("vi-VN")
													: "Chưa cập nhật"}
											</TableCell>
											<TableCell className="text-center">
												<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
													{statusVN(job.status || "Chưa cập nhật")}
												</span>
											</TableCell>
											<TableCell className="text-center">
												<Button
													size="sm"
													className="bg-[#236afe] hover:bg-[#4338ca] text-white"
													onClick={() =>
														navigate(
															`/dashboard-staff-warehouse/blood-separation-process/${job._id}`,
														)
													}
												>
													Phân tách
												</Button>
											</TableCell>
										</TableRow>
									))
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
