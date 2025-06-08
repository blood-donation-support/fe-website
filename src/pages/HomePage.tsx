import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
	return (
		<div>
			home page
			<div className="hidden md:flex items-center gap-3 text-sm">
				<Link
					to="/login"
					className="px-5 py-3 rounded-full border text-white shadow-xl 
  hover:bg-orange-100 hover:text-orange-400 hover:border-orange-300 
  transition-all duration-200 ease-in-out hover:shadow-2xl hover:z-[999] hover:ring hover:ring-offset-1 hover:ring-orange-300"
				>
					SIGN IN
				</Link>
				<Link
					to="/register"
					className="px-5 py-3 rounded-full border border-orange-300 bg-orange-100 text-orange-400 shadow-xl 
  hover:bg-orange-300 hover:text-orange-500 hover:border-orange-800 
  transition-all duration-200 ease-in-out hover:shadow-2xl hover:z-[999] hover:ring hover:ring-offset-1 hover:ring-orange-300"
				>
					SIGN UP
				</Link>
			</div>
		</div>
	);
}
