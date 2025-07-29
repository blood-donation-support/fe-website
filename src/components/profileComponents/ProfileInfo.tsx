import React, { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { fetchUserProfile } from "@/redux/slices/userSlice";
import type { UserProfile } from "@/redux/slices/userSlice";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import genderVN from "@/utils/genderVN";
import { toast } from "react-toastify";
import { updateProfile } from "@/api/userService";
import { fetchBloodGroups } from "@/api/bloodService";
import roleVN from "@/utils/roleVN";
import axios from "axios";

const DEFAULT_AVATAR =
	"https://ui-avatars.com/api/?name=User&background=dedede&color=222&rounded=true&size=128";

const genderOptions = [
	{ value: "Male", label: "Nam" },
	{ value: "Female", label: "Nữ" },
	{ value: "Other", label: "Khác" },
];

const ProfileInfo: React.FC = () => {
	const profile = useSelector(
		(state: RootState) => state.users.profile,
	) as UserProfile | null;
	console.log("profile trang pror", profile);
	const dispatch = useDispatch<AppDispatch>();

	const [bloodGroups, setBloodGroups] = useState<
		{ _id: string; name: string }[]
	>([]);
	const [isEdit, setIsEdit] = useState(false);
	const [formData, setFormData] = useState<any>({});
	const [isDirty, setIsDirty] = useState(false);
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Load blood group list từ API
	useEffect(() => {
		fetchBloodGroups()
			.then(setBloodGroups)
			.catch(() => {});
	}, []);

	useEffect(() => {
		if (!profile) dispatch(fetchUserProfile());
	}, [dispatch, profile]);

	useEffect(() => {
		if (profile && bloodGroups.length) {
			// Map tên nhóm máu sang id cho form mặc định
			const defaultBloodGroupId = (() => {
				if (profile.blood_group_id) return profile.blood_group_id;
				if (profile.blood_group && profile.blood_group.name) {
					const found = bloodGroups.find(
						(bg) => bg.name === profile.blood_group?.name,
					);
					return found?._id || "";
				}
				return "";
			})();
			setFormData({
				full_name: profile.full_name,
				date_of_birth: dayjs(profile.date_of_birth).format("YYYY-MM-DD"),
				gender: profile.gender || "Male",
				weight: profile.weight,
				avatar_url: profile.avatar_url,
				address: profile.address ?? "",
				blood_group_id: defaultBloodGroupId,
				phone: profile.phone, // chỉ để show, không update
			});
			console.log("formData set in ProfileInfo", {
				full_name: profile.full_name,
				date_of_birth: dayjs(profile.date_of_birth).format("YYYY-MM-DD"),
				gender: profile.gender || "Male",
				weight: profile.weight,
				avatar_url: profile.avatar_url,
				address: profile.address ?? "",
				blood_group_id: defaultBloodGroupId,
				phone: profile.phone,
			});
			setIsDirty(false);
			setFieldErrors({});
		}
	}, [profile, bloodGroups, isEdit]);

	if (!profile) {
		return (
			<div className="flex justify-center items-center py-20">
				<span className="text-gray-400 text-lg">
					Đang tải thông tin cá nhân...
				</span>
			</div>
		);
	}

	// Check dirty fields
	const checkDirty = (current: any) => {
		if (!profile) return false;
		const groupIdByName = (() => {
			if (profile.blood_group_id) return profile.blood_group_id;
			if (profile.blood_group && profile.blood_group.name) {
				const found = bloodGroups.find(
					(bg) => bg.name === profile.blood_group?.name,
				);
				return found?._id || "";
			}
			return "";
		})();
		return (
			current.full_name !== profile.full_name ||
			current.date_of_birth !==
				dayjs(profile.date_of_birth).format("YYYY-MM-DD") ||
			current.gender !== profile.gender ||
			Number(current.weight) !== profile.weight ||
			current.avatar_url !== profile.avatar_url ||
			current.address !== (profile.address ?? "") ||
			current.blood_group_id !== groupIdByName
		);
	};

	const handleFieldChange = (name: string, value: string) => {
		const newFormData = { ...formData, [name]: value };
		setFormData(newFormData);
		setIsDirty(checkDirty(newFormData));
		// Nếu có error thì clear, dùng "" thay vì undefined
		setFieldErrors((old) => ({ ...old, [name]: "" }));
	};

	const handleCancel = () => {
		if (profile && bloodGroups.length) {
			const defaultBloodGroupId = (() => {
				if (profile.blood_group_id) return profile.blood_group_id;
				if (profile.blood_group && profile.blood_group.name) {
					const found = bloodGroups.find(
						(bg) => bg.name === profile.blood_group?.name,
					);
					return found?._id || "";
				}
				return "";
			})();
			setFormData({
				full_name: profile.full_name,
				date_of_birth: dayjs(profile.date_of_birth).format("YYYY-MM-DD"),
				gender: profile.gender || "Male",
				weight: profile.weight,
				avatar_url: profile.avatar_url,
				address: profile.address ?? "",
				blood_group_id: defaultBloodGroupId,
				phone: profile.phone,
			});
			setIsEdit(false);
			setIsDirty(false);
			setFieldErrors({});
		}
	};

	// Upload avatar (fake), bạn thay API thật vào nếu cần
	const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const data = new FormData();
		data.append("file", file);
		data.append("upload_preset", "BloodDonation");

		try {
			const resp = await axios.post(
				"https://api.cloudinary.com/v1_1/dpf7yfupt/image/upload",
				data
			);
			console.log("Upload response:", resp.data.url);

			const newFormData = {
				...formData,
				avatar_url: resp.data.url,
			};
			setFormData(newFormData);
			setIsDirty(checkDirty(newFormData));
			setFieldErrors((old) => ({ ...old, avatar_url: "" }));
			toast.success("Tải ảnh thành công!");
		} catch {
			toast.error("Không thể upload hình ảnh");
		}
	};


	// Gọi API update
	const handleSave = async () => {
		setFieldErrors({});
		try {
			await updateProfile({
				full_name: formData.full_name,
				date_of_birth: formData.date_of_birth,
				gender: formData.gender,
				weight: Number(formData.weight),
				avatar_url: formData.avatar_url,
				address: formData.address,
				blood_group_id: formData.blood_group_id,
			});
			toast.success("Cập nhật thành công!");
			setIsEdit(false);
			setIsDirty(false);
			dispatch(fetchUserProfile());
		} catch (e: any) {
			if (e?.response?.status === 422 && e.response.data?.errors) {
				// Mapping lỗi field, set "" nếu không lỗi
				const errs = e.response.data.errors;
				const fieldErrs: Record<string, string> = {};
				Object.keys(errs).forEach((key) => {
					fieldErrs[key] = errs[key].msg || "";
				});
				setFieldErrors(fieldErrs);
			} else {
				toast.error(e?.response?.data?.message || "Có lỗi khi cập nhật hồ sơ");
			}
		}
	};
	console.log("bloodGroups:", bloodGroups);
	console.log("blood_group_id value:", formData.blood_group_id);
	return (
		<div className="container mx-auto mb-20">
			<div
				className="bg-white shadow-md rounded-2xl p-8 relative"
				style={{
					maxWidth: "90%",
					margin: "0 auto",
					borderRadius: "1rem",
				}}
			>
				{!isEdit && (
					<Tooltip title="Sửa thông tin">
						<IconButton
							onClick={() => setIsEdit(true)}
							className="!absolute top-4 right-4"
							color="primary"
						>
							<EditIcon />
						</IconButton>
					</Tooltip>
				)}

				<div className="flex flex-col items-center mb-8">
					<div className="relative">
						<img
							src={formData.avatar_url || DEFAULT_AVATAR}
							alt="avatar"
							className="w-28 h-28 rounded-full object-cover border-4 border-white shadow"
						/>
						{isEdit && (
							<>
								<input
									type="file"
									accept="image/*"
									ref={fileInputRef}
									className="hidden"
									onChange={handleAvatarUpload}
								/>
								<IconButton
									color="primary"
									className="!absolute bottom-2 right-2"
									onClick={() => fileInputRef.current?.click()}
									size="small"
								>
									<PhotoCamera />
								</IconButton>
							</>
						)}
					</div>
					<div style={{ width: "20%", marginTop: 16 }}>
						<TextField
							label="Họ tên"
							value={formData.full_name}
							onChange={(e) => handleFieldChange("full_name", e.target.value)}
							fullWidth
							margin="normal"
							variant="outlined"
							size="small"
							InputProps={{ readOnly: !isEdit }}
							disabled={!isEdit}
							error={!!fieldErrors.full_name}
							helperText={fieldErrors.full_name}
							slotProps={{ inputLabel: { shrink: true } }}
						/>
					</div>
					<div className="text-gray-400">{profile.email}</div>
					<div className="text-sm text-blue-600 font-semibold mt-1">
						{roleVN(profile.role)}
					</div>
				</div>

				<div className="pl-24 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
					<TextField
						label="Ngày sinh"
						type="date"
						value={formData.date_of_birth}
						onChange={(e) => handleFieldChange("date_of_birth", e.target.value)}
						fullWidth
						margin="normal"
						InputProps={{ readOnly: !isEdit }}
						disabled={!isEdit}
						error={!!fieldErrors.date_of_birth}
						helperText={fieldErrors.date_of_birth}
						slotProps={{ inputLabel: { shrink: true } }}
					/>
					{isEdit ? (
						<TextField
							label="Giới tính"
							select
							value={formData.gender}
							onChange={(e) => handleFieldChange("gender", e.target.value)}
							fullWidth
							margin="normal"
							InputProps={{ readOnly: false }}
							disabled={false}
							error={!!fieldErrors.gender}
							helperText={fieldErrors.gender}
							slotProps={{ inputLabel: { shrink: true } }}
						>
							{genderOptions.map((opt) => (
								<MenuItem key={opt.value} value={opt.value}>
									{opt.label}
								</MenuItem>
							))}
						</TextField>
					) : (
						<TextField
							label="Giới tính"
							value={genderVN(formData.gender)}
							fullWidth
							margin="normal"
							InputProps={{ readOnly: true }}
							disabled
							slotProps={{ inputLabel: { shrink: true } }}
						/>
					)}

					<TextField
						label="Cân nặng (kg)"
						type="number"
						value={formData.weight}
						onChange={(e) => handleFieldChange("weight", e.target.value)}
						fullWidth
						margin="normal"
						InputProps={{ readOnly: !isEdit }}
						disabled={!isEdit}
						error={!!fieldErrors.weight}
						helperText={fieldErrors.weight}
						slotProps={{ inputLabel: { shrink: true } }}
					/>
					<TextField
						label="Địa chỉ"
						value={formData.address}
						onChange={(e) => handleFieldChange("address", e.target.value)}
						fullWidth
						margin="normal"
						InputProps={{ readOnly: !isEdit }}
						disabled={!isEdit}
						error={!!fieldErrors.address}
						helperText={fieldErrors.address}
						slotProps={{ inputLabel: { shrink: true } }}
					/>
					<TextField
						label="Nhóm máu"
						select
						value={formData.blood_group_id || ""}
						onChange={(e) =>
							handleFieldChange("blood_group_id", e.target.value)
						}
						fullWidth
						margin="normal"
						InputProps={{ readOnly: !isEdit }}
						disabled={!isEdit}
						error={!!fieldErrors.blood_group_id}
						helperText={fieldErrors.blood_group_id}
						slotProps={{ inputLabel: { shrink: true } }}
					>
						{bloodGroups.map((bg) => (
							<MenuItem key={bg._id} value={bg._id}>
								{bg.name}
							</MenuItem>
						))}
					</TextField>
					{/* Chỉ view, không edit */}
					<TextField
						label="Số điện thoại"
						value={formData.phone || ""}
						fullWidth
						margin="normal"
						InputProps={{ readOnly: true }}
						disabled
						slotProps={{ inputLabel: { shrink: true } }}
					/>
					<TextField
						label="Số lần hiến máu"
						value={
							profile.number_of_donations >= 0
								? `${profile.number_of_donations} lần`
								: ""
						}
						fullWidth
						margin="normal"
						InputProps={{ readOnly: true }}
						disabled
						slotProps={{ inputLabel: { shrink: true } }}
					/>
					<TextField
						label="Số lần nhận máu"
						value={
							profile.number_of_requests >= 0
								? `${profile.number_of_requests} lần`
								: ""
						}
						fullWidth
						margin="normal"
						InputProps={{ readOnly: true }}
						disabled
						slotProps={{ inputLabel: { shrink: true } }}
					/>
				</div>
				{isEdit && (
					<div className="flex gap-3 justify-end mt-8 pr-24">
						<Button
							variant="contained"
							color="primary"
							startIcon={<SaveIcon />}
							disabled={!isDirty}
							onClick={handleSave}
						>
							Lưu
						</Button>
						<Button
							variant="outlined"
							color="secondary"
							startIcon={<CloseIcon />}
							onClick={handleCancel}
						>
							Hủy
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProfileInfo;
