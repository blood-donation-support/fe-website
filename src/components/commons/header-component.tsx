import { useState, useEffect } from "react";

import { Dialog } from "@headlessui/react";
import { Link, NavLink } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Logo } from "@/components";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-toastify";

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
		<header
			onScroll={() => setBlurActivation(true)}
			className={`fixed inset-x-0 top-0 z-50 border-b border-white/[.2] ${
				blurActivation ? "bg-blue-400/[.5] backdrop-blur-md" : ""
			}`}
		>
			<div
				className="flex items-center justify-between p-6 lg:px-8 w-[min(1250px,100%-15px)] m-auto"
				aria-label="Global"
			>
				<div className="flex lg:flex-1">
					<a href="/" className="-m-1.5 p-1.5">
						<span className="sr-only">{compnayName}</span>
						<img className="w-auto h-10" src={Logo} alt="" />
					</a>
				</div>

				<div className="flex lg:hidden">
					<button
						type="button"
						className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 "
					>
						<span className="sr-only">Open main menu</span>
						<Bars3Icon className="w-6 h-6" aria-hidden="true" />
					</button>
				</div>

				<div className="hidden lg:flex lg:gap-x-4 lg:transition">
					{navigation.map((item) => (
						<NavLink
							key={item.name}
							to={item.href}
							className={`text-lg font-bold hover:bg-teal-400 lg:transition leading-6 text-white px-3 py-2 rounded-md ${
								item.secondLast && `${reuseableClass.for_second_last}`
							} ${item.last && `${reuseableClass.for_last} hover:bg-red-950`} ${
								isActiveName == item.name ? `bg-dark` : ``
							}`}
							>
							{item.name}
						</NavLink>
					))}
				</div>
				{user && (
					<button
						onClick={handleLogout}
						className="ml-20 -mr-20 px-4 py-2 rounded bg-red-800 text-white hover:bg-red-600 font-semibold transition"
					>
						Đăng xuất
					</button>
				)}
			</div>
		</header>
	);
};

export default HeaderComponent;