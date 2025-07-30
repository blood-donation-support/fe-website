import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { fetchInventory } from "@/api/inventoryService";
import type { InventoryItem } from "@/api/inventoryService";
import { fetchBloodGroups, fetchBloodComponents, updateBloodUnitStatus } from "@/api/bloodService";
import bloodComponentVN from "@/utils/translateBloodComponentVN";
import { BloodStorageProcessPage } from "./BloodStorageProcessPage";
import { BloodReleaseForm } from "./BloodReleaseForm";
import { BloodDiscardForm } from "./BloodDiscardForm";
import { ChevronDown, X, Edit } from "lucide-react";
import statusVN from "@/utils/statusVN";
import { toast } from "react-toastify";

export enum BloodUnitStatus {
	Available = "Available",
	Reserved = "Reserved",
	Used = "Used",
	Expired = "Expired",
	Damaged = "Damaged",
}

const statusStyles: Record<BloodUnitStatus, string> = {
	[BloodUnitStatus.Available]: "bg-green-100 text-green-800",
	[BloodUnitStatus.Reserved]: "bg-yellow-100 text-yellow-800",
	[BloodUnitStatus.Used]: "bg-red-100 text-red-800",
	[BloodUnitStatus.Expired]: "bg-gray-100 text-gray-600",
	[BloodUnitStatus.Damaged]: "bg-red-200 text-red-800",
};

export const BloodStoragePage: React.FC = () => {
	const [data, setData] = useState<InventoryItem[]>([]);
	const [groups, setGroups] = useState<Record<string, string>>({});
	const [comps, setComps] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [expandedId, setExpandedId] = useState<string | null>(null);
	const [tab] = useState("inventory"); // Assuming tab is managed elsewhere

	// Status update modal states
	const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
	const [updatingStatus, setUpdatingStatus] = useState(false);

	// Filter states
	const [searchText, setSearchText] = useState("");
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const [bloodGroupFilter, setBloodGroupFilter] = useState("all");
	const [bloodComponentFilter, setBloodComponentFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");
	const [volumeMinFilter, setVolumeMinFilter] = useState("");
	const [volumeMaxFilter, setVolumeMaxFilter] = useState("");
	const [dateFromFilter, setDateFromFilter] = useState<Date | undefined>(
		undefined,
	);
	const [dateToFilter, setDateToFilter] = useState<Date | undefined>(undefined);

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

	// Filtered data
	const filteredData = useMemo(() => {
		return data.filter((item) => {
			// Search text filter
			if (searchText) {
				const searchLower = searchText.toLowerCase();
				const bgName = (
					groups[item.blood_group_id] ?? item.blood_group_id
				).toLowerCase();
				const compName = (
					comps[item.blood_component_id] ?? item.blood_component_id
				).toLowerCase();
				const searchMatch =
					bgName.includes(searchLower) ||
					compName.includes(searchLower) ||
					item.donation_process_id?.toLowerCase().includes(searchLower) ||
					item.request_process_id?.toLowerCase().includes(searchLower);

				if (!searchMatch) return false;
			}

			// Blood group filter
			if (
				bloodGroupFilter !== "all" &&
				item.blood_group_id !== bloodGroupFilter
			) {
				return false;
			}

			// Blood component filter
			if (
				bloodComponentFilter !== "all" &&
				item.blood_component_id !== bloodComponentFilter
			) {
				return false;
			}

			// Status filter
			if (statusFilter !== "all" && item.status !== statusFilter) {
				return false;
			}

			// Volume filter
			if (volumeMinFilter && item.volume < parseInt(volumeMinFilter)) {
				return false;
			}
			if (volumeMaxFilter && item.volume > parseInt(volumeMaxFilter)) {
				return false;
			}

			// Date range filter
			if (dateFromFilter || dateToFilter) {
				const itemDate = new Date(item.created_at);
				if (dateFromFilter && itemDate < dateFromFilter) {
					return false;
				}
				if (dateToFilter && itemDate > dateToFilter) {
					return false;
				}
			}

			// Selected date filter (legacy)
			if (selectedDate) {
				const itemDate = new Date(item.created_at);
				const selectedDateOnly = new Date(
					selectedDate.getFullYear(),
					selectedDate.getMonth(),
					selectedDate.getDate(),
				);
				const itemDateOnly = new Date(
					itemDate.getFullYear(),
					itemDate.getMonth(),
					itemDate.getDate(),
				);
				if (itemDateOnly.getTime() !== selectedDateOnly.getTime()) {
					return false;
				}
			}

			return true;
		});
	}, [
		data,
		searchText,
		bloodGroupFilter,
		bloodComponentFilter,
		statusFilter,
		volumeMinFilter,
		volumeMaxFilter,
		dateFromFilter,
		dateToFilter,
		selectedDate,
		groups,
		comps,
	]);

	// Clear all filters
	const clearAllFilters = () => {
		setSearchText("");
		setSelectedDate(undefined);
		setBloodGroupFilter("all");
		setBloodComponentFilter("all");
		setStatusFilter("all");
		setVolumeMinFilter("");
		setVolumeMaxFilter("");
		setDateFromFilter(undefined);
		setDateToFilter(undefined);
	};

	// Count active filters
	const activeFiltersCount = [
		searchText,
		selectedDate,
		bloodGroupFilter !== "all",
		bloodComponentFilter !== "all",
		statusFilter !== "all",
		volumeMinFilter,
		volumeMaxFilter,
		dateFromFilter,
		dateToFilter,
	].filter(Boolean).length;

	// Handle status update
	const handleStatusUpdate = (item: InventoryItem) => {
		setSelectedItem(item);
		setIsStatusModalOpen(true);
	};

	const confirmStatusUpdate = async () => {
		if (!selectedItem) return;

		setUpdatingStatus(true);
		try {
			// Call the updateBloodUnitStatus API
			await updateBloodUnitStatus(selectedItem._id, { 
				status: BloodUnitStatus.Damaged 
			});

			// Update the item in the data array
			setData((prevData) =>
				prevData.map((item) =>
					item._id === selectedItem._id
						? {
								...item,
								status: BloodUnitStatus.Damaged,
								updated_at: new Date().toISOString(),
						  }
						: item,
				),
			);

			setIsStatusModalOpen(false);
			setSelectedItem(null);
			toast.success("Cập nhật trạng thái thành công");
		} catch (error) {
			console.error("Failed to update status:", error);
			toast.error("Cập nhật trạng thái thất bại. Vui lòng thử lại.");
		} finally {
			setUpdatingStatus(false);
		}
	};

	const closeStatusModal = () => {
		setIsStatusModalOpen(false);
		setSelectedItem(null);
	};

	return (
		<div className="p-4 bg-[#f9fafb] min-h-screen flex flex-col items-center">
			<div className="w-full max-w-8xl">
				<h2 className="text-3xl font-semibold text-[#236afe] text-center mb-6">
					Quản lý kho máu
				</h2>

				{/* Enhanced Filter Card */}
				<Card className="border-0 mb-8 overflow-hidden shadow-lg">
					<div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1"></div>
					<CardContent className="p-8">
						<div className="space-y-8">
							{/* Calendar and Filters in 2-column layout */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{/* Left: Calendar */}
								<div className="space-y-3 col-span-1">
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-purple-500 rounded-full" />
										<label className="text-sm font-semibold text-gray-700 tracking-wide">
											CHỌN NGÀY CỤ THỂ
										</label>
									</div>
									<div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
										<Calendar
											mode="single"
											selected={selectedDate}
											onSelect={setSelectedDate}
											className="w-full"
										/>
									</div>
								</div>

								{/* Right: Filter column */}
								<div className="col-span-1 md:col-span-2 grid grid-cols-1 gap-6">
									{/* NHÓM MÁU */}
									<div className="space-y-3">
										<div className="flex items-center gap-2">
											<div className="w-2 h-2 bg-red-500 rounded-full" />
											<label className="text-sm font-semibold text-gray-700 tracking-wide">
												NHÓM MÁU
											</label>
										</div>
										<Select
											value={bloodGroupFilter}
											onValueChange={setBloodGroupFilter}
										>
											<SelectTrigger className="w-full h-12 bg-white border-gray-200 rounded-xl shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-200">
												<SelectValue placeholder="Tất cả nhóm máu" />
											</SelectTrigger>
											<SelectContent className="rounded-xl border-gray-200 shadow-xl">
												<SelectItem value="all">Tất cả</SelectItem>
												{Object.entries(groups).map(([id, name]) => (
													<SelectItem key={id} value={id}>
														{name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									{/* THÀNH PHẦN */}
									<div className="space-y-3">
										<div className="flex items-center gap-2">
											<div className="w-2 h-2 bg-orange-500 rounded-full" />
											<label className="text-sm font-semibold text-gray-700 tracking-wide">
												THÀNH PHẦN
											</label>
										</div>
										<Select
											value={bloodComponentFilter}
											onValueChange={setBloodComponentFilter}
										>
											<SelectTrigger className="w-full h-12 bg-white border-gray-200 rounded-xl shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-200">
												<SelectValue placeholder="Tất cả thành phần" />
											</SelectTrigger>
											<SelectContent className="rounded-xl border-gray-200 shadow-xl">
												<SelectItem value="all">Tất cả</SelectItem>
												{Object.entries(comps).map(([id, name]) => (
													<SelectItem key={id} value={id}>
														{bloodComponentVN(name)}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									{/* TRẠNG THÁI */}
									<div className="space-y-3">
										<div className="flex items-center gap-2">
											<div className="w-2 h-2 bg-emerald-500 rounded-full" />
											<label className="text-sm font-semibold text-gray-700 tracking-wide">
												TRẠNG THÁI
											</label>
										</div>
										<Select
											value={statusFilter}
											onValueChange={setStatusFilter}
										>
											<SelectTrigger className="w-full h-12 bg-white border-gray-200 rounded-xl shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-200">
												<SelectValue placeholder="Tất cả trạng thái" />
											</SelectTrigger>
											<SelectContent className="rounded-xl border-gray-200 shadow-xl">
												<SelectItem value="all">Tất cả</SelectItem>
												{Object.values(BloodUnitStatus).map((status) => (
													<SelectItem key={status} value={status}>
														{statusVN(status)}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									{/* THỂ TÍCH */}
									<div className="space-y-3">
										<div className="flex items-center gap-2">
											<div className="w-2 h-2 bg-blue-500 rounded-full" />
											<label className="text-sm font-semibold text-gray-700 tracking-wide">
												THỂ TÍCH (ML)
											</label>
										</div>
										<div className="flex gap-2">
											<Input
												type="number"
												placeholder="Tối thiểu"
												value={volumeMinFilter}
												onChange={(e) => setVolumeMinFilter(e.target.value)}
												className="flex-1 h-12 bg-white border-gray-200 rounded-xl shadow-sm hover:border-gray-300 hover:shadow-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
											/>
											<Input
												type="number"
												placeholder="Tối đa"
												value={volumeMaxFilter}
												onChange={(e) => setVolumeMaxFilter(e.target.value)}
												className="flex-1 h-12 bg-white border-gray-200 rounded-xl shadow-sm hover:border-gray-300 hover:shadow-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Results Card */}
				<Card className="shadow-lg">
					<CardContent className="p-6">
						{tab === "inventory" &&
							(loading ? (
								<div className="text-center py-8">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
									<p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
								</div>
							) : error ? (
								<div className="text-red-500 text-center py-8 bg-red-50 rounded-lg">
									<p className="font-medium">{error}</p>
								</div>
							) : (
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<h3 className="text-lg font-semibold text-gray-800">
											Kết quả tìm kiếm
										</h3>
										<span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
											{filteredData.length} / {data.length} mẫu máu
										</span>
									</div>

									<Table className="border rounded-xl overflow-hidden">
										<TableHeader className="bg-[#236afe] text-white">
											<TableRow>
												<TableHead className="text-white px-4 py-3">
													STT
												</TableHead>
												<TableHead className="text-white px-4 py-3">
													Nhóm máu
												</TableHead>
												<TableHead className="text-white px-4 py-3">
													Thành phần
												</TableHead>
												<TableHead className="text-white px-4 py-3">
													Thể tích (ml)
												</TableHead>
												<TableHead className="text-white px-4 py-3">
													Ngày hết hạn
												</TableHead>
												<TableHead className="text-white px-4 py-3">
													Trạng thái
												</TableHead>
												<TableHead className="text-white px-4 py-3">
													Ngày tạo
												</TableHead>
												<TableHead className="text-white px-4 py-3">
													Cập nhật bởi
												</TableHead>
												<TableHead className="text-white px-4 py-3">
													Thao tác
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{filteredData.length === 0 ? (
												<TableRow>
													<TableCell
														colSpan={9}
														className="text-center py-8 text-gray-500"
													>
														Không tìm thấy dữ liệu phù hợp với bộ lọc
													</TableCell>
												</TableRow>
											) : (
												filteredData.map((item, index) => {
													const isOpen = expandedId === item._id;
													const bgName =
														groups[item.blood_group_id] ?? item.blood_group_id;
													const compVn = bloodComponentVN(
														comps[item.blood_component_id] ??
															item.blood_component_id,
													);
													const statusKey =
														(item.status as BloodUnitStatus) ||
														BloodUnitStatus.Available;
													const badgeClass =
														statusStyles[statusKey] ||
														"bg-gray-100 text-gray-600";
													const canUpdateStatus =
														item.status === BloodUnitStatus.Available;

													return (
														<React.Fragment key={item._id}>
															<TableRow className="hover:bg-gray-50 transition group">
																<TableCell
																	className="px-4 py-3"
																	onClick={() =>
																		setExpandedId(isOpen ? null : item._id)
																	}
																>
																	{index + 1}

																	<ChevronDown
																		size={16}
																		className={`transition-transform ${
																			isOpen ? "rotate-180" : ""
																		}`}
																	/>
																</TableCell>
																<TableCell className="px-4 py-3 flex items-center gap-2 cursor-pointer">
																	{bgName}
																</TableCell>
																<TableCell className="px-4 py-3">
																	{compVn}
																</TableCell>
																<TableCell className="px-4 py-3">
																	{item.volume}
																</TableCell>
																<TableCell className="px-4 py-3">
																	{item.expired_at
																		? format(
																				new Date(item.expired_at),
																				"dd/MM/yyyy HH:mm",
																		  )
																		: "Chưa cập nhật"}
																</TableCell>
																<TableCell className="px-4 py-3 text-center">
																	<span
																		className={`inline-block px-2 py-1 rounded-full text-sm ${badgeClass}`}
																	>
																		{statusVN(item.status || "Không có")}
																	</span>
																</TableCell>
																<TableCell className="px-4 py-3 text-sm text-gray-600">
																	{format(
																		new Date(item.created_at),
																		"dd/MM/yyyy HH:mm",
																	)}
																</TableCell>
																<TableCell className="px-4 py-3 text-sm text-gray-700">
																	{item.update_by || "Chưa cập nhật"}
																</TableCell>
																<TableCell className="px-4 py-3 text-center">
																	<Button
																		variant="outline"
																		size="sm"
																		onClick={(e) => {
																			e.stopPropagation();
																			handleStatusUpdate(item);
																		}}
																		disabled={!canUpdateStatus}
																		className={`border-[#236afe] text-[#236afe] ${
																			canUpdateStatus
																				? "hover:bg-[#236afe] hover:text-white"
																				: "opacity-50 cursor-not-allowed"
																		}`}
																		title={
																			canUpdateStatus
																				? "Cập nhật trạng thái thành Damaged"
																				: "Chỉ có thể cập nhật trạng thái Available"
																		}
																	>
																		Cập nhật trạng thái
																	</Button>
																</TableCell>
															</TableRow>

															{isOpen && (
																<TableRow className="bg-gray-50">
																	<TableCell
																		colSpan={9}
																		className="px-6 py-4 text-sm text-gray-700"
																	>
																		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
																			<div>
																				<strong>Mã Chu Trình Lấy Máu:</strong>{" "}
																				{item.donation_process_id ||
																					"Chưa cập nhật"}
																			</div>
																			<div>
																				<strong>
																					Mã Chu Trình Xét Nghiệm:
																				</strong>{" "}
																				{item.request_process_id ||
																					"Chưa cập nhật"}
																			</div>
																			<div>
																				<strong>Cập nhật bởi:</strong>{" "}
																				{item.update_by || "Chưa cập nhật"}
																			</div>
																			<div>
																				<strong>Cập nhật ngày:</strong>{" "}
																				{format(
																					new Date(item.updated_at),
																					"dd/MM/yyyy HH:mm",
																				)}
																			</div>
																		</div>
																	</TableCell>
																</TableRow>
															)}
														</React.Fragment>
													);
												})
											)}
										</TableBody>
									</Table>
								</div>
							))}

						{tab === "discard" && <BloodDiscardForm />}
					</CardContent>
				</Card>
			</div>

			{/* Status Update Modal */}
			<Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="text-lg font-semibold text-gray-900">
							Cập nhật trạng thái mẫu máu
						</DialogTitle>
					</DialogHeader>

					{selectedItem && (
						<div className="space-y-4">
							<div className="bg-gray-50 p-4 rounded-lg space-y-2">
								<div className="flex justify-between items-center">
									<span className="text-sm font-medium text-gray-600">
										Nhóm máu:
									</span>
									<span className="text-sm text-gray-900">
										{groups[selectedItem.blood_group_id] ??
											selectedItem.blood_group_id}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm font-medium text-gray-600">
										Thành phần:
									</span>
									<span className="text-sm text-gray-900">
										{bloodComponentVN(
											comps[selectedItem.blood_component_id] ??
												selectedItem.blood_component_id,
										)}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm font-medium text-gray-600">
										Thể tích:
									</span>
									<span className="text-sm text-gray-900">
										{selectedItem.volume} ml
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm font-medium text-gray-600">
										Trạng thái hiện tại:
									</span>
									<span
										className={`text-sm px-2 py-1 rounded-full ${
											statusStyles[selectedItem.status as BloodUnitStatus] ||
											"bg-gray-100 text-gray-600"
										}`}
									>
										{statusVN(selectedItem.status || "Không có")}
									</span>
								</div>
							</div>

							<div className="border-t pt-4">
								<div className="flex items-center gap-3">
									<span className="text-sm font-medium text-gray-600">
										Thay đổi thành:
									</span>
									<span className="text-sm px-3 py-1 rounded-full bg-red-200 text-red-800">
										{statusVN(BloodUnitStatus.Damaged)}
									</span>
								</div>
								<p className="text-sm text-red-600 mt-2">
									Hành động này không thể hoàn tác. Mẫu máu sẽ được đánh dấu là
									hư hỏng.
								</p>
							</div>
						</div>
					)}

					<DialogFooter className="flex gap-2">
						<Button
							variant="outline"
							onClick={closeStatusModal}
							disabled={updatingStatus}
						>
							Hủy
						</Button>
						<Button
							variant="destructive"
							onClick={confirmStatusUpdate}
							disabled={updatingStatus}
						>
							{updatingStatus ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
									Đang cập nhật...
								</>
							) : (
								"Xác nhận cập nhật"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};