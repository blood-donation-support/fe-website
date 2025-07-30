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
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import bloodComponentVN from "@/utils/translateBloodComponentVN";
import statusVN from "@/utils/statusVN";
import {
	fetchDonationRegistrations,
	fetchDonationRegistrationById,
} from "@/api/donationRegistrationService";
import type { DonationRegistration } from "@/types/donation";

// Hàm format datetime đầy đủ (giờ, ngày, tháng, năm)
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

export default function DonationRegistrationsPage() {
	const [registrations, setRegistrations] = useState<DonationRegistration[]>(
		[],
	);
	const [filtered, setFiltered] = useState<DonationRegistration[]>([]);
	const [statusFilter, setStatusFilter] = useState<
		"all" | "Pending" | "Approved" | "Rejected"
	>("all");
	const [donationTypeFilter, setDonationTypeFilter] = useState<string>("all");
	const [bloodGroupFilter, setBloodGroupFilter] = useState<string>("all");
	const [searchText, setSearchText] = useState<string>("");
	const [selected, setSelected] = useState<DonationRegistration | null>(null);
	const [openDetail, setOpenDetail] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				const data = await fetchDonationRegistrations();
				// Sắp xếp theo ngày đăng ký mới nhất lên trước
				const sorted = data.sort(
					(a, b) =>
						new Date(b.start_date_donation).getTime() -
						new Date(a.start_date_donation).getTime(),
				);
				setRegistrations(sorted);
				setFiltered(sorted);
			} catch (err) {
				console.error("Lỗi khi tải đăng ký:", err);
			}
		})();
	}, []);

	const donationTypes = React.useMemo<string[]>(
		() =>
			Array.from(
				new Set(
					registrations
						.map((r) => r.donation_type)
						.filter((t): t is string => Boolean(t)),
				),
			),
		[registrations],
	);

	const bloodGroups = React.useMemo<string[]>(
		() =>
			Array.from(
				new Set(
					registrations
						.map((r) => r.blood_group_name)
						.filter((bg): bg is string => Boolean(bg)),
				),
			),
		[registrations],
	);

	useEffect(() => {
		let curr = registrations;
		if (statusFilter !== "all") {
			curr = curr.filter((r) => r.status === statusFilter);
		}
		if (donationTypeFilter !== "all") {
			curr = curr.filter((r) => r.donation_type === donationTypeFilter);
		}
		if (bloodGroupFilter !== "all") {
			curr = curr.filter((r) => r.blood_group_name === bloodGroupFilter);
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
		registrations,
		statusFilter,
		donationTypeFilter,
		bloodGroupFilter,
		searchText,
	]);

	const handleSelect = async (id: string) => {
		try {
			const detail = await fetchDonationRegistrationById(id);
			setSelected(detail);
			setOpenDetail(true);
		} catch (err) {
			console.error("Lỗi khi tải chi tiết:", err);
		}
	};

	return (
		<div className="p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
			<Card className="g-gradient-to-r from-indigo-600 to-blue-500 border-0 mb-8 overflow-hidden">
				<CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
					<CardTitle className="text-2xl text-center font-bold">
						Danh sách đăng ký hiến máu
					</CardTitle>
				</CardHeader>
				<CardContent className="p-6 space-y-6">
					{/* Enhanced Filter Section */}
					<Card className="g-gradient-to-r from-indigo-600 to-blue-500 border-0 mb-8 overflow-hidden">
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
											onValueChange={(
												value: "all" | "pending" | "approved" | "rejected",
											) => setStatusFilter(value)}
										>
											<SelectTrigger className="w-full h-12 bg-white border-gray-200 rounded-xl shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
												<SelectValue placeholder="Tất cả trạng thái" />
											</SelectTrigger>
											<SelectContent className="rounded-xl border-gray-200 shadow-xl">
												<SelectItem value="all">Tất cả</SelectItem>
												<SelectItem value="pending">Chờ duyệt</SelectItem>
												<SelectItem value="approved">Đã duyệt</SelectItem>
												<SelectItem value="rejected">Từ chối</SelectItem>
											</SelectContent>
										</Select>
									</div>

									{/* Donation Type Filter */}
									<div className="space-y-3">
										<div className="flex items-center gap-2">
											<div className="w-2 h-2 bg-pink-500 rounded-full" />
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
											<SelectContent className="rounded-xl border-gray-200 shadow-xl">
												<SelectItem value="all">Tất cả</SelectItem>
												{donationTypes.map((type) => (
													<SelectItem key={type} value={type}>
														{bloodComponentVN(type)}
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
											<SelectTrigger className="w-full h-12 bg-white border-gray-200 rounded-xl shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
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
									donationTypeFilter !== "all" ||
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
											{donationTypeFilter !== "all" && (
												<span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-50 text-pink-700 text-sm rounded-full border border-pink-200">
													Loại hiến: {bloodComponentVN(donationTypeFilter)}
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
										Loại hiến
									</th>
									<th className="text-white font-semibold px-6 py-4 text-left">
										Ngày đăng ký
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
								{filtered.length > 0 ? (
									filtered.map((r, i) => (
										<tr
											key={r._id}
											className={`hover:bg-blue-50 transition-all ${
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
												<span className="font-medium text-blue-600">
													{r.blood_group_name || "Chưa cập nhật"}
												</span>
											</td>
											<td className="px-6 py-4 text-gray-600">
												{bloodComponentVN(r.donation_type || "Chưa cập nhật")}
											</td>
											<td className="px-6 py-4 text-gray-600">
												{formatDateTime(r.start_date_donation)}
											</td>
											<td className="px-6 py-4">
												<span
													className={`px-3 py-1 rounded-full text-xs font-medium ${
														r.status === "approved"
															? "bg-green-100 text-green-800"
															: r.status === "rejected"
															? "bg-red-100 text-red-800"
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
													className="rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50"
													onClick={() => handleSelect(r._id)}
												>
													<Eye size={16} />
												</Button>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={8} className="text-center py-8 text-gray-500">
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
				<DialogContent className="max-w-4xl rounded-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold text-gray-800 mb-4">
							Chi tiết đăng ký hiến máu
						</DialogTitle>
						<DialogDescription className="text-gray-600">
							Thông tin chi tiết về đăng ký hiến máu trong hệ thống.
						</DialogDescription>
					</DialogHeader>
					{selected && (
						<div className="space-y-6">
							{/* Basic Info Section */}
							<div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
								<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
									<div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></div>
									Thông tin cá nhân
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="bg-white rounded-xl p-4 shadow-sm">
										<label className="text-sm font-medium text-gray-500">
											CCCD
										</label>
										<p className="text-lg font-semibold text-gray-900">
											{selected.citizen_id_number || "Chưa cập nhật"}
										</p>
									</div>
									<div className="bg-white rounded-xl p-4 shadow-sm">
										<label className="text-sm font-medium text-gray-500">
											Họ tên
										</label>
										<p className="text-lg font-semibold text-gray-900">
											{selected.full_name || "Chưa cập nhật"}
										</p>
									</div>
									<div className="bg-white rounded-xl p-4 shadow-sm">
										<label className="text-sm font-medium text-gray-500">
											SĐT
										</label>
										<p className="text-lg text-gray-900">
											{selected.phone || "Chưa cập nhật"}
										</p>
									</div>
								</div>
							</div>

							{/* Medical Info Section */}
							<div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6">
								<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
									<div className="w-2 h-6 bg-gradient-to-b from-red-500 to-pink-500 rounded-full mr-3"></div>
									Thông tin hiến máu
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="bg-white rounded-xl p-4 shadow-sm">
										<label className="text-sm font-medium text-gray-500">
											Nhóm máu
										</label>
										<p className="text-lg font-semibold text-blue-600">
											{selected.blood_group_name || "Chưa cập nhật"}
										</p>
									</div>
									<div className="bg-white rounded-xl p-4 shadow-sm">
										<label className="text-sm font-medium text-gray-500">
											Loại hiến
										</label>
										<p className="text-lg font-semibold text-green-600">
											{selected.donation_type
												? bloodComponentVN(selected.donation_type)
												: "Chưa cập nhật"}
										</p>
									</div>
									<div className="bg-white rounded-xl p-4 shadow-sm">
										<label className="text-sm font-medium text-gray-500">
											Ngày đăng ký
										</label>
										<p className="text-lg text-gray-900">
											{formatDateTime(selected.start_date_donation)}
										</p>
									</div>
									<div className="bg-white rounded-xl p-4 shadow-sm">
										<label className="text-sm font-medium text-gray-500">
											Trạng thái
										</label>
										<p className="text-lg font-semibold text-gray-900">
											<span
												className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
													selected.status === "approved"
														? "bg-green-100 text-green-800"
														: selected.status === "rejected"
														? "bg-red-100 text-red-800"
														: "bg-yellow-100 text-yellow-800"
												}`}
											>
												{statusVN(selected.status) || "Chưa cập nhật"}
											</span>
										</p>
									</div>
								</div>
							</div>

							{/* System Info Section */}
							<div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6">
								<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
									<div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full mr-3"></div>
									Thông tin hệ thống
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="bg-white rounded-xl p-4 shadow-sm">
										<label className="text-sm font-medium text-gray-500">
											ID
										</label>
										<p className="text-sm text-gray-600 font-mono">
											{selected._id || "Chưa cập nhật"}
										</p>
									</div>
									<div className="bg-white rounded-xl p-4 shadow-sm">
										<label className="text-sm font-medium text-gray-500">
											Ngày tạo
										</label>
										<p className="text-lg text-gray-900">
											{formatDateTime(selected.created_at) || "Chưa cập nhật"}
										</p>
									</div>
								</div>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
