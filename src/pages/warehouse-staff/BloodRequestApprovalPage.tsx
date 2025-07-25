import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableRow,
	TableCell,
	TableHeader,
	TableHead,
} from "@/components/ui/table";
import { Stepper } from "@/components/ui/stepper";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
	fetchDoctorRequestById,
	approveDoctorRequest,
	fetchRequestProcessDetail,
	updateRequestProcessDetail,
	fetchRequestProcessBlood,
	updateRequestProcessBloodAPI,
	confirmRequestProcessBloodAPI,
} from "../../api/doctorRequestService";
import {
	fetchBloodUnits,
	fetchBloodGroups,
	fetchBloodComponents,
} from "../../api/bloodService";
import { FindUserByLocation } from "../../api/locationService"; // Add this import
import type {
	DoctorRequest,
	RequestProcessDetail,
	RequestProcessDetailPayLoad,
	RequestProcessBlood,
	RequestProcessBloodPayLoad,
} from "../../api/doctorRequestService";
import type {
	BloodUnit,
	BloodGroup,
	BloodComponent,
} from "../../api/bloodService";
import type { Location } from "@/types/location"; // Add this import

import { BLOOD_COMPONENT_LABELS } from "../../constants/bloodLabels";
import bloodComponentVN from "@/utils/translateBloodComponentVN";
import { toast } from "react-toastify";

export const BloodRequestApprovalPage: React.FC = () => {
	const navigate = useNavigate();

	const { id } = useParams<{ id: string }>();
	const [step, setStep] = useState(1);
	const [request, setRequest] = useState<DoctorRequest | null>(null);
	const [groupName, setGroupName] = useState<string>("");
	const [componentNames, setComponentNames] = useState<string[]>([]);
	const [compatibleGroups, setCompatibleGroups] = useState<string[]>([]);
	const [selectedGroup, setSelectedGroup] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [units, setUnits] = useState<BloodUnit[]>([]);
	const [loadingUnits, setLoadingUnits] = useState(false);
	const [requestProcessDetail, setRequestProcessDetail] = useState<
		RequestProcessDetail[] | null
	>(null);
	const [requestProcessId, setRequestProcessId] = useState<string>();
	const [editForm, setEditForm] = useState<RequestProcessDetailPayLoad[]>();
	const [requestProcessBloodPayload, setRequestProcessBloodPayload] = useState<
		RequestProcessBloodPayLoad[]
	>([]); // Renamed state variable

	// New state for step 2 - suitable blood list
	const [suitableBloodList, setSuitableBloodList] = useState<
		RequestProcessBlood[]
	>([]);
	const [loadingSuitableBlood, setLoadingSuitableBlood] = useState(false);
	// Fixed: Use a more unique identifier for blood units
	const [selectedBloodUnits, setSelectedBloodUnits] = useState<string[]>([]);

	// New state for Find Donors Modal
	const [showFindDonorsModal, setShowFindDonorsModal] = useState(false);
	const [radiusKm, setRadiusKm] = useState(500);
	const [loadingDonors, setLoadingDonors] = useState(false);
	const [donorSearchResult, setDonorSearchResult] = useState<Location | null>(
		null,
	);

	const bloodCompatibility: Record<string, string[]> = {
		"O-": ["O-"],
		"O+": ["O+", "O-"],
		"A-": ["A-", "O-"],
		"A+": ["A+", "A-", "O+", "O-"],
		"B-": ["B-", "O-"],
		"B+": ["B+", "B-", "O+", "O-"],
		"AB-": ["AB-", "A-", "B-", "O-"],
		"AB+": ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"],
	};

	useEffect(() => {
		if (!id) return;
		(async () => {
			const req = await fetchDoctorRequestById(id);
			console.log(req);
			setRequest(req);

			const requestProcessDetail = await fetchRequestProcessDetail(
				req.request_process_id,
			);
			setRequestProcessDetail(requestProcessDetail);
			setRequestProcessId(req.request_process_id);
			console.log("RequestProcessDetail", requestProcessDetail);

			// map group ID → name
			const allGroups: BloodGroup[] = await fetchBloodGroups();
			const foundG = allGroups.find((g) => g._id === req.blood_group_id);
			setGroupName(foundG?.name || req.blood_group_id);

			// map component IDs → names
			const compIds = Array.isArray(req.blood_component_ids)
				? req.blood_component_ids
				: req.blood_component_ids.split(",");
			const allComps: BloodComponent[] = await fetchBloodComponents();
			const namesVi = compIds.map((cid) => {
				const comp = allComps.find((c) => c._id === cid);
				const raw = comp?.name || cid;
				return BLOOD_COMPONENT_LABELS[raw] || raw;
			});
			setComponentNames(namesVi);

			// compute compatibility
			const groups = bloodCompatibility[req.blood_group_id] || [];
			setCompatibleGroups(groups);
		})();
	}, [id]);

	// Load suitable blood when moving to step 3
	useEffect(() => {
		if (step === 3 && requestProcessId) {
			setLoadingSuitableBlood(true);
			(async () => {
				try {
					const suitableBlood = await fetchRequestProcessBlood(
						requestProcessId,
					);
					setSuitableBloodList(suitableBlood);
					console.log("Suitable blood list:", suitableBlood);
				} catch (err) {
					console.error("Lỗi load suitable blood:", err);
				} finally {
					setLoadingSuitableBlood(false);
				}
			})();
		}
	}, [step, requestProcessId]);

	const handleApprove = async () => {
		if (!request || selectedBloodUnits.length === 0) {
			alert("Vui lòng chọn ít nhất một đơn vị máu");
			return;
		}
		setLoading(true);
		try {
			await approveDoctorRequest(request._id, {
				status: "Approved",
				assigned_blood_group: selectedBloodUnits.join(","), // Join selected units
			});
			setStep(4);
		} catch (err) {
			console.error(err);
			alert("Có lỗi khi duyệt đơn");
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateRequestProcessDetail = async () => {
		if (!requestProcessId) {
			console.error("ID is undefined");
			alert("Không tìm thấy ID yêu cầu.");
			return;
		}
		console.log("update", id);

		try {
			await updateRequestProcessDetail(requestProcessId, editForm || []);
			console.log("update", editForm);
			setStep(3);
		} catch (err) {
			console.error(err);
			alert("Có lỗi khi cập nhật đơn");
		} finally {
			setLoading(false);
		}
	};

	const handleOnChange = (index: number, value: number) => {
		// Cập nhật UI
		setRequestProcessDetail((prev) => {
			if (!prev) return prev;
			const updated = [...prev];
			updated[index] = {
				...updated[index],
				volume_required: value,
			};
			return updated;
		});

		// Cập nhật dữ liệu sẽ gửi lên API
		setEditForm((prev) => {
			const current = prev ? [...prev] : [];

			// Tìm item hiện có theo request_process_detail_id
			const id = requestProcessDetail?.[index]?.blood_component_id;
			if (!id) return current;

			const existingIndex = current.findIndex(
				(i) => i.blood_component_id === id,
			);

			if (existingIndex !== -1) {
				current[existingIndex] = {
					...current[existingIndex],
					volume_required: value,
				};
			} else {
				current.push({
					blood_component_id: id,
					volume_required: value,
					status: "Pending",
				});
			}

			return current;
		});
	};

	const handleUpdateRequestProcessBlood = async () => {
		if (!requestProcessId) {
			console.error("ID is undefined");
			alert("Không tìm thấy ID yêu cầu.");
			return;
		}
		console.log("update", id);

		try {
			await updateRequestProcessBloodAPI(
				// Use the renamed import
				requestProcessId,
				requestProcessBloodPayload || [], // Use the renamed state variable
			);
			console.log("update", requestProcessBloodPayload);
			setStep(4);
		} catch (err) {
			console.error(err);
			alert("Có lỗi khi cập nhật đơn");
		} finally {
			setLoading(false);
		}
	};

	const handleConfirmRequestProcessBlood = async () => {
		if (!requestProcessId) {
			console.error("ID is undefined");
			alert("Không tìm thấy ID yêu cầu.");
			return;
		}
		console.log("update", id);

		try {
			await confirmRequestProcessBloodAPI(
				// Use the renamed import
				requestProcessId,
			);
			toast.success("Đã gửi thông báo");
			navigate("/dashboard-staff/doctor-request-approved");
		} catch (err) {
			console.error(err);
			alert("Có lỗi khi cập nhật đơn");
		} finally {
			setLoading(false);
		}
	};

	// Fixed: Create a unique identifier for each blood unit
	const createBloodUnitId = (blood: RequestProcessBlood, index: number) => {
		return `${blood.blood_component_id}-${blood.blood_group_id}-${index}`;
	};

	const handleBloodUnitSelection = (bloodUnitId: string) => {
		setSelectedBloodUnits((prevSelected) => {
			let updatedSelected: string[];

			if (prevSelected.includes(bloodUnitId)) {
				updatedSelected = prevSelected.filter((id) => id !== bloodUnitId);
			} else {
				updatedSelected = [...prevSelected, bloodUnitId];
			}

			// 🔄 Cập nhật requestProcessBloodPayload tương ứng
			const updatedPayload: RequestProcessBloodPayLoad[] = suitableBloodList
				.map((blood, index) => ({
					blood,
					id: createBloodUnitId(blood, index),
				}))
				.filter((item) => updatedSelected.includes(item.id))
				.map((item) => ({
					blood_component_id: item.blood.blood_component_id,
					blood_unit_id: item.blood.blood_unit_id,
					status: "Selected",
				}));

			setRequestProcessBloodPayload(updatedPayload); // Use the renamed state variable
			return updatedSelected;
		});
	};

	const handleSelectAll = () => {
		const allIds = suitableBloodList.map((blood, index) =>
			createBloodUnitId(blood, index),
		);
		setSelectedBloodUnits(allIds);

		const allPayload: RequestProcessBloodPayLoad[] = suitableBloodList.map(
			(blood) => ({
				blood_component_id: blood.blood_component_id,
				blood_unit_id: blood.blood_unit_id,
				status: "Select",
			}),
		);
		setRequestProcessBloodPayload(allPayload); // Use the renamed state variable
	};

	const handleDeselectAll = () => {
		setSelectedBloodUnits([]);
		setRequestProcessBloodPayload([]); // Use the renamed state variable
	};

	// New function to handle finding donors
	const handleFindDonors = async () => {
		if (!requestProcessDetail || requestProcessDetail.length === 0) {
			toast.error("Không tìm thấy thông tin nhóm máu");
			return;
		}

		if (radiusKm <= 5) {
			toast.error("Bán kính phải lớn hơn 5km");
			return;
		}

		setLoadingDonors(true);
		try {
			// Get blood group name from step 2 data
			const bloodGroupName =
				requestProcessDetail[0].blood_group_name || groupName;

			const payload: Location = {
				blood_group_name: bloodGroupName,
				radiusKm: radiusKm,
			};

			const result = await FindUserByLocation(payload);
			setDonorSearchResult(result);
			toast.success("Tìm thấy người hiến máu phù hợp!");
			setShowFindDonorsModal(false);

			console.log("Donor search result:", result);
		} catch (err) {
			console.error("Error finding donors:", err);
			toast.error("Không tìm thấy người hiến máu phù hợp trong khu vực");
			setDonorSearchResult(null);
		} finally {
			setLoadingDonors(false);
		}
	};

	const handleCloseFindDonorsModal = () => {
		setShowFindDonorsModal(false);
		setDonorSearchResult(null);
		setRadiusKm(500);
	};

	if (!request) {
		return <div className="p-8 text-center">Đang tải thông tin...</div>;
	}

	return (
		<div className="p-8 bg-[#f9fafb] min-h-screen flex flex-col items-center">
			<h2 className="text-3xl font-semibold text-[#4f46e5] mb-10">
				Duyệt Đơn Xin Máu
			</h2>
			<div className="w-full max-w-3xl">
				<Stepper
					steps={[
						"Thông tin yêu cầu",
						"Thông tin xin máu",
						"Danh sách máu phù hợp",
						"Hoàn tất",
					]}
					currentStep={step}
				/>

				{/* Step 1: Info */}
				{step === 1 && (
					<Card className="mt-8 shadow-lg">
						<CardContent className="space-y-4 text-lg p-6">
							<div>
								<b>Tên bệnh nhân:</b> {request.full_name || "chưa cập nhật"}
							</div>
							<div>
								<b>Nhóm máu yêu cầu:</b> {groupName}
							</div>
							<div>
								<b>Thành phần:</b> {componentNames.join(", ")}
							</div>
							<div>
								<b>Ngày yêu cầu:</b>{" "}
								{new Date(request.receive_date_request).toLocaleString()}
							</div>
							<div>
								<b>Ghi chú:</b> {request.note || "Không có"}
							</div>

							<div>
								<b>Khẩn cấp:</b>{" "}
								{request.is_emergency ? (
									<span className="text-red-500 font-bold">Khẩn cấp</span>
								) : (
									<span className="text-green-600 font-semibold">
										Bình thường
									</span>
								)}
							</div>
							{request.image && (
								<div className="mt-4">
									<b>Ảnh đính kèm:</b>
									<img
										src={request.image}
										alt="ảnh yêu cầu"
										className="mt-2 w-48 h-auto object-cover rounded border"
									/>
								</div>
							)}
							<div className="text-center pt-4">
								<Button
									className="bg-[#236afe] hover:bg-[#4338ca] text-white px-8 py-3 rounded-xl text-lg"
									onClick={() => setStep(2)}
								>
									Nhập thông tin xin máu
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Step 2: Input unit request */}
				{step === 2 && (
					<Card className="mt-8 shadow-lg">
						<CardContent className="space-y-4 text-lg p-6">
							<h3 className="text-xl font-bold mb-6 text-center">
								Thông tin xin máu
							</h3>
							{requestProcessDetail?.map((detail, index) => (
								<div key={index} className="border-t pt-4 mt-4 space-y-4">
									<div>
										<b>Nhóm máu:</b>{" "}
										{detail.blood_group_name || "chưa cập nhật"}
									</div>

									<div>
										<b>Loại máu nhận:</b>{" "}
										{detail.blood_component_name || "chưa cập nhật"}
									</div>

									<div>
										<b>Khối lượng máu cần nhận:</b>{" "}
										<Input
											type="number"
											placeholder="ml"
											value={detail.volume_required}
											onChange={(e) =>
												handleOnChange(index, Number(e.target.value))
											}
										/>
									</div>

									<div>
										<b>Trạng thái:</b> {detail.status || "chưa cập nhật"}
									</div>
								</div>
							))}

							{request?.image && (
								<div className="mt-4">
									<b>Ảnh đính kèm:</b>
									<img
										src={request.image}
										alt="ảnh yêu cầu"
										className="mt-2 w-48 h-auto object-cover rounded border"
									/>
								</div>
							)}

							<div className="text-center pt-4">
								<Button
									className="bg-[#236afe] hover:bg-[#4338ca] text-white px-8 py-3 rounded-xl text-lg"
									onClick={handleUpdateRequestProcessDetail}
									disabled={loading}
								>
									{loading ? "Đang xử lý..." : "Xem danh sách máu phù hợp"}
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Step 3: Suitable Blood List and Selection */}
				{step === 3 && (
					<Card className="mt-8 shadow-lg">
						<CardContent className="p-6">
							<h3 className="text-xl font-bold mb-6 text-center">
								Danh sách máu phù hợp
							</h3>
							{loadingSuitableBlood ? (
								<p className="text-center">Đang tải...</p>
							) : suitableBloodList.length === 0 ? (
								<div className="text-center space-y-4">
									<p className="text-gray-500">
										Không có máu phù hợp trong kho
									</p>
									<Button
										className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl"
										onClick={() => setShowFindDonorsModal(true)}
									>
										Tìm người hiến máu gần nhất
									</Button>
								</div>
							) : (
								<>
									<div className="mb-4 space-y-2">
										<div className="text-sm text-gray-600">
											<b>Lưu ý:</b> Có thể chọn 1 hoặc nhiều đơn vị máu phù hợp
										</div>
										<div className="flex gap-2">
											<Button
												variant="outline"
												size="sm"
												onClick={handleSelectAll}
												disabled={
													selectedBloodUnits.length === suitableBloodList.length
												}
											>
												Chọn tất cả
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={handleDeselectAll}
												disabled={selectedBloodUnits.length === 0}
											>
												Bỏ chọn tất cả
											</Button>
										</div>
									</div>
									<Table>
										<TableHeader className="bg-[#f3f4f6]">
											<TableRow>
												<TableHead className="text-center">Chọn</TableHead>
												<TableHead>Nhóm máu</TableHead>
												<TableHead>Thành phần</TableHead>
												<TableHead>Thể tích (ml)</TableHead>
												<TableHead>Trạng thái</TableHead>
												<TableHead>Cập nhật lần cuối</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{suitableBloodList.map((blood, index) => {
												const bloodUnitId = createBloodUnitId(blood, index);
												const isSelected =
													selectedBloodUnits.includes(bloodUnitId);

												return (
													<TableRow
														key={bloodUnitId}
														className={isSelected ? "bg-blue-50" : ""}
													>
														<TableCell className="text-center">
															<input
																type="checkbox"
																checked={isSelected}
																onChange={() =>
																	handleBloodUnitSelection(bloodUnitId)
																}
																className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
															/>
														</TableCell>
														<TableCell className="font-medium">
															{blood.blood_group_name}
														</TableCell>
														<TableCell>
															{bloodComponentVN(blood.blood_component_name)}
														</TableCell>
														<TableCell className="font-medium">
															{blood.volume}
														</TableCell>
														<TableCell>
															<span
																className={`px-2 py-1 rounded text-sm font-medium ${
																	blood.status === "Pending"
																		? "bg-yellow-100 text-yellow-800"
																		: blood.status === "Approved"
																		? "bg-green-100 text-green-800"
																		: "bg-gray-100 text-gray-800"
																}`}
															>
																{blood.status}
															</span>
														</TableCell>
														<TableCell>
															{new Date(blood.updated_at).toLocaleString()}
														</TableCell>
													</TableRow>
												);
											})}
										</TableBody>
									</Table>
									{selectedBloodUnits.length > 0 && (
										<div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
											<div className="flex items-center">
												<div className="text-blue-800">
													<div className="text-sm mt-1">
														Tổng số đơn vị khả dụng: {suitableBloodList.length}
													</div>
												</div>
											</div>
										</div>
									)}
								</>
							)}
							<div className="mt-8 text-center space-x-4">
								<Button
									variant="outline"
									onClick={() => setStep(2)}
									className="px-6 py-3 text-lg"
								>
									Quay lại
								</Button>
								{suitableBloodList.length > 0 && (
									<Button
										className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl text-lg"
										disabled={selectedBloodUnits.length === 0 || loading}
										onClick={handleUpdateRequestProcessBlood}
									>
										{loading ? "Đang xử lý..." : `Duyệt`}
									</Button>
								)}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Step 4: Done */}
				{step === 4 && (
					<div className="mt-16 text-center">
						<div className="mb-6 text-lg space-y-2">
							<div>
								<b>Đã gán {selectedBloodUnits.length} đơn vị máu cho yêu cầu</b>
							</div>
							<div className="text-gray-600">Yêu cầu ID: {request._id}</div>
						</div>
						<div className="space-x-4">
							<Button
								className="bg-[#236afe] hover:bg-[#4338ca] text-white px-6 py-3 rounded-xl text-lg"
								onClick={handleConfirmRequestProcessBlood}
							>
								Hoàn Tất Đơn Xin Máu
							</Button>
							<Button
								variant="outline"
								className="px-6 py-3 text-lg"
								onClick={() => (window.location.href = "/")}
							>
								Về trang chủ
							</Button>
						</div>
					</div>
				)}
			</div>

			{/* Find Donors Modal */}
			<Dialog open={showFindDonorsModal} onOpenChange={setShowFindDonorsModal}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Tìm người hiến máu gần nhất</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="bloodGroup">Nhóm máu cần tìm</Label>
							<Input
								id="bloodGroup"
								value={requestProcessDetail?.[0]?.blood_group_name || groupName}
								disabled
								className="bg-gray-100"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="radius">Bán kính tìm kiếm (km)</Label>
							<Input
								id="radius"
								type="number"
								min={6}
								value={radiusKm}
								onChange={(e) => setRadiusKm(Number(e.target.value))}
								placeholder="Nhập bán kính (> 5km)"
							/>
							{radiusKm <= 5 && (
								<p className="text-sm text-red-500">
									Bán kính phải lớn hơn 5km
								</p>
							)}
						</div>
					</div>
					<DialogFooter className="sm:justify-start">
						<Button
							type="button"
							onClick={handleFindDonors}
							disabled={loadingDonors || radiusKm <= 5}
							className="bg-orange-500 hover:bg-orange-600"
						>
							{loadingDonors ? "Đang tìm..." : "Tìm kiếm"}
						</Button>
						<Button
							type="button"
							variant="secondary"
							onClick={handleCloseFindDonorsModal}
						>
							Đóng
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};
