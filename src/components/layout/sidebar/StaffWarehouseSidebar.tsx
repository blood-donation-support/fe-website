import { Link } from "react-router-dom";
import SidebarNavItem from "./SidebarNavItem";
import SidebarUpdateCard from "./SidebarUpdateCard";

const artistNavItems = [
		{
	icon: "fa-chart-pie", 
	label: "Dashboard Kho Máu",
	path: "/dashboard-staff-warehouse/blood-storage-dashboard",
},
	
	{
	icon: "fa-chart-pie", 
	label: "Blood Storage Summary",
	path: "/dashboard-staff-warehouse/blood-storage-summary",
},
{
	icon: "fa-tint",  
	label: "Quản Lý Kho Máu",
	path: "/dashboard-staff-warehouse/blood-storage",
},

{
	icon: "fa-list-alt",  
	label: "Đơn Xin Máu",
	path: "/dashboard-staff-warehouse/request-list",
},

{
	icon: "fa-list-alt",  
	label: "Đơn Phân Tách & Nhập Kho",
	path: "/dashboard-staff-warehouse/blood-separation-list",
},

	
];

export default function StaffWarehouseSidebar() {
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
