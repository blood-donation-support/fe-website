import { useNavigate } from "react-router-dom";
interface StaffItemProps {
	full_name: string;
	_id: string;
	role: string;
	phone: string;
	avatar_url: string;
	bgColor: string;
	status: number;
}
export default function StaffItem({
	full_name,
	_id,
	role,
	phone,
	avatar_url,
	bgColor,
	status,
}: StaffItemProps) {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(`/staffs/${_id}`);
	};

	return (
		<div
			onClick={handleClick}
			style={{
				backgroundColor: bgColor,
				cursor: "pointer",
				padding: "16px",
				borderRadius: "8px",
				marginBottom: "12px",
			}}
		>
			<div className="bg-white rounded-xl shadow p-4 text-center space-y-3">
				<div className="flex justify-center">
					<div
						className={`w-20 h-20 rounded-full overflow-hidden`}
						style={{ backgroundColor: bgColor }}
					>
						<img src={avatar_url} alt={full_name} className="object-cover w-full h-full" />
					</div>
				</div>

				<div className="text-center break-words">
					<p className="font-bold text-lg inline">
						{full_name} ·{" "}
						<span
							className={`font-medium text-sm ${
								status === 0
									? "text-blue-800"
									: status === 1
									? "text-emerald-800"
									: status === 2
									? "text-red-700"
									: "text-gray-700"
							}`}
						>
							{status === 0
								? "Requested"
								: status === 1
								? "Accepted"
								: status === 2
								? "Rejected"
								: "Unknown"}
						</span>
					</p>
				</div>

				<p className="text-sm text-gray-500">{role}</p>
				<p className="text-sm text-gray-500">
					<i className="fa-solid fa-phone mr-1"></i> {phone}
				</p>
			</div>
		</div>
	);
}
