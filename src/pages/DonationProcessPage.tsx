import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Stepper } from "@/components/ui/stepper";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

import {
	fetchDonationRegistrations,
	checkInDonationRegistration,
} from "../api/donationRegistrationService";
import {
	fetchHealthCheck,
	updateHealthCheckDonation,
} from "../api/healthCheckService";
import {
	fetchDonationProcess,
	updateDonationProcess,
} from "../api/donationProcessService";

import type {
	DonationRegistration,
	HealthCheck,
	DonationProcess,
} from "../types/donation";
import { UnderlyingHealthCondition } from "../types/health";

import {
	SCREEN_RESULT_LABELS,
	DONATION_STATUS_LABELS,
	CONDITION_LABELS,
} from "@/constants/donationLabels";
import bloodComponentVN from "@/utils/translateBloodComponentVN";
import { Label } from "@/components/ui/label";
import { fetchBloodGroups } from "@/api/bloodService";
import { RequestTypeList, RequestTypeVN } from "@/constants/requestType";
import {
	validateDonationProcess,
	validateHealthScreeningFields,
} from "@/utils/healthCheckValidation";
import { toast } from "sonner";
type ResultType = "Approved" | "Rejected";

function getExactLocalDatetime() {
	const now = new Date();

	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const date = String(now.getDate()).padStart(2, "0");
	const hours = String(now.getHours()).padStart(2, "0");
	const minutes = String(now.getMinutes()).padStart(2, "0");

	return `${year}-${month}-${date}T${hours}:${minutes}`;
}

export const DonationProcessPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const [currentStep, setCurrentStep] = useState<number>(1);
	const [registration, setRegistration] = useState<DonationRegistration | null>(
		null,
	);
	const [health, setHealth] = useState<HealthCheck | null>(null);
	const [process, setProcess] = useState<DonationProcess | null>(null);

	const [donationGroup, setDonationGroup] = useState<string>("");
	const [donationType, setDonationType] = useState<string>("");
	

	// Step 2
	const [weight, setWeight] = useState<string>("");
	const [temperature, setTemperature] = useState<string>("");
	const [heartRate, setHeartRate] = useState<string>("");
	const [diastolicBP, setDiastolicBP] = useState<string>("");
	const [systolicBP, setSystolicBP] = useState<string>("");
	const [hemoglobin, setHemoglobin] = useState<string>("");
	const [conditions, setConditions] = useState<string[]>([]);
	const [screenResult, setScreenResult] = useState<ResultType>("Approved");

	// Step 3
	const [donationDate, setDonationDate] = useState<string>("");
	const [volumeCollected, setVolumeCollected] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [statusDonation, setStatusDonation] = useState<"Approved" | "Rejected">(
		"Approved",
	);
	const [donationDone, setDonationDone] = useState(false);

	const [bloodGroupOptions, setBloodGroupOptions] = useState<
		{ id: string; name: string }[]
	>([]);
	const [bloodComponentOptions, setBloodComponentOptions] = useState<string[]>(
		[],
	);
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
	const [donationErrors, setDonationErrors] = useState<Record<string, string>>(
		{},
	);
	const [rejectedStep, setRejectedStep] = useState<number | undefined>(
		undefined,
	);
	const [shouldSubmitScreening, setShouldSubmitScreening] = useState(false);
	const [shouldSubmitDonation, setShouldSubmitDonation] = useState(false);

	useEffect(() => {
		const loadOptions = async () => {
			try {
				const groups = await fetchBloodGroups();
				setBloodGroupOptions(groups.map((g) => ({ id: g._id, name: g.name })));
				const types = await RequestTypeList;
				setBloodComponentOptions(types.map((t) => t[0]));
			} catch (err) {
				console.error("Failed to load options", err);
			}
		};
		loadOptions();
	}, [currentStep]);

	useEffect(() => {
		if (currentStep === 3 && !donationDate) {
			const localTime = getExactLocalDatetime();
			console.log("⏰ Local datetime:", localTime);
			console.log("⏰ new Date().toString()", new Date().toString());

			setDonationDate(localTime);
		}
	}, [currentStep]);

	useEffect(() => {
		console.log("⏰ donationDate:", donationDate);
	}, [currentStep]);
	useEffect(() => {
		if (!id) return;
		(async () => {
			const regs = await fetchDonationRegistrations();
			const reg = regs.find((r) => r._id === id) ?? null;
			setRegistration(reg);
			if (reg) {
				setDonationType(reg.donation_type || "");
				setDonationGroup(reg.blood_group_id || "");
			}
			if (!reg || reg.status !== "Checked In") {
				setCurrentStep(1);
				return;
			}
			let hc = null;
			if (reg.health_check_id) {
				hc = await fetchHealthCheck(reg.health_check_id);
				setHealth(hc);
				setDonationGroup(hc.blood_group_id || "");
			}
			if (hc && hc.status === "Rejected") {
				setRejectedStep(2);
				setStatusDonation("Rejected");
				setCurrentStep(4);
				return;
			}
			if (!hc || hc.status !== "Approved") {
				setCurrentStep(2);
				return;
			}
			let dp = null;
			if (hc.donation_process_id) {
				dp = await fetchDonationProcess(hc.donation_process_id);
				setProcess(dp);
			}
			if (dp && dp.status === "Rejected") {
				setRejectedStep(3);
				setStatusDonation("Rejected");
				setCurrentStep(4);
				return;
			}
			setCurrentStep(dp?.status === "Pending" ? 3 : 4);
		})();
	}, [id]);

	useEffect(() => {
		if (health && currentStep === 2) {
			setWeight(health.weight?.toString() || "");
			setTemperature(health.temperature?.toString() || "");
			setHeartRate(health.heart_rate?.toString() || "");
			setDiastolicBP(health.diastolic_blood_pressure?.toString() || "");
			setSystolicBP(health.systolic_blood_pressure?.toString() || "");
			setHemoglobin(health.hemoglobin?.toString() || "");
			setConditions(health.underlying_health_conditions || []);
			if (!donationGroup && health.blood_group_id) {
				setDonationGroup(health.blood_group_id);
			}
			if (!donationType && health.donation_type) {
				setDonationType(health.donation_type);
			}

			if (health.status === "Approved" || health.status === "Rejected") {
				setScreenResult(health.status);
			}
		}
	}, [health]);

	useEffect(() => {
		if (process && currentStep === 3) {
			// setDonationDate(process.donation_date?.slice(0, 16) || "");
			setVolumeCollected(process.volume_collected?.toString() || "");
			setDescription(process.description || "");
			if (process.status === "Approved" || process.status === "Rejected") {
				setStatusDonation(process.status);
			}
		}
	}, [process]);
	const handleCheckIn = async () => {
		if (!registration) return;
		await checkInDonationRegistration(
			id!,
			"Checked In",
			donationType || undefined,
		);
		setCurrentStep(2);
	};
	useEffect(() => {
		if (screenResult !== "Rejected" && currentStep === 2) {
			setRejectedStep(undefined);
		}
		if (statusDonation !== "Rejected" && currentStep === 3) {
			setRejectedStep(undefined);
		}
	}, [screenResult, statusDonation, currentStep]);

	useEffect(() => {
		if (shouldSubmitScreening && health && currentStep === 2) {
			(async () => {
				try {
					await updateHealthCheckDonation(health._id, {
						blood_group_id: donationGroup || health.blood_group_id,
						weight: parseFloat(weight),
						temperature: parseFloat(temperature),
						heart_rate: parseFloat(heartRate),
						diastolic_blood_pressure: parseFloat(diastolicBP),
						systolic_blood_pressure: parseFloat(systolicBP),
						hemoglobin: parseFloat(hemoglobin),
						underlying_health_conditions: conditions,
						description: health.description,
						status: screenResult,
						donation_type: donationType || health.donation_type,
					});

					const updatedHealth = await fetchHealthCheck(health._id);
					setHealth(updatedHealth);
					if (updatedHealth.donation_process_id) {
						try {
							const dp = await fetchDonationProcess(
								updatedHealth.donation_process_id,
							);
							setProcess(dp);
						} catch (err) {
							console.error("Fetch process sau sàng lọc thất bại:", err);
						}
					}

					if (screenResult === "Rejected") {
						setRejectedStep(currentStep);
						setStatusDonation("Rejected");
						setCurrentStep(4);
					} else {
						setCurrentStep(3);
					}
					toast.success("Sàng lọc sức khỏe thành công!");
				} catch (err) {
					console.error("Screening failed", err);
					toast.error("Có lỗi xảy ra khi cập nhật thông tin sàng lọc!");
				} finally {
					setShouldSubmitScreening(false);
				}
			})();
		}
	}, [shouldSubmitScreening, health, currentStep]);

	const onScreening = async () => {
		const { valid, fieldErrors } = validateHealthScreeningFields({
			donationGroup,
			donationType,
			weight: parseFloat(weight),
			temperature: parseFloat(temperature),
			heartRate: parseFloat(heartRate),
			systolicBP: parseFloat(systolicBP),
			diastolicBP: parseFloat(diastolicBP),
			hemoglobin: parseFloat(hemoglobin),
			conditions,
			screenResult,
		});
		setFieldErrors(fieldErrors);
		if (!valid) {
			Object.values(fieldErrors).forEach((msg) => toast.error(msg));
			return;
		}
		setShouldSubmitScreening(true);
	};
	useEffect(() => {
		// Khi vào bước 3, nếu chưa có process mà health.donation_process_id đã có
		if (currentStep === 3 && !process && health?.donation_process_id) {
			(async () => {
				try {
					const dp = await fetchDonationProcess(health.donation_process_id);
					setProcess(dp);
				} catch (err) {
					console.error("Không lấy được DonationProcess:", err);
				}
			})();
		}
	}, [currentStep, health, process]);

	// useEffect(() => {
	// 	if (shouldSubmitDonation && process && currentStep === 3) {
	// 		(async () => {
	// 			try {
	// 				await updateDonationProcess(process._id, {
	// 					donation_date: donationDate + ":00Z",
	// 					volume_collected: parseFloat(volumeCollected),
	// 					description,
	// 					status: statusDonation,
	// 				});
	// 				const updatedProcess = await fetchDonationProcess(process._id);
	// 				setProcess(updatedProcess);

	// 				if (statusDonation === "Rejected") {
	// 					setRejectedStep(currentStep);
	// 					toast.error("Ca hiến máu bị từ chối");
	// 				} else {
	// 					toast.success("Lưu thông tin hiến máu thành công");
	// 				}

	// 				setCurrentStep(4);
	// 			} catch (err) {
	// 				console.error("Donation update failed", err);
	// 				toast.error("Không thể cập nhật thông tin hiến máu");
	// 			} finally {
	// 				setShouldSubmitDonation(false);
	// 			}
	// 		})();
	// 	}
	// }, [shouldSubmitDonation, process, currentStep]);

	// const onDonate = async () => {
	// 	const { valid, errors } = validateDonationProcess({
	// 		donationDate,
	// 		volumeCollected: parseFloat(volumeCollected),
	// 		statusDonation,
	// 	});
	// 	const fieldErrs: Record<string, string> = {};
	// 	errors.forEach((err) => {
	// 		if (err.includes("ngày")) fieldErrs.donationDate = err;
	// 		else if (err.includes("Thể tích")) fieldErrs.volumeCollected = err;
	// 		else fieldErrs.statusDonation = err;
	// 	});
	// 	setDonationErrors(fieldErrs);
	// 	if (!valid) {
	// 		errors.forEach((msg) => toast.error(msg));
	// 		return;
	// 	}
	// 	setShouldSubmitDonation(true);
	// };

	const onDonate = async () => {
		// 1. Validate
		const { valid, errors } = validateDonationProcess({
			donationDate,
			volumeCollected: parseFloat(volumeCollected),
			statusDonation,
		});
		if (!valid) {
			errors.forEach((msg) => toast.error(msg));
			return;
		}

		// 2. Kiểm tra chắc có process
		if (!process?._id) {
			toast.error("Quá trình hiến máu chưa sẵn sàng, vui lòng thử lại sau.");
			return;
		}

		// 3. Gọi API ngay lập tức
		try {
			await updateDonationProcess(process._id, {
				donation_date: donationDate + ":00Z",
				volume_collected: parseFloat(volumeCollected),
				description,
				status: statusDonation,
			});
			// 4. Cập nhật lại state và chuyển bước
			const updated = await fetchDonationProcess(process._id);
			setProcess(updated);
			toast.success("Lưu thông tin hiến máu thành công");
			setCurrentStep(4);
		} catch (err) {
			console.error("Donation update failed", err);
			toast.error("Không thể cập nhật thông tin hiến máu");
		}
	};

	const finish = () => navigate("/dashboard-staff");

	return (
		// <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
		// 	<div className="max-w-6xl mx-auto space-y-6">
		// 		{/* Header Card */}
		// 		<Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
		<div className="min-h-screen bg-white p-4 md:p-6">
			<div className="max-w-6xl mx-auto space-y-6">
				<Card className="shadow border bg-white">
					<CardHeader className="bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-t-lg">
						<CardTitle className="text-2xl font-bold flex items-center gap-3">
							<div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
								❤️
							</div>
							Quy trình hiến máu
						</CardTitle>
						<div className="text-red-50 mt-2">
							{registration?.full_name ? (
								<span className="text-lg font-medium">
									{registration.full_name}
								</span>
							) : (
								<span className="text-sm opacity-90">Mã đăng ký: {id}</span>
							)}
						</div>
					</CardHeader>

					<CardContent className="p-8">
						<Stepper
							steps={[
								"Thông tin yêu cầu",
								"Sàng lọc sức khỏe",
								"Lấy máu",
								"Hoàn tất",
							]}
							currentStep={currentStep}
							rejectedStep={rejectedStep}
						/>
					</CardContent>
				</Card>

				{/* Main Content Card */}
				<Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
					<CardContent className="p-8">
						{/* Step 1 - Registration Info */}
						{currentStep === 1 && registration && (
							<div className="space-y-6">
								<div className="text-center mb-8">
									<h3 className="text-2xl font-semibold text-gray-800 mb-2">
										Thông tin đăng ký hiến máu
									</h3>
									<p className="text-gray-600">
										Kiểm tra và xác nhận thông tin người hiến
									</p>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
									<div className="space-y-4">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
												🆔
											</div>
											<div>
												<p className="text-sm font-medium text-gray-500">
													CCCD
												</p>
												<p className="text-lg font-semibold text-gray-800">
													{registration.citizen_id_number}
												</p>
											</div>
										</div>

										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
												👤
											</div>
											<div>
												<p className="text-sm font-medium text-gray-500">
													Họ và tên
												</p>
												<p className="text-lg font-semibold text-gray-800">
													{registration.full_name}
												</p>
											</div>
										</div>

										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
												📱
											</div>
											<div>
												<p className="text-sm font-medium text-gray-500">
													Số điện thoại
												</p>
												<p className="text-lg font-semibold text-gray-800">
													{registration.phone}
												</p>
											</div>
										</div>
									</div>

									<div className="space-y-4">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
												🩸
											</div>
											<div>
												<p className="text-sm font-medium text-gray-500">
													Loại hiến máu
												</p>
												<Badge
													variant="secondary"
													className="text-base font-semibold"
												>
													{bloodComponentVN(registration.donation_type || "")}
												</Badge>
											</div>
										</div>

										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
												📅
											</div>
											<div>
												<p className="text-sm font-medium text-gray-500">
													Ngày hẹn
												</p>
												<p className="text-lg font-semibold text-gray-800">
													{new Date(
														registration.start_date_donation,
													).toLocaleString("vi-VN")}
												</p>
											</div>
										</div>
									</div>
								</div>

								<div className="flex justify-center pt-6">
									<Button
										onClick={handleCheckIn}
										size="lg"
										className="px-12 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg transform transition hover:scale-105"
									>
										Hoàn tất Check-in
									</Button>
								</div>
							</div>
						)}

						{/* Step 2 - Health Screening */}
						{currentStep === 2 && (
							<div className="space-y-8">
								<div className="text-center mb-8">
									<h3 className="text-2xl font-semibold text-gray-800 mb-2">
										Sàng lọc sức khỏe
									</h3>
									<p className="text-gray-600">
										Nhập các chỉ số sức khỏe của người hiến
									</p>
								</div>
								{/* Vital Signs */}
								<Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-blue-700">
											📊 Chỉ số sức khỏe
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
											<div className="space-y-2">
												<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
													⚖️ Cân nặng (kg)
												</label>
												<Input
													type="number"
													value={weight}
													onChange={(e) => setWeight(e.target.value)}
													className="text-center text-lg font-semibold"
													placeholder="0.0"
												/>
												{fieldErrors.weight && (
													<p className="text-red-600 text-sm">
														{fieldErrors.weight}
													</p>
												)}
											</div>

											<div className="space-y-2">
												<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
													🌡️ Nhiệt độ (°C)
												</label>
												<Input
													type="number"
													value={temperature}
													onChange={(e) => setTemperature(e.target.value)}
													className="text-center text-lg font-semibold"
													placeholder="36.5"
												/>
												{fieldErrors.temperature && (
													<p className="text-red-600 text-sm">
														{fieldErrors.temperature}
													</p>
												)}
											</div>

											<div className="space-y-2">
												<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
													💓 Nhịp tim (bpm)
												</label>
												<Input
													type="number"
													value={heartRate}
													onChange={(e) => setHeartRate(e.target.value)}
													className="text-center text-lg font-semibold"
													placeholder="72"
												/>
												{fieldErrors.heartRate && (
													<p className="text-red-600 text-sm">
														{fieldErrors.heartRate}
													</p>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
								{/* Registation Doantion inf */}
								<Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-blue-700">
											📊 Thông tin đơn hiến
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-6">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											{/* Nhóm máu */}
											<div>
												<Label>Nhóm máu</Label>
												<Select
													value={donationGroup}
													onValueChange={(v) => setDonationGroup(v)}
												>
													<SelectTrigger>
														<SelectValue
															placeholder="Chọn nhóm máu"
															defaultValue={donationGroup}
														>
															{bloodGroupOptions.find(
																(g) => g.id === donationGroup,
															)?.name || "Chọn nhóm máu"}
														</SelectValue>
													</SelectTrigger>
													<SelectContent>
														{bloodGroupOptions.map((g) => (
															<SelectItem key={g.id} value={g.id}>
																{g.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												{fieldErrors.donationGroup && (
													<p className="text-red-600 text-sm">
														{fieldErrors.donationGroup}
													</p>
												)}
											</div>

											{/* Loại hiến máu */}
											<div>
												<Label>Loại hiến máu</Label>
												<Select
													value={donationType}
													onValueChange={(v) => setDonationType(v)}
												>
													<SelectTrigger>
														<SelectValue placeholder="Chọn loại hiến máu" />
													</SelectTrigger>
													<SelectContent>
														{bloodComponentOptions.map((c) => (
															<SelectItem key={c} value={c}>
																{RequestTypeVN[
																	c as keyof typeof RequestTypeVN
																] || c}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												{fieldErrors.donationType && (
													<p className="text-red-600 text-sm">
														{fieldErrors.donationType}
													</p>
												)}
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Blood Pressure & Hemoglobin */}
								<Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-red-700">
											🫀 Huyết áp & Hemoglobin
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
											<div className="space-y-2">
												<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
													📈 Huyết áp tâm thu (mmHg)
												</label>
												<Input
													type="number"
													value={systolicBP}
													onChange={(e) => setSystolicBP(e.target.value)}
													className="text-center text-lg font-semibold"
													placeholder="120"
												/>
												{fieldErrors.systolicBP && (
													<p className="text-red-600 text-sm">
														{fieldErrors.systolicBP}
													</p>
												)}
											</div>

											<div className="space-y-2">
												<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
													📉 Huyết áp tâm trương (mmHg)
												</label>
												<Input
													type="number"
													value={diastolicBP}
													onChange={(e) => setDiastolicBP(e.target.value)}
													className="text-center text-lg font-semibold"
													placeholder="80"
												/>
												{fieldErrors.diastolicBP && (
													<p className="text-red-600 text-sm">
														{fieldErrors.diastolicBP}
													</p>
												)}
											</div>

											<div className="space-y-2">
												<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
													🔬 Hemoglobin (g/dL)
												</label>
												<Input
													type="number"
													value={hemoglobin}
													onChange={(e) => setHemoglobin(e.target.value)}
													className="text-center text-lg font-semibold"
													placeholder="12.5"
												/>
												{fieldErrors.hemoglobin && (
													<p className="text-red-600 text-sm">
														{fieldErrors.hemoglobin}
													</p>
												)}
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Health Conditions */}
								<Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-yellow-700">
											🏥 Tình trạng sức khỏe
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											{Object.values(UnderlyingHealthCondition).map((cond) => (
												<label
													key={cond}
													className="flex items-center space-x-3 p-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
												>
													<Checkbox
														checked={conditions.includes(cond)}
														onCheckedChange={(checked) => {
															if (checked) setConditions([...conditions, cond]);
															else
																setConditions(
																	conditions.filter((c) => c !== cond),
																);
														}}
													/>
													<span className="text-sm font-medium text-gray-700">
														{CONDITION_LABELS[cond] || cond}
													</span>
												</label>
											))}
										</div>
										{fieldErrors.conditions && (
											<p className="mt-2 text-red-600 text-sm">
												{fieldErrors.conditions}
											</p>
										)}

										{fieldErrors.screenResult && (
											<p className="mt-2 text-red-600 text-sm">
												{fieldErrors.screenResult}
											</p>
										)}
									</CardContent>
								</Card>

								{/* Screening Result */}
								<Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-green-700">
											Kết quả sàng lọc
										</CardTitle>
									</CardHeader>
									<CardContent>
										<Select
											defaultValue="Approved"
											onValueChange={(v) => setScreenResult(v as ResultType)}
										>
											<SelectTrigger className="w-full text-sm font-semibold">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{Object.entries(SCREEN_RESULT_LABELS).map(
													([key, label]) => (
														<SelectItem
															key={key}
															value={key}
															className="text-sm"
														>
															{key === "Approved" ? "✅" : "❌"} {label}
														</SelectItem>
													),
												)}
											</SelectContent>
										</Select>
									</CardContent>
								</Card>

								<div className="flex justify-center pt-6">
									<Button
										onClick={onScreening}
										size="lg"
										className="px-12 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-lg transform transition hover:scale-105"
									>
										Hoàn tất Sàng lọc
									</Button>
								</div>
							</div>
						)}

						{/* Step 3 - Blood Collection */}
						{currentStep === 3 && !donationDone && (
							<div className="space-y-8">
								<div className="text-center mb-8">
									<h3 className="text-2xl font-semibold text-gray-800 mb-2">
										Quy trình lấy máu
									</h3>
									<p className="text-gray-600">
										Ghi nhận thông tin quá trình hiến máu
									</p>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
									<Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
										<CardHeader>
											<CardTitle className="flex items-center gap-2 text-purple-700">
												⏰ Thời gian & Thể tích
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-6">
											<div className="space-y-2">
												<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
													📅 Ngày và giờ lấy máu
												</label>
												<Input
													type="datetime-local"
													value={donationDate}
													disabled
													readOnly
													className="text-lg bg-gray-100 text-gray-700 border-gray-300 cursor-not-allowed"
												/>
												<p className="text-sm text-gray-500 italic mt-1">
													Thời gian ghi nhận được tự động xác định khi hiến máu
													bắt đầu
												</p>

												{/* {donationErrors.donationDate && (
													<p className="text-red-600 text-sm">
														{donationErrors.donationDate}
													</p>
												)} */}
												{donationErrors.statusDonation && (
													<p className="text-red-600 text-sm">
														{donationErrors.statusDonation}
													</p>
												)}
											</div>

											<div className="space-y-2">
												<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
													🩸 Thể tích thu được (ml)
												</label>
												<Input
													type="number"
													min={0}
													value={volumeCollected}
													onChange={(e) => setVolumeCollected(e.target.value)}
													className="text-center text-lg font-semibold"
													placeholder="450"
												/>
												{donationErrors.volumeCollected && (
													<p className="text-red-600 text-sm">
														{donationErrors.volumeCollected}
													</p>
												)}
											</div>
										</CardContent>
									</Card>

									<Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200">
										<CardHeader>
											<CardTitle className="flex items-center gap-2 text-teal-700">
												📝 Trạng thái & Ghi chú
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-6">
											<div className="space-y-2">
												<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
													📊 Trạng thái hiến máu
												</label>
												<Select
													defaultValue="Approved"
													onValueChange={(v) =>
														setStatusDonation(v as ResultType)
													}
												>
													<SelectTrigger className="text-sm">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														{Object.entries(DONATION_STATUS_LABELS).map(
															([key, label]) => (
																<SelectItem
																	key={key}
																	value={key}
																	className="text-sm"
																>
																	{key === "Approved" ? "✅" : "❌"} {label}
																</SelectItem>
															),
														)}
													</SelectContent>
												</Select>
												{/* {donationErrors.statusDonation && (
													<p className="text-red-600 text-sm">
														{donationErrors.statusDonation}
													</p>
												)} */}
											</div>

											<div className="space-y-2">
												<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
													💬 Ghi chú
												</label>
												<Textarea
													value={description}
													onChange={(e) => setDescription(e.target.value)}
													className="min-h-[100px] resize-none"
													placeholder="Nhập ghi chú về quá trình hiến máu..."
												/>
											</div>
										</CardContent>
									</Card>
								</div>

								<div className="flex justify-center pt-6">
									<Button
										onClick={onDonate}
										size="lg"
										className="px-12 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg transition"
									>
										Hoàn tất Lấy máu
									</Button>
								</div>
							</div>
						)}

						{/* Step 4 - Completion */}
						{currentStep === 4 && (
							<div className="text-center space-y-8">
								{statusDonation === "Rejected" ? (
									<div className="space-y-6">
										<div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
											<span className="text-4xl">❌</span>
										</div>
										<div>
											<h3 className="text-2xl font-semibold text-red-600 mb-2">
												Quy trình đã bị hủy
											</h3>
											<p className="text-gray-600">
												Quá trình hiến máu không thể hoàn tất do không đáp ứng
												các tiêu chí sàng lọc.
											</p>
										</div>
									</div>
								) : (
									<div className="space-y-6">
										<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
											<span className="text-4xl">✅</span>
										</div>
										<div>
											<h3 className="text-2xl font-semibold text-green-600 mb-2">
												Hoàn tất thành công!
											</h3>
											<p className="text-gray-600 mb-6">
												Cảm ơn bạn đã hoàn tất quy trình hiến máu. Thông tin đã
												được lưu trữ thành công.
											</p>
											<Button
												onClick={finish}
												size="lg"
												className="px-12 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg transform transition hover:scale-105"
											>
												🏠 Quay về Dashboard
											</Button>
										</div>
									</div>
								)}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
};
