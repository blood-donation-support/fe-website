import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
	ArrowLeft,
	User,
	Heart,
	Weight,
	Thermometer,
	Droplets,
	Activity,
	CheckCircle,
	XCircle,
} from "lucide-react";

import {
	fetchHealthCheck,
	updateHealthCheck,
} from "../../api/healthCheckService";
import {
	fetchDoctorRequestById,
	approveDoctorRequest,
} from "@/api/doctorRequestService";
import type { HealthCheck, RequestRegistration } from "@/types/request";
import { UnderlyingHealthCondition } from "@/types/health";
import {
	CONDITION_LABELS,
	SCREEN_RESULT_LABELS,
} from "@/constants/donationLabels";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { fetchBloodGroups } from "@/api/bloodService";
import { RequestTypeList, RequestTypeVN } from "@/constants/requestType";
import { toast } from "react-toastify";
import {
	validateBloodRequest,
	type TransfusionScreeningInput,
} from "@/utils/validateBloodRequest";
import statusVN from "@/utils/statusVN";

interface EditForm {
	blood_group_id: string;
	request_type: string;
	weight: number;
	temperature: number;
	heart_rate: number;
	diastolic_blood_pressure: number;
	systolic_blood_pressure: number;
	hemoglobin: number;
	underlying_health_conditions: UnderlyingHealthCondition[];
	description: string;
}

export const HealthCheckRequest: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const [registration, setRegistration] = useState<RequestRegistration | null>(
		null,
	);
	const [healthCheck, setHealthCheck] = useState<HealthCheck | null>(null);
	const [bloodGroupOptions, setBloodGroupOptions] = useState<
		{ id: string; name: string }[]
	>([]);
	const [bloodComponentOptions, setBloodComponentOptions] = useState<string[]>(
		[],
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [editForm, setEditForm] = useState<EditForm>({
		blood_group_id: "",
		request_type: "",
		weight: 0,
		temperature: 0,
		heart_rate: 0,
		diastolic_blood_pressure: 0,
		systolic_blood_pressure: 0,
		hemoglobin: 0,
		underlying_health_conditions: [],
		description: "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		const loadOptions = async () => {
			try {
				const groups = await fetchBloodGroups();
				setBloodGroupOptions(groups.map((g) => ({ id: g._id, name: g.name })));
				setBloodComponentOptions(RequestTypeList.map((t) => t[0]));
			} catch {
				console.error("Failed to load options");
			}
		};
		loadOptions();
	}, []);

	useEffect(() => {
		if (!id) return;
		const fetchData = async () => {
			try {
				setLoading(true);
				const reg = await fetchDoctorRequestById(id);
				setRegistration(reg);
				if (reg?.health_check_id) {
					const hc = await fetchHealthCheck(reg.health_check_id);
					setHealthCheck(hc);
					setEditForm({
						blood_group_id: hc.blood_group_id || "",
						request_type: hc.request_type || "",
						weight: hc.weight || 0,
						temperature: hc.temperature || 0,
						heart_rate: hc.heart_rate || 0,
						diastolic_blood_pressure: hc.diastolic_blood_pressure || 0,
						systolic_blood_pressure: hc.systolic_blood_pressure || 0,
						hemoglobin: hc.hemoglobin || 0,
						underlying_health_conditions: (
							hc.underlying_health_conditions || []
						).map((c) => c as UnderlyingHealthCondition),
						description: hc.description || "",
					});
				} else {
					setError("Không tìm thấy thông tin khám sức khỏe.");
				}
			} catch {
				setError("Có lỗi khi tải dữ liệu.");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [id]);

	const handleChange = (field: keyof EditForm, value: any) => {
		setEditForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleConditionChange = (
		cond: UnderlyingHealthCondition,
		checked: boolean,
	) => {
		setEditForm((prev) => ({
			...prev,
			underlying_health_conditions: checked
				? [...prev.underlying_health_conditions, cond]
				: prev.underlying_health_conditions.filter((c) => c !== cond),
		}));
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Approved":
				return "bg-green-100 text-green-800";
			case "Rejected":
				return "bg-red-100 text-red-800";
			default:
				return "bg-yellow-100 text-yellow-800";
		}
	};

	const formatDate = (d: string) =>
		new Date(d).toLocaleString("vi-VN", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		});

	const onSave = async () => {
		if (!healthCheck?._id) return;

		const input: TransfusionScreeningInput = {
			patientBloodGroup: editForm.blood_group_id,
			componentType: editForm.request_type,
			temperature: editForm.temperature,
			diastolicBP: editForm.diastolic_blood_pressure,
			hemoglobin: editForm.hemoglobin,
			heartRate: editForm.heart_rate,
			systolicBP: editForm.systolic_blood_pressure,
			conditions: editForm.underlying_health_conditions,
		};

		const result = validateBloodRequest(input);
		if (!result.valid) {
			setErrors(result.fieldErrors);
			return;
		}
		setErrors({});

		try {
			await updateHealthCheck(healthCheck._id, {
				status: "Approved",
				blood_group_id: editForm.blood_group_id,
				request_type: editForm.request_type,
				donation_type: editForm.request_type,
				weight: editForm.weight,
				temperature: editForm.temperature,
				heart_rate: editForm.heart_rate,
				systolic_blood_pressure: editForm.systolic_blood_pressure,
				diastolic_blood_pressure: editForm.diastolic_blood_pressure,
				hemoglobin: editForm.hemoglobin,
				underlying_health_conditions: editForm.underlying_health_conditions,
				description: editForm.description,
			});
			toast.success("Cập nhật thành công");
			navigate(-1);
		} catch {
			setError("Lỗi khi cập nhật");
		}
	};
	const onReject = async () => {
		if (!healthCheck?._id) return;

		try {
			await updateHealthCheck(healthCheck._id, {
				status: "Rejected",
				blood_group_id: editForm.blood_group_id || "",
				request_type: editForm.request_type || "",
				donation_type: editForm.request_type || "",
				weight: editForm.weight || 0,
				temperature: editForm.temperature || 0,
				heart_rate: editForm.heart_rate || 0,
				systolic_blood_pressure: editForm.systolic_blood_pressure || 0,
				diastolic_blood_pressure: editForm.diastolic_blood_pressure || 0,
				hemoglobin: editForm.hemoglobin || 0,
				underlying_health_conditions:
					editForm.underlying_health_conditions || "",
				description: editForm.description || "",
			});
			toast.success("Đã đánh dấu 'Không đạt yêu cầu'");
			navigate(-1);
		} catch {
			setError("Lỗi khi cập nhật trạng thái từ chối");
		}
	};

	if (loading)
		return (
			<div className="p-6 flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);

	if (error)
		return (
			<div className="p-6">
				<Card>
					<CardContent className="text-center">
						<Activity className="mx-auto mb-4 text-red-500" />
						<p className="text-red-600">{error}</p>
						<Button
							variant="outline"
							onClick={() => navigate(-1)}
							className="mt-4"
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Quay lại
						</Button>
					</CardContent>
				</Card>
			</div>
		);

	return (
		<div className="min-h-screen bg-white p-4 md:p-6">
			<div className="max-w-8xl mx-auto space-y-6">
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
							<CardTitle className="text-2xl">Khám sức khỏe</CardTitle>
							<div />
						</div>
					</CardHeader>
				</Card>

				{/* Patient Info */}
				<Card className="shadow">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-gray-800">
							<User /> Thông tin bệnh nhân
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<Label>Họ và tên</Label>
								<p className="font-semibold">
									{registration?.full_name || "Chưa cập nhật"}
								</p>
							</div>
							<div>
								<Label>Số điện thoại</Label>
								<p className="font-semibold">
									{registration?.phone || "Chưa cập nhật"}
								</p>
							</div>
							<div>
								<Label>Nhóm máu</Label>
								<p className="font-semibold">
									{registration?.blood_group_name || "Chưa cập nhật"}
								</p>
							</div>
							<div>
								<Label>Ngày yêu cầu</Label>
								<p className="font-semibold">
									{registration?.receive_date_request
										? formatDate(registration.receive_date_request)
										: "Chưa cập nhật"}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Health Check Form */}
				{healthCheck && (
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="flex items-center gap-2 text-gray-800">
									<Activity /> Kết quả khám
								</CardTitle>
								<Badge className={getStatusColor(healthCheck.status)}>
									{statusVN(healthCheck.status)}
								</Badge>
							</div>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Blood & Component */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<Label>Nhóm máu</Label>
									<Select
										value={editForm.blood_group_id}
										onValueChange={(v) => handleChange("blood_group_id", v)}
									>
										<SelectTrigger>
											<SelectValue placeholder="Chọn nhóm máu" />
										</SelectTrigger>
										<SelectContent>
											{bloodGroupOptions.map((g) => (
												<SelectItem key={g.id} value={g.id}>
													{g.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label>Thành phần</Label>
									<Select
										value={editForm.request_type}
										onValueChange={(v) => handleChange("request_type", v)}
									>
										<SelectTrigger>
											<SelectValue placeholder="Chọn thành phần" />
										</SelectTrigger>
										<SelectContent>
											{bloodComponentOptions.map((c) => (
												<SelectItem key={c} value={c}>
													{RequestTypeVN[c as keyof typeof RequestTypeVN] || c}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{errors.donationType && (
										<p className="text-red-600 text-sm">
											{errors.donationType}
										</p>
									)}
								</div>
							</div>

							{/* Vital Signs */}
							<Card className="bg-blue-50 border-blue-200">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-blue-700">
										<Weight /> Sinh hiệu
									</CardTitle>
								</CardHeader>
								<CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
									<div>
										<Label>Cân nặng (kg)</Label>
										<Input
											type="number"
											min={0}
											value={editForm.weight}
											onChange={(e) =>
												handleChange("weight", Number(e.target.value))
											}
										/>
										{/* {errors.weight && (
											<p className="text-red-600 text-sm">{errors.weight}</p>
										)} */}
									</div>

									<div>
										<Label>Nhiệt độ (°C)</Label>
										<Input
											type="number"
											step="0.1"
											min={0}
											value={editForm.temperature}
											onChange={(e) =>
												handleChange("temperature", Number(e.target.value))
											}
										/>
										{errors.temperature && (
											<p className="text-red-600 text-sm">
												{errors.temperature}
											</p>
										)}
									</div>
									<div>
										<Label>Nhịp tim (bpm)</Label>
										<Input
											type="number"
											min={0}
											value={editForm.heart_rate}
											onChange={(e) =>
												handleChange("heart_rate", Number(e.target.value))
											}
										/>
										{errors.heartRate && (
											<p className="text-red-600 text-sm">{errors.heartRate}</p>
										)}
									</div>
								</CardContent>
							</Card>

							{/* Blood Pressure & Hemoglobin */}
							<Card className="bg-red-50 border-red-200">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-red-700">
										<Droplets /> Áp suất máu & Hb
									</CardTitle>
								</CardHeader>
								<CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
									<div>
										<Label>Huyết áp tâm thu</Label>
										<Input
											type="number"
											min={0}
											value={editForm.systolic_blood_pressure}
											onChange={(e) =>
												handleChange(
													"systolic_blood_pressure",
													Number(e.target.value),
												)
											}
										/>
										{errors.systolicBP && (
											<p className="mt-1 text-sm text-red-600">
												{errors.systolicBP}
											</p>
										)}
									</div>

									<div>
										<Label>Huyết áp tâm trương</Label>
										<Input
											type="number"
											min={0}
											value={editForm.diastolic_blood_pressure}
											onChange={(e) =>
												handleChange(
													"diastolic_blood_pressure",
													Number(e.target.value),
												)
											}
										/>
										{errors.diastolicBP && (
											<p className="text-red-600 text-sm">
												{errors.diastolicBP}
											</p>
										)}
									</div>

									<div>
										<Label>Hemoglobin (g/dL) </Label>
										<Input
											type="number"
											step="0.1"
											min={0}
											value={editForm.hemoglobin}
											onChange={(e) =>
												handleChange("hemoglobin", Number(e.target.value))
											}
										/>
										{errors.hemoglobin && (
											<p className="mt-1 text-sm text-red-600">
												{errors.hemoglobin}
											</p>
										)}
									</div>
								</CardContent>
							</Card>

							{/* Conditions & Description */}
							{/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
							<Card className="bg-yellow-50 border-yellow-200">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-yellow-700">
										<Activity /> Điều kiện sức khỏe
									</CardTitle>
								</CardHeader>
								<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{Object.values(UnderlyingHealthCondition).map((cond) => (
										<label
											key={cond}
											className="flex items-center gap-2 p-2 bg-white border rounded"
										>
											<Checkbox
												checked={editForm.underlying_health_conditions.includes(
													cond,
												)}
												onCheckedChange={(ch) =>
													handleConditionChange(cond, ch as boolean)
												}
											/>
											<span>{CONDITION_LABELS[cond] || cond}</span>
										</label>
									))}

									{errors.conditions && (
										<p className="text-red-600 text-sm">{errors.conditions}</p>
									)}
									{errors.screenResult && (
										<p className="text-red-600 text-sm">
											{errors.screenResult}
										</p>
									)}
								</CardContent>
							</Card>
							{/* <div> */}
							{/* Description Card */}
							<Card className="bg-gray-50 border border-gray-200 shadow-sm rounded-lg">
								<CardHeader className="px-4 py-2 bg-gray-100 border-b border-gray-200">
									<CardTitle className="flex items-center gap-2 text-gray-800 text-lg font-medium">
										<Activity className="w-5 h-5 text-gray-600" />
										Mô tả chi tiết
									</CardTitle>
								</CardHeader>
								<CardContent className="px-4 py-4">
									<Textarea
										value={editForm.description}
										onChange={(e) =>
											handleChange("description", e.target.value)
										}
										placeholder="Nhập mô tả chi tiết về tình trạng sức khỏe..."
										className="w-full min-h-[120px] bg-white border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
									/>
								</CardContent>
							</Card>

							{/* </div>
              </div> */}

							{/* Actions */}
							<div className="flex justify-center pt-4">
								{/* Chỉ hiển thị nút Lưu nếu chưa Approved */}
								{healthCheck.status !== "Approved" && (
									<>
										<Button
											onClick={onSave}
											className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white"
										>
											<CheckCircle className="w-5 h-5 mr-2" /> Đạt yêu cầu
										</Button>

										<Button
											onClick={onReject}
											className="ml-4 px-8 py-3 bg-red-600 hover:bg-red-700 text-white"
										>
											<XCircle className="w-5 h-5 mr-2" /> Không đạt yêu cầu
										</Button>
									</>
								)}

								{/* Nút Quay lại luôn hiển thị */}
								<Button
									onClick={() => navigate(-1)}
									variant="outline"
									className="ml-4"
								>
									<ArrowLeft className="w-5 h-5 mr-2 text-gray-600" />
									Quay lại
								</Button>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
};
