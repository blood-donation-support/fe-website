import React, { useEffect, useState } from "react";
import { Plus, Trash2, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
// Removed table imports - using custom table styling
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { fetchUserAll, deleteUser, createUser } from "@/api/userService";
import type { User, NewUserPayload } from "@/types/user";
import genderVN from "@/utils/genderVN";
import { UserGender } from "@/types/user";

const roleVN = (role) => {
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
// const genderVN = (genderVN) => {
// 	switch (genderVN) {
// 		case "Male":
// 			return "Nam";
// 		case "Female":
// 			return "Nữ";
// 		case "Other":
// 			return "Khác";
// 	}
// };

const formatDate = (dateString) => {
	return new Date(dateString).toLocaleDateString("vi-VN");
};

export default function UserListPage() {
	const [users, setUsers] = useState<User[]>([]);
	const [searchText, setSearchText] = useState("");
	const [openAdd, setOpenAdd] = useState(false);
	const [openDetail, setOpenDetail] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [newUser, setNewUser] = useState<Partial<NewUserPayload>>({
		weight: 0,
		location: "",
		avatar_url: "",
		blood_group_id: "",
	});

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
		await deleteUser(id);
		setUsers((prev) => prev.filter((u) => u._id !== id));
		toast.success("Đã cập nhật");
	};

	const handleAddUser = async () => {
		const payload = newUser as NewUserPayload;
		try {
			const created = await createUser(payload);
			toast.success("Tạo người dùng thành công");
			setUsers((prev) => [created, ...prev]);
			setOpenAdd(false);
			setNewUser({
				weight: 0,
				location: "",
				avatar_url: "",
				blood_group_id: "",
			});
		} catch (err) {
			toast.error("Tạo người dùng thất bại");
		}
	};

	const handleViewDetail = (user: User) => {
		setSelectedUser(user);
		setOpenDetail(true);
	};

	const filtered = users.filter((u) =>
		u.full_name.toLowerCase().includes(searchText.toLowerCase()),
	);

	return (
		<>
			<ToastContainer />
			<div className="p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
				<Card className="border-none shadow-2xl bg-white/95 backdrop-blur-md overflow-hidden rounded-3xl">
					<CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
						<CardTitle className="text-2xl text-center font-bold">
							Danh sách người dùng
						</CardTitle>
					</CardHeader>
					<CardContent className="p-6 space-y-6">
						<div className="flex flex-col md:flex-row justify-between gap-4">
							<Input
								placeholder="Tìm theo tên..."
								className="w-full md:w-1/3 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-all"
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
							/>
							<Dialog open={openAdd} onOpenChange={setOpenAdd}>
								<DialogTrigger asChild>
									<Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all">
										<Plus className="w-4 h-4 mr-2" /> Thêm người dùng
									</Button>
								</DialogTrigger>
								<DialogContent className="rounded-2xl">
									<DialogHeader>
										<DialogTitle className="text-xl font-bold text-gray-800">
											Thêm người dùng mới
										</DialogTitle>
									</DialogHeader>
									<div className="space-y-4 mt-4">
										<Input
											placeholder="Số CMND/CCCD"
											className="rounded-xl"
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
											onChange={(e) =>
												setNewUser({ ...newUser, full_name: e.target.value })
											}
										/>
										<Input
											placeholder="Email"
											className="rounded-xl"
											onChange={(e) =>
												setNewUser({ ...newUser, email: e.target.value })
											}
										/>
										<Input
											placeholder="Số điện thoại"
											className="rounded-xl"
											onChange={(e) =>
												setNewUser({ ...newUser, phone: e.target.value })
											}
										/>
										<Input
											type="password"
											placeholder="Mật khẩu"
											className="rounded-xl"
											onChange={(e) =>
												setNewUser({ ...newUser, password: e.target.value })
											}
										/>
										<Input
											type="password"
											placeholder="Xác nhận mật khẩu"
											className="rounded-xl"
											onChange={(e) =>
												setNewUser({
													...newUser,
													confirm_password: e.target.value,
												})
											}
										/>
										<Input
											type="date"
											placeholder="Ngày sinh"
											className="rounded-xl"
											onChange={(e) =>
												setNewUser({
													...newUser,
													date_of_birth: new Date(e.target.value).toISOString(),
												})
											}
										/>
										<Select
											value={newUser.gender ?? ""}
											onValueChange={(val) =>
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

						<div className="rounded-2xl overflow-hidden shadow-lg border">
							<table className="w-full">
								<thead className="bg-gradient-to-r from-blue-600 to-purple-600">
									<tr>
										<th className="text-white font-semibold px-6 py-4 text-left">
											Họ tên
										</th>
										<th className="text-white font-semibold px-6 py-4 text-left">
											Số CCCD
										</th>
										<th className="text-white font-semibold px-6 py-4 text-left">
											Giới tính
										</th>
										<th className="text-white font-semibold px-6 py-4 text-left">
											Email
										</th>
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
												{u.full_name || "chưa cập nhật"}
											</td>
											<td className="px-6 py-4 text-gray-600">
												{u.citizen_id_number}
											</td>
											<td className="px-6 py-4 text-gray-600">
												{genderVN(u.gender) || "chưa cập nhật"}
											</td>

											<td className="px-6 py-4 text-gray-600">
												{u.email || "chưa cập nhật"}
											</td>
											<td className="px-6 py-4 text-gray-600">
												{u.phone || "chưa cập nhật"}
											</td>
											<td className="px-6 py-4">
												<span
													className={`px-3 py-1 rounded-full text-xs font-medium ${
														u.role === "Admin"
															? "bg-red-100 text-red-800"
															: u.role === "Donor"
															? "bg-green-100 text-green-800"
															: "bg-blue-100 text-blue-800"
													}`}
												>
													{roleVN(u.role || "chưa cập nhật")}
												</span>
											</td>
												<td className="px-6 py-4 text-gray-600">
												{u.is_active || "chưa kích hoạt"}
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
					</CardContent>
				</Card>

				{/* User Detail Modal */}
				<Dialog open={openDetail} onOpenChange={setOpenDetail}>
					<DialogContent className="max-w-4xl rounded-2xl max-h-[90vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle className="text-2xl font-bold text-gray-800 mb-4">
								Chi tiết người dùng
							</DialogTitle>
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
												{selectedUser.full_name || "chưa cập nhật"}
											</p>
										</div>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												Email
											</label>
											<p className="text-lg text-gray-900">
												{selectedUser.email || "chưa cập nhật"}
											</p>
										</div>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												Số điện thoại
											</label>
											<p className="text-lg text-gray-900">
												{selectedUser.phone || "chưa cập nhật"}
											</p>
										</div>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												Giới tính
											</label>
											<p className="text-lg text-gray-900">
												{genderVN(selectedUser.gender) || "chưa cập nhật"}
											</p>
										</div>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												Ngày sinh
											</label>
											<p className="text-lg text-gray-900">
												{formatDate(selectedUser.date_of_birth) ||
													"chưa cập nhật"}
											</p>
										</div>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												CMND/CCCD
											</label>
											<p className="text-lg text-gray-900">
												{selectedUser.citizen_id_number || "chưa cập nhật"}
											</p>
										</div>
									</div>
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
												{selectedUser.weight || "chưa cập nhật"} kg
											</p>
										</div>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												Số lần hiến máu
											</label>
											<p className="text-lg font-semibold text-green-600">
												{selectedUser.number_of_donation || "chưa cập nhật"}
											</p>
										</div>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												Số lần yêu cầu
											</label>
											<p className="text-lg font-semibold text-blue-600">
												{selectedUser.number_of_request || "chưa cập nhật"}
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
											<span
												className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
													selectedUser.role === "Admin"
														? "bg-red-100 text-red-800"
														: selectedUser.role === "Donor"
														? "bg-green-100 text-green-800"
														: "bg-blue-100 text-blue-800"
												}`}
											>
												{roleVN(selectedUser.role) || "chưa cập nhật"}
											</span>
										</div>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												ID
											</label>
											<p className="text-sm text-gray-600 font-mono">
												{selectedUser._id || "chưa cập nhật"}
											</p>
										</div>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												Ngày tạo
											</label>
											<p className="text-lg text-gray-900">
												{formatDate(selectedUser.created_at) || "chưa cập nhật"}
											</p>
										</div>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<label className="text-sm font-medium text-gray-500">
												Cập nhật cuối
											</label>
											<p className="text-lg text-gray-900">
												{formatDate(selectedUser.updated_at) || "chưa cập nhật"}
											</p>
										</div>
									</div>
								</div>

								{/* Address Section */}
								{selectedUser.address && (
									<div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6">
										<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
											<div className="w-2 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full mr-3"></div>
											Địa chỉ
										</h3>
										<div className="bg-white rounded-xl p-4 shadow-sm">
											<p className="text-lg text-gray-900">
												{selectedUser.address || "chưa cập nhật"}
											</p>
										</div>
									</div>
								)}
							</div>
						)}
					</DialogContent>
				</Dialog>
			</div>
		</>
	);
}
