import { NavLink } from "react-router-dom";

interface SidebarNavItemProps {
  icon: string;
  label: string;
  path: string;
  end?: boolean; 
}

export default function SidebarNavItem({ icon, label, path, end }: SidebarNavItemProps) {
  return (
    <NavLink
      to={path}
      end={end} 
      className={({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-md ${
          isActive ? "bg-[#f7f9ff] text-[#236afe] font-semibold" : "text-gray-700"
        } hover:bg-gray-100`
      }
    >
      <i className={`fa-solid ${icon} w-5`}></i>
      <span>{label}</span>
    </NavLink>
  );
}
