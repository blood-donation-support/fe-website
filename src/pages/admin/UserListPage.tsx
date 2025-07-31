import React, { useEffect, useState } from "react";
import { Plus, Trash2, Eye, EyeOff, AlignJustify } from "lucide-react";
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
import { debounce } from "lodash";
import { searchLocationSuggestions } from "@/api/locationService";
const roleVN = (role: string) => {
	switch (role) {
		case "Customer":
			return "Bệnh nhân";
		case "Staff":
			return "Nhân viên y tế";
		case "Staff Warehouse":
			return "Nhân viên kho máu";
		default:
			return role;
	}
};

interface ExtendedNewUser extends Partial<NewUserPayload> {
	latitude?: number | null;
	longitude?: number | null;
}
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
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [loading, setLoading] = useState(false);
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
		"all" | "Customer" | "Staff" | "Staff Warehouse"
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
	}, [fetchUserAll]);
	const fetchUsers = async () => {
		setLoading(true);
		try {
			const res = await fetchUserAll();
			setUsers(res.reverse());
		} catch (err) {
			console.error("Fetch error", err);
			toast.error("Không thể tải danh sách người dùng");
		} finally {
			setLoading(false);
		}
	};

	const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
	const [showAddressList, setShowAddressList] = useState(false);
	const [addressLoading, setAddressLoading] = useState(false);
	const [selectedAddress, setSelectedAddress] = useState<any>(null);
	const [addressCache, setAddressCache] = useState<{ [key: string]: any[] }>(
		{},
	);
	const [requestCount, setRequestCount] = useState(0);
	const [lastRequestTime, setLastRequestTime] = useState(0);

	// Thêm vào functions trong UserListPage
	const searchAddresses = async (query: string) => {
		if (query.length < 3) {
			setAddressSuggestions([]);
			setShowAddressList(false);
			return;
		}

		// Kiểm tra rate limiting
		const now = Date.now();
		if (now - lastRequestTime < 1000) {
			return;
		}

		// Reset counter mỗi phút
		if (now - lastRequestTime > 60000) {
			setRequestCount(0);
		}

		// Giới hạn tối đa 10 request/phút
		if (requestCount >= 10) {
			console.warn("Rate limit reached, please wait...");
			return;
		}

		if (addressCache[query]) {
			setAddressSuggestions(addressCache[query]);
			setShowAddressList(addressCache[query].length > 0);
			return;
		}
		// if (newUser.address && newUser.address.trim() && !selectedAddress) {
		// 	toast.error("Vui lòng chọn địa chỉ từ danh sách gợi ý");
		// 	return;
		// }

		setAddressLoading(true);
		setRequestCount((prev) => prev + 1);
		setLastRequestTime(now);

		try {
			const suggestions = await searchLocationSuggestions(query, "vn");

			setAddressCache((prev) => ({
				...prev,
				[query]: suggestions,
			}));

			setAddressSuggestions(suggestions);
			setShowAddressList(suggestions.length > 0);
		} catch (error) {
			console.error("Error searching addresses:", error);
			setAddressSuggestions([]);
			setShowAddressList(false);
		} finally {
			setAddressLoading(false);
		}
	};

	// Debounced search function
	const debouncedSearch = debounce(searchAddresses, 2000);

	// Handle address selection
	const handleAddressSelect = (address: any) => {
		setSelectedAddress(address);
		setNewUser({
			...newUser,
			address: address.display_name,
			latitude: address.lat,
			longitude: address.lon,
		});
		setShowAddressList(false);
		setAddressSuggestions([]);
	};

	// Handle address input change
	const handleAddressInputChange = (text: string) => {
		setNewUser({
			...newUser,
			address: text,
		});
		// Reset coordinates khi user thay đổi địa chỉ
		if (text !== selectedAddress?.display_name) {
			setSelectedAddress(null);
			setNewUser({
				...newUser,
				address: text,
				latitude: null,
				longitude: null,
			});
		}
		debouncedSearch(text);
	};

	const handleOpenDeleteDialog = (id: string) => {
		setDeleteId(id);
		setOpenDeleteDialog(true);
	};

	const handleConfirmDelete = async () => {
		if (!deleteId) return;
		try {
			await deleteUser(deleteId);
			await fetchUsers();
			toast.success("Đã xóa người dùng thành công");
		} catch (err) {
			console.error("Delete error", err);
			toast.error("Xóa người dùng thất bại");
		} finally {
			setDeleteId(null);
			setOpenDeleteDialog(false);
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
			fetchUsers();
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
			fetchUsers();
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
													value:
														| "all"
														| "Customer"
														| "Staff"
														| "Staff Warehouse",
												) => setRoleFilter(value)}
											>
												<SelectTrigger className="w-full h-12 bg-white border-gray-200 rounded-xl shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
													<SelectValue placeholder="Tất cả vai trò" />
												</SelectTrigger>
												<SelectContent className="rounded-xl border-gray-200 shadow-xl">
													<SelectItem value="all">Tất cả</SelectItem>
													<SelectItem value="Customer">Bệnh nhân</SelectItem>
													<SelectItem value="Staff">Nhân viên y tế</SelectItem>
													<SelectItem value="Staff Warehouse">
														Nhân viên kho máu
													</SelectItem>
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
														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																Số CMND/CCCD{" "}
																<span className="text-red-500">*</span>
															</label>
															<Input
																placeholder="Nhập số CMND/CCCD"
																className="rounded-xl"
																value={newUser.citizen_id_number || ""}
																onChange={(e) =>
																	setNewUser({
																		...newUser,
																		citizen_id_number: e.target.value,
																	})
																}
																title="Vui lòng nhập số chứng minh nhân dân hoặc căn cước công dân"
															/>
														</div>

														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																Họ tên <span className="text-red-500">*</span>
															</label>
															<Input
																placeholder="Nhập họ và tên đầy đủ"
																className="rounded-xl"
																value={newUser.full_name || ""}
																onChange={(e) =>
																	setNewUser({
																		...newUser,
																		full_name: e.target.value,
																	})
																}
																title="Vui lòng nhập họ và tên đầy đủ"
															/>
														</div>

														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																Email <span className="text-red-500">*</span>
															</label>
															<Input
																placeholder="Nhập địa chỉ email"
																type="email"
																className="rounded-xl"
																value={newUser.email || ""}
																onChange={(e) =>
																	setNewUser({
																		...newUser,
																		email: e.target.value,
																	})
																}
																title="Vui lòng nhập địa chỉ email hợp lệ"
															/>
														</div>

														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																Số điện thoại{" "}
																<span className="text-red-500">*</span>
															</label>
															<Input
																placeholder="Nhập số điện thoại"
																className="rounded-xl"
																value={newUser.phone || ""}
																onChange={(e) =>
																	setNewUser({
																		...newUser,
																		phone: e.target.value,
																	})
																}
																title="Vui lòng nhập số điện thoại hợp lệ"
															/>
														</div>

														{/* Password với icon mắt */}
														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																Mật khẩu <span className="text-red-500">*</span>
															</label>
															<div className="relative">
																<Input
																	type={showPassword ? "text" : "password"}
																	placeholder="Nhập mật khẩu"
																	className="rounded-xl pr-12"
																	value={newUser.password || ""}
																	onChange={(e) =>
																		setNewUser({
																			...newUser,
																			password: e.target.value,
																		})
																	}
																	title="Mật khẩu phải có ít nhất 6 ký tự"
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
														</div>

														{/* Confirm Password với icon mắt */}
														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																Xác nhận mật khẩu{" "}
																<span className="text-red-500">*</span>
															</label>
															<div className="relative">
																<Input
																	type={
																		showConfirmPassword ? "text" : "password"
																	}
																	placeholder="Nhập lại mật khẩu"
																	className="rounded-xl pr-12"
																	value={newUser.confirm_password || ""}
																	onChange={(e) =>
																		setNewUser({
																			...newUser,
																			confirm_password: e.target.value,
																		})
																	}
																	title="Mật khẩu xác nhận phải giống với mật khẩu đã nhập"
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
														</div>

														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																Ngày sinh{" "}
																<span className="text-red-500">*</span>
															</label>
															<Input
																type="date"
																placeholder="Chọn ngày sinh"
																className="rounded-xl"
																max={new Date().toISOString().split("T")[0]} // Chỉ cho phép chọn ngày quá khứ
																onChange={(e) =>
																	setNewUser({
																		...newUser,
																		date_of_birth: new Date(
																			e.target.value,
																		).toISOString(),
																	})
																}
																title="Vui lòng chọn ngày sinh (chỉ được chọn ngày trong quá khứ)"
															/>
														</div>

														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																Giới tính{" "}
																<span className="text-red-500">*</span>
															</label>
															<Select
																value={newUser.gender ?? ""}
																onValueChange={(val: UserGender) =>
																	setNewUser({ ...newUser, gender: val })
																}
															>
																<SelectTrigger
																	className="rounded-xl"
																	title="Vui lòng chọn giới tính"
																>
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
														</div>

														{/* Weight field với validation không âm */}
														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																Cân nặng (kg)
															</label>
															<Input
																type="number"
																placeholder="Nhập cân nặng"
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
																title="Nhập cân nặng tính bằng kg (số dương)"
															/>
														</div>
														<div className="space-y-3 relative">
															<div className="flex items-center gap-2">
																<div className="w-2 h-2 bg-orange-500 rounded-full" />
																<label className="text-sm font-semibold text-gray-700 tracking-wide">
																	ĐỊA CHỈ
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
																			d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
																		/>
																		<path
																			strokeLinecap="round"
																			strokeLinejoin="round"
																			strokeWidth={2}
																			d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
																		/>
																	</svg>
																</div>
																<Input
																	placeholder="Nhập địa chỉ để tìm kiếm..."
																	value={newUser.address || ""}
																	onChange={(e) =>
																		handleAddressInputChange(e.target.value)
																	}
																	className="w-full h-12 pl-12 pr-4 bg-white border-gray-200 rounded-xl shadow-sm hover:border-gray-300 hover:shadow-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
																	onFocus={() => {
																		if (addressSuggestions.length > 0) {
																			setShowAddressList(true);
																		}
																	}}
																/>
																{addressLoading && (
																	<div className="absolute inset-y-0 right-0 pr-4 flex items-center">
																		<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
																	</div>
																)}
																{selectedAddress && (
																	<div className="absolute inset-y-0 right-0 pr-4 flex items-center">
																		<svg
																			className="h-5 w-5 text-green-500"
																			fill="none"
																			stroke="currentColor"
																			viewBox="0 0 24 24"
																		>
																			<path
																				strokeLinecap="round"
																				strokeLinejoin="round"
																				strokeWidth={2}
																				d="M5 13l4 4L19 7"
																			/>
																		</svg>
																	</div>
																)}
															</div>

															{/* Address Suggestions List */}
															{showAddressList &&
																addressSuggestions.length > 0 && (
																	<div className="absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto mt-1">
																		{addressSuggestions.map(
																			(address, index) => (
																				<button
																					key={address.place_id || index}
																					type="button"
																					className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-start gap-3"
																					onClick={() =>
																						handleAddressSelect(address)
																					}
																				>
																					<svg
																						className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0"
																						fill="none"
																						stroke="currentColor"
																						viewBox="0 0 24 24"
																					>
																						<path
																							strokeLinecap="round"
																							strokeLinejoin="round"
																							strokeWidth={2}
																							d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
																						/>
																					</svg>
																					<span className="text-sm text-gray-700 line-clamp-2">
																						{address.display_name}
																					</span>
																				</button>
																			),
																		)}
																	</div>
																)}
														</div>

														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																Vai trò
															</label>
															<Select
																value={newUser.role ?? "Customer"}
																onValueChange={(val: string) =>
																	setNewUser({ ...newUser, role: val })
																}
															>
																<SelectTrigger
																	className="rounded-xl"
																	title="Chọn vai trò cho người dùng"
																>
																	<SelectValue placeholder="Chọn vai trò" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="Customer">
																		Bệnh nhân
																	</SelectItem>
																	<SelectItem value="Staff">
																		Nhân viên y tế
																	</SelectItem>
																	<SelectItem value="Staff Warehouse">
																		Nhân viên kho máu
																	</SelectItem>
																</SelectContent>
															</Select>
														</div>

														{/* Blood Group selection với tên hiển thị */}
														<div>
															<label className="block text-sm font-medium text-gray-700 mb-2">
																Nhóm máu
															</label>
															<Select
																value={newUser.blood_group_id || "none"}
																onValueChange={(val) =>
																	setNewUser({
																		...newUser,
																		blood_group_id: val === "none" ? "" : val,
																	})
																}
															>
																<SelectTrigger
																	className="rounded-xl"
																	title="Chọn nhóm máu (không bắt buộc)"
																>
																	<SelectValue placeholder="Chọn nhóm máu (tùy chọn)" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="none">
																		Không chọn
																	</SelectItem>
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
														</div>

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
														onClick={() => handleOpenDeleteDialog(u._id)}
													>
														<AlignJustify size={16} />
													</Button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						{/* Dialog xác nhận xoá */}
						<Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
							<DialogContent className="max-w-md rounded-xl">
								<DialogHeader>
									<DialogTitle>
										Bạn có chắc chuyển trạng thái người dùng?
									</DialogTitle>
								</DialogHeader>
								<div className="flex justify-end gap-4 mt-6">
									<Button
										variant="outline"
										onClick={() => {
											setDeleteId(null);
											setOpenDeleteDialog(false);
										}}
									>
										Hủy
									</Button>
									<Button variant="destructive" onClick={handleConfirmDelete}>
										Xác nhận
									</Button>
								</div>
							</DialogContent>
						</Dialog>

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
												{selectedUser.number_of_donations || "Chưa cập nhật"}
											</p>
										</div>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												Số lần yêu cầu
											</label>
											<p className="text-lg font-semibold text-blue-600">
												{selectedUser.number_of_requests || "Chưa cập nhật"}
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
									<SelectItem value="Staff Warehouse">
										Nhân viên kho máu
									</SelectItem>
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
