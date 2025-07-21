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
				console.log("data nè", data);
				setRegistrations(data);
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
		<div className="p-8 bg-[#f9fafb] min-h-screen flex flex-col items-center">
			<div className="w-full max-w-5xl">
				<h2 className="text-3xl font-semibold text-[#236afe] text-center mb-8">
					Danh sách đăng ký hiến máu
				</h2>
				<Card className="shadow-lg mb-8">
					<CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
						<div>
							<label className="block mb-2 font-medium">Chọn ngày</label>
							<Calendar
								mode="single"
								selected={selectedDate}
								onSelect={setSelectedDate}
							/>
						</div>
						<div>
							<label className="block mb-2 font-medium">Trạng thái</label>
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger>
									<SelectValue placeholder="Tất cả" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Tất cả</SelectItem>
									<SelectItem value="Pending">Chưa đến</SelectItem>
									<SelectItem value="Checked In">Đã đến</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<label className="block mb-2 font-medium">Tìm kiếm</label>
							<Input
								placeholder="ID hoặc User ID"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>
					</CardContent>
				</Card>

				<Card className="shadow-md">
					<CardContent className="overflow-x-auto p-0">
						<Table>
							<TableHeader>
								<TableRow>
									{/* <TableHead>ID</TableHead> */}
									{/* <TableHead>User ID</TableHead> */}
									<TableHead>CCCD</TableHead>
									<TableHead>Họ tên</TableHead>
									<TableHead>Số điện thoại</TableHead>
									<TableHead>Loại hiến</TableHead>

									<TableHead>Ngày hẹn</TableHead>
									<TableHead>Trạng thái</TableHead>
									<TableHead>Thao tác</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{filtered.map((r) => (
									<TableRow key={r._id}>
										{/* <TableCell>{r._id}</TableCell> */}
										{/* <TableCell>{r.user_id}</TableCell> */}
										<TableCell>{r.citizen_id_number}</TableCell>
										<TableCell>{r.full_name}</TableCell>
											<TableCell>{r.phone}</TableCell>
										<TableCell>{bloodComponentVN(r.donation_type || "Không có")}</TableCell>

										<TableCell>
											{new Date(r.start_date_donation).toLocaleDateString()}
										</TableCell>
										<TableCell>{statusVN(r.status)}</TableCell>
										<TableCell>
											<Button
												onClick={() =>
													navigate(`/dashboard-staff/donation/${r._id}`)
												}
											>
												Xem chi tiết
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};
