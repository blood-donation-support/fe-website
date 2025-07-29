import React, { useEffect, useState } from "react";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchBloodGroups, type BloodGroup } from "@/api/bloodService";
import {
	fetchUserAll,
	deleteUser,
	createUser,
	updateRoleByAdmin,
} from "@/api/userService";
import type { User, NewUserPayload } from "@/types/user";
import genderVN from "@/utils/genderVN";
import { UserGender } from "@/types/user";
import { useNavigate } from "react-router-dom";

const roleVN = (role: string) => {
	switch (role) {
		case "Customer":
			return "Bệnh nhân";
		case "Staff":
			return "Nhân viên y tế";
		case "Admin":
			return "Quản trị viên";
		default:
			return role;
	}
};

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("vi-VN");
};

// Hàm format datetime đầy đủ (giờ, ngày, tháng, năm)
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

export default function UserListPage() {
	const navigate = useNavigate();
	const [users, setUsers] = useState<User[]>([]);
	const [searchText, setSearchText] = useState("");
	const [openAdd, setOpenAdd] = useState(false);
	const [openDetail, setOpenDetail] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [newUser, setNewUser] = useState<Partial<NewUserPayload>>({
		weight: 0,
		address: "",
		avatar_url: "",
		blood_group_id: "",
		role: "Customer",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [bloodGroups, setBloodGroups] = useState<BloodGroup[]>([]);
	const [openUpdateRole, setOpenUpdateRole] = useState(false);
	const [selectedUserForUpdate, setSelectedUserForUpdate] =
		useState<User | null>(null);
	const [newRole, setNewRole] = useState<string>("");

	useEffect(() => {
		fetchBloodGroups()
			.then(setBloodGroups)
			.catch((error) => {
				console.error("Error fetching blood groups:", error);
				setBloodGroups([]); // Set empty array nếu lỗi
			});
	}, []);

	// Filter states
	const [roleFilter, setRoleFilter] = useState<
		"all" | "Customer" | "Staff" | "Admin"
	>("all");
	const [genderFilter, setGenderFilter] = useState<
		"all" | "Male" | "Female" | "Other"
	>("all");
	const [activeFilter, setActiveFilter] = useState<"all" | "true" | "false">(
		"all",
	);

	useEffect(() => {
		fetchUserAll().then((data) => {
			const sorted = data.sort(
				(a, b) =>
					new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
			);
			setUsers(sorted);
		});
	}, []);

	const handleDelete = async (id: string) => {
		try {
			await deleteUser(id);
			setUsers((prev) => prev.filter((u) => u._id !== id));
			toast.success("Đã xóa người dùng thành công");
		} catch (error) {
			console.error("Error deleting user:", error);
			toast.error("Xóa người dùng thất bại");
		}
	};

	const handleAddUser = async () => {
		// Validate các trường bắt buộc
		if (
			!newUser.citizen_id_number ||
			!newUser.full_name ||
			!newUser.email ||
			!newUser.phone ||
			!newUser.password ||
			!newUser.confirm_password ||
			!newUser.date_of_birth ||
			!newUser.gender
		) {
			toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
			return;
		}

		// Validate password match
		if (newUser.password !== newUser.confirm_password) {
			toast.error("Mật khẩu xác nhận không khớp");
			return;
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(newUser.email)) {
			toast.error("Email không hợp lệ");
			return;
		}

		// Validate gender is from enum
		if (!Object.values(UserGender).includes(newUser.gender as UserGender)) {
			toast.error("Giới tính không hợp lệ");
			return;
		}

		const payload = newUser as NewUserPayload;
		try {
			const created = await createUser(payload);
			toast.success("Tạo tài khoản thành công");
			setUsers((prev) => [created, ...prev]);
			setOpenAdd(false);
			// Reset form với đầy đủ các trường
			setNewUser({
				weight: 0,
				address: "",
				avatar_url: "",
				blood_group_id: "",
				role: "Customer",
				// Reset các field bắt buộc
				citizen_id_number: "",
				full_name: "",
				email: "",
				phone: "",
				password: "",
				confirm_password: "",
				date_of_birth: "",
				gender: undefined,
			});
			navigate("/dashboard-admin/users");
		} catch (err) {
			console.error("Error creating user:", err);
			toast.error("Tạo tài khoản thất bại");
		}
	};

	const handleViewDetail = (user: User) => {
		setSelectedUser(user);
		setOpenDetail(true);
	};

	// Enhanced filtering logic
	const filtered = users.filter((u) => {
		// Search text filter - fix lỗi undefined
		const matchesSearch = u.full_name
			? u.full_name.toLowerCase().includes(searchText.toLowerCase())
			: searchText === ""; // Nếu full_name undefined và không có searchText thì vẫn match

		// Role filter
		const matchesRole = roleFilter === "all" ? true : u.role === roleFilter;

		// Gender filter
		const matchesGender =
			genderFilter === "all" ? true : u.gender === genderFilter;

		// Active status filter
		const matchesActive =
			activeFilter === "all"
				? true
				: activeFilter === "true"
				? u.is_active === true
				: u.is_active === false;

		return matchesSearch && matchesRole && matchesGender && matchesActive;
	});

	const handleUpdateRole = async () => {
		if (!selectedUserForUpdate || !newRole) {
			toast.error("Vui lòng chọn vai trò");
			return;
		}

		try {
			// Đảm bảo truyền object với key role
			const updatedUser = await updateRoleByAdmin(selectedUserForUpdate._id, {
				role: newRole,
			});

			// Cập nhật danh sách users
			setUsers((prev) =>
				prev.map((u) =>
					u._id === selectedUserForUpdate._id ? { ...u, role: newRole } : u,
				),
			);

			toast.success("Cập nhật vai trò thành công");
			setOpenUpdateRole(false);
			setSelectedUserForUpdate(null);
			setNewRole("");
		} catch (error) {
			console.error("Error updating role:", error);
			toast.error("Cập nhật vai trò thất bại");
		}
	};

	const handleOpenUpdateRole = (user: User) => {
		setSelectedUserForUpdate(user);
		setNewRole(user.role || "Customer");
		setOpenUpdateRole(true);
	};

	return (
		<>
			<ToastContainer />
			<div className="p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
				<Card className="g-gradient-to-r from-indigo-600 to-blue-500 border-0 mb-8 overflow-hidden">
					<CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
						<CardTitle className="text-2xl text-center font-bold">
							Danh sách người dùng
						</CardTitle>
					</CardHeader>
					<CardContent className="p-6 space-y-6">
						{/* Enhanced Filter Section */}
						<Card className="g-gradient-to-r from-indigo-600 to-blue-500 border-0 mb-8 overflow-hidden">
							<div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1"></div>
							<CardContent className="p-6">
								<div className="space-y-6">
									{/* Search */}
									<div className="space-y-3">
										<div className="flex items-center gap-2">
											<div className="w-2 h-2 bg-purple-500 rounded-full" />
											<label className="text-sm font-semibold text-gray-700 tracking-wide">
												TÌM KIẾM
											</label>
										</div>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
												<svg
													className="h-5 w-5 text-gray-400"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
													/>
												</svg>
											</div>
											<Input
												placeholder="Tìm theo tên..."
												value={searchText}
												onChange={(e) => setSearchText(e.target.value)}
												className="w-full h-12 pl-12 pr-4 bg-white border-gray-200 rounded-xl shadow-sm hover:border-gray-300 hover:shadow-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
											/>
											{searchText && (
												<button
													onClick={() => setSearchText("")}
													className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
												>
													<svg
														className="h-4 w-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M6 18L18 6M6 6l12 12"
														/>
													</svg>
												</button>
											)}
										</div>
									</div>

									{/* Filters */}
									<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
										{/* Role Filter */}
										<div className="space-y-3">
											<div className="flex items-center gap-2">
												<div className="w-2 h-2 bg-emerald-500 rounded-full" />
												<label className="text-sm font-semibold text-gray-700 tracking-wide">
													VAI TRÒ
												</label>
											</div>
											<Select
												value={roleFilter}
												onValueChange={(
													value: "all" | "Customer" | "Staff" | "Admin",
												) => setRoleFilter(value)}
											>
												<SelectTrigger className="w-full h-12 bg-white border-gray-200 rounded-xl shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
													<SelectValue placeholder="Tất cả vai trò" />
												</SelectTrigger>
												<SelectContent className="rounded-xl border-gray-200 shadow-xl">
													<SelectItem value="all">Tất cả</SelectItem>
													<SelectItem value="Customer">Bệnh nhân</SelectItem>
													<SelectItem value="Staff">Nhân viên y tế</SelectItem>
													<SelectItem value="Admin">Quản trị viên</SelectItem>
												</SelectContent>
											</Select>
										</div>

										{/* Gender Filter */}
										<div className="space-y-3">
											<div className="flex items-center gap-2">
												<div className="w-2 h-2 bg-pink-500 rounded-full" />
												<label className="text-sm font-semibold text-gray-700 tracking-wide">
													GIỚI TÍNH
												</label>
											</div>
											<Select
												value={genderFilter}
												onValueChange={(
													value: "all" | "Male" | "Female" | "Other",
												) => setGenderFilter(value)}
											>
												<SelectTrigger className="w-full h-12 bg-white border-gray-200 rounded-xl shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
													<SelectValue placeholder="Tất cả giới tính" />
												</SelectTrigger>
												<SelectContent className="rounded-xl border-gray-200 shadow-xl">
													<SelectItem value="all">Tất cả</SelectItem>
													<SelectItem value="Male">Nam</SelectItem>
													<SelectItem value="Female">Nữ</SelectItem>
													<SelectItem value="Other">Khác</SelectItem>
												</SelectContent>
											</Select>
										</div>

										{/* Active Status Filter */}
										<div className="space-y-3">
											<div className="flex items-center gap-2">
												<div className="w-2 h-2 bg-green-500 rounded-full" />
												<label className="text-sm font-semibold text-gray-700 tracking-wide">
													TRẠNG THÁI
												</label>
											</div>
											<Select
												value={activeFilter}
												onValueChange={(value: "all" | "true" | "false") =>
													setActiveFilter(value)
												}
											>
												<SelectTrigger className="w-full h-12 bg-white border-gray-200 rounded-xl shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
													<SelectValue placeholder="Tất cả trạng thái" />
												</SelectTrigger>
												<SelectContent className="rounded-xl border-gray-200 shadow-xl">
													<SelectItem value="all">Tất cả</SelectItem>
													<SelectItem value="true">Đã kích hoạt</SelectItem>
													<SelectItem value="false">Chưa kích hoạt</SelectItem>
												</SelectContent>
											</Select>
										</div>

										{/* Add User Button */}
										<div className="space-y-3">
											<div className="flex items-center gap-2">
												<div className="w-2 h-2 bg-blue-500 rounded-full" />
												<label className="text-sm font-semibold text-gray-700 tracking-wide">
													THAO TÁC
												</label>
											</div>
											<Dialog open={openAdd} onOpenChange={setOpenAdd}>
												<DialogTrigger asChild>
													<Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
														<Plus className="w-4 h-4 mr-2" /> Thêm người dùng
													</Button>
												</DialogTrigger>
												<DialogContent className="rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
													<DialogHeader>
														<DialogTitle className="text-xl font-bold text-gray-800">
															Thêm người dùng mới
														</DialogTitle>
														<DialogDescription className="text-gray-600">
															Điền thông tin để tạo tài khoản người dùng mới
															trong hệ thống.
														</DialogDescription>
													</DialogHeader>
													<div className="space-y-4 mt-4">
														<Input
															placeholder="Số CMND/CCCD"
															className="rounded-xl"
															value={newUser.citizen_id_number || ""}
															onChange={(e) =>
																setNewUser({
																	...newUser,
																	citizen_id_number: e.target.value,
																})
															}
														/>
														<Input
															placeholder="Họ tên"
															className="rounded-xl"
															value={newUser.full_name || ""}
															onChange={(e) =>
																setNewUser({
																	...newUser,
																	full_name: e.target.value,
																})
															}
														/>
														<Input
															placeholder="Email"
															type="email"
															className="rounded-xl"
															value={newUser.email || ""}
															onChange={(e) =>
																setNewUser({
																	...newUser,
																	email: e.target.value,
																})
															}
														/>
														<Input
															placeholder="Số điện thoại"
															className="rounded-xl"
															value={newUser.phone || ""}
															onChange={(e) =>
																setNewUser({
																	...newUser,
																	phone: e.target.value,
																})
															}
														/>

														{/* Password với icon mắt */}
														<div className="relative">
															<Input
																type={showPassword ? "text" : "password"}
																placeholder="Mật khẩu"
																className="rounded-xl pr-12"
																value={newUser.password || ""}
																onChange={(e) =>
																	setNewUser({
																		...newUser,
																		password: e.target.value,
																	})
																}
															/>
															<button
																type="button"
																className="absolute inset-y-0 right-0 pr-3 flex items-center"
																onClick={() => setShowPassword(!showPassword)}
															>
																{showPassword ? (
																	<EyeOff className="h-4 w-4 text-gray-400" />
																) : (
																	<Eye className="h-4 w-4 text-gray-400" />
																)}
															</button>
														</div>

														{/* Confirm Password với icon mắt */}
														<div className="relative">
															<Input
																type={showConfirmPassword ? "text" : "password"}
																placeholder="Xác nhận mật khẩu"
																className="rounded-xl pr-12"
																value={newUser.confirm_password || ""}
																onChange={(e) =>
																	setNewUser({
																		...newUser,
																		confirm_password: e.target.value,
																	})
																}
															/>
															<button
																type="button"
																className="absolute inset-y-0 right-0 pr-3 flex items-center"
																onClick={() =>
																	setShowConfirmPassword(!showConfirmPassword)
																}
															>
																{showConfirmPassword ? (
																	<EyeOff className="h-4 w-4 text-gray-400" />
																) : (
																	<Eye className="h-4 w-4 text-gray-400" />
																)}
															</button>
														</div>

														<Input
															type="date"
															placeholder="Ngày sinh"
															className="rounded-xl"
															onChange={(e) =>
																setNewUser({
																	...newUser,
																	date_of_birth: new Date(
																		e.target.value,
																	).toISOString(),
																})
															}
														/>
														<Select
															value={newUser.gender ?? ""}
															onValueChange={(val: UserGender) =>
																setNewUser({ ...newUser, gender: val })
															}
														>
															<SelectTrigger className="rounded-xl">
																<SelectValue placeholder="Chọn giới tính" />
															</SelectTrigger>
															<SelectContent>
																{Object.values(UserGender).map((g) => (
																	<SelectItem key={g} value={g}>
																		{genderVN(g)}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>

														{/* Weight field với validation không âm */}
														<Input
															type="number"
															placeholder="Cân nặng (kg)"
															className="rounded-xl"
															min="0"
															step="0.1"
															value={newUser.weight || ""}
															onChange={(e) => {
																const value = parseFloat(e.target.value);
																setNewUser({
																	...newUser,
																	weight: value >= 0 ? value : 0,
																});
															}}
														/>

														<Input
															placeholder="Địa chỉ"
															className="rounded-xl"
															value={newUser.address || ""}
															onChange={(e) =>
																setNewUser({
																	...newUser,
																	address: e.target.value,
																})
															}
														/>

														<Select
															value={newUser.role ?? "Customer"}
															onValueChange={(val: string) =>
																setNewUser({ ...newUser, role: val })
															}
														>
															<SelectTrigger className="rounded-xl">
																<SelectValue placeholder="Chọn vai trò" />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="Customer">
																	Bệnh nhân
																</SelectItem>
																<SelectItem value="Staff">
																	Nhân viên y tế
																</SelectItem>
																<SelectItem value="Admin">
																	Quản trị viên
																</SelectItem>
															</SelectContent>
														</Select>

														{/* Blood Group selection với tên hiển thị */}
														<Select
															value={newUser.blood_group_id || "none"}
															onValueChange={(val) =>
																setNewUser({
																	...newUser,
																	blood_group_id: val === "none" ? "" : val,
																})
															}
														>
															<SelectTrigger className="rounded-xl">
																<SelectValue placeholder="Chọn nhóm máu (tùy chọn)" />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="none">Không chọn</SelectItem>
																{bloodGroups && bloodGroups.length > 0 ? (
																	bloodGroups.map((group) => (
																		<SelectItem
																			key={group._id}
																			value={group._id}
																		>
																			{group.name}
																		</SelectItem>
																	))
																) : (
																	<SelectItem value="" disabled>
																		Đang tải...
																	</SelectItem>
																)}
															</SelectContent>
														</Select>

														<Input
															placeholder="URL ảnh đại diện (tùy chọn)"
															className="rounded-xl"
															value={newUser.avatar_url || ""}
															onChange={(e) =>
																setNewUser({
																	...newUser,
																	avatar_url: e.target.value,
																})
															}
														/>

														<Button
															onClick={handleAddUser}
															className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl py-3 shadow-lg hover:shadow-xl transition-all"
														>
															Lưu
														</Button>
													</div>
												</DialogContent>
											</Dialog>
										</div>
									</div>

									{/* Active Filters Display */}
									{(roleFilter !== "all" ||
										genderFilter !== "all" ||
										activeFilter !== "all" ||
										searchText) && (
										<div className="pt-4 border-t border-gray-100">
											<span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
												Bộ lọc đang áp dụng
											</span>
											<div className="flex flex-wrap gap-2 mt-2">
												{roleFilter !== "all" && (
													<span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full border border-emerald-200">
														Vai trò: {roleVN(roleFilter)}
													</span>
												)}
												{genderFilter !== "all" && (
													<span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-50 text-pink-700 text-sm rounded-full border border-pink-200">
														Giới tính: {genderVN(genderFilter)}
													</span>
												)}
												{activeFilter !== "all" && (
													<span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full border border-green-200">
														{activeFilter === "true"
															? "Đã kích hoạt"
															: "Chưa kích hoạt"}
													</span>
												)}
												{searchText && (
													<span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full border border-purple-200">
														Tìm kiếm: "{searchText}"
													</span>
												)}
											</div>
										</div>
									)}
								</div>
							</CardContent>
						</Card>

						<div className="rounded-2xl overflow-hidden shadow-lg border">
							<table className="w-full">
								<thead className="bg-gradient-to-r from-blue-600 to-purple-600">
									<tr>
										<th className="text-white font-semibold px-6 py-4 text-left">
											STT
										</th>
										<th className="text-white font-semibold px-6 py-4 text-left">
											Họ tên
										</th>
										<th className="text-white font-semibold px-6 py-4 text-left">
											Số CCCD
										</th>
										<th className="text-white font-semibold px-6 py-4 text-left">
											Giới tính
										</th>
										{/* <th className="text-white font-semibold px-6 py-4 text-left">
											Email
										</th> */}
										<th className="text-white font-semibold px-6 py-4 text-left">
											Số điện thoại
										</th>
										<th className="text-white font-semibold px-6 py-4 text-left">
											Vai trò
										</th>
										<th className="text-white font-semibold px-6 py-4 text-left">
											Trạng thái
										</th>
										<th className="text-white font-semibold px-6 py-4 text-center">
											Thao tác
										</th>
									</tr>
								</thead>
								<tbody>
									{filtered.map((u, index) => (
										<tr
											key={u._id}
											className={`hover:bg-blue-50 transition-all ${
												index % 2 === 0 ? "bg-white" : "bg-gray-50"
											}`}
										>
											<td className="px-6 py-4 font-medium text-gray-900">
												{index + 1 || "Chưa cập nhật"}
											</td>
											<td className="px-6 py-4 font-medium text-gray-900">
												{u.full_name || "Chưa cập nhật"}
											</td>
											<td className="px-6 py-4 text-gray-600">
												{u.citizen_id_number}
											</td>
											<td className="px-6 py-4 text-gray-600">
												{genderVN(u.gender) || "Chưa cập nhật"}
											</td>
											{/* <td className="px-6 py-4 text-gray-600">
												{u.email || "Chưa cập nhật"}
											</td> */}
											<td className="px-6 py-4 text-gray-600">
												{u.phone || "Chưa cập nhật"}
											</td>
											<td className="px-6 py-4">
												<span
													className={`px-3 py-1 rounded-full text-xs font-medium ${
														u.role === "Admin"
															? "bg-red-100 text-red-800"
															: u.role === "Staff"
															? "bg-green-100 text-green-800"
															: "bg-blue-100 text-blue-800"
													}`}
												>
													{roleVN(u.role || "Chưa cập nhật")}
												</span>
											</td>
											<td className="px-6 py-4">
												<span
													className={`px-3 py-1 rounded-full text-xs font-medium ${
														u.is_active === true
															? "bg-green-100 text-green-800"
															: "bg-red-100 text-red-800"
													}`}
												>
													{u.is_active === true
														? "Đã kích hoạt"
														: "Chưa kích hoạt"}
												</span>
											</td>
											<td className="px-6 py-4 text-center">
												<div className="flex items-center justify-center gap-2">
													<Button
														variant="outline"
														size="sm"
														className="rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50"
														onClick={() => handleViewDetail(u)}
													>
														<Eye size={16} />
													</Button>
													<Button
														variant="outline"
														size="sm"
														className="rounded-lg border-green-200 text-green-600 hover:bg-green-50"
														onClick={() => handleOpenUpdateRole(u)}
													>
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
																d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
															/>
														</svg>
													</Button>
													<Button
														variant="outline"
														size="sm"
														className="rounded-lg border-red-200 text-red-600 hover:bg-red-50"
														onClick={(e) => {
															e.stopPropagation();
															handleDelete(u._id);
														}}
													>
														<Trash2 size={16} />
													</Button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{filtered.length === 0 && (
							<div className="text-center py-8 text-gray-500">
								Không tìm thấy dữ liệu phù hợp với bộ lọc hiện tại
							</div>
						)}
					</CardContent>
				</Card>

				{/* User Detail Modal */}
				<Dialog open={openDetail} onOpenChange={setOpenDetail}>
					<DialogContent className="max-w-4xl rounded-2xl max-h-[90vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle className="text-2xl font-bold text-gray-800 mb-4">
								Chi tiết người dùng
							</DialogTitle>
							<DialogDescription className="text-gray-600">
								Thông tin chi tiết về người dùng trong hệ thống.
							</DialogDescription>
						</DialogHeader>
						{selectedUser && (
							<div className="space-y-6">
								{/* Basic Info Section */}
								<div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
									<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
										<div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></div>
										Thông tin cá nhân
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												Họ tên
											</label>
											<p className="text-lg font-semibold text-gray-900">
												{selectedUser.full_name || "Chưa cập nhật"}
											</p>
										</div>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												Email
											</label>
											<p className="text-lg text-gray-900">
												{selectedUser.email || "Chưa cập nhật"}
											</p>
										</div>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												Số điện thoại
											</label>
											<p className="text-lg text-gray-900">
												{selectedUser.phone || "Chưa cập nhật"}
											</p>
										</div>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												Giới tính
											</label>
											<p className="text-lg text-gray-900">
												{genderVN(selectedUser.gender) || "Chưa cập nhật"}
											</p>
										</div>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												Ngày sinh
											</label>
											<p className="text-lg text-gray-900">
												{formatDate(selectedUser.date_of_birth) ||
													"Chưa cập nhật"}
											</p>
										</div>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												CMND/CCCD
											</label>
											<p className="text-lg text-gray-900">
												{selectedUser.citizen_id_number || "Chưa cập nhật"}
											</p>
										</div>
									
									</div>
										{selectedUser.address && (
									<div className="mt-4">
									
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
											Địa chỉ
											</label>
											<p className="text-lg text-gray-900">
												{selectedUser.address || "Chưa cập nhật"}
											</p>
										</div>
									</div>
								)}
								</div>

								{/* Medical Info Section */}
								<div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
									<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
										<div className="w-2 h-6 bg-gradient-to-b from-green-500 to-blue-500 rounded-full mr-3"></div>
										Thông tin y tế
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												Cân nặng
											</label>
											<p className="text-lg font-semibold text-gray-900">
												{selectedUser.weight
													? `${selectedUser.weight} kg`
													: "Chưa cập nhật"}
											</p>
										</div>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												Số lần hiến máu
											</label>
											<p className="text-lg font-semibold text-green-600">
												{selectedUser.number_of_donation || "Chưa cập nhật"}
											</p>
										</div>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												Số lần yêu cầu
											</label>
											<p className="text-lg font-semibold text-blue-600">
												{selectedUser.number_of_request || "Chưa cập nhật"}
											</p>
										</div>
									</div>
								</div>

								{/* System Info Section */}
								<div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
									<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
										<div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"></div>
										Thông tin hệ thống
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												Vai trò
											</label>
											<p className="text-lg font-semibold text-gray-900">
												<span
													className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
														selectedUser.role === "Admin"
															? "bg-red-100 text-red-800"
															: selectedUser.role === "Donor"
															? "bg-green-100 text-green-800"
															: "bg-blue-100 text-blue-800"
													}`}
												>
													{roleVN(selectedUser.role) || "Chưa cập nhật"}
												</span>
											</p>
										</div>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												Trạng thái
											</label>
											<p className="text-lg font-semibold text-gray-900">
												<span
													className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
														selectedUser.is_active === true
															? "bg-green-100 text-green-800"
															: "bg-red-100 text-red-800"
													}`}
												>
													{selectedUser.is_active === true
														? "Đã kích hoạt"
														: "Chưa kích hoạt"}
												</span>
											</p>
										</div>

										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												Ngày tạo
											</label>
											<p className="text-lg text-gray-900">
												{formatDateTime(selectedUser.created_at) ||
													"Chưa cập nhật"}
											</p>
										</div>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												Ngày cập nhật cuối
											</label>
											<p className="text-lg text-gray-900">
												{formatDateTime(selectedUser.updated_at) ||
													"Chưa cập nhật"}
											</p>
										</div>
									</div>
								</div>

							
							
							</div>
						)}
					</DialogContent>
				</Dialog>
				{/* Update Modal */}
				<Dialog open={openUpdateRole} onOpenChange={setOpenUpdateRole}>
					<DialogContent className="max-w-md rounded-2xl">
						<DialogHeader>
							<DialogTitle className="text-xl font-bold text-gray-800">
								Cập nhật vai trò
							</DialogTitle>
							<DialogDescription className="text-gray-600">
								Thay đổi vai trò của người dùng{" "}
								{selectedUserForUpdate?.full_name}
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4 mt-4">
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">
									Vai trò hiện tại:{" "}
									<span className="font-semibold text-blue-600">
										{roleVN(selectedUserForUpdate?.role || "")}
									</span>
								</label>
							</div>

							<Select
								value={newRole}
								onValueChange={(value: string) => setNewRole(value)}
							>
								<SelectTrigger className="rounded-xl">
									<SelectValue placeholder="Chọn vai trò mới" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Customer">Bệnh nhân</SelectItem>
									<SelectItem value="Staff">Nhân viên y tế</SelectItem>
									<SelectItem value="Admin">Quản trị viên</SelectItem>
								</SelectContent>
							</Select>

							<div className="flex gap-3 pt-4">
								<Button
									variant="outline"
									onClick={() => setOpenUpdateRole(false)}
									className="flex-1 rounded-xl"
								>
									Hủy
								</Button>
								<Button
									onClick={handleUpdateRole}
									className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
								>
									Cập nhật
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</>
	);
}
