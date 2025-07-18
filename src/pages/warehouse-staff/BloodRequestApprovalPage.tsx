import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

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
	fetchDoctorRequestById,
	approveDoctorRequest,
	fetchRequestProcessDetail,
	updateRequestProcessDetail,
} from "../../api/doctorRequestService";
import {
	fetchBloodUnits,
	fetchBloodGroups,
	fetchBloodComponents,
} from "../../api/bloodService";
import type {
	DoctorRequest,
	RequestProcessDetail,
	RequestProcessDetailPayLoad,
} from "../../api/doctorRequestService";
import type {
	BloodUnit,
	BloodGroup,
	BloodComponent,
} from "../../api/bloodService";

import { BLOOD_COMPONENT_LABELS } from "../../constants/bloodLabels";
import bloodComponentVN from "@/utils/translateBloodComponentVN";
import { Input } from "@/components/ui/input";

export const BloodRequestApprovalPage: React.FC = () => {
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
			console.log("Request", requestProcessDetail[0].blood_component_name);

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
			//   const pick = groups.find(g =>
			//     warehouseMock.some(
			//       b =>
			//         b.bloodGroup === g &&
			//         b.bloodProductType === req.blood_component_ids &&
			//         b.status === "Available"
			//     )
			//   );
			//   if (pick) setSelectedGroup(pick);
		})();
	}, [id]);

	// Load units when moving to step 2
	useEffect(() => {
		if (step === 3 && request) {
			setLoadingUnits(true);
			(async () => {
				try {
					const arr = await fetchBloodUnits(
						request.blood_group_id,
						Array.isArray(request.blood_component_ids)
							? request.blood_component_ids[0]
							: request.blood_component_ids,
					);
					setUnits(arr);
				} catch (err) {
					console.error("Lỗi load blood units:", err);
				} finally {
					setLoadingUnits(false);
				}
			})();
		}
	}, [step, request]);

	const handleApprove = async () => {
		if (!request || !selectedGroup) return;
		setLoading(true);
		try {
			await approveDoctorRequest(request._id, {
				status: "Approved",
				assigned_blood_group: selectedGroup,
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
			setStep(3);
			await updateRequestProcessDetail(requestProcessId, editForm || []);
			console.log("update", editForm);
		} catch (err) {
			console.error(err);
			alert("Có lỗi khi duyệt đơn");
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
						"Chọn máu",
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
									Kiểm tra kho máu
								</Button>
							</div>
						</CardContent>
					</Card>
				)}
				{/* Step 2: input unit request */}
				{step === 2 && (
					<Card className="mt-8 shadow-lg">
						<CardContent className="space-y-4 text-lg p-6">
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
									onClick={() => handleUpdateRequestProcessDetail()}
								>
									Kiểm tra kho máu
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Step 3: Select unit */}
				{step === 3 && (
					<Card className="mt-8 shadow-lg">
						<CardContent className="p-6">
							<h3 className="text-xl font-bold mb-6 text-center">
								Các đơn vị máu tương thích
							</h3>
							{loadingUnits ? (
								<p>Đang tải...</p>
							) : units.length === 0 ? (
								<p>Không có đơn vị máu tương thích</p>
							) : (
								<Table>
									<TableHeader className="bg-[#f3f4f6]">
										<TableRow>
											<TableHead className="text-center">Chọn</TableHead>
											{/* <TableHead>CMND/CCCD</TableHead> */}
											<TableHead>Nhóm máu</TableHead>
											<TableHead>Thành phần</TableHead>
											<TableHead>Thể tích</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{units.map((u) => (
											<TableRow key={u._id}>
												<TableCell className="text-center">
													<input
														type="radio"
														name="selectedGroup"
														value={u.blood_group_name}
														checked={selectedGroup === u.blood_group_name}
														onChange={() =>
															setSelectedGroup(u.blood_group_name)
														}
														className="w-5 h-5"
													/>
												</TableCell>
												{/* <TableCell>{u.citizen_id_number}</TableCell> */}
												<TableCell>{u.blood_group_name}</TableCell>
												<TableCell>
													{bloodComponentVN(u.blood_component_name || "123")}
												</TableCell>
												<TableCell>{u.volume} ml</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
							<div className="mt-8 text-center">
								<Button
									className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl text-lg"
									disabled={!selectedGroup || loading}
									onClick={handleApprove}
								>
									{loading ? "Đang xử lý..." : "Duyệt & Gán máu"}
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Step 4: Done */}
				{step === 4 && (
					<div className="mt-16 text-center">
						<div className="text-green-600 font-bold text-2xl mb-6">
							Đã duyệt thành công!
						</div>
						<Button
							className="bg-[#236afe] hover:bg-[#4338ca] text-white px-6 py-3 rounded-xl text-lg"
							onClick={() => setStep(1)}
						>
							Quay lại
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};
