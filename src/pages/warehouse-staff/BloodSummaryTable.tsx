import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table";
import { Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { fetchBloodStorageSummary } from "@/api/dashboardService";

// Define interfaces based on the API response
interface BloodStorageItem {
	blood_component_name: string;
	blood_group_name: string;
	total_units: number;
	total_volume: number;
	blood_component_id: string;
	blood_group_id: string;
	threshold?: number; // Add threshold for local state management
}

export default function BloodSummaryTable() {
	const [data, setData] = useState<BloodStorageItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadData = async () => {
		try {
			setLoading(true);
			setError(null);

			// Use actual API call
			const response = await fetchBloodStorageSummary();

			// Add default threshold values to the API response
			const dataWithThresholds = response.map((item) => ({
				...item,
				threshold: 2, // Default threshold - you can customize this or fetch from another API
			}));

			setData(dataWithThresholds);
		} catch (err) {
			setError("Không thể tải dữ liệu. Vui lòng thử lại.");
			console.error("Error loading data:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	const getStatusBadge = (units: number, threshold: number) => {
		if (units <= threshold) {
			return (
				<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
					<AlertTriangle size={12} className="mr-1" />
					Thiếu hụt
				</span>
			);
		}
		return (
			<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
				Ngưỡng an toàn
			</span>
		);
	};

	if (loading) {
		return (
			<div className="p-4 bg-[#f9fafb] min-h-screen flex flex-col items-center justify-center">
				<div className="flex items-center gap-2 text-[#236afe]">
					<Loader2 className="animate-spin" size={24} />
					<span className="text-lg">Đang tải dữ liệu...</span>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-4 bg-[#f9fafb] min-h-screen flex flex-col items-center justify-center">
				<div className="text-center">
					<div className="text-red-500 mb-4">
						<AlertTriangle size={48} className="mx-auto mb-2" />
						<p className="text-lg font-medium">{error}</p>
					</div>
					<Button
						onClick={loadData}
						className="bg-[#236afe] hover:bg-[#1e5ae6]"
					>
						<RefreshCw size={16} className="mr-2" />
						Thử lại
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="p-4 bg-[#f9fafb] min-h-screen flex flex-col items-center">
			<div className="w-full max-w-8xl">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-3xl font-semibold text-[#236afe] text-center flex-1">
						Quản lý tổng hợp nhóm máu & thành phần đang có trong kho
					</h2>
					<Button
						onClick={loadData}
						variant="outline"
						className="border-[#236afe] text-[#236afe] hover:bg-[#236afe] hover:text-white ml-4"
					>
						<RefreshCw size={16} className="mr-2" />
						Làm mới
					</Button>
				</div>

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
										Số túi máu
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Thể tích (ml)
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Trạng thái
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.length > 0 ? (
									data.map((item, idx) => (
										<TableRow
											key={`${item.blood_group_id}-${item.blood_component_id}`}
											className="hover:bg-[#f9fafb]"
										>
											<TableCell className="text-center">{idx + 1}</TableCell>
											<TableCell className="text-center">
												{item.blood_group_name || "Chưa cập nhật"}
											</TableCell>
											<TableCell className="text-center">
												{item.blood_component_name || "Chưa cập nhật"}
											</TableCell>
											<TableCell className="text-center">
												<span className="font-semibold text-lg">
													{item.total_units}
												</span>
											</TableCell>
											<TableCell className="text-center">
												{item.total_volume.toLocaleString()}
											</TableCell>
											<TableCell className="text-center">
												{getStatusBadge(item.total_units, item.threshold || 0)}
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={6}
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

				<div className="mt-6 text-sm text-gray-600 bg-white p-4 rounded-lg shadow">
					<p className="font-medium mb-2">Ghi chú:</p>
					<ul className="space-y-1">
						<li>• <strong>Số túi máu:</strong> Tổng số đơn vị máu có sẵn</li>
						<li>• <strong>Thể tích:</strong> Tổng thể tích máu tính bằng ml</li>
						<li>• <strong>Trạng thái:</strong>
							<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 ml-2 mr-1">
								Thiếu hụt
							</span>
							khi số túi máu ≤ 2,
							<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
								Ngưỡng an toàn
							</span>
							khi số túi máu {">"} 2
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}