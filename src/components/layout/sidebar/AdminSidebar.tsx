import { Link } from "react-router-dom";
import SidebarNavItem from "./SidebarNavItem";
import SidebarUpdateCard from "./SidebarUpdateCard";

const adminNavItems = [
  { icon: "fa-chart-pie", label: "Dashboard", path: "/dashboard-admin" },              
  { icon: "fa-user-tie", label: "Staffs", path: "/dashboard-admin/staffs" },          
  { icon: "fa-users", label: "Users", path: "/dashboard-admin/users" },                
  { icon: "fa-tint", label: "Bloods", path: "/dashboard-admin/bloods" },              
  { icon: "fa-flask", label: "Blood Process", path: "/dashboard-admin/blood-process" }, 
  { icon: "fa-clipboard-list", label: "Donation Registrations", path: "/dashboard-admin/donation-registers" }, 
  { icon: "fa-hand-holding-heart", label: "Donation Requests", path: "/dashboard-admin/donation-requests" },  
  { icon: "fa-file-alt", label: "Reports", path: "/dashboard-admin/reports" },     
  { icon: "fa-blog", label: "Blogs", path: "/dashboard-admin/blogs" }   
];


export default function AdminSidebar() {
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
                    {adminNavItems.map((item) => (
                        <SidebarNavItem key={item.path} {...item} />
                    ))}
                </div>
            </div>
            <SidebarUpdateCard />
        </aside>
    );
}
