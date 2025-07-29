import { useState, useEffect } from "react";
import { fetchUser } from "../api/userService";
import type { User } from "@/types/user";
import AdminDropdown from "./ui/AdminDropdown";
import NotificationDropdown from "./NotificationDropdown";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useAuthStore } from "@/store/authStore";
import type { AppDispatch } from "@/redux/store";
import { resetUser } from "@/redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

export default function UserMenu() {
	const [userProfile, setUserProfile] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const logout = useAuthStore((state) => state.logout);
	const dispatch = useDispatch<AppDispatch>();
	const [offset, setOffset] = useState(0);
	const [blurActivation, setBlurActivation] = useState(false);
	const navigate = useNavigate();
	useEffect(() => {
		const loadUserProfile = async () => {
			try {
				setLoading(true);
				setError(null);
				const userData = await fetchUser();
				setUserProfile(userData);
			} catch (err) {
				setError("Không thể tải thông tin người dùng");
				console.error("Error fetching user profile:", err);
			} finally {
				setLoading(false);
			}
		};

		loadUserProfile();
	}, []);

	const handleLogout = async () => {
		logout();
		setTimeout(() => {
			toast.success("Đăng xuất thành công!");
		}, 200); // 200ms là đủ, không gây khó chịu
		navigate("/"); // Redirect to login page after logout
		dispatch(resetUser());
	};

	useEffect(() => {
		const onScroll = () => {
			setOffset(window.pageYOffset);
			setBlurActivation(window.pageYOffset > 5);
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	if (loading) {
		return (
			<div className="flex items-center gap-4 bg-white rounded-xl p-3 shadow-sm">
				<div className="flex items-center gap-2">
					<div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
					<div className="text-right">
						<div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1"></div>
						<div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
					</div>
				</div>
				<div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center gap-4 bg-white rounded-xl p-3 shadow-sm">
				<div className="text-red-500 text-sm">{error}</div>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-4  p-3 ">
			{/* Notification */}
			<NotificationDropdown />

			{/* Admin dropdown */}
			<AdminDropdown
				user={{
					avatar_url: userProfile?.avatar_url || "",
					fullname: userProfile?.full_name || "Không tên",
					role: userProfile?.role || "Không có email",
				}}
				onLogout={handleLogout}
			/>
		</div>
	);
}
