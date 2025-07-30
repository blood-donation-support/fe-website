import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table";
import { RefreshCw, AlertTriangle } from "lucide-react";
import {
	fetchBloodInventoryThresholds,
	updateBloodInventoryThresholds,
} from "@/api/bloodInventoryThresholdsService";
import bloodComponentVN from "@/utils/translateBloodComponentVN";
import { toast } from "sonner";

interface BloodInventoryItem {
	_id: string;
	blood_group_id: string;
	blood_group_name: string;
	blood_component_id: string;
	blood_component_name: string;
	threshold_unit: number;
	threshold_volume_ml: number;
	threshold_unit_stable: number;
	total_units: number;
	total_volume_ml: number;
	is_stable: boolean;
}

export default function BloodSummaryTable() {
	const [data, setData] = useState<BloodInventoryItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedItem, setSelectedItem] = useState<BloodInventoryItem | null>(
		null,
	);
	const [newThreshold, setNewThreshold] = useState<number>(0);
	const [showDialog, setShowDialog] = useState(false);

	const loadData = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await fetchBloodInventoryThresholds();
			setData(response);
		} catch (err) {
			setError("Không thể tải dữ liệu. Vui lòng thử lại.");
			console.error("Error loading data:", err);
		} finally {
			setLoading(false);
		}
	};

	const updateThreshold = async (id: string, newThreshold: number) => {
		try {
			await updateBloodInventoryThresholds(id, {
				threshold_unit_stable: newThreshold,
			});
			await loadData();
		} catch (err) {
			console.error("Lỗi khi cập nhật ngưỡng:", err);
			throw err;
		}
	};

	const openEditDialog = (item: BloodInventoryItem) => {
		setSelectedItem(item);
		setNewThreshold(item.threshold_unit_stable);
		setShowDialog(true);
	};
	const handleConfirmUpdate = async () => {
		if (!selectedItem) return;
		try {
			await updateThreshold(selectedItem._id, newThreshold);
			toast.success("Cập nhật ngưỡng an toàn thành công!");
			setShowDialog(false);
			setSelectedItem(null);
		} catch (error) {
			console.error("Lỗi cập nhật:", error);
			toast.error("Cập nhật thất bại. Vui lòng thử lại.");
		}
	};

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
				An toàn
			</span>
		);
	};

	useEffect(() => {
		loadData();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
				<div className="flex flex-col items-center space-y-4">
					<div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
					<div className="text-slate-600 font-medium">Đang tải dữ liệu...</div>
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
					<h2 className="text-2xl font-semibold text-[#236afe] text-center flex-1">
						Quản lý ngưỡng an toàn của nhóm máu & thành phần đang có trong kho
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
									<TableHead className="text-white text-center">STT</TableHead>
									<TableHead className="text-white text-center">
										Nhóm máu
									</TableHead>
									<TableHead className="text-white text-center">
										Thành phần
									</TableHead>
									<TableHead className="text-white text-center">
										Số túi máu
									</TableHead>
									<TableHead className="text-white text-center">
										Thể tích (ml)
									</TableHead>
									<TableHead className="text-white text-center">
										Trạng thái
									</TableHead>
									<TableHead className="text-white text-center">
										Hành động
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.length > 0 ? (
									data.map((item, idx) => (
										<TableRow key={item._id} className="hover:bg-[#f9fafb]">
											<TableCell className="text-center">{idx + 1}</TableCell>
											<TableCell className="text-center">
												{item.blood_group_name}
											</TableCell>
											<TableCell className="text-center">
												{bloodComponentVN(item.blood_component_name)}
											</TableCell>
											<TableCell className="text-center font-semibold text-lg">
												{item.total_units}
											</TableCell>
											<TableCell className="text-center">
												{item.total_volume_ml?.toLocaleString?.() ?? "0"}
											</TableCell>
											<TableCell className="text-center">
												{getStatusBadge(
													item.total_units,
													item.threshold_unit_stable,
												)}
												<div className="text-xs text-gray-500 mt-1">
													Ngưỡng: {item.threshold_unit_stable}
												</div>
											</TableCell>
											<TableCell className="text-center">
												<Button
													variant="outline"
													size="sm"
													className="rounded-lg border-green-200 text-green-600 hover:bg-green-50"
													onClick={() => openEditDialog(item)}
												>
													<svg
														className="w-4 h-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
														/>
													</svg>
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
				{showDialog && selectedItem && (
					<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
						<div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md">
							<h3 className="text-xl font-semibold mb-4 text-center text-[#236afe]">
								Cập nhật ngưỡng an toàn
							</h3>
							<p className="text-sm text-gray-700 mb-2 text-center">
								{selectedItem.blood_group_name} -{" "}
								{bloodComponentVN(selectedItem.blood_component_name)}
							</p>

							<label className="block text-sm mb-2">
								Ngưỡng an toàn (số túi):
							</label>
							<input
								type="number"
								min={0}
								value={newThreshold}
								onChange={(e) => setNewThreshold(parseInt(e.target.value))}
								className="w-full border px-3 py-2 rounded-md mb-4 text-sm"
							/>

							<div className="flex justify-end gap-3">
								<Button
									variant="ghost"
									onClick={() => setShowDialog(false)}
									className="text-gray-500"
								>
									Hủy
								</Button>
								<Button
									onClick={handleConfirmUpdate}
									className="bg-[#236afe] hover:bg-[#1e5ae6] text-white"
								>
									Cập nhật
								</Button>
							</div>
						</div>
					</div>
				)}

				<div className="mt-6 text-sm text-gray-600 bg-white p-4 rounded-lg shadow">
					<p className="font-medium mb-2">Ghi chú:</p>
					<ul className="space-y-1">
						<li>
							• <strong>Số túi máu:</strong> Tổng số đơn vị máu hiện có trong
							kho
						</li>
						<li>
							• <strong>Thể tích:</strong> Tổng thể tích máu (đơn vị ml)
						</li>
						<li>
							• <strong>Trạng thái:</strong>{" "}
							<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 ml-2 mr-1">
								Thiếu hụt
							</span>{" "}
							khi số túi máu ≤ <strong>ngưỡng an toàn</strong>,
							<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
								An toàn
							</span>{" "}
							khi số túi máu {" > "} ngưỡng.
						</li>
						<li>
							• <strong>Ngưỡng an toàn:</strong> Có thể được tùy chỉnh cho từng
							nhóm máu và thành phần máu bằng nút <strong>chỉnh sửa</strong>.
						</li>
						<li>
							• <strong>Hệ thống sẽ tự động cảnh báo</strong> khi số lượng máu
							trong kho dưới ngưỡng an toàn, gửi thông báo đến quản trị viên.
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
