import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const summaryMock = [
	{ bloodGroup: "A+", productType: "Whole", quantity: 10, threshold: 5 },
	{ bloodGroup: "O-", productType: "Whole", quantity: 2, threshold: 3 },
	{ bloodGroup: "B+", productType: "Plasma", quantity: 8, threshold: 4 },
	{ bloodGroup: "AB-", productType: "Platelet", quantity: 0, threshold: 1 },
];

export const BloodSummaryTable = () => {
	const [data, setData] = useState(summaryMock);

	const updateThreshold = (index: number, value: string) => {
		const updated = [...data];
		updated[index].threshold = parseInt(value) || 0;
		setData(updated);
	};
  

	return (
		<div className="p-8 bg-[#f9fafb] min-h-screen flex flex-col items-center">
			<div className="w-full max-w-4xl">
				<h2 className="text-3xl font-semibold text-[#236afe] text-center mb-8">
					Quản lý tổng hợp nhóm máu & thành phần
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
										Nhóm máu
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Thành phần
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Số lượng
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Ngưỡng an toàn
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Trạng thái
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.map((item, idx) => (
									<TableRow key={`${item.bloodGroup}-${item.productType}`}>
										<TableCell className="text-center">{idx + 1}</TableCell>

										<TableCell className="text-center">{item.bloodGroup}</TableCell>
										<TableCell className="text-center">{item.productType}</TableCell>
										<TableCell className="text-center">{item.quantity}</TableCell>
										<TableCell className="text-center">
											<Input
												type="number"
												value={item.threshold}
												min={0}
												onChange={(e) => updateThreshold(idx, e.target.value)}
												className="w-24"
											/>
										</TableCell>
										<TableCell className="text-center">
											{item.quantity <= item.threshold ? (
												<Badge className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-400 text-white border border-red-200 ">
													⚠ Dưới ngưỡng
												</Badge>
											) : (
												<Badge className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-400  text-white border border-green-200 ">
													Ổn định
												</Badge>
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>

						<div className="mt-8 text-center">
							<Button className="bg-[#236afe] text-white px-6 py-3 rounded-xl text-lg">
								Lưu thay đổi
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};
