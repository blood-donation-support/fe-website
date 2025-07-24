import { Link } from "react-router-dom";
import SidebarNavItem from "./SidebarNavItem";
import SidebarUpdateCard from "./SidebarUpdateCard";

const artistNavItems = [
	// { icon: "fa-table-cells", label: "Dashboard", path: "/dashboard" },
	{
		icon: "fa-calendar-check",
		label: "Hiến máu",
		path: "/dashboard-staff/donation",
	},
	{
		icon: "fa-hand-holding-medical",
		label: "Tạo đơn xin máu",
		path: "/dashboard-staff/doctor-request",
	},
	{
		icon: "fa-table-cells",
		label: "Danh Sách đơn xin máu",
		path: "/dashboard-staff/doctor-request-approved",
	},
	// { icon: "fa-message", label: "Messages", path: "/dashboard-artist/messages" },
];

export default function StaffSidebar() {
	return (
		<aside className="w-64 bg-white border-r p-4 hidden md:flex flex-col justify-between">
			<div>
				<Link
					to="/"
					className="text-xl font-bold mb-6 text-[#236afe] text-center block"
				>
					Blood Donation
				</Link>
				<div className="flex flex-col gap-2">
					{artistNavItems.map((item) => (
						<SidebarNavItem key={item.path} {...item} />
					))}
				</div>
			</div>
			<SidebarUpdateCard />
		</aside>
	);
}
