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
import { fetchHealthCheck } from "@/api/healthCheckService";
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
import type { HealthCheck } from "@/types/donation";
import statusVN from "@/utils/statusVN";

const formatDateTime = (dateString: string) => {
	if (!dateString) return "Chưa cập nhật";

	const date = new Date(dateString);
	const options = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		// minute: '2-digit',
		// second: '2-digit',
		// hour12: false
	};

	return date.toLocaleString("vi-VN", options);
};

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
	const [healthCheckLoading, setHealthCheckLoading] = useState(false);

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
	const translateStatus = (status) => {
		const statusMap = {
			Pending: "Đang chờ",
			Approved: "Đã duyệt",
			Rejected: "Từ chối",
		};
		return statusMap[status] || status;
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
			navigate("/dashboard-staff-warehouse/request-list");
		} catch (err) {
			console.error(err);
			alert("Có lỗi khi cập nhật đơn");
		} finally {
			setLoading(false);
		}
	};
	const handleProceedToStep2 = async () => {
		if (!request?.health_check_id) {
			toast.error("Không tìm thấy thông tin khám sức khỏe");
			return;
		}

		setHealthCheckLoading(true);
		try {
			const healthCheck: HealthCheck = await fetchHealthCheck(
				request.health_check_id,
			);

			if (healthCheck.status === "Approved") {
				setStep(2);
			} else {
				toast.error("Không đạt yêu cầu hoặc đang chờ khám sức khỏe");
			}
		} catch (err) {
			console.error("Lỗi khi kiểm tra sức khỏe:", err);
			toast.error("Có lỗi khi kiểm tra thông tin sức khỏe");
		} finally {
			setHealthCheckLoading(false);
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

	const handleCombackList = () => {
		navigate("/dashboard-staff-warehouse/request-list");
	};
	return (
		<div className="p-8 bg-[#f9fafb] min-h-screen flex flex-col items-center">
			<Button
				variant="outline"
				className="self-start mb-6 gap-2 px-6 py-3 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				onClick={handleCombackList}
			>
				← Quay lại danh sách
			</Button>

			<h2 className="text-3xl font-semibold text-[#4f46e5] mb-10">
				Duyệt Đơn Xin Máu
			</h2>
			<div className="w-full max-w-6xl">
				<Stepper
					steps={[
						"Thông tin yêu cầu",
						"Thông tin xin máu",
						"Danh sách máu phù hợp",
						"Hoàn tất",
					]}
					currentStep={step}
				/>

				{step === 1 && (
					<Card className="mt-8 shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
						<CardContent className="p-8">
							<div className="text-center mb-8">
								<h3 className="text-2xl font-bold text-gray-800 mb-2">
									Thông tin yêu cầu máu
								</h3>
								<div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
								{/* Thông tin bệnh nhân */}
								<div className="space-y-6">
									<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
										<div className="flex items-start space-x-4">
											<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
												<svg
													className="w-6 h-6 text-blue-600"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
													/>
												</svg>
											</div>
											<div className="flex-1">
												<span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
													Tên bệnh nhân
												</span>
												<p className="text-lg font-bold text-gray-800 mt-1">
													{request.full_name || "Chưa cập nhật"}
												</p>
											</div>
										</div>
									</div>

									<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
										<div className="flex items-start space-x-4">
											<div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
												<svg
													className="w-6 h-6 text-red-600"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z"
													/>
												</svg>
											</div>
											<div className="flex-1">
												<span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
													Nhóm máu yêu cầu
												</span>
												<p className="text-lg font-bold text-red-600 mt-1">
													{groupName || "Chưa cập nhật"}
												</p>
											</div>
										</div>
									</div>

									<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
										<div className="flex items-start space-x-4">
											<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
												<svg
													className="w-6 h-6 text-red-600"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z"
													/>
												</svg>
											</div>
											<div className="flex-1">
												<span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
													Thành phần máu yêu cầu
												</span>
												<p className="text-lg font-bold text-gray-800 mt-1">
													{componentNames.join(", ") || "Chưa cập nhật"}
												</p>
											</div>
										</div>
									</div>
								</div>

								{/* Thông tin bổ sung */}
								<div className="space-y-6">
									<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
										<div className="flex items-start space-x-4">
											<div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													strokeWidth={1.5}
													stroke="currentColor"
													className="w-6 h-6 text-purple-600"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M2.25 6.75A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25v10.5A2.25 2.25 0 0119.5 19.5h-15A2.25 2.25 0 012.25 17.25V6.75z"
													/>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M6.75 10.5a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zM6.75 14.25h3m3.75-3h4.5m-4.5 3h4.5"
													/>
												</svg>
											</div>

											<div className="flex-1">
												<span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
													CCCD
												</span>
												<p className="text-lg font-bold text-gray-800 mt-1">
													{request.citizen_id_number || "Chưa cập nhật"}
												</p>
											</div>
										</div>
									</div>
									<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
										<div className="flex items-start space-x-4">
											<div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
												<svg
													className="w-6 h-6 text-purple-600"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M8 7V3a4 4 0 118 0v4m-4 4v8m0-8H8m4 0h4"
													/>
												</svg>
											</div>
											<div className="flex-1">
												<span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
													Ngày yêu cầu
												</span>
												<p className="text-lg font-bold text-gray-800 mt-1">
													{formatDateTime(request.receive_date_request) ||
														"Chưa cập nhật"}
												</p>
											</div>
										</div>
									</div>

									<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
										<div className="flex items-start space-x-4">
											<div
												className={`w-12 h-12 rounded-full flex items-center justify-center ${
													request.is_emergency ? "bg-red-100" : "bg-green-100"
												}`}
											>
												<svg
													className={`w-6 h-6 ${
														request.is_emergency
															? "text-red-600"
															: "text-green-600"
													}`}
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													{request.is_emergency ? (
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
														/>
													) : (
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
														/>
													)}
												</svg>
											</div>
											<div className="flex-1">
												<span className="text-sm font-semibold text-gray-500 uppercase tracking-wide mr-4">
													Tình trạng
												</span>
												<span
													className={`inline-block px-4 py-2 text-sm font-bold rounded-full mt-2 ${
														request.is_emergency
															? "bg-red-100 text-red-700 border border-red-200"
															: "bg-green-100 text-green-700 border border-green-200"
													}`}
												>
													{request.is_emergency ? " Khẩn cấp" : " Bình thường"}
												</span>
											</div>
										</div>
									</div>

									{request.note && (
										<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
											<div className="flex items-start space-x-4">
												<div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
													<svg
														className="w-6 h-6 text-yellow-600"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M7 8h10M7 12h4m-7 8h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2z"
														/>
													</svg>
												</div>
												<div className="flex-1">
													<span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
														Ghi chú
													</span>
													<p className="text-lg text-gray-800 mt-1 leading-relaxed">
														{request.note}
													</p>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>

							{request.image && (
								<div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
									<span className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 block">
										Ảnh đính kèm
									</span>
									<div className="flex justify-center">
										<img
											src={request.image}
											alt="ảnh yêu cầu"
											className="max-w-md w-full h-auto rounded-lg shadow-md border border-gray-200"
										/>
									</div>
								</div>
							)}

							<div className="text-center mt-8">
								<Button
									className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white px-10 py-4 rounded-2xl text-lg font-semibold shadow-lg transform transition-all duration-200 hover:scale-105"
									onClick={handleProceedToStep2}
									disabled={healthCheckLoading}
								>
									{healthCheckLoading ? (
										<>
											<svg
												className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
											Đang kiểm tra...
										</>
									) : (
										"Tiếp tục nhập thông tin xin máu →"
									)}
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

				{step === 2 && (
					<Card className="mt-8 shadow-xl border-0 bg-gradient-to-br from-white to-green-50">
						<CardContent className="p-8">
							<div className="text-center mb-8">
								<h3 className="text-2xl font-bold text-gray-800 mb-2">
									Thông tin chi tiết xin máu
								</h3>
								<div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
								<p className="text-gray-600 mt-3">
									Vui lòng nhập thông tin chi tiết về lượng máu cần thiết
								</p>
							</div>

							<div className="space-y-6">
								{requestProcessDetail?.map((detail, index) => (
									<div
										key={index}
										className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
									>
										<div className="flex items-center mb-4">
											<div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
												{index + 1}
											</div>
											<h4 className="text-lg font-semibold text-gray-800">
												Yêu cầu thành phần máu #{index + 1}
											</h4>
											<div className="mt-1 self-end ml-auto">
												<span
													className={`inline-block px-3 py-1 text-sm font-bold rounded-full ${
														detail.status === "Pending"
															? "bg-yellow-100 text-yellow-700 border border-yellow-200"
															: detail.status === "Approved"
															? "bg-green-100 text-green-700 border border-green-200"
															: "bg-gray-100 text-gray-700 border border-gray-200"
													}`}
												>
													{translateStatus(detail.status) || "Đang chờ"}
												</span>
											</div>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											{/* Cột trái - Thông tin cơ bản */}
											<div className="space-y-6">
												<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
													<div className="flex items-start space-x-4">
														<div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
															<svg
																className="w-6 h-6 text-red-600"
																fill="none"
																stroke="currentColor"
																viewBox="0 0 24 24"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth={2}
																	d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z"
																/>
															</svg>
														</div>
														<div className="flex-1">
															<span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
																Nhóm máu
															</span>
															<p className="text-lg font-bold text-gray-800 mt-1">
																{detail.blood_group_name}
															</p>
														</div>
													</div>
												</div>

												<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
													<div className="flex items-start space-x-4">
														<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
															<svg
																className="w-6 h-6 text-red-600"
																fill="none"
																stroke="currentColor"
																viewBox="0 0 24 24"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth={2}
																	d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z"
																/>
															</svg>
														</div>
														<div className="flex-1">
															<span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
																Thành phần máu
															</span>
															<p className="text-lg font-bold text-red-600 mt-1">
																{bloodComponentVN(detail.blood_component_name)}
															</p>
														</div>
													</div>
												</div>
											</div>

											{/* Cột phải - Input và trạng thái */}
											<div className="space-y-4">
												<div className="bg-blue-50 p-4 rounded-xl border border-blue-100 h-fit">
													<label className="block text-xs font-semibold text-blue-700 uppercase tracking-wide mb-3">
														KHỐI LƯỢNG CẦN THIẾT (ML)
													</label>
													<div className="relative">
														<Input
															type="number"
															placeholder="0"
															min="0"
															value={detail.volume_required || ""}
															onChange={(e) =>
																handleOnChange(
																	index,
																	Number(e.target.value) || 0,
																)
															}
															className="text-lg font-bold h-12 pr-12 border-2 border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white"
														/>
														<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
															<span className="text-sm font-medium text-blue-600">
																ml
															</span>
														</div>
													</div>
												</div>
												{/* 
												<div className="bg-gray-50 p-4 rounded-xl border border-gray-100 h-fit">
													<div className="flex items-center space-x-3">
														<div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
															<svg
																className="w-5 h-5 text-gray-600"
																fill="none"
																stroke="currentColor"
																viewBox="0 0 24 24"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth={2}
																	d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																/>
															</svg>
														</div>
														<div className="min-w-0 flex-1">
															<span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">
																TRẠNG THÁI HIỆN TẠI
															</span>
															<div className="mt-1">
																<span
																	className={`inline-block px-3 py-1 text-sm font-bold rounded-full ${
																		detail.status === "Pending"
																			? "bg-yellow-100 text-yellow-700 border border-yellow-200"
																			: detail.status === "Approved"
																			? "bg-green-100 text-green-700 border border-green-200"
																			: "bg-gray-100 text-gray-700 border border-gray-200"
																	}`}
																>
																	{translateStatus(detail.status) || "Đang chờ"}
																</span>
															</div>
														</div>
													</div>
												</div> */}
											</div>
										</div>
									</div>
								))}
							</div>

							{request?.image && (
								<div className="mt-8 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
									<div className="flex items-center mb-4">
										<div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mr-3">
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
													d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
												/>
											</svg>
										</div>
										<span className="text-lg font-semibold text-gray-800">
											Ảnh đính kèm
										</span>
									</div>
									<div className="flex justify-center">
										<img
											src={request.image}
											alt="ảnh yêu cầu"
											className="max-w-md w-full h-auto rounded-lg shadow-md border border-gray-200"
										/>
									</div>
								</div>
							)}

							<div className="flex justify-center space-x-4 mt-10">
								<Button
									variant="outline"
									onClick={() => setStep(1)}
									className="px-8 py-4 text-lg rounded-2xl border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
								>
									← Quay lại
								</Button>
								<Button
									className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white px-10 py-4 rounded-2xl text-lg font-semibold shadow-lg transform transition-all duration-200 hover:scale-105"
									onClick={handleUpdateRequestProcessDetail}
									disabled={loading}
								>
									{loading ? (
										<>
											<svg
												className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
											Đang xử lý...
										</>
									) : (
										"Xem danh sách máu phù hợp →"
									)}
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
																{statusVN(blood.status)}
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
									className="px-8 py-4 text-lg rounded-2xl border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
								>
									← Quay lại
								</Button>
								{suitableBloodList.length > 0 && (
									<Button
										className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl text-lg"
										disabled={selectedBloodUnits.length === 0 || loading}
										onClick={handleUpdateRequestProcessBlood}
									>
										{loading ? (
											<>
												<svg
													className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
												>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
													></circle>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
													></path>
												</svg>
												Đang xử lý...
											</>
										) : (
											"Duyệt →"
										)}
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
								onClick={() =>
									(window.location.href = "/dashboard-staff-warehouse")
								}
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
