import { useState, useEffect } from "react";

import { Dialog } from "@headlessui/react";
import { Link, NavLink } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Logo } from "@/components";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-toastify";
import { FaBars, FaBell, FaPhone, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
const navigation = [
	{ name: "Trang chủ", href: "/" },
	{ name: "Donate Money", href: "https://www.facebook.com/dustin.tsan.181003" },
	{ name: "Trợ giúp", href: "/contact" },
	{ name: "Cần máu", href: "/need-blood", secondLast: true },
	{ name: "Hiến máu", href: "/donateBlood", last: true },
];
const compnayName = "HemoCell Blood Bank";

const HeaderComponent=  () => {
	const [offset, setOffset] = useState(0);
	const [blurActivation, setBlurActivation] = useState(false);
	const [isActiveName, setIsActiveName] = useState('');
	const user = useAuthStore((state) => state.user);
	console.log("user in header", user);

  	const logout = useAuthStore((state) => state.logout);
	const reuseableClass = {
		for_last: `bg-red-800 text-white hover:bg-white hover:text-dark`,
		for_second_last: `rounded-rsm border border-white/[.5] hover:bg-white hover:text-dark`,
	};
	const handleLogout = async () => {
		const ok = logout();
		if (true) {//để ní kia chỉnh lại sau
			toast.success("Đăng xuất thành công!");
		} else {
			toast.error("Đăng xuất thất bại! Vui lòng thử lại.");
		}
	};
	useEffect(() => {
		const onScroll = () => {
			setOffset(window.pageYOffset);
			setBlurActivation(window.pageYOffset > 5);
		};

		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return (
		<motion.header
			initial={{ opacity: 0, y: -32 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				duration: 1.2,
				ease: [0, 0.05, 0.05, 0.1],
				delay: 0.08,
			}}
			className="w-full px-8 pb-10 pt-5 flex items-center justify-between bg-white/0 transition absolute top-0 left-0 z-20"
			>
			<div className="flex items-center gap-20">
				<div className="flex items-center gap-2">
					<img src="src/assets/logo.png" alt="Donate Blood" className="w-8 h-8 rounded-full" />
					<span className="font-bold text-2xl text-blue-600">Donate Blood</span>
				</div>
				<button className="md:hidden p-2 rounded-full hover:bg-gray-200">
					<FaBars size={20} />
				</button>
				<nav className="hidden md:flex items-center gap-3 ml-4">
					{[{context:"Chúng tôi",nav:"/home"},{context:"Hiến máu",nav:"/home"} ,{context:"Nhận máu",nav:"/home"} ,{context: "Hỗ trợ",nav:"/home"}].map((item) => (
						<Link to={item.nav}
						key={item.context}
						className="px-6 py-2 text-lg bg-white rounded-full border border-gray-200 shadow-sm font-medium text-gray-700 hover:bg-blue-50 transition"
						>
						{item.context}
						</Link>
					))}
				</nav>
			</div>
			<div className="flex items-center gap-4">
				<div className="hidden md:block text-2xl text-gray-500 mr-4 bg-white rounded-full px-6 py-3">
					<span className="inline-block align-middle mr-1">
						<svg width="14" height="14" fill="none" viewBox="0 0 24 24">
							<circle cx="12" cy="10" r="6" stroke="#7C8DB0" strokeWidth="2" />
							<path d="M12 16v4" stroke="#7C8DB0" strokeWidth="2" strokeLinecap="round" />
						</svg>
					</span>
					Nhà văn hóa sinh viên,Q9
				</div>
				<div className="flex gap-2">
					<button className="w-14 h-14 flex items-center justify-center rounded-full bg-black text-white hover:bg-blue-600 transition">
						<FaPhone size={16} />
					</button>
					<button className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 hover:bg-blue-600 hover:text-white transition">
						<FaBell size={16} />
					</button>
					<button className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 hover:bg-blue-600 hover:text-white transition">
						<FaUser size={16} />
					</button>
				</div>
			</div>
		</motion.header>
	);
};

export default HeaderComponent;