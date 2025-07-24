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
import bloodComponentVN from "@/utils/translateBloodComponentVN";
import statusVN from "@/utils/statusVN";
import {
	fetchDonationRegistrations,
	fetchDonationRegistrationById,
} from "@/api/donationRegistrationService";
import type { DonationRegistration } from "@/types/donation";

export default function DonationRegistrationsPage() {
	const [registrations, setRegistrations] = useState<DonationRegistration[]>(
		[],
	);
	const [filtered, setFiltered] = useState<DonationRegistration[]>([]);
	const [statusFilter, setStatusFilter] = useState<
		"all" | "pending" | "approved" | "rejected"
	>("all");
	const [donationTypeFilter, setDonationTypeFilter] = useState<string>("all");
	const [searchText, setSearchText] = useState<string>("");
	const [selected, setSelected] = useState<DonationRegistration | null>(null);

	useEffect(() => {
		(async () => {
			try {
				const data = await fetchDonationRegistrations();
				setRegistrations(data);
				setFiltered(data);
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

	useEffect(() => {
		let curr = registrations;
		if (statusFilter !== "all") {
			curr = curr.filter((r) => r.status === statusFilter);
		}
		if (donationTypeFilter !== "all") {
			curr = curr.filter((r) => r.donation_type === donationTypeFilter);
		}
		if (searchText.trim()) {
			const txt = searchText.toLowerCase();
			curr = curr.filter(
				(r) =>
					r.full_name.toLowerCase().includes(txt) ||
					r.phone.toLowerCase().includes(txt),
			);
		}
		setFiltered(curr);
	}, [registrations, statusFilter, donationTypeFilter, searchText]);

	const handleSelect = async (id: string) => {
		try {
			const detail = await fetchDonationRegistrationById(id);
			setSelected(detail);
		} catch (err) {
			console.error("Lỗi khi tải chi tiết:", err);
		}
	};

	return (
		<div className="p-6 bg-[#f9fafb] min-h-screen">
			<h2 className="text-3xl font-semibold text-[#236afe] text-center mb-6">
				Danh sách đăng ký hiến máu
			</h2>

			{/* Header + Filters */}
			<Card className="mb-8 border-0 overflow-hidden">
				<div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1" />
				<CardContent className="p-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{/* Search */}
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Tìm kiếm
							</label>
							<Input
								placeholder="Họ tên hoặc SĐT..."
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
								className="w-full"
							/>
						</div>
						{/* Status */}
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Trạng thái
							</label>
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Tất cả" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Tất cả</SelectItem>
									<SelectItem value="pending">Chờ duyệt</SelectItem>
									<SelectItem value="approved">Đã duyệt</SelectItem>
									<SelectItem value="rejected">Từ chối</SelectItem>
								</SelectContent>
							</Select>
						</div>
						{/* Donation Type */}
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Loại hiến
							</label>
							<Select
								value={donationTypeFilter}
								onValueChange={setDonationTypeFilter}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Tất cả" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Tất cả</SelectItem>
									{donationTypes.map((type) => (
										<SelectItem key={type} value={type}>
											{bloodComponentVN(type)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Table + Detail */}
			<div
				className={`grid gap-4 ${
					selected ? "md:grid-cols-3" : "md:grid-cols-1"
				}`}
			>
				{/* Bảng */}
				<Card className={selected ? "md:col-span-2" : "md:col-span-1"}>
					<CardContent className="p-6">
						<Table className="border rounded-xl overflow-hidden">
							<TableHeader className="bg-[#236afe] text-white">
								<TableRow>
									<TableHead className="text-white px-4 py-3 text-center">
										STT
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Họ tên
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										SĐT
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Nhóm máu
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Loại hiến
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Ngày đăng ký
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Trạng thái
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Chi tiết
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filtered.length > 0 ? (
									filtered.map((r, i) => (
										<TableRow key={r._id} className="hover:bg-[#f3f4f6]">
											<TableCell className="text-center">{i + 1}</TableCell>
											<TableCell className="text-center">
												{r.full_name}
											</TableCell>
											<TableCell className="text-center">{r.phone}</TableCell>
											<TableCell className="text-center">
												<span className="font-medium text-blue-600">
													{r.blood_group_name}
												</span>
											</TableCell>
											<TableCell className="text-center">
												{bloodComponentVN(r.donation_type || "")}
											</TableCell>
											<TableCell className="text-center">
												{new Date(r.start_date_donation).toLocaleDateString(
													"vi-VN",
												)}
											</TableCell>
											<TableCell className="text-center">
												<span
													className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
														r.status === "approved"
															? "bg-green-100 text-green-800"
															: r.status === "rejected"
															? "bg-red-100 text-red-800"
															: "bg-yellow-100 text-yellow-800"
													}`}
												>
													{statusVN(r.status)}
												</span>
											</TableCell>
											<TableCell className="text-center">
												<Button
													size="sm"
													variant="outline"
													onClick={() => handleSelect(r._id)}
												>
													Xem
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
											Không có bản ghi
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</CardContent>
				</Card>

				{/* Chi tiết đơn */}
				{selected && (
					<Card className="md:col-span-1 shadow-lg">
						{/* Thanh gradient top */}
						<div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1 rounded-t-md" />
						<CardHeader className="pt-4">
							<CardTitle className="text-[#236afe] text-lg text-center">
								Chi tiết đơn đăng ký
							</CardTitle>
						</CardHeader>
						<CardContent className="p-6">
							<dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
								<dt className="font-medium text-slate-600">CCCD</dt>
								<dd className="text-slate-800">{selected.citizen_id_number}</dd>

								<dt className="font-medium text-slate-600">Họ tên</dt>
								<dd className="text-slate-800">{selected.full_name}</dd>

								<dt className="font-medium text-slate-600">SĐT</dt>
								<dd className="text-slate-800">{selected.phone}</dd>

								<dt className="font-medium text-slate-600">Nhóm máu</dt>
								<dd className="text-slate-800">
									{selected.blood_group_name || "—"}
								</dd>

								<dt className="font-medium text-slate-600">Loại hiến</dt>
								<dd className="text-slate-800">
									{selected.donation_type
										? bloodComponentVN(selected.donation_type)
										: "—"}
								</dd>

								<dt className="font-medium text-slate-600">Trạng thái</dt>
								<dd className="text-slate-800">{statusVN(selected.status)}</dd>

								<dt className="font-medium text-slate-600">Ngày đăng ký</dt>
								<dd className="text-slate-800">
									{new Date(selected.start_date_donation).toLocaleDateString(
										"vi-VN",
									)}
								</dd>
							</dl>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
