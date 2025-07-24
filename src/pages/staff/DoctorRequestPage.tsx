import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import axios from "axios";

import { createDoctorRequest } from "@/api/doctorRequestService";
import {
	fetchBloodGroups,
	getBloodGroupIdByName,
	getBloodComponentIdByName,
} from "@/api/bloodService";
import { getCCCD } from "@/api/userService";
import bloodComponentVN from "@/utils/translateBloodComponentVN";
import { validateDoctorRequest } from "@/utils/validateDoctorRequest";
import type { FormErrors } from "@/utils/validateDoctorRequest";
import type { DoctorRequestForm } from "@/api/doctorRequestService";

const FormField = React.memo<{
	label: string;
	error?: string;
	children: React.ReactNode;
	required?: boolean;
	icon?: React.ReactNode;
}>(({ label, error, children, required = false, icon }) => (
	<div className="space-y-3">
		<Label className="text-blue-800 font-semibold text-sm flex items-center gap-2">
			{icon}
			{label}
			{required && <span className="text-red-500">*</span>}
		</Label>
		{children}
		{error && (
			<p className="text-red-500 text-sm flex items-center gap-1">
				<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
					<path
						fillRule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
						clipRule="evenodd"
					/>
				</svg>
				{error}
			</p>
		)}
	</div>
));

const REQUEST_TYPE_OPTIONS = [
	"Whole Blood",
	"Red Blood Cells",
	"Platelets",
	"Plasma",
	"White Blood Cells",
	"Platelets - Plasma",
	"Plasma - Red Blood Cells",
	"Platelets - Red Blood Cells",
] as const;

export const DoctorRequestPage: React.FC = () => {
	const navigate = useNavigate();

	const [form, setForm] = useState<DoctorRequestForm>({
		patient_code: "",
		citizen_id_number: "",
		full_name: "",
		phone: "",
		bloodGroupName: "",
		request_type: "",
		receive_date_request: new Date().toISOString(),
		is_emergency: false,
		image: "",
		note: "",
	});

	const [errors, setErrors] = useState<FormErrors>({});
	const [bloodGroupOptions, setBloodGroupOptions] = useState<string[]>([]);
	const [previewUrl, setPreviewUrl] = useState(form.image);
	const nowLocal = new Date().toISOString().slice(0, 16);

	useEffect(() => {
		(async () => {
			try {
				const groups = await fetchBloodGroups();
				setBloodGroupOptions(groups.map((g) => g.name));
			} catch (err) {
				console.error("Lỗi lấy danh mục nhóm máu:", err);
			}
		})();
	}, []);

	useEffect(() => {
		setPreviewUrl(form.image);
	}, [form.image]);

	const handleReceiveDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const valLocal = e.target.value;
		const selected = new Date(valLocal);
		if (selected < new Date()) {
			setErrors((prev) => ({
				...prev,
				receive_date_request: "Không được chọn ngày giờ trong quá khứ",
			}));
			return; 
		}
		handleChange("receive_date_request", selected.toISOString());
	};

	const handleChange = <K extends keyof DoctorRequestForm>(
		field: K,
		value: DoctorRequestForm[K],
	) => {
		setForm((prev) => ({ ...prev, [field]: value }));
		setErrors((prev) => ({ ...prev, [field]: undefined }));
	};

	const handleBlurCCCD = async () => {
		const id = form.citizen_id_number.trim();
		if (!id) return;
		try {
			const user = await getCCCD(id);
			if (user) {
				handleChange("full_name", user.full_name || "");
				handleChange("phone", user.phone || "");
			}
		} catch {
			console.error("Không tìm thấy người dùng theo CCCD");
		}
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const data = new FormData();
		data.append("file", file);
		data.append("upload_preset", "BloodDonation");
		try {
			const resp = await axios.post(
				"https://api.cloudinary.com/v1_1/dpf7yfupt/image/upload",
				data,
			);
			handleChange("image", resp.data.secure_url);
		} catch {
			toast.error("Không thể upload hình ảnh");
		}
	};

	const handleSubmit = async () => {
		const errs = validateDoctorRequest(form);
		setErrors(errs);
		if (Object.keys(errs).length) return;

		try {
			const bgId = await getBloodGroupIdByName(form.bloodGroupName);
			const bcId = await getBloodComponentIdByName(form.request_type);

			await createDoctorRequest({
				blood_group_id: bgId!,
				blood_component_ids: [bcId!],
				receive_date_request: form.receive_date_request,
				is_emergency: form.is_emergency,
				full_name: form.full_name,
				phone: form.phone,
				citizen_id_number: form.citizen_id_number,
				request_type: form.request_type,
				image: form.image || undefined,
				note: form.note || undefined,
			});

			toast.success("Tạo đơn xin máu thành công!");
			navigate(-1);
		} catch {
			toast.error("Có lỗi khi gửi yêu cầu");
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-100/2 via-white to-blue-100 py-8 px-4">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full mb-4 shadow-lg">
						<svg
							className="w-10 h-10 text-white"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="12" cy="12" r="10" />
							<polyline points="9 12 12 15 17 10" />
						</svg>
					</div>

					<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
						Tạo Đơn Xin Máu
					</h1>
					<p className="text-blue-600 mt-2 text-lg">
						Điền thông tin chi tiết để tạo yêu cầu lấy máu
					</p>
				</div>

				<Card className="shadow-2xl rounded-[30px] bg-white/80 backdrop-blur-sm">
					<CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
						<div className="flex items-center gap-3">
							<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
								<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
								<path
									fillRule="evenodd"
									d="M4 5a2 2 0 012-2v1a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2V3a2 2 0 012-2 2 2 0 012 2v1h1a1 1 0 110 2H3a1 1 0 110-2h1V5z"
									clipRule="evenodd"
								/>
							</svg>
							<h2 className="text-xl font-semibold">Thông Tin Yêu Cầu</h2>
						</div>
					</CardHeader>
					<CardContent className="p-8">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							{/* Left Column */}
							<div className="space-y-6">
								{/* CCCD */}
								<FormField
									label="Số CCCD"
									error={errors.citizen_id_number}
									required
									icon={
										<svg
											className="w-4 h-4"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
												clipRule="evenodd"
											/>
										</svg>
									}
								>
									<Input
										placeholder="Nhập số CCCD (12 chữ số)"
										value={form.citizen_id_number}
										onChange={(e) =>
											handleChange("citizen_id_number", e.target.value)
										}
										onBlur={handleBlurCCCD}
										className={`${
											errors.citizen_id_number
												? "border-red-500 focus:ring-red-500/20"
												: "border-blue-200 focus:border-blue-500 focus:ring-blue-500/20"
										} bg-white/90 backdrop-blur-sm transition-all duration-200`}
									/>
								</FormField>

								{/* Họ và tên */}
								<FormField
									label="Họ và tên"
									error={errors.full_name}
									required
									icon={
										<svg
											className="w-4 h-4"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
												clipRule="evenodd"
											/>
										</svg>
									}
								>
									<Input
										placeholder="Nhập họ và tên đầy đủ"
										value={form.full_name}
										onChange={(e) => handleChange("full_name", e.target.value)}
										className={`${
											errors.full_name
												? "border-red-500 focus:ring-red-500/20"
												: "border-blue-200 focus:border-blue-500 focus:ring-blue-500/20"
										} bg-white/90 backdrop-blur-sm`}
									/>
								</FormField>

								{/* Số điện thoại */}
								<FormField
									label="Số điện thoại"
									error={errors.phone}
									required
									icon={
										<svg
											className="w-4 h-4"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
										</svg>
									}
								>
									<Input
										placeholder="Nhập số điện thoại"
										value={form.phone}
										onChange={(e) => handleChange("phone", e.target.value)}
										className={`${
											errors.phone
												? "border-red-500 focus:ring-red-500/20"
												: "border-blue-200 focus:border-blue-500 focus:ring-blue-500/20"
										} bg-white/90 backdrop-blur-sm`}
									/>
								</FormField>

								{/* Ngày nhận yêu cầu */}
								<FormField
									label="Ngày nhận yêu cầu"
									error={errors.receive_date_request}
									required
									icon={
										<svg
											className="w-4 h-4"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
												clipRule="evenodd"
											/>
										</svg>
									}
								>
									<Input
										type="datetime-local"
										min={nowLocal}
										value={form.receive_date_request.slice(0, 16)}
										onChange={handleReceiveDateChange}
										className={`${
											errors.receive_date_request
												? "border-red-500 focus:ring-red-500/20"
												: "border-blue-200 focus:border-blue-500 focus:ring-blue-500/20"
										} bg-white/90 backdrop-blur-sm`}
									/>
								</FormField>

								{/* Nhóm máu */}
								<FormField
									label="Nhóm máu"
									error={errors.bloodGroupName}
									required
									icon={
										<svg
											className="w-4 h-4"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
												clipRule="evenodd"
											/>
										</svg>
									}
								>
									<Select
										value={form.bloodGroupName}
										onValueChange={(v) => handleChange("bloodGroupName", v)}
									>
										<SelectTrigger
											className={`${
												errors.bloodGroupName
													? "border-red-500 focus:ring-red-500/20"
													: "border-blue-200 focus:border-blue-500 focus:ring-blue-500/20"
											} bg-white/90 backdrop-blur-sm`}
										>
											<SelectValue placeholder="Chọn nhóm máu" />
										</SelectTrigger>
										<SelectContent className="bg-white border-blue-200">
											{bloodGroupOptions.map((g) => (
												<SelectItem
													key={g}
													value={g}
													className="focus:bg-blue-50"
												>
													{g}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormField>
							</div>

							{/* Right Column */}
							<div className="space-y-6">
								{/* Thành phần máu */}
								<FormField
									label="Thành phần máu"
									error={errors.request_type}
									required
									icon={
										<svg
											className="w-4 h-4"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
										</svg>
									}
								>
									<Select
										value={form.request_type}
										onValueChange={(v) => handleChange("request_type", v)}
									>
										<SelectTrigger
											className={`${
												errors.request_type
													? "border-red-500 focus:ring-red-500/20"
													: "border-blue-200 focus:border-blue-500 focus:ring-blue-500/20"
											} bg-white/90 backdrop-blur-sm`}
										>
											<SelectValue placeholder="Chọn thành phần máu" />
										</SelectTrigger>
										<SelectContent className="bg-white border-blue-200">
											{REQUEST_TYPE_OPTIONS.map((enName) => (
												<SelectItem
													key={enName}
													value={enName}
													className="focus:bg-blue-50"
												>
													{bloodComponentVN(enName)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormField>

								{/* Khẩn cấp */}
								<FormField
									label="Mức độ ưu tiên"
									icon={
										<svg
											className="w-4 h-4"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
												clipRule="evenodd"
											/>
										</svg>
									}
								>
									<Select
										value={form.is_emergency ? "true" : "false"}
										onValueChange={(v) =>
											handleChange("is_emergency", v === "true")
										}
									>
										<SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/90 backdrop-blur-sm">
											<SelectValue placeholder="Chọn mức độ" />
										</SelectTrigger>
										<SelectContent className="bg-white border-blue-200">
											<SelectItem value="false" className="focus:bg-blue-50">
												<div className="flex items-center gap-2">
													<div className="w-2 h-2 bg-green-500 rounded-full"></div>
													Bình thường
												</div>
											</SelectItem>
											<SelectItem value="true" className="focus:bg-blue-50">
												<div className="flex items-center gap-2">
													<div className="w-2 h-2 bg-red-500 rounded-full"></div>
													Khẩn cấp
												</div>
											</SelectItem>
										</SelectContent>
									</Select>
								</FormField>

								{/* Hình ảnh */}
								<FormField
									label="Hình ảnh đính kèm"
									error={errors.image}
									icon={
										<svg
											className="w-4 h-4"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
												clipRule="evenodd"
											/>
										</svg>
									}
								>
									<div className="space-y-3">
										<input
											type="file"
											accept="image/*"
											onChange={handleFileChange}
											className="block w-full text-sm text-blue-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
										/>
										{previewUrl && (
											<div className="relative inline-block">
												<img
													src={previewUrl}
													alt="preview"
													className="w-32 h-32 object-cover rounded-lg border-2 border-blue-200 shadow-md"
												/>
												<div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
													<svg
														className="w-4 h-4 text-white"
														fill="currentColor"
														viewBox="0 0 20 20"
													>
														<path
															fillRule="evenodd"
															d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
															clipRule="evenodd"
														/>
													</svg>
												</div>
											</div>
										)}
									</div>
								</FormField>

								{/* Ghi chú */}
								<FormField
									label="Ghi chú thêm"
									error={errors.note}
									icon={
										<svg
											className="w-4 h-4"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.828-2.828z" />
										</svg>
									}
								>
									<Textarea
										placeholder="Nhập ghi chú, yêu cầu đặc biệt..."
										value={form.note}
										onChange={(e) => handleChange("note", e.target.value)}
										className={`${
											errors.note
												? "border-red-500 focus:ring-red-500/20"
												: "border-blue-200 focus:border-blue-500 focus:ring-blue-500/20"
										} bg-white/90 backdrop-blur-sm min-h-[100px] resize-none`}
										rows={4}
									/>
								</FormField>
							</div>
						</div>

						{/* Submit Button */}
						<div className="mt-10 flex justify-center">
							<Button
								onClick={handleSubmit}
								className="px-12 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3"
							>
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
										clipRule="evenodd"
									/>
								</svg>
								Gửi Yêu Cầu
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};
