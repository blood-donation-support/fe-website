import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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


	const updateThreshold = (index: number, value: string) => {
		const updated = [...data];
		updated[index].threshold = parseInt(value) || 0;
		setData(updated);
	};


	const getStatusBadge = (units: number, threshold: number) => {
		if (units <= threshold) {
			return (
				<Badge className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-1">
					<AlertTriangle size={12} />
					Dưới ngưỡng
				</Badge>
			);
		}
		return (
			<Badge className="bg-green-500 hover:bg-green-600 text-white">
				Ổn định
			</Badge>
		);
	};


	if (loading) {
		return (
			<div className="p-8 bg-[#f9fafb] min-h-screen flex flex-col items-center justify-center">
				<div className="flex items-center gap-2 text-[#236afe]">
					<Loader2 className="animate-spin" size={24} />
					<span className="text-lg">Đang tải dữ liệu...</span>
				</div>
			</div>
		);
	}


	if (error) {
		return (
			<div className="p-8 bg-[#f9fafb] min-h-screen flex flex-col items-center justify-center">
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
		<div className="p-8 bg-[#f9fafb] min-h-screen flex flex-col items-center">
			<div className="w-full max-w-6xl">
				<div className="flex justify-between items-center mb-8">
					<h2 className="text-3xl font-semibold text-[#236afe]">
						Quản lý tổng hợp nhóm máu & thành phần đang có trong kho
					</h2>
					<Button
						onClick={loadData}
						variant="outline"
						className="border-[#236afe] text-[#236afe] hover:bg-[#236afe] hover:text-white"
					>
						<RefreshCw size={16} className="mr-2" />
						Làm mới
					</Button>
				</div>


				<Card className="shadow-lg border-0">
					<CardContent className="p-0">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-gradient-to-r from-[#236afe] to-[#1e5ae6] text-white">
									<tr>
										<th className="px-6 py-4 text-left font-semibold">
											Nhóm máu
										</th>
										<th className="px-6 py-4 text-left font-semibold">
											Thành phần
										</th>
										<th className="px-6 py-4 text-left font-semibold">
											Số túi máu
										</th>
										<th className="px-6 py-4 text-left font-semibold">
											Thể tích (ml)
										</th>
										{/* <th className="px-6 py-4 text-left font-semibold">Ngưỡng an toàn</th> */}
										{/* <th className="px-6 py-4 text-left font-semibold">Trạng thái</th> */}
									</tr>
								</thead>
								<tbody>
									{data.map((item, idx) => (
										<tr
											key={`${item.blood_group_id}-${item.blood_component_id}`}
											className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${item.total_units <= (item.threshold || 0)
												? "bg-red-50"
												: ""
												}`}
										>
											<td className="px-6 py-4">
												<span className="font-medium text-[#236afe]">
													{item.blood_group_name}
												</span>
											</td>
											<td className="px-6 py-4 text-gray-700">
												{item.blood_component_name}
											</td>
											<td className="px-6 py-4">
												<span className="font-semibold text-lg">
													{item.total_units}
												</span>
											</td>
											<td className="px-6 py-4 text-gray-600">
												{item.total_volume.toLocaleString()}
											</td>
											{/* <td className="px-6 py-4">
                        <Input
                          type="number"
                          value={item.threshold || 0}
                          min={0}
                          onChange={e => updateThreshold(idx, e.target.value)}
                          className="w-20 text-center border-gray-300 focus:border-[#236afe] focus:ring-[#236afe]"
                        />
                      </td> */}
											{/* <td className="px-6 py-4">
                        {getStatusBadge(item.total_units, item.threshold || 0)}
                      </td> */}
										</tr>
									))}
								</tbody>
							</table>
						</div>


						{data.length === 0 && (
							<div className="text-center py-12 text-gray-500">
								<p className="text-lg">Không có dữ liệu để hiển thị</p>
							</div>
						)}
					</CardContent>
				</Card>


				{/* <div className="mt-6 text-sm text-gray-600 bg-white p-4 rounded-lg shadow">
          <p className="font-medium mb-2">Ghi chú:</p>
          <ul className="space-y-1">
            <li>• <strong>Số đơn vị:</strong> Tổng số đơn vị máu có sẵn</li>
            <li>• <strong>Thể tích:</strong> Tổng thể tích máu tính bằng ml</li>
            <li>• <strong>Ngưỡng an toàn:</strong> Mức tồn kho tối thiểu cần duy trì</li>
            <li>• <strong>Trạng thái:</strong>
              <Badge className="bg-red-500 hover:bg-red-600 text-white ml-2 mr-1">Dưới ngưỡng</Badge>
              khi số đơn vị ≤ ngưỡng,
              <Badge className="bg-green-500 hover:bg-green-600 text-white ml-2">Ổn định</Badge>
              khi số đơn vị {">"} ngưỡng
            </li>
          </ul>
        </div> */}
			</div>
		</div>
	);
}
