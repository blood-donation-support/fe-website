import React from "react";
import {
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Paper,
	Chip,
} from "@mui/material";
import type { DonationForm } from "@/types/dashboard";
import statusVN from "@/utils/statusVN";
import bloodComponentVN from "@/utils/translateBloodComponentVN";

interface BloodDonationTableProps {
	data: DonationForm[];
}

export default function BloodDonationTable({ data }: BloodDonationTableProps) {
	return (
		<TableContainer component={Paper} className="shadow-lg">
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Mã hồ sơ</TableCell>
						<TableCell>Người hiến</TableCell>
						<TableCell>Nhóm máu</TableCell>
						<TableCell>Loại hiến</TableCell>
						<TableCell>Ngày đăng ký</TableCell>
						<TableCell>Trạng thái</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data.map((row) => (
						<TableRow key={row.id}>
							<TableCell>{row.id}</TableCell>
							<TableCell>{row.donorName}</TableCell>
							<TableCell>{row.bloodGroupName}</TableCell>
							<TableCell> {bloodComponentVN(row.donationType)}</TableCell>
							<TableCell>
								{new Date(row.registerDate).toLocaleDateString("vi-VN")}
							</TableCell>
							<TableCell>
								<Chip
									label={statusVN(row.status)}
									size="small"
									color={
										row.status === "Approved"
											? "success"
											: row.status === "Pending"
											? "warning"
											: "error"
									}
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
