import { Link } from "react-router-dom";
import SidebarNavItem from "./SidebarNavItem";
import SidebarUpdateCard from "./SidebarUpdateCard";

const artistNavItems = [
	
	{
	icon: "fa-chart-pie", 
	label: "Blood Storage Summary",
	path: "/dashboard-staff-warehouse/blood-storage-summary",
},
	{
	icon: "fa-chart-pie", 
	label: "Blood Storage Dashboard",
	path: "/dashboard-staff-warehouse/blood-storage-dashboard",
},
{
	icon: "fa-list-alt",  
	label: "Donation Request List",
	path: "/dashboard-staff-warehouse/request-list",
},
{
	icon: "fa-tint",  
	label: "Blood Storage",
	path: "/dashboard-staff-warehouse/blood-storage",
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
