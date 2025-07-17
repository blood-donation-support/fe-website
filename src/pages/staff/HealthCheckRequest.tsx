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
	Calendar,
	Activity,
	Heart,
	Thermometer,
	Weight,
	Droplets,
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
import {
	SCREEN_RESULT_LABELS,
	CONDITION_LABELS,
} from "@/constants/donationLabels";
import { UnderlyingHealthCondition } from "@/types/health";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { fetchBloodComponents, fetchBloodGroups } from "@/api/bloodService";
import { RequestTypeVN } from "@/constants/requestType";

// Define the form interface
interface EditForm {
	blood_group_id: string;
	request_type: string;
	weight: number;
	temperature: number;
	heart_rate: number;
	diastolic_blood_pressure: number;
	systolic_blood_pressure: number;
	hemoglobin: number;
	underlying_health_conditions: string[];
	description: string;
}

// Define errors interface
interface FormErrors {
	blood_group_id?: string;
	request_type?: string;
	weight?: string;
	temperature?: string;
	heart_rate?: string;
	diastolic_blood_pressure?: string;
	systolic_blood_pressure?: string;
	hemoglobin?: string;
	underlying_health_conditions?: string;
	description?: string;
}

export const HealthCheckRequest: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const [healthCheck, setHealthCheck] = useState<HealthCheck | null>(null);
	const [registration, setRegistration] = useState<RequestRegistration | null>(
		null,
	);
	const [bloodComponentOptions, setBloodComponentOptions] = useState<string[]>(
		[],
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [errors, setErrors] = useState<FormErrors>({});
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

	// Cập nhật state để lưu trữ objects thay vì chỉ strings
	const [bloodGroupOptions, setBloodGroupOptions] = useState<
		{ id: string; name: string }[]
	>([]);

	// Cập nhật useEffect để lưu trữ cả id và name
	useEffect(() => {
		(async () => {
			try {
				const groups = await fetchBloodGroups();
				setBloodGroupOptions(groups.map((g) => ({ id: g._id, name: g.name }))); // Lưu trữ toàn bộ objects với code và name
				const comps = await fetchBloodComponents();
				setBloodComponentOptions(comps.map((c) => c.name));
			} catch (err) {
				console.error("Lỗi lấy danh mục máu:", err);
			}
		})();
	}, []);

	const handleChange = (
		field: keyof EditForm,
		value: string | number | boolean | string[],
	) => {
		setEditForm((prev) => ({ ...prev, [field]: value }));
		setErrors((prev) => ({ ...prev, [field]: "" }));
	};

	// useEffect(() => {
	// 	(async () => {
	// 		try {
	// 			const groups = await fetchBloodGroups();
	// 			setBloodGroupOptions(groups.map((g) => g.name));
	// 			const comps = await fetchBloodComponents();
	// 			setBloodComponentOptions(comps.map((c) => c.name));
	// 		} catch (err) {
	// 			console.error("Lỗi lấy danh mục máu:", err);
	// 		}
	// 	})();
	// }, []);

	useEffect(() => {
		if (!id) return;

		const fetchData = async () => {
			try {
				setLoading(true);
				setError(null);

				// Fetch the doctor request/registration
				const reg = await fetchDoctorRequestById(id);
				setRegistration(reg);

				// If registration has health_check_id, fetch the health check
				if (reg?.health_check_id) {
					const hc = await fetchHealthCheck(reg.health_check_id);
					setHealthCheck(hc);
					// Initialize edit form with current data
					setEditForm({
						blood_group_id: hc.blood_group_id || "",
						request_type: hc.request_type || "",
						weight: hc.weight || 0,
						temperature: hc.temperature || 0,
						heart_rate: hc.heart_rate || 0,
						diastolic_blood_pressure: hc.diastolic_blood_pressure || 0,
						systolic_blood_pressure: hc.systolic_blood_pressure || 0,
						hemoglobin: hc.hemoglobin || 0,
						underlying_health_conditions: hc.underlying_health_conditions || [],
						description: hc.description || "",
					});
				} else {
					setError(
						"Không tìm thấy thông tin kiểm tra sức khỏe cho yêu cầu này.",
					);
				}
			} catch (err) {
				console.error("Error fetching health check:", err);
				setError("Có lỗi khi tải thông tin kiểm tra sức khỏe.");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [id]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Approved":
				return "bg-green-100 text-green-800 border-green-200";
			case "Rejected":
				return "bg-red-100 text-red-800 border-red-200";
			case "Pending":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const getStatus = (status: string) => {
		switch (status) {
			case "Approved":
				return "Hoàn Thành";
			case "Rejected":
				return "Bị từ chối";
			case "Pending":
				return "Đang chờ";
			default:
				return "Chưa cập nhật";
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString("vi-VN", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const handleInputChange = (field: keyof EditForm, value: any) => {
		setEditForm((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleConditionChange = (condition: string, checked: boolean) => {
		setEditForm((prev) => ({
			...prev,
			underlying_health_conditions: checked
				? [...prev.underlying_health_conditions, condition]
				: prev.underlying_health_conditions.filter((c) => c !== condition),
		}));
	};

	const handleUpdateHealthCheck = async () => {
		if (!healthCheck?._id) return;

		try {
			const updatePayload = {
				...editForm,
				status: "Approved",
			};

			await updateHealthCheck(healthCheck._id, updatePayload);
			navigate("/dashboard-staff/doctor-request-approved");
		} catch (err) {
			console.error("Error updating health check:", err);
			setError("Có lỗi khi cập nhật thông tin kiểm tra sức khỏe.");
		}
	};

	const handleApprove = async (approvalStatus: "Approved" | "Rejected") => {
		if (!registration?._id || !registration?.blood_group_id) return;
		if (!healthCheck?._id) return;
		try {
			await approveDoctorRequest(registration._id, {
				status: approvalStatus,
				assigned_blood_group: registration.blood_group_id,
			});
			const updatePayload = {
				...editForm,
				status: approvalStatus,
			};

			await updateHealthCheck(healthCheck._id, updatePayload);
			navigate("/dashboard-staff/doctor-request-approved");
		} catch (err) {
			console.error("Error approving/rejecting request:", err);
			setError("Có lỗi khi duyệt yêu cầu.");
		}
	};

	if (loading) {
		return (
			<div className="p-6 flex justify-center items-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">
						Đang tải thông tin kiểm tra sức khỏe...
					</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-6">
				<Card className="max-w-2xl mx-auto">
					<CardContent className="p-6 text-center">
						<div className="text-red-500 mb-4">
							<Activity className="w-16 h-16 mx-auto mb-2" />
							<h2 className="text-xl font-semibold">Lỗi</h2>
						</div>
						<p className="text-gray-600 mb-4">{error}</p>
						<Button onClick={() => navigate(-1)} variant="outline">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Quay lại
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="p-6 bg-[#f9fafb] min-h-screen">
			<div className="max-w-4xl mx-auto space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<Button
							variant="outline"
							onClick={() => navigate(-1)}
							className="flex items-center space-x-2"
						>
							<ArrowLeft className="w-4 h-4" />
							<span>Quay lại</span>
						</Button>
						<h1 className="text-2xl font-bold text-gray-900">
							Thông tin kiểm tra sức khỏe
						</h1>
					</div>
				</div>

				{/* Patient Information */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<User className="w-5 h-5" />
							<span>Thông tin bệnh nhân</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<p className="text-sm text-gray-600 mb-1">Họ và tên</p>
								<p className="font-semibold">
									{registration?.full_name || "Chưa cập nhật"}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-600 mb-1">Số điện thoại</p>
								<p className="font-semibold">
									{registration?.phone || "Chưa cập nhật"}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-600 mb-1">Nhóm máu</p>
								<p className="font-semibold">
									{registration?.blood_group_name || "Chưa cập nhật"}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-600 mb-1">Ngày yêu cầu</p>
								<p className="font-semibold">
									{registration?.receive_date_request
										? formatDate(registration.receive_date_request)
										: "Chưa cập nhật"}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Health Check Results */}
				{healthCheck && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<Activity className="w-5 h-5" />
									<span>Kết quả kiểm tra sức khỏe</span>
								</div>
								<Badge className={getStatusColor(healthCheck.status)}>
									{getStatus(healthCheck.status)}
								</Badge>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-6">
								<div>
									<h3 className="text-lg font-semibold mb-4 flex items-center">
										<Heart className="w-5 h-5 mr-2" />
										Máu
									</h3>
									{/* Nhóm máu */}
									<div className="mb-4">
										<div className="font-bold mb-2">Nhóm máu</div>
										<Select
											value={editForm.blood_group_id}
											onValueChange={(v) => handleChange("blood_group_id", v)}
										>
											<SelectTrigger>
												<SelectValue placeholder="Chọn nhóm máu" />
											</SelectTrigger>
											<SelectContent>
												{bloodGroupOptions.map((group) => (
													<SelectItem key={group.id} value={group.id}>
														{group.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									{/* Thành phần máu (multi-check, 3 cột) */}
									<div className="space-y-2">
										<Label className="font-bold">Thành phần máu</Label>
										<Select
											value={editForm.request_type}
											onValueChange={(value) =>
												handleChange("request_type", value)
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Chọn thành phần máu" />
											</SelectTrigger>
											<SelectContent>
												{bloodComponentOptions.map((component) => (
													<SelectItem key={component} value={component}>
														{RequestTypeVN[
															component as keyof typeof RequestTypeVN
														] || component}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>

								{/* Vital Signs */}
								<div>
									<h3 className="text-lg font-semibold mb-4 flex items-center">
										<Heart className="w-5 h-5 mr-2" />
										Sinh hiệu
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
										<div className="flex items-center space-x-3">
											<Weight className="w-5 h-5 text-blue-600" />
											<div className="flex-1">
												<Label className="text-sm text-gray-600">
													Cân nặng (kg)
												</Label>
												<Input
													type="number"
													value={editForm.weight}
													onChange={(e) =>
														handleInputChange("weight", Number(e.target.value))
													}
													className="mt-1"
												/>
											</div>
										</div>
										<div className="flex items-center space-x-3">
											<Thermometer className="w-5 h-5 text-red-600" />
											<div className="flex-1">
												<Label className="text-sm text-gray-600">
													Nhiệt độ (°C)
												</Label>
												<Input
													type="number"
													step="0.1"
													value={editForm.temperature}
													onChange={(e) =>
														handleInputChange(
															"temperature",
															Number(e.target.value),
														)
													}
													className="mt-1"
												/>
											</div>
										</div>
										<div className="flex items-center space-x-3">
											<Heart className="w-5 h-5 text-pink-600" />
											<div className="flex-1">
												<Label className="text-sm text-gray-600">
													Nhịp tim (BPM)
												</Label>
												<Input
													type="number"
													value={editForm.heart_rate}
													onChange={(e) =>
														handleInputChange(
															"heart_rate",
															Number(e.target.value),
														)
													}
													className="mt-1"
												/>
											</div>
										</div>
									</div>
								</div>

								{/* Blood Pressure */}
								<div>
									<h3 className="text-lg font-semibold mb-4">Huyết áp</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<Label className="text-sm text-gray-600">
												Huyết áp tâm thu (mmHg)
											</Label>
											<Input
												type="number"
												value={editForm.systolic_blood_pressure}
												onChange={(e) =>
													handleInputChange(
														"systolic_blood_pressure",
														Number(e.target.value),
													)
												}
												className="mt-1"
											/>
										</div>
										<div>
											<Label className="text-sm text-gray-600">
												Huyết áp tâm trương (mmHg)
											</Label>
											<Input
												type="number"
												value={editForm.diastolic_blood_pressure}
												onChange={(e) =>
													handleInputChange(
														"diastolic_blood_pressure",
														Number(e.target.value),
													)
												}
												className="mt-1"
											/>
										</div>
									</div>
								</div>

								{/* Hemoglobin */}
								<div>
									<h3 className="text-lg font-semibold mb-4 flex items-center">
										<Droplets className="w-5 h-5 mr-2 text-red-600" />
										Hemoglobin
									</h3>
									<div className="max-w-xs">
										<Label className="text-sm text-gray-600">
											Hemoglobin (g/dL)
										</Label>
										<Input
											type="number"
											step="0.1"
											value={editForm.hemoglobin}
											onChange={(e) =>
												handleInputChange("hemoglobin", Number(e.target.value))
											}
											className="mt-1"
										/>
									</div>
								</div>

								{/* Health Conditions */}
								<div>
									<h3 className="text-lg font-semibold mb-4">
										Tình trạng sức khỏe
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{Object.values(UnderlyingHealthCondition).map(
											(condition) => (
												<div
													key={condition}
													className="flex items-center space-x-2"
												>
													<Checkbox
														id={condition}
														checked={editForm.underlying_health_conditions.includes(
															condition,
														)}
														onCheckedChange={(checked) =>
															handleConditionChange(
																condition,
																checked as boolean,
															)
														}
													/>
													<Label htmlFor={condition} className="text-sm">
														{CONDITION_LABELS[condition] || condition}
													</Label>
												</div>
											),
										)}
									</div>
								</div>

								{/* Description */}
								<div>
									<h3 className="text-lg font-semibold mb-4">Mô tả</h3>
									<Textarea
										value={editForm.description}
										onChange={(e) =>
											handleInputChange("description", e.target.value)
										}
										placeholder="Nhập mô tả chi tiết..."
										className="min-h-[100px]"
									/>
								</div>

								{/* Timestamps */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
									<div>
										<p className="font-medium">Ngày tạo</p>
										<p>
											{healthCheck.created_at
												? formatDate(healthCheck.created_at)
												: "Chưa cập nhật"}
										</p>
									</div>
									<div>
										<p className="font-medium">Ngày cập nhật</p>
										<p>
											{healthCheck.updated_at
												? formatDate(healthCheck.updated_at)
												: "Chưa cập nhật"}
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Actions */}
				<Card>
					<CardContent className="p-6">
						<div className="flex justify-center space-x-4">
							{healthCheck && healthCheck.status === "Pending" && (
								<>
									<Button
										onClick={handleUpdateHealthCheck}
										className="bg-green-600 hover:bg-green-700 text-white"
									>
										<CheckCircle className="w-4 h-4 mr-2" />
										Duyệt
									</Button>
									<Button
										onClick={() => handleApprove("Rejected")}
										className="bg-red-600 hover:bg-red-700 text-white"
									>
										<XCircle className="w-4 h-4 mr-2" />
										Từ chối
									</Button>
								</>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};
