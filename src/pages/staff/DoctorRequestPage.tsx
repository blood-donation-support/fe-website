import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";

import { createDoctorRequest } from "../../api/doctorRequestService";
import {
	fetchBloodGroups,
	fetchBloodComponents,
	getBloodGroupIdByName,
	getBloodComponentIdByName,
} from "../../api/bloodService";
import type { DoctorRequestPayload } from "../../api/doctorRequestService";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { analytics } from "@/firebase";
import { getCCCD } from "@/api/userService";
import { toast } from "react-toastify";

export const DoctorRequestPage: React.FC = () => {
	const navigate = useNavigate();

	const handleBlurCCCD = async () => {
		const id = form.citizen_id_number.trim();
		if (!id) return;

		try {
			const user = await getCCCD(id);
			if (user) {
				// Cập nhật form với thông tin từ API
				handleChange("full_name", user.full_name || "");
				handleChange("phone", user.phone || "");
			}
		} catch (error) {
			console.error("Không tìm thấy người dùng theo CCCD:", error);
		}
	};

	type Form = {
		patient_code: string;
		citizen_id_number: string;
		full_name: string;
		phone: string;
		bloodGroupName: string;
		bloodComponentNames: string[];
		receive_date_request: string;
		is_emergency: boolean;
		image: string;
		note: string;
	};

	const initialForm: Form = {
		patient_code: "",
		citizen_id_number: "",
		full_name: "",
		phone: "",
		bloodGroupName: "",
		bloodComponentNames: [],
		receive_date_request: new Date().toISOString(),
		is_emergency: false,
		image: "",
		note: "",
	};

	const [idType, setIdType] = useState<"patient_code" | "citizen_id_number">(
		"citizen_id_number", // Changed default to citizen_id_number
	);
	const [form, setForm] = useState<Form>(initialForm);
	const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
	const [successMessage, setSuccessMessage] = useState("");
	const [bloodGroupOptions, setBloodGroupOptions] = useState<string[]>([]);
	const [bloodComponentOptions, setBloodComponentOptions] = useState<string[]>(
		[],
	);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [previewUrl, setPreviewUrl] = useState("");

	useEffect(() => {
		(async () => {
			try {
				const groups = await fetchBloodGroups();
				setBloodGroupOptions(groups.map((g) => g.name));
				const comps = await fetchBloodComponents();
				setBloodComponentOptions(comps.map((c) => c.name));
			} catch (err) {
				console.error("Lỗi lấy danh mục máu:", err);
			}
		})();
	}, []);

	useEffect(() => {
		setPreviewUrl(form.image || "");
	}, [form.image]);

	const handleChange = (
		field: keyof Form,
		value: string | boolean | string[],
	) => {
		setForm((prev) => ({ ...prev, [field]: value } as any));
		setErrors((prev) => ({ ...prev, [field]: "" }));
	};

	const validate = () => {
		const errs: Partial<Record<keyof Form, string>> = {};
		
		// Required fields
		if (!form.full_name.trim()) errs.full_name = "Bắt buộc";
		if (!/^\d{10,11}$/.test(form.phone)) errs.phone = "SĐT không hợp lệ";
		if (!form.bloodGroupName) errs.bloodGroupName = "Chọn nhóm máu";
		if (form.bloodComponentNames.length === 0)
			errs.bloodComponentNames = "Chọn thành phần máu";
		
		// Always require citizen_id_number since idType is fixed to citizen_id_number
		if (!form.citizen_id_number.trim()) {
			errs.citizen_id_number = "Nhập CCCD";
		}
		
		// Validate CCCD format (12 digits)
		if (form.citizen_id_number.trim() && !/^\d{12}$/.test(form.citizen_id_number.trim())) {
			errs.citizen_id_number = "CCCD phải có 12 chữ số";
		}

	// 	setErrors(errs);
	// 	return Object.keys(errs).length === 0;
	// };
    // Upload lên Firebase
    // const storageRef = ref(
    //   // analytics,
    //   `doctor-requests/${Date.now()}_${file.name}`
    // );
    //const uploadTask = uploadBytesResumable(storageRef, file);
    // uploadTask.on(
    //   "state_changed",
    //   (snapshot) => {
    //     const prog = Math.round(
    //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    //     );
    //     setUploadProgress(prog);
    //   },
    //   (err) => console.error("Upload lỗi:", err),
    //   () => {
    //     getDownloadURL(uploadTask.snapshot.ref).then((url) => {
    //       handleChange("image", url); // Lưu URL chính thức
    //       URL.revokeObjectURL(objectUrl); // Dọn preview tạm
    //       setUploadProgress(0);
    //     });
    //   }
    // );
  };

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Preview tạm
		const objectUrl = URL.createObjectURL(file);
		setPreviewUrl(objectUrl);

		// Upload lên Firebase
		const storageRef = ref(
			analytics,
			`doctor-requests/${Date.now()}_${file.name}`,
		);
		const uploadTask = uploadBytesResumable(storageRef, file);
		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const prog = Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100,
				);
				setUploadProgress(prog);
			},
			(err) => console.error("Upload lỗi:", err),
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((url) => {
					handleChange("image", url); // Lưu URL chính thức
					URL.revokeObjectURL(objectUrl); // Dọn preview tạm
					setUploadProgress(0);
				});
			},
		);
	};

	const handleSubmit = async () => {
		if (!validate()) return;

		const bgId = await getBloodGroupIdByName(form.bloodGroupName);
		const bcIds = await Promise.all(
			form.bloodComponentNames.map((name) => getBloodComponentIdByName(name)),
		);

		if (!bgId || bcIds.some((id) => !id)) {
			alert("Không tìm thấy nhóm máu hoặc thành phần máu phù hợp.");
			return;
		}

		const payload: DoctorRequestPayload = {
			blood_group_id: bgId,
			blood_component_ids: bcIds as string[],
			receive_date_request: form.receive_date_request,
			is_emergency: form.is_emergency,
			full_name: form.full_name,
			phone: form.phone,
			image: form.image || undefined,
			note: form.note || undefined,
			citizen_id_number: form.citizen_id_number, 
			request_type: "Red Blood Cells",
		};
		console.log("payload nè", payload);

		try {
			await createDoctorRequest(payload);
			// setSuccessMessage("Tạo đơn xin máu thành công!");
      toast.success("Tạo đơn xin máu thành công!")
			setForm(initialForm);
		} catch (err: any) {
			console.error(err);
			
			// Handle API validation errors
			if (err.response?.data?.errors) {
				const apiErrors = err.response.data.errors;
				const newErrors: Partial<Record<keyof Form, string>> = {};
				
				// Map API errors to form errors
				if (apiErrors.citizen_id_number) {
					newErrors.citizen_id_number = apiErrors.citizen_id_number.msg;
				}
				if (apiErrors.phone) {
					newErrors.phone = apiErrors.phone.msg;
				}
				if (apiErrors.full_name) {
					newErrors.full_name = apiErrors.full_name.msg;
				}
				
				setErrors(newErrors);
			} else {
				alert("Có lỗi khi gửi yêu cầu");
			}
		}
	};

	return (
		<div className="p-8 bg-[#f9fafb] min-h-screen flex justify-center">
			<div className="w-full max-w-3xl">
				<h2 className="text-3xl font-semibold text-center text-[#236afe] mb-8">
					Tạo Đơn Xin Máu
				</h2>
				{successMessage && (
					<div className="mb-4 text-green-600 font-medium text-center">
						{successMessage}
					</div>
				)}
				<Card className="shadow-lg">
					<CardContent className="p-6 space-y-4">
						{/* CCCD Input */}
						<div>
							<div className="font-bold">CCCD</div>
							<Input
								placeholder="Nhập số CCCD (12 chữ số)"
								value={form.citizen_id_number}
								onChange={(e) =>
									handleChange("citizen_id_number", e.target.value)
								}
								onBlur={handleBlurCCCD}
								className={errors.citizen_id_number ? "border-red-500" : ""}
							/>
							{errors.citizen_id_number && (
								<p className="text-red-600 text-sm mt-1">
									{errors.citizen_id_number}
								</p>
							)}
						</div>

						{/* Họ tên & SĐT */}
						<div>
							<div className="font-bold">Họ và tên</div>
							<Input
								placeholder="Họ và tên"
								value={form.full_name}
								onChange={(e) => handleChange("full_name", e.target.value)}
								className={errors.full_name ? "border-red-500" : ""}
							/>
							{errors.full_name && (
								<p className="text-red-600 text-sm mt-1">{errors.full_name}</p>
							)}
						</div>

						<div>
							<div className="font-bold">Số điện thoại</div>
							<Input
								placeholder="Số điện thoại"
								value={form.phone}
								onChange={(e) => handleChange("phone", e.target.value)}
								className={errors.phone ? "border-red-500" : ""}
							/>
							{errors.phone && (
								<p className="text-red-600 text-sm mt-1">{errors.phone}</p>
							)}
						</div>

						{/* Ngày nhận yêu cầu */}
						<div>
							<div className="font-bold">Ngày nhận yêu cầu</div>
							<Input
								type="datetime-local"
								value={form.receive_date_request.slice(0, 16)}
								onChange={(e) =>
									handleChange(
										"receive_date_request",
										new Date(e.target.value).toISOString(),
									)
								}
							/>
						</div>

						{/* Nhóm máu */}
						<div>
							<div className="font-bold">Nhóm máu</div>
							<Select
								value={form.bloodGroupName}
								onValueChange={(v) => handleChange("bloodGroupName", v)}
							>
								<SelectTrigger className={errors.bloodGroupName ? "border-red-500" : ""}>
									<SelectValue placeholder="Chọn nhóm máu" />
								</SelectTrigger>
								<SelectContent>
									{bloodGroupOptions.map((g) => (
										<SelectItem key={g} value={g}>
											{g}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.bloodGroupName && (
								<p className="text-red-600 text-sm mt-1">{errors.bloodGroupName}</p>
							)}
						</div>

						{/* Thành phần máu (multi-check, 3 cột) */}
						<div className="space-y-2">
							<Label className="font-bold">Thành phần máu</Label>
							<div className="grid grid-cols-3 gap-4">
								{bloodComponentOptions.map((name) => (
									<div key={name} className="flex items-center">
										<Checkbox
											id={name}
											checked={form.bloodComponentNames.includes(name)}
											onCheckedChange={(checked) => {
												const isChecked = checked === true;
												const next = isChecked
													? [...form.bloodComponentNames, name]
													: form.bloodComponentNames.filter((n) => n !== name);
												handleChange("bloodComponentNames", next);
											}}
										/>
										<Label htmlFor={name} className="ml-2">
											{name}
										</Label>
									</div>
								))}
							</div>
							{errors.bloodComponentNames && (
								<p className="text-red-600 text-sm mt-1">
									{errors.bloodComponentNames}
								</p>
							)}
						</div>

						{/* Khẩn cấp */}
						<div>
							<div className="font-bold">Tình trạng</div>
							<Select
								value={form.is_emergency ? "true" : "false"}
								onValueChange={(v) =>
									handleChange("is_emergency", v === "true")
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Khẩn cấp" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="false">Bình thường</SelectItem>
									<SelectItem value="true">Khẩn cấp</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* File picker + URL input */}
						<div className="flex items-start space-x-6">
							<div className="flex flex-col">
								<label className="block mb-1 font-bold">Hình ảnh</label>
								<input
									type="file"
									accept="image/*"
									onChange={handleFileChange}
									className="border rounded px-2 py-1"
								/>
								{uploadProgress > 0 && uploadProgress < 100 && (
									<p className="text-sm mt-1">Đang upload: {uploadProgress}%</p>
								)}
								{previewUrl && (
									<img
										src={previewUrl}
										alt="preview"
										className="mt-2 w-32 h-32 object-cover rounded border"
									/>
								)}
							</div>
							<div className="flex-1 flex flex-col">
								<label className="block mb-1 font-medium">URL hình ảnh</label>
								<Input
									placeholder="Url hình ảnh"
									value={form.image}
									onChange={(e) => handleChange("image", e.target.value)}
									className={errors.image ? "border-red-500" : ""}
								/>
								{errors.image && (
									<p className="text-red-600 text-sm mt-1">{errors.image}</p>
								)}
							</div>
						</div>

						{/* Ghi chú */}
						<div>
							<div className="font-bold">Ghi chú</div>
							<Textarea
								placeholder="Ghi chú"
								value={form.note}
								onChange={(e) => handleChange("note", e.target.value)}
								className="min-h-[80px]"
							/>
						</div>

						{/* Submit */}
						<div className="text-center">
							<Button onClick={handleSubmit}>Gửi yêu cầu</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};