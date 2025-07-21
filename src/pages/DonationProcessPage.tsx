import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
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

import {
	fetchDonationRegistrations,
	checkInDonationRegistration,
} from "../api/donationRegistrationService";
import { fetchHealthCheck, updateHealthCheck } from "../api/healthCheckService";
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

export const DonationProcessPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const [currentStep, setCurrentStep] = useState<number>(1);

	const [registration, setRegistration] = useState<DonationRegistration | null>(
		null,
	);
	const [health, setHealth] = useState<HealthCheck | null>(null);
	const [process, setProcess] = useState<DonationProcess | null>(null);
	const [donationType, setDonationType] = useState<string | null>(
		null,
	);

	// --- Step 2 form state ---
	const [weight, setWeight] = useState<string>("");
	const [temperature, setTemperature] = useState<string>("");
	const [heartRate, setHeartRate] = useState<string>("");
	const [diastolicBP, setDiastolicBP] = useState<string>("");
	const [systolicBP, setSystolicBP] = useState<string>("");
	const [hemoglobin, setHemoglobin] = useState<string>("");
	const [conditions, setConditions] = useState<string[]>([]);
	const [screenResult, setScreenResult] = useState<"Approved" | "Rejected">(
		"Approved",
	);

	// --- Step 3 form state ---
	const [donationDate, setDonationDate] = useState<string>("");
	const [volumeCollected, setVolumeCollected] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [statusDonation, setStatusDonation] = useState<"Approved" | "Rejected">(
		"Approved",
	);
	const [donationDone, setDonationDone] = useState(false);

	useEffect(() => {
		if (!id) return;
		(async () => {
			// fetch registration list and select
			const regs = await fetchDonationRegistrations();
			const reg = regs.find((r) => r._id === id) ?? null;
			console.log("reg nè", reg);
			setRegistration(reg);

			if (!reg || reg.status !== "Checked In") {
				setCurrentStep(1);
				return;
			}

			// fetch health check
			let hc: HealthCheck | null = null;
			if (reg.health_check_id) {
				hc = await fetchHealthCheck(reg.health_check_id);
				console.log("fetch health check", hc);
				setHealth(hc);
			}

			if (hc && hc.status === "Rejected") {
				setStatusDonation("Rejected");
				setCurrentStep(4);
				return;
			}

			if (!hc || hc.status !== "Approved") {
				if (hc) {
					setWeight(hc.weight?.toString() || "");
					setTemperature(hc.temperature?.toString() || "");
					setHeartRate(hc.heart_rate?.toString() || "");
					setDiastolicBP(hc.diastolic_blood_pressure?.toString() || "");
					setSystolicBP(hc.systolic_blood_pressure?.toString() || "");
					setHemoglobin(hc.hemoglobin?.toString() || "");
					setConditions(hc.underlying_health_conditions || []);
					setScreenResult(hc.status as any);
				}
				setCurrentStep(2);
				return;
			}

			// health approved → fetch donation process
			let dp: DonationProcess | null = null;
			if (hc.donation_process_id) {
				dp = await fetchDonationProcess(hc.donation_process_id);
				setProcess(dp);
				setDonationDate(dp.donation_date.slice(0, 16));
				setVolumeCollected(dp.volume_collected?.toString() || "");
				setDescription(dp.description || "");
				setStatusDonation(dp.status as any);
			}

			if (!dp || dp.status === "Pending") {
				setCurrentStep(3);
			} else {
				setStatusDonation(dp.status as any);
				setCurrentStep(4);
			}
		})();
	}, [id]);
useEffect(() => {
  if (registration?.donation_type) {
    setDonationType(registration.donation_type);
  }
}, [registration]);

	// Step handlers
	const handleCheckIn = async () => {
		if (!registration) return;
		await checkInDonationRegistration(id!, "Checked In", donationType ?? undefined);
		setCurrentStep(2);
	};

	const handleScreening = async () => {
		if (!health) return;
		console.log("tyep ở health", health.donation_type);

		await updateHealthCheck(health._id, {
			blood_group_id: health.blood_group_id,
			weight: parseFloat(weight),
			temperature: parseFloat(temperature),
			heart_rate: parseFloat(heartRate),
			diastolic_blood_pressure: parseFloat(diastolicBP),
			systolic_blood_pressure: parseFloat(systolicBP),
			hemoglobin: parseFloat(hemoglobin),
			underlying_health_conditions: conditions,
			description: health.description,
			status: screenResult,
			donation_type: health.donation_type,

		});
		if (screenResult === "Rejected") {
			setStatusDonation("Rejected");
			setCurrentStep(4);
		} else {
			setCurrentStep(3);
		}
	};

	const handleDonation = async () => {
		if (!process) return;
		try {
			await updateDonationProcess(process._id, {
				donation_date: donationDate + ":00Z",
				volume_collected: parseFloat(volumeCollected),
				description,
				status: statusDonation,


			});
			setDonationDone(true);
			setCurrentStep(4);
		} catch (e: any) {
			alert("Lỗi: " + JSON.stringify(e.response?.data.errors));
		}
	};

	const finish = () => navigate("/dashboard-staff/donation");

	return (
		<div className="p-6 space-y-6">
			<Card className="mb-6 ">
				<CardContent className="p-6 ">
					<h2 className="text-xl font-semibold text-blue-700 mb-4">
						Xử lý hiến máu – {registration?.full_name || id}
					</h2>

					<Stepper
						steps={["Thông tin yêu cầu", "Sàng lọc", "Lấy máu", "Hoàn tất"]}
						currentStep={currentStep}
					/>

					{/* Step 1 */}
					{currentStep === 1 && (
						<Button onClick={handleCheckIn}>Hoàn tất Check-in</Button>
					)}

					{/* Step 2 */}
					{currentStep === 2 && (
						<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Weight */}
							<div>
								<label className="block mb-1">Cân nặng (kg)</label>
								<Input
									type="number"
									value={weight}
									onChange={(e) => setWeight(e.target.value)}
								/>
							</div>
							{/* Temperature */}
							<div>
								<label className="block mb-1">Nhiệt độ (°C)</label>
								<Input
									type="number"
									value={temperature}
									onChange={(e) => setTemperature(e.target.value)}
								/>
							</div>
							{/* Heart Rate */}
							<div>
								<label className="block mb-1">Nhịp tim</label>
								<Input
									type="number"
									value={heartRate}
									onChange={(e) => setHeartRate(e.target.value)}
								/>
							</div>
							{/* Systolic BP */}
							<div>
								<label className="block mb-1">Huyết áp tâm thu</label>
								<Input
									type="number"
									value={systolicBP}
									onChange={(e) => setSystolicBP(e.target.value)}
								/>
							</div>
							{/* Diastolic BP */}
							<div>
								<label className="block mb-1">Huyết áp tâm trương</label>
								<Input
									type="number"
									value={diastolicBP}
									onChange={(e) => setDiastolicBP(e.target.value)}
								/>
							</div>
							{/* Hemoglobin */}
							<div>
								<label className="block mb-1">Hemoglobin</label>
								<Input
									type="number"
									value={hemoglobin}
									onChange={(e) => setHemoglobin(e.target.value)}
								/>
							</div>

							{/* Conditions */}
							<div className="md:col-span-2">
								<label className="block mb-2">Tình trạng sức khỏe</label>
								<div className="grid grid-cols-2 gap-4">
									{Object.values(UnderlyingHealthCondition).map((cond) => (
										<label key={cond} className="flex items-center space-x-2">
											<Checkbox
												checked={conditions.includes(cond)}
												onCheckedChange={(checked) => {
													if (checked) setConditions([...conditions, cond]);
													else
														setConditions(conditions.filter((c) => c !== cond));
												}}
											/>
											<span>{CONDITION_LABELS[cond] || cond}</span>
										</label>
									))}
								</div>
							</div>

							{/* Screening Result */}
							<div className="md:col-span-2">
								<label className="block mb-1">Kết quả sàng lọc</label>
								<Select
									value={screenResult}
									onValueChange={(v) => setScreenResult(v as any)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Chọn kết quả" />
									</SelectTrigger>
									<SelectContent>
										{Object.entries(SCREEN_RESULT_LABELS).map(
											([key, label]) => (
												<SelectItem key={key} value={key}>
													{label}
												</SelectItem>
											),
										)}
									</SelectContent>
								</Select>
							</div>

							<div className="md:col-span-2 text-right">
								<Button onClick={handleScreening}>Hoàn tất Sàng lọc</Button>
							</div>
						</div>
					)}

					{/* Step 3 */}
					{currentStep === 3  && !donationDone && (
						<div className="mt-6 grid grid-cols-1 gap-6">
							<div>
								<label className="block mb-1">Ngày lấy máu</label>
								<Input
									type="datetime-local"
									value={donationDate}
									onChange={(e) => setDonationDate(e.target.value)}
								/>
							</div>

							<div>
								<label className="block mb-1">Thể tích thu (ml)</label>
								<Input
									type="number"
									value={volumeCollected}
									onChange={(e) => setVolumeCollected(e.target.value)}
								/>
							</div>

							<div>
								<label className="block mb-1">Ghi chú</label>
								<Textarea
									value={description}
									onChange={(e) => setDescription(e.target.value)}
								/>
							</div>

							<div>
								<label className="block mb-1">Trạng thái hiến máu</label>
								<Select
									value={statusDonation}
									onValueChange={(v) => setStatusDonation(v as any)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Chọn trạng thái" />
									</SelectTrigger>
									<SelectContent>
										{Object.entries(DONATION_STATUS_LABELS).map(
											([key, label]) => (
												<SelectItem key={key} value={key}>
													{label}
												</SelectItem>
											),
										)}
									</SelectContent>
								</Select>
							</div>

							<div className="text-right">
								<Button onClick={handleDonation}>Hoàn tất Lấy máu</Button>
							</div>
						</div>
					)}

					{/* Step 4 */}
					{currentStep === 4 && (
						<div className="mt-6">
							{statusDonation === "Rejected" ? (
								<p className="text-red-600 font-medium">Quy trình đã bị hủy.</p>
							) : (
								<Button variant="link" onClick={finish}>
									Xác nhận Hoàn tất
								</Button>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};
