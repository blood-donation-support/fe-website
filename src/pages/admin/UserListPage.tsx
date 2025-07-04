import React, { useEffect, useState } from "react";
import { Plus, Trash2, ChevronDown } from "lucide-react";
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
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table";
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

export default function UserListPage() {
	const [users, setUsers] = useState<User[]>([]);
	const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
	const [searchText, setSearchText] = useState("");
	const [openAdd, setOpenAdd] = useState(false);
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

	const filtered = users.filter((u) =>
		u.full_name.toLowerCase().includes(searchText.toLowerCase()),
	);

	return (
		<>
			<ToastContainer />
			<div className="p-6">
				<Card
					className="border-none shadow-2xl bg-white/95 backdrop-blur-md overflow-hidden"
					sx={{ borderRadius: "24px" }}
				>
					<CardHeader>
						<CardTitle className="text-[#236afe] text-xl text-center">
							Danh sách người dùng
						</CardTitle>
					</CardHeader>
					<CardContent className="p-4 space-y-4">
						<div className="flex flex-col md:flex-row justify-between gap-4">
							<Input
								placeholder="Tìm theo tên..."
								className="w-full md:w-1/3"
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
							/>
							<Dialog open={openAdd} onOpenChange={setOpenAdd}>
								<DialogTrigger asChild>
									<Button className="bg-[#236afe] text-white">
										<Plus className="w-4 h-4 mr-1" /> Thêm người dùng
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Thêm người dùng</DialogTitle>
									</DialogHeader>
									<div className="space-y-3 mt-2">
										<Input
											placeholder="Số CMND/CCCD"
											onChange={(e) =>
												setNewUser({
													...newUser,
													citizen_id_number: e.target.value,
												})
											}
										/>
										<Input
											placeholder="Họ tên"
											onChange={(e) =>
												setNewUser({ ...newUser, full_name: e.target.value })
											}
										/>
										<Input
											placeholder="Email"
											onChange={(e) =>
												setNewUser({ ...newUser, email: e.target.value })
											}
										/>
										<Input
											placeholder="Số điện thoại"
											onChange={(e) =>
												setNewUser({ ...newUser, phone: e.target.value })
											}
										/>
										<Input
											type="password"
											placeholder="Mật khẩu"
											onChange={(e) =>
												setNewUser({ ...newUser, password: e.target.value })
											}
										/>
										<Input
											type="password"
											placeholder="Xác nhận mật khẩu"
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
											onChange={(e) =>
												setNewUser({
													...newUser,
													date_of_birth: new Date(e.target.value).toISOString(),
												})
											}
										/>{" "}
										<Select
											value={newUser.gender ?? ""}
											onValueChange={(val) =>
												setNewUser({ ...newUser, gender: val })
											}
										>
											<SelectTrigger>
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
											className="w-full bg-[#236afe] text-white"
										>
											Lưu
										</Button>
									</div>
								</DialogContent>
							</Dialog>
						</div>

						<Table className="border rounded-xl overflow-hidden">
							<TableHeader className="bg-[#236afe] text-white">
								<TableRow>
									<TableHead className="text-white px-4 py-3">Họ tên</TableHead>
									<TableHead className="text-white px-4 py-3">Email</TableHead>
									<TableHead className="text-white px-4 py-3">
										Vai trò
									</TableHead>
									<TableHead className="text-white px-4 py-3 text-center">
										Thao tác
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filtered.map((u) => (
									<React.Fragment key={u._id}>
										<TableRow
											onClick={() =>
												setExpandedUserId(
													expandedUserId === u._id ? null : u._id,
												)
											}
											className="hover:bg-gray-50 transition cursor-pointer group"
										>
											<TableCell className="px-4 py-3 flex items-center gap-2">
												<ChevronDown
													size={16}
													className={`transition-transform group-hover:text-[#236afe] ${
														expandedUserId === u._id ? "rotate-180" : ""
													}`}
												/>
												{u.full_name}
											</TableCell>
											<TableCell className="px-4 py-3">{u.email}</TableCell>
											<TableCell className="px-4 py-3">{u.role}</TableCell>
											<TableCell className="px-4 py-3 text-center">
												<Button
													variant="destructive"
													size="icon"
													onClick={(e) => {
														e.stopPropagation();
														handleDelete(u._id);
													}}
												>
													<Trash2 size={16} />
												</Button>
											</TableCell>
										</TableRow>
										{expandedUserId === u._id && (
											<TableRow className="bg-gray-50">
												<TableCell colSpan={4} className="px-6 py-4">
													<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
														<p>
															<strong>Giới tính:</strong> {genderVN(u.gender)}
														</p>
														<p>
															<strong>Ngày sinh:</strong>{" "}
															{new Date(u.date_of_birth).toLocaleDateString()}
														</p>
														<p>
															<strong>SĐT:</strong> {u.phone || "-"}
														</p>
														<p>
															<strong>Địa chỉ:</strong> {u.location || "-"}
														</p>
														<p>
															<strong>Lượt hiến máu:</strong>{" "}
															{u.number_of_donation}
														</p>
														<p>
															<strong>Lượt yêu cầu:</strong>{" "}
															{u.number_of_request}
														</p>
													</div>
												</TableCell>
											</TableRow>
										)}
									</React.Fragment>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
