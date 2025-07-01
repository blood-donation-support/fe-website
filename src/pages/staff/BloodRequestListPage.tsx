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

export const BloodRequestListPage: React.FC = () => {
	const navigate = useNavigate();

	const [requests, setRequests] = useState<DoctorRequest[]>([]);
	const [statusFilter, setStatusFilter] = useState<
		"all" | "Pending" | "Approved" | "Completed" | "Rejected"
	>("Pending");
	const [urgencyFilter, setUrgencyFilter] = useState<
		"all" | "Emergency" | "Normal"
	>("Emergency");
	const [searchText, setSearchText] = useState<string>("");

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
	}, []);

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
		<div className="p-8 bg-[#f9fafb] min-h-screen">
			<h2 className="text-2xl text-center font-semibold text-[#236afe] mb-8">
				Danh sách đơn xin máu
			</h2>
			<Card className="mb-6 shadow-md">
				<CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
					<Input
						placeholder="Tìm kiếm theo ID hoặc ghi chú..."
						className="w-full"
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
					/>

					<Select value={statusFilter} onValueChange={setStatusFilter}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Lọc theo trạng thái" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Tất cả</SelectItem>
							<SelectItem value="Pending">Chờ duyệt</SelectItem>
							<SelectItem value="Approved">Đã duyệt</SelectItem>
							<SelectItem value="Completed">Hoàn tất</SelectItem>
							<SelectItem value="Rejected">Từ chối</SelectItem>
						</SelectContent>
					</Select>

					<Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Lọc theo khẩn cấp" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Tất cả</SelectItem>
							<SelectItem value="Emergency">Khẩn cấp</SelectItem>
							<SelectItem value="Normal">Không khẩn cấp</SelectItem>
						</SelectContent>
					</Select>
				</CardContent>
			</Card>

			<Card className="shadow-md">
				<CardContent className="overflow-x-auto p-0">
					<Table>
						<TableHeader className="bg-[#f3f4f6]">
							<TableRow>
								<TableHead>Mã đơn</TableHead>
								<TableHead>Ngày yêu cầu</TableHead>
								<TableHead>Khẩn cấp</TableHead>
								<TableHead>Trạng thái</TableHead>
								<TableHead className="text-center">Hành động</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filtered.map((r) => (
								<TableRow key={r._id} className="hover:bg-[#f9fafb]">
									<TableCell>{r._id}</TableCell>
									<TableCell>
										{new Date(r.receive_date_request).toLocaleString()}
									</TableCell>
									<TableCell>
										{r.is_emergency ? (
											<span className="text-red-500 font-bold">Khẩn cấp</span>
										) : (
											<span className="text-green-600 font-medium">
												Bình thường
											</span>
										)}
									</TableCell>
									<TableCell>{r.status}</TableCell>
									<TableCell className="text-center">
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
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
};
