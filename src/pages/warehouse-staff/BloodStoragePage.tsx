import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table";
import { fetchInventory } from "@/api/inventoryService";
import type { InventoryItem } from "@/api/inventoryService";
import { fetchBloodGroups, fetchBloodComponents } from "@/api/bloodService";
import bloodComponentVN from "@/utils/translateBloodComponentVN";
import { BloodStorageProcessPage } from "./BloodStorageProcessPage";
import { BloodReleaseForm } from "./BloodReleaseForm";
import { BloodDiscardForm } from "./BloodDiscardForm";
import { ChevronDown } from "lucide-react";
import statusVN from "@/utils/statusVN";

export type Status = "Available" | "Reserved" | "Used" | "Expired" | "Damaged";

const statusStyles: Record<Status, string> = {
	Available: "bg-green-100 text-green-800",
	Reserved: "bg-yellow-100 text-yellow-800",
	Used: "bg-red-100 text-red-800",
	Expired: "bg-gray-100 text-gray-600",
	Damaged: "bg-red-200 text-red-800",
};

const tabs = [
	{ key: "inventory" as const, label: "Tồn kho hiện tại" },
	{ key: "discard" as const, label: "Hủy máu" },
];
export const BloodStoragePage: React.FC = () => {
	// const [tab, setTab] = useState<'inventory' | 'intake' | 'release' | 'discard'>('inventory');
	const [tab, setTab] = useState<"inventory" | "discard">("inventory");

	const [data, setData] = useState<InventoryItem[]>([]);
	const [groups, setGroups] = useState<Record<string, string>>({});
	const [comps, setComps] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [expandedId, setExpandedId] = useState<string | null>(null);

	useEffect(() => {
		if (tab !== "inventory") return;
		setLoading(true);
		Promise.all([fetchInventory(), fetchBloodGroups(), fetchBloodComponents()])
			.then(([inv, bg, bc]) => {
				setData(inv);
				setGroups(bg.reduce((m, g) => ({ ...m, [g._id]: g.name }), {}));
				setComps(bc.reduce((m, c) => ({ ...m, [c._id]: c.name }), {}));
			})
			.catch(() => setError("Không tải được dữ liệu tồn kho."))
			.finally(() => setLoading(false));
	}, [tab]);

	return (
		<div className="p-8 bg-[#f9fafb] min-h-screen flex flex-col items-center">
			<div className="w-full max-w-4xl">
				<h2 className="text-3xl font-semibold text-[#236afe] text-center mb-6">
					Quản lý kho máu
				</h2>

				{/* Tabs */}
				<div className="flex justify-center gap-4 mb-6">
					{tabs.map((t) => (
						<Button
							key={t.key}
							className={`px-6 py-2 rounded-xl text-lg ${
								tab === t.key
									? "bg-[#236afe] text-white"
									: "bg-white border border-[#236afe] text-[#236afe]"
							}`}
							onClick={() => setTab(t.key)}
						>
							{t.label}
						</Button>
					))}
				</div>

				<Card className="shadow-lg">
					<CardContent className="p-6">
						{tab === "inventory" &&
							(loading ? (
								<div className="text-center py-4">Đang tải dữ liệu...</div>
							) : error ? (
								<div className="text-red-500 text-center py-4">{error}</div>
							) : (
								// <Card className="shadow-lg">
								<CardContent className="p-6">
									{tab === "inventory" &&
										(loading ? (
											<div className="text-center py-4">
												Đang tải dữ liệu...
											</div>
										) : error ? (
											<div className="text-red-500 text-center py-4">
												{error}
											</div>
										) : (
											<Table className="border rounded-xl overflow-hidden">
												<TableHeader className="bg-[#236afe] text-white">
													<TableRow>
														<TableHead className="text-white px-4 py-3">
															Nhóm máu
														</TableHead>
														<TableHead className="text-white px-4 py-3">
															Thành phần
														</TableHead>
														<TableHead className="text-white px-4 py-3 ">
															Thể tích (ml)
														</TableHead>
														<TableHead className="text-white px-4 py-3 text-center">
															Trạng thái
														</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{data.map((item) => {
														const isOpen = expandedId === item._id;
														const bgName =
															groups[item.blood_group_id] ??
															item.blood_group_id;
														const compVn = bloodComponentVN(
															comps[item.blood_component_id] ??
																item.blood_component_id,
														);
														const statusKey =
															(item.status as Status) || "Available";
														const badgeClass =
															statusStyles[statusKey] ||
															"bg-gray-100 text-gray-600";

														return (
															<React.Fragment key={item._id}>
																<TableRow
																	className="hover:bg-gray-50 transition cursor-pointer group"
																	onClick={() =>
																		setExpandedId(isOpen ? null : item._id)
																	}
																>
																	<TableCell className="px-4 py-3 flex items-center gap-2">
																		<ChevronDown
																			size={16}
																			className={`transition-transform ${
																				isOpen ? "rotate-180" : ""
																			}`}
																		/>
																		{bgName}
																	</TableCell>
																	<TableCell className="px-4 py-3">
																		{compVn}
																	</TableCell>
																	<TableCell className="px-4 py-3">
																		{item.volume}
																	</TableCell>
																	<TableCell className="px-4 py-3 text-center">
																		<span
																			className={`inline-block px-2 py-1 rounded-full text-sm ${badgeClass}`}
																		>
																			{statusVN(item.status  || "Không có")}
																		</span>
																	</TableCell>
																</TableRow>

																{isOpen && (
																	<TableRow className="bg-gray-50">
																		<TableCell
																			colSpan={4}
																			className="px-6 py-4 text-sm text-gray-700"
																		>
																			<div>
																				<strong>Mã Chu Trình Lấy Máu:</strong>{" "}
																				{item.donation_process_id}
																			</div>
																			<div>
																				<strong>Mã Chu Trình Xét Nghiệm:</strong>{" "}
																				{item.request_process_id}
																			</div>
																			<div>
																				<strong>Cập nhập bở<i></i>:</strong>{" "}
																				{item.update_by}
																			</div>
																			<div>
																				<strong>Tạo ngày:</strong>{" "}
																				{format(
																					new Date(item.created_at),
																					"yyyy-MM-dd HH:mm",
																				)}
																			</div>
																			<div>
																				<strong>Cập nhật ngày:</strong>{" "}
																				{format(
																					new Date(item.updated_at),
																					"yyyy-MM-dd HH:mm",
																				)}
																			</div>
																		</TableCell>
																	</TableRow>
																)}
															</React.Fragment>
														);
													})}
												</TableBody>
											</Table>
										))}
								</CardContent>
								// </Card>
							))}

						{/* {tab === 'intake' && <BloodStorageProcessPage />} */}
						{/* {tab === 'release' && <BloodReleaseForm />} */}
						{tab === "discard" && <BloodDiscardForm />}
					</CardContent>
				</Card>
			</div>
		</div>
	);
};
