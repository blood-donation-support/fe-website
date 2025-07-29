import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Label } from "@/components/ui/label";
import { Activity, ArrowLeft, Droplets } from "lucide-react";
import { toast } from "sonner";

import {
	fetchInventoryByRequestById,
	updateInventoryByRequest,
} from "@/api/inventoryService";
import { fetchBloodGroups, fetchBloodComponents } from "@/api/bloodService";
import bloodComponentVN from "@/utils/translateBloodComponentVN";
import statusVN from "@/utils/statusVN";
import type { InventoryItem } from "@/api/inventoryService";

export const BloodSeparationProcessPage: React.FC = () => {
	const { id: requestId } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const [items, setItems] = useState<InventoryItem[]>([]);
	const [groupsMap, setGroupsMap] = useState<Record<string, string>>({});
	const [compsMap, setCompsMap] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	const STATUS_OPTIONS = [
		"Available",
		"Reserved",
		"Used",
		"Expired",
		"Damaged",
	];

	useEffect(() => {
		if (!requestId) return;
		setLoading(true);
		(async () => {
			try {
				const data = await fetchInventoryByRequestById(requestId);
				setItems(
					data.map((item) => ({
						...item,
						storage_temperature: item.storage_temperature,
					})),
				);

				const bg = await fetchBloodGroups();
				setGroupsMap(bg.reduce((m, g) => ({ ...m, [g._id]: g.name }), {}));

				const bc = await fetchBloodComponents();
				setCompsMap(bc.reduce((m, c) => ({ ...m, [c._id]: c.name }), {}));
			} catch {
				setError("Không tải được dữ liệu tồn kho.");
			} finally {
				setLoading(false);
			}
		})();
	}, [requestId]);

	const handleChange = (id: string, field: keyof InventoryItem, value: any) => {
		setItems((prev) =>
			prev.map((it) => (it._id === id ? { ...it, [field]: value } : it)),
		);
	};

	const handleSave = async () => {
		setSaving(true);
		try {
			await updateInventoryByRequest(
				requestId!,
				items.map(
					({
						blood_group_id,
						blood_component_id,
						note,
						volume,
						status,
						storage_temperature,
					}) => ({
						blood_group_id,
						blood_component_id,
						note,
						volume,
						status,
						storage_temperature,
					}),
				),
			);
			toast.success("Cập nhật thành công");
			navigate("/dashboard-staff-warehouse/blood-separation-list");
		} catch {
			setError("Lưu thay đổi thất bại.");
			toast.error("Cập nhật thất bại");
		} finally {
			setSaving(false);
		}
	};

	const format = (dateString: string) => {
		const d = new Date(dateString);
		return d.toLocaleString("vi-VN", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

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

	if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

	if (!items.length)
		return <div className="p-6 text-center">Không có dữ liệu.</div>;

	const groupName =
		items[0].blood_group_name ||
		groupsMap[items[0].blood_group_id] ||
		items[0].blood_group_id;

	const byComponent = items.reduce((m: Record<string, InventoryItem[]>, it) => {
		(m[it.blood_component_id] ||= []).push(it);
		return m;
	}, {} as Record<string, InventoryItem[]>);

	const donationDate = items[0]?.created_at;

	return (
		<div className="min-h-screen bg-white p-6">
			<div className="max-w-6xl mx-auto space-y-8">
				{/* Header */}
				<Card>
					<CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-t-lg">
						<div className="flex items-center justify-between">
							<Button
								variant="ghost"
								onClick={() => navigate(-1)}
								className="text-white"
							>
								<ArrowLeft />
							</Button>
							<CardTitle className="text-2xl">Chi tiết nhập kho</CardTitle>
							<div />
						</div>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2">
							<div>
								<Label>Nhóm máu</Label>
								<p className="font-semibold">{groupName}</p>
							</div>
							<div>
								<Label>Loại hiến</Label>
								<p className="font-semibold break-words">
									{bloodComponentVN(items[0].donation_type || "Chưa có")}
								</p>
							</div>
							<div>
								<Label>Ngày hiến</Label>
								<p className="font-semibold break-words">
									{donationDate ? format(donationDate) : "Chưa có"}
								</p>
							</div>
							<div>
								<Label>Mã chu trình lấy máu</Label>
								<p className="font-semibold break-words">
									{items[0].donation_process_id}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Components */}
				{Object.entries(byComponent).map(([compId, list]) => (
					<Card
						key={compId}
						className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-slate-50 hover:shadow-xl transition-all duration-300"
					>
						<CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
							<CardTitle className="text-xl font-semibold flex items-center gap-3">
								<div className="w-2 h-2 bg-blue-200 rounded-full"></div>
								{bloodComponentVN(
									compsMap[compId] || list[0].blood_component_name || compId,
								)}
								<span className="ml-auto bg-blue-500/20 px-3 py-1 rounded-full text-sm font-medium">
									{list.length} mẫu
								</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="p-6 space-y-6">
							{list.map((it, index) => (
								<div
									key={it._id}
									className={`
     relative overflow-visible rounded-xl border-l-4 border-blue-400
     bg-gradient-to-r from-blue-50/80 to-white
     hover:from-blue-100/80 hover:to-blue-50/50
     transition-all duration-300 hover:shadow-md
     ${index !== list.length - 1 ? "mb-4" : ""}
   `}
								>
									{/* Item number indicator */}
									<div
										className="absolute -top-2 -left-2 w-8 h-8 bg-blue-600 text-white
             rounded-full flex items-center justify-center text-sm
             font-bold shadow-lg"
									>
										{index + 1}
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 pt-8">
										<div className="space-y-2">
											<Label className="text-blue-800 font-medium flex items-center gap-2">
												<svg
													className="w-4 h-4"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.828-2.828z" />
												</svg>
												Ghi chú
											</Label>
											<Input
												value={it.note || ""}
												onChange={(e) =>
													handleChange(it._id, "note", e.target.value)
												}
												className="border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80 backdrop-blur-sm"
												placeholder="Nhập ghi chú..."
											/>
										</div>

										<div className="space-y-2">
											<Label className="text-blue-800 font-medium flex items-center gap-2">
												<svg
													className="w-4 h-4"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path
														fillRule="evenodd"
														d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
														clipRule="evenodd"
													/>
												</svg>
												Thể tích (ml)
											</Label>
											<Input
												type="number"
												value={it.volume}
												onChange={(e) =>
													handleChange(it._id, "volume", Number(e.target.value))
												}
												className="border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80 backdrop-blur-sm"
												placeholder="0"
											/>
										</div>

										<div className="space-y-2">
											<Label className="text-blue-800 font-medium flex items-center gap-2">
												<svg
													className="w-4 h-4"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path
														fillRule="evenodd"
														d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 9a1 1 0 000 2h2a1 1 0 100-2H8z"
														clipRule="evenodd"
													/>
												</svg>
												Nhiệt độ (°C)
											</Label>
											<Input
												type="number"
												value={it.storage_temperature}
												onChange={(e) =>
													handleChange(
														it._id,
														"storage_temperature",
														Number(e.target.value),
													)
												}
												className="border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80 backdrop-blur-sm"
												placeholder="0"
											/>
										</div>

										<div className="space-y-2">
											<Label className="text-blue-800 font-medium flex items-center gap-2">
												<svg
													className="w-4 h-4"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path
														fillRule="evenodd"
														d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
														clipRule="evenodd"
													/>
												</svg>
												Trạng thái
											</Label>
											<Select
												value={it.status || ""}
												onValueChange={(v) => handleChange(it._id, "status", v)}
											>
												<SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80 backdrop-blur-sm">
													<SelectValue placeholder="Chọn trạng thái" />
												</SelectTrigger>
												<SelectContent className="bg-white border-blue-200">
													{STATUS_OPTIONS.map((opt) => (
														<SelectItem
															key={opt}
															value={opt}
															className="focus:bg-blue-50 focus:text-blue-900"
														>
															<span className="flex items-center gap-2">
																<div
																	className={`w-2 h-2 rounded-full ${
																		opt === "active"
																			? "bg-green-500"
																			: opt === "inactive"
																			? "bg-red-500"
																			: "bg-yellow-500"
																	}`}
																></div>
																{statusVN(opt)}
															</span>
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>

									{/* Bottom accent line */}
									<div className="h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"></div>
								</div>
							))}
						</CardContent>
					</Card>
				))}

				{/* Save */}
				<div className="text-right">
					<Button
						onClick={handleSave}
						disabled={saving}
						className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md disabled:opacity-70"
					>
						{saving ? "Đang lưu..." : "Nhập kho"}
					</Button>
				</div>
			</div>
		</div>
	);
};
