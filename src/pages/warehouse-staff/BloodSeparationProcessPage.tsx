import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	Card,
	CardContent,
} from "@/components/ui/card";
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
	fetchInventoryByRequestById,
	updateInventoryByRequest,
} from "@/api/inventoryService";
import type { InventoryItem } from "@/api/inventoryService";

import { fetchBloodGroups, fetchBloodComponents } from "@/api/bloodService";
import bloodComponentVN from "@/utils/translateBloodComponentVN";
import { Label } from "@/components/ui/label";
import statusVN from "@/utils/statusVN";
import { toast } from "sonner";

export const BloodSeparationProcessPage: React.FC = () => {
	const { id: requestId } = useParams<{ id: string }>();
	const [items, setItems] = useState<InventoryItem[]>([]);
	const [groupsMap, setGroupsMap] = useState<Record<string, string>>({});
	const [compsMap, setCompsMap] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
const navigate = useNavigate();

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

		const loadData = async () => {
			try {
				const data = await fetchInventoryByRequestById(requestId);
				const withTemp = data.map((item) => ({
					...item,
					storage_temperature: item.storage_temperature ?? 0,
				}));
        console.log(data);
				setItems(withTemp);
			} catch {
				setError("Không tải được chi tiết tồn kho.");
			} finally {
				setLoading(false);
			}

			try {
				const bg = await fetchBloodGroups();
				setGroupsMap(bg.reduce((m, g) => ({ ...m, [g._id]: g.name }), {}));
			} catch (err) {
				console.error("Lỗi lấy nhóm máu:", err);
			}

			try {
				const bc = await fetchBloodComponents();
				setCompsMap(bc.reduce((m, c) => ({ ...m, [c._id]: c.name }), {}));
			} catch (err) {
				console.error("Lỗi lấy thành phần máu:", err);
			}
		};

		loadData();
	}, [requestId]);

	const handleChange = (id: string, field: keyof InventoryItem, value: any) => {
		setItems((prev) =>
			prev.map((it) => (it._id === id ? { ...it, [field]: value } : it))
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
console.log( "item.map", items.map(
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
   toast("Cập nhật thành công", {
  description: "Thông tin tồn kho đã được lưu.",
  action: {
    label: "Hoàn tác",
    onClick: () => console.log("Undo update"),
  },
});

    navigate("/dashboard-staff-warehouse/blood-separation-list");
  } catch (error) {
    toast.error("Cập nhật thất bại", {
      description: "Vui lòng thử lại.",
    });
    setError("Lưu thay đổi thất bại.");
  } finally {
    setSaving(false);
  }
};

	if (loading) return <div className="text-center py-4">Đang tải...</div>;
	if (error) return <div className="text-red-500 text-center py-4">{error}</div>;
	if (!items.length) return <div className="text-center py-4">Không có dữ liệu.</div>;

	const groupName =
		items[0].blood_group_name ||
		groupsMap[items[0].blood_group_id] ||
		items[0].blood_group_id;
	const donationProcessId = items[0].donation_process_id;
	const reqProcessId = items[0].request_process_id;

	const byComponent = items.reduce((m: Record<string, InventoryItem[]>, it) => {
		(m[it.blood_component_id] ||= []).push(it);
		return m;
	}, {} as Record<string, InventoryItem[]>);

	return (
		<div className="p-6 md:p-10 bg-[#f9fafb] min-h-screen">
			<div className="max-w-6xl mx-auto space-y-8">
				<h2 className="text-3xl font-bold text-[#236AFE] text-center">
					Chi tiết tồn kho
				</h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-white p-6 rounded-2xl border shadow text-base text-gray-800">
					<div className="flex flex-col gap-1">
						<p className="text-sm text-gray-500">Nhóm máu</p>
						<p className="text-lg font-semibold">{groupName}</p>
					</div>
					<div className="flex flex-col gap-1">
						<p className="text-sm text-gray-500">Mã chu trình lấy máu</p>
						<p className="text-lg font-semibold break-words">
							{donationProcessId}
						</p>
					</div>
					<div className="flex flex-col gap-1">
						<p className="text-sm text-gray-500">Mã chu trình xét nghiệm</p>
						<p className="text-lg font-semibold break-words">{reqProcessId}</p>
					</div>
				</div>

				{Object.entries(byComponent).map(([compId, list]) => {
					const compName = bloodComponentVN(
						compsMap[compId] || list[0].blood_component_name || compId,
					);

					return (
						<Card key={compId} className="border shadow-sm">
							<CardContent className="p-6 space-y-4">
								<h3 className="text-xl font-semibold text-[#236AFE] mb-2">
									{compName}
								</h3>
								<div className="grid gap-4">
									{list.map((it, index) => (
										<div
											key={it._id}
											className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border"
										>
											<div className="space-y-1">
												<Label htmlFor={`note-${it._id}`}>Ghi chú</Label>
												<Input
													id={`note-${it._id}`}
													value={it.note || ""}
													onChange={(e) =>
														handleChange(it._id, "note", e.target.value)
													}
													placeholder="Nhập ghi chú"
												/>
											</div>
											<div className="space-y-1">
												<Label htmlFor={`volume-${it._id}`}>
													Thể tích (ml)
												</Label>
												<Input
													id={`volume-${it._id}`}
													type="number"
													value={it.volume}
													onChange={(e) =>
														handleChange(
															it._id,
															"volume",
															Number(e.target.value),
														)
													}
												/>
											</div>

											<div className="space-y-1">
												<Label htmlFor={`temp-${it._id}`}>
													Nhiệt độ bảo quản (°C)
												</Label>
												<Input
													id={`temp-${it._id}`}
													type="number"
													placeholder="0"
													value={it.storage_temperature || ""}
													onChange={(e) =>
														handleChange(
															it._id,
															"storage_temperature",
															Number(e.target.value),
														)
													}
												/>
											</div>

											<div className="space-y-1">
												<Label>Trạng thái</Label>
												<Select
													value={it.status || ""}
													onValueChange={(v) =>
														handleChange(it._id, "status", v)
													}
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Chọn trạng thái" />
													</SelectTrigger>
													<SelectContent>
														{STATUS_OPTIONS.map((opt) => (
															<SelectItem key={opt} value={opt}>
																{statusVN(opt)}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
											<div className="space-y-1">
												<Label htmlFor={`expired-${it._id}`}>
													Hết hạn ngày
												</Label>
												<Input
													id={`expired-${it._id}`}
													type="date"
													value={it.expired_at || ""}
													onChange={(e) =>
														handleChange(it._id, "expired_at", e.target.value)
													}
													disabled
												/>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					);
				})}

				<div className="text-right">
					<Button onClick={handleSave} disabled={saving}>
						{saving ? "Đang lưu..." : "Lưu thay đổi"}
					</Button>
				</div>
			</div>
		</div>
	);
};
