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
import { fetchDonationProcessAll } from "../../api/donationProcessService";
import type { DonationProcess } from "../../types/donation";
import statusVN from "@/utils/statusVN";
import bloodComponentVN from "@/utils/translateBloodComponentVN";

export const BloodSeparationListPage: React.FC = () => {
	const navigate = useNavigate();
	const [jobs, setJobs] = useState<DonationProcess[]>([]);

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

	return (
		<div className="p-4 bg-[#f9fafb] min-h-screen flex flex-col items-center">
			<div className="w-full max-w-8xl">
				<h2 className="text-3xl font-semibold text-[#236afe] text-center mb-6">
					Danh sách mẫu cần phân tách
				</h2>
				<Card className="shadow-lg">
					<CardContent className="p-6">
						<Table className="border rounded-xl overflow-hidden">
							<TableHeader className="bg-[#236afe] text-white">
								<TableRow>
									<TableHead className="text-white px-4 py-3 text-center">
										STT
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Tên người hiến
									</TableHead>

									<TableHead className="text-white px-4 py-3 text-center">
										Nhóm máu
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Loại hiến
									</TableHead>
									{/* <TableHead className="text-white px-4 py-3 text-center">Thành phần</TableHead> */}
									<TableHead className="text-white px-4 py-3 text-center">
										Số lượng
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Ngày hiến
									</TableHead>

									<TableHead className="text-white px-4 py-3 text-center">
										Trạng thái
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Hành động
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{jobs.length > 0 ? (
									jobs.map((job, i) => (
										<TableRow key={job._id} className="hover:bg-[#f9fafb]">
											<TableCell className="text-center">{i + 1}</TableCell>
											<TableCell className="text-center">
												{job.full_name|| "Chưa cập nhật"}
											</TableCell>
											<TableCell className="text-center">
												{job.blood_group_name|| "Chưa cập nhật"}
											</TableCell>
											<TableCell className="text-center">
												{bloodComponentVN(job.donation_type || "Chưa cập nhật")}
											</TableCell>
											{/* <TableCell className="text-center">{job.blood_component_name}</TableCell> */}
											<TableCell className="text-center">
												{job.volume_collected|| "Chưa cập nhật"}
											</TableCell>
											<TableCell className="text-center">
												{new Date(job.donation_date).toLocaleString("vi-VN")}
											</TableCell>
											<TableCell className="text-center">
												<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
													{statusVN(job.status|| "Chưa cập nhật")}
												</span>
											</TableCell>
											<TableCell className="text-center">
												<Button
													size="sm"
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
											colSpan={7}
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
