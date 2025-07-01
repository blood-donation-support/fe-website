import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTotalBloodUnits } from "../../redux/slices/bloodUnitsSlice";
import { fetchTotalDonations } from "../../redux/slices/donationSlice";
import { fetchBestBloodType } from "@/redux/slices/bestBloodTypeSlice";
import { fetchBestStaff } from "@/redux/slices/bestStaffSlice";
import { fetchTotalUsers } from "@/redux/slices/userSlice";
import { fetchTotalStaff } from "@/redux/slices/staffSlice";
import type { RootState, AppDispatch } from "../../redux/store";
import {
	FaStar,
	FaRegStar,
	FaStarHalfAlt,
	FaSortUp,
	FaSortDown,
	FaSort,
} from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faDroplet,
	faUser,
	faCalendarCheck,
	faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	CartesianGrid,
	ResponsiveContainer,
	ReferenceDot,
	Label,
} from "recharts";

interface bestStaffInMonth {
	idStaff: string;
	nameStaff: string;
	avatarStaff: string;
	status: number;
	avgRating: number;
	totalBloodUnitsInMonth: number;
	totalDonationsInMonth: number;
	totalCancelInMonth: number;
}

interface bestBloodTypeInMonth {
	idBloodType: string;
	nameBloodType: string;
	avgDemand: number;
}

interface userInMonth {
	totalUsers: number;
	newUsers: number;
	returnUsers: number;
	cancelUsers: number;
}

interface staffInMonth {
	totalStaff: number;
	newStaff: number;
	bannedStaff: number;
}

export default function BloodDonationDashboard() {
	// 1. API totalBloodUnits
	const dispatch = useDispatch<AppDispatch>();
	const { data: dataBloodUnits } = useSelector(
		(state: RootState) => state.bloodUnits,
	);

	useEffect(() => {
		dispatch(fetchTotalBloodUnits());
	}, [dispatch]);

	const [year, setYear] = useState("2025");
	const selectedYearDataBloodUnits =
		dataBloodUnits?.totalBloodUnits?.perYear.find(
			(y: { year: number }) => y.year === Number(year),
		);

	const chartDataBloodUnits = selectedYearDataBloodUnits
		? Object.keys(selectedYearDataBloodUnits.collected).map((monthKey) => ({
				month: monthKey.charAt(0).toUpperCase() + monthKey.slice(1), // ví dụ: jan -> Jan
				collected: selectedYearDataBloodUnits.collected[monthKey],
				used: selectedYearDataBloodUnits.used[monthKey],
				available: selectedYearDataBloodUnits.available[monthKey],
		  }))
		: [];
	const bestCollected = selectedYearDataBloodUnits?.bestCollected ?? {
		month: "",
		collected: 0,
	};
	const bestUsed = selectedYearDataBloodUnits?.bestUsed ?? {
		month: "",
		used: 0,
	};
	const bestAvailable = selectedYearDataBloodUnits?.bestAvailable ?? {
		month: "",
		available: 0,
	};
	const collectedYear = selectedYearDataBloodUnits?.totalCollectedPerYear || 0;
	const usedYear = selectedYearDataBloodUnits?.totalUsedPerYear || 0;
	const availableYear = selectedYearDataBloodUnits?.totalAvailablePerYear || 0;

	// 2. API totalDonations
	const { data: dataDonations } = useSelector(
		(state: RootState) => state.donations,
	);

	useEffect(() => {
		dispatch(fetchTotalDonations());
	}, [dispatch]);
	const [yearDonations, setYearDonations] = useState("2023");
	const selectedYearDataDonations = dataDonations?.totalDonations?.perYear.find(
		(y: { year: number }) => y.year === Number(yearDonations),
	);
	const chartDataDonations = selectedYearDataDonations
		? Object.keys(selectedYearDataDonations.donations).map((monthKey) => ({
				month: monthKey.charAt(0).toUpperCase() + monthKey.slice(1), // jan -> Jan
				donations: selectedYearDataDonations.donations[monthKey],
				cancel: selectedYearDataDonations.cancel[monthKey],
		  }))
		: [];

	const bestDonationsYear = selectedYearDataDonations?.bestDonations || 0;
	const bestCancelYear = selectedYearDataDonations?.bestCancel || 0;

	// 3. API bestStaff
	const { data: dataBestStaff } = useSelector(
		(state: RootState) => state.bestStaff,
	);

	useEffect(() => {
		dispatch(fetchBestStaff());
	}, [dispatch]);

	const [yearBestStaff, setYearBestStaff] = useState("2025");
	const currentMonthBestStaff = monthNames[new Date().getMonth()];
	const [monthBestStaff, setMonthBestStaff] = useState(currentMonthBestStaff);
	const bestStaffRaw: bestStaffInMonth[] =
		dataBestStaff?.bestStaff?.find(
			(y: { year: number }) => y.year === Number(yearBestStaff),
		)?.months[monthBestStaff] ?? [];
	const [sortBy, setSortBy] = useState<
		"bloodUnits" | "donations" | "cancels" | "rating"
	>("bloodUnits");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
	const handleSort = (column: typeof sortBy) => {
		if (sortBy === column) {
			setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortBy(column);
			setSortDirection("desc");
		}
	};
	const bestStaffData = [...bestStaffRaw].sort((a, b) => {
		const multiplier = sortDirection === "asc" ? 1 : -1;
		switch (sortBy) {
			case "bloodUnits":
				return (
					(a.totalBloodUnitsInMonth - b.totalBloodUnitsInMonth) * multiplier
				);
			case "donations":
				return (a.totalDonationsInMonth - b.totalDonationsInMonth) * multiplier;
			case "cancels":
				return (a.totalCancelInMonth - b.totalCancelInMonth) * multiplier;
			case "rating":
				return (a.avgRating - b.avgRating) * multiplier;
			default:
				return 0;
		}
	});

	// 4. API bestBloodType
	const { data: dataBestBloodType } = useSelector(
		(state: RootState) => state.bestBloodType,
	);

	useEffect(() => {
		dispatch(fetchBestBloodType());
	}, [dispatch]);

	const [yearBestBloodType, setYearBestBloodType] = useState("2025");
	const currentMonthBestBloodType = monthNames[new Date().getMonth()];
	const [monthBestBloodType, setMonthBestBloodType] = useState(
		currentMonthBestBloodType,
	);
	const bestBloodTypeData: bestBloodTypeInMonth[] = [
		...(dataBestBloodType?.bestBloodType?.find(
			(y: { year: number }) => y.year === Number(yearBestBloodType),
		)?.months[monthBestBloodType] ?? []),
	].sort((a, b) => b.avgDemand - a.avgDemand);

	// 5. API totalUsers
	const { data: dataUsers } = useSelector((state: RootState) => state.users);

	useEffect(() => {
		dispatch(fetchTotalUsers());
	}, [dispatch]);

	const [yearUsers, setYearUsers] = useState("2025");
	const currentMonthUsers = monthNames[new Date().getMonth()];
	const [monthUsers, setMonthUsers] = useState(currentMonthUsers);
	const usersData: userInMonth = dataUsers?.totalUsers?.perYear.find(
		(y: { year: number }) => y.year === Number(yearUsers),
	)?.months[monthUsers] ?? {
		totalUsers: 0,
		newUsers: 0,
		returnUsers: 0,
		cancelUsers: 0,
	};
	// Lấy dữ liệu từ usersData
	const totalUsers = usersData.totalUsers;
	const newUsers = usersData.newUsers;
	const returnUsers = usersData.returnUsers;
	const cancelUsers = usersData.cancelUsers;
	// Dữ liệu cho PieChart
	const chartDataUsers = [
		{ name: "New", value: newUsers },
		{ name: "Returning", value: returnUsers },
		{ name: "Canceled", value: cancelUsers },
	];

	// 6. API totalStaff
	const { data: dataStaff } = useSelector((state: RootState) => state.staff);

	useEffect(() => {
		dispatch(fetchTotalStaff());
	}, [dispatch]);

	const [yearStaff, setYearStaff] = useState("2025");
	const currentMonthStaff = monthNames[new Date().getMonth()];
	const [monthStaff, setMonthStaff] = useState(currentMonthStaff);
	const staffData: staffInMonth = dataStaff?.totalStaff?.perYear.find(
		(y: { year: number }) => y.year === Number(yearStaff),
	)?.months[monthStaff] ?? {
		totalStaff: 0,
		newStaff: 0,
		bannedStaff: 0,
	};
	// Lấy dữ liệu từ staffData
	const totalStaffCount = staffData.totalStaff;
	const newStaff = staffData.newStaff;
	const bannedStaff = staffData.bannedStaff;
	// Dữ liệu cho PieChart
	const chartDataStaff = [
		{ name: "New", value: newStaff },
		{ name: "Banned", value: bannedStaff },
	];

	return (
		<div className="flex flex-col gap-4 bg-gray-50 min-h-screen">
			<div className="flex flex-row gap-4">
				{/* A. Left Side - 2/3 */}
				<div className="w-2/3 space-y-4">
					{/* 1. Card to show the total blood units, total users, total donations, and total staff */}
					<div className="grid grid-cols-2 gap-4">
						<Card
							className="p-4 rounded-2xl shadow-lg bg-gradient-to-r from-red-100 to-rose-100 text-gray-800 flex items-center gap-4 hover:shadow-2xl hover:scale-105 hover:cursor-pointer hover:text-red-900 hover:shadow-red-300 hover:bg-gradient-to-r hover:from-red-200 hover:to-rose-200 hover:border-2 hover:border-red-300 hover:border-solid transition-shadow duration-300"
							title="Total Blood Units"
							value={
								dataBloodUnits?.totalBloodUnits?.totalUnitsAllYear
									? formatBloodUnits(
											dataBloodUnits?.totalBloodUnits?.totalUnitsAllYear,
									  )
									: "Loading..."
							}
							icon={faDroplet}
						/>
						<Card
							className="p-4 rounded-2xl shadow-lg bg-gradient-to-r from-green-100 to-emerald-100 text-gray-800 flex items-center gap-4 hover:shadow-2xl hover:scale-105 hover:cursor-pointer hover:text-emerald-950 hover:shadow-emerald-300 hover:bg-gradient-to-r hover:from-green-200 hover:to-emerald-200 hover:border-2 hover:border-emerald-300 hover:border-solid transition-shadow duration-300"
							title="Total Donors"
							value={dataUsers?.totalUsers?.totalUsersAllYear ?? "Loading..."}
							icon={faUser}
						/>
						<Card
							className="p-4 rounded-2xl shadow-lg bg-gradient-to-r from-blue-100 to-cyan-100 text-gray-800 flex items-center gap-4 hover:shadow-2xl hover:scale-105 hover:cursor-pointer hover:text-cyan-950 hover:shadow-cyan-300 hover:bg-gradient-to-r hover:from-blue-200 hover:to-cyan-200 hover:border-2 hover:border-cyan-300 hover:border-solid transition-shadow duration-300"
							title="Total Staff"
							value={dataStaff?.totalStaff?.totalStaffAllYear ?? "Loading..."}
							icon={faUserTie}
						/>
						<Card
							className="p-4 rounded-2xl shadow-lg bg-gradient-to-r from-purple-100 to-violet-100 text-gray-800 flex items-center gap-4 hover:shadow-2xl hover:scale-105 hover:cursor-pointer hover:text-violet-900 hover:shadow-violet-300 hover:bg-gradient-to-r hover:from-purple-200 hover:to-violet-200 hover:border-2 hover:border-violet-300 hover:border-solid transition-shadow duration-300"
							title="Total Donations"
							value={
								dataDonations?.totalDonations?.totalDonationsAllYear
									? formatCurrency(
											dataDonations?.totalDonations?.totalDonationsAllYear,
									  )
									: "Loading..."
							}
							icon={faCalendarCheck}
						/>
					</div>
					{/* 2. Blood Units */}
					<div className="bg-white p-4 rounded-2xl shadow-xl">
						<div className="flex justify-between items-center mb-2">
							<h2 className="text-lg font-semibold">Blood Units Management</h2>
							<select
								value={year}
								onChange={(e) => setYear(e.target.value)}
								className="bg-gradient-to-r from-red-100 to-rose-100 text-sm px-3 py-1 rounded-xl text-gray-700 outline-none"
							>
								{Array.isArray(dataBloodUnits?.totalBloodUnits?.perYear) &&
									dataBloodUnits.totalBloodUnits.perYear.map(
										(y: { year: number }) => (
											<option key={y.year} value={y.year}>
												{y.year}
											</option>
										),
									)}
							</select>
						</div>
						<div className="h-72 -mx-2 bg-red-50 rounded-2xl shadow-xl hover:scale-105 hover:shadow-rose-200 hover:cursor-pointer">
							{chartDataBloodUnits.length > 0 && (
								<ResponsiveContainer width="100%" height="100%">
									<LineChart
										data={chartDataBloodUnits}
										margin={{ left: 10, right: 20 }}
									>
										<CartesianGrid strokeDasharray="3 3" vertical={false} />
										<XAxis dataKey="month" />
										<YAxis />
										<Tooltip formatter={formatBloodUnits} />
										<Legend verticalAlign="top" height={36} />
										{/* Line Collected */}
										<Line
											type="monotone"
											dataKey="collected"
											stroke="#dc2626"
											strokeWidth={2}
											dot={{ r: 4 }}
											activeDot={{ r: 6 }}
											name="Collected"
										/>
										{/* Best Collected */}
										{renderBestDot({
											month: bestCollected.month,
											value: bestCollected.collected,
											label: "Collected",
											color: "#dc2626",
											position: "top",
										})}
										{/* Line Used */}
										<Line
											type="monotone"
											dataKey="used"
											stroke="#f59e0b"
											strokeWidth={2}
											dot={false}
											name="Used"
										/>
										{/* Best Used */}
										{renderBestDot({
											month: bestUsed.month,
											value: bestUsed.used,
											label: "Used",
											color: "#f59e0b",
											position: "bottom",
										})}
										{/* Line Available */}
										<Line
											type="monotone"
											dataKey="available"
											stroke="#10b981"
											strokeDasharray="5 5"
											strokeWidth={2}
											dot={false}
											name="Available"
										/>
										{/* Best Available */}
										{renderBestDot({
											month: bestAvailable.month,
											value: bestAvailable.available,
											label: "Available",
											color: "#10b981",
											position: "top",
										})}
									</LineChart>
								</ResponsiveContainer>
							)}
						</div>
						<div className="mt-4 grid grid-cols-3 gap-4 text-sm text-gray-700">
							<div className="bg-red-50 p-3 rounded-xl shadow-xl hover:scale-105 hover:shadow-red-200 hover:cursor-pointer">
								<div className="font-semibold">Total Collected</div>
								<div className="text-base font-bold text-red-600">
									{formatBloodUnits(collectedYear)}
								</div>
							</div>
							<div className="bg-amber-50 p-3 rounded-xl shadow-xl hover:scale-105 hover:shadow-amber-200 hover:cursor-pointer">
								<div className="font-semibold">Total Used</div>
								<div className="text-base font-bold text-amber-600">
									{formatBloodUnits(usedYear)}
								</div>
							</div>
							<div className="bg-emerald-50 p-3 rounded-xl shadow-xl hover:scale-105 hover:shadow-emerald-200 hover:cursor-pointer">
								<div className="font-semibold">Total Available</div>
								<div className="text-base font-bold text-emerald-600">
									{formatBloodUnits(availableYear)}
								</div>
							</div>
						</div>
					</div>
					{/* 3. Donations */}
					<div className="bg-white p-4 rounded-2xl shadow">
						<div className="flex justify-between items-center mb-2">
							<div>
								<h2 className="text-lg font-semibold">Blood Donations</h2>
								<div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
									<span className="text-2xl font-bold text-black">
										{selectedYearDataDonations?.totalDonationsPerYear.toLocaleString() ??
											"0"}
									</span>
									<span className="text-gray-400">Total Donations</span>
								</div>
							</div>
							<select
								value={yearDonations}
								onChange={(e) => setYearDonations(e.target.value)}
								className="bg-gradient-to-r from-purple-100 to-violet-100 text-sm px-3 py-1 rounded-xl text-gray-700 outline-none"
							>
								{dataDonations?.totalDonations?.perYear.map(
									(y: { year: number }) => (
										<option key={y.year} value={y.year}>
											{y.year}
										</option>
									),
								)}
							</select>
						</div>
						<div className="h-60 -ml-2 rounded-xl shadow-xl bg-gradient-to-r from-purple-50 to-violet-50 text-gray-800 flex items-center gap-4 hover:shadow-2xl hover:scale-105 hover:cursor-pointer hover:text-violet-950 hover:shadow-violet-300 hover:border-2 hover:border-violet-300 hover:border-solid transition-shadow duration-300">
							{chartDataDonations.length > 0 ? (
								<ResponsiveContainer width="100%" height="100%">
									<BarChart data={chartDataDonations}>
										<defs>
											<linearGradient
												id="donationGradient"
												x1="0"
												y1="0"
												x2="1"
												y2="0"
											>
												<stop offset="0%" stopColor="#ddd6fe" />
												<stop offset="100%" stopColor="#a78bfa" />
											</linearGradient>
											<linearGradient
												id="cancelGradient"
												x1="0"
												y1="0"
												x2="1"
												y2="0"
											>
												<stop offset="0%" stopColor="#fbcfe8" />
												<stop offset="100%" stopColor="#fca5a5" />
											</linearGradient>
										</defs>
										<CartesianGrid strokeDasharray="3 3" vertical={false} />
										<XAxis dataKey="month" />
										<YAxis />
										<Tooltip
											content={({ active, payload, label }) => {
												if (!active || !payload) return null;
												return (
													<div className="bg-white p-3 rounded-xl shadow text-sm">
														<div className="font-semibold mb-1">{label}</div>
														{payload.map((entry, index) => {
															const isCancel = entry.dataKey === "cancel";
															const colorClass = isCancel
																? "bg-gradient-to-r from-pink-100 to-red-100"
																: "bg-gradient-to-r from-purple-100 to-violet-100";
															return (
																<div
																	key={index}
																	className="flex items-center gap-2"
																>
																	<span
																		className={`w-3 h-3 rounded-full ${colorClass}`}
																	/>
																	<span className="text-gray-600">
																		{entry.name}:
																	</span>
																	<span className="font-medium">
																		{entry.value?.toLocaleString()} donations
																	</span>
																</div>
															);
														})}
													</div>
												);
											}}
										/>
										<Legend
											verticalAlign="top"
											height={36}
											content={() => (
												<div className="flex gap-4 text-sm text-gray-600 px-4 mt-1">
													<div className="flex items-center gap-2">
														<span className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-100 to-red-100" />
														Cancel
													</div>
													<div className="flex items-center gap-2">
														<span className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-100 to-violet-100" />
														Donations
													</div>
												</div>
											)}
										/>
										<Bar
											dataKey="cancel"
											fill="url(#cancelGradient)"
											radius={[4, 4, 0, 0]}
											name="Cancel"
										/>
										<Bar
											dataKey="donations"
											fill="url(#donationGradient)"
											radius={[4, 4, 0, 0]}
											name="Donations"
										/>
									</BarChart>
								</ResponsiveContainer>
							) : (
								<div className="h-full flex justify-center items-center text-gray-400">
									Loading...
								</div>
							)}
						</div>

						<div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
							<div className="bg-violet-50 p-3 rounded-xl shadow-xl hover:scale-105 hover:shadow-violet-200 hover:cursor-pointer">
								<div className="font-semibold">Best Donations</div>
								<div className="text-base font-bold text-violet-600">
									{bestDonationsYear?.month} -{" "}
									{formatCurrency(bestDonationsYear?.donations)}
								</div>
							</div>
							<div className="bg-rose-50 p-3 rounded-xl shadow-xl hover:scale-105 hover:shadow-rose-200 hover:cursor-pointer">
								<div className="font-semibold">Best Cancel</div>
								<div className="text-base font-bold text-rose-500">
									{bestDonationsYear?.donations != null
										? formatCurrency(bestDonationsYear.donations)
										: "N/A"}
								</div>
							</div>
						</div>
					</div>
					{/* 4. Best Staff */}
					<div className="bg-white p-4 rounded-2xl shadow">
						<div className="flex justify-between items-center mb-2">
							<h2 className="text-lg font-semibold">Best Staff Performance</h2>
							<div className="flex gap-2">
								<select
									value={monthBestStaff}
									onChange={(e) => setMonthBestStaff(e.target.value)}
									className="text-sm px-2 py-1 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100"
								>
									{monthNames.map((m) => (
										<option key={m} value={m}>
											{m.toUpperCase()}
										</option>
									))}
								</select>
								<select
									value={yearBestStaff}
									onChange={(e) => setYearBestStaff(e.target.value)}
									className="text-sm px-2 py-1 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50"
								>
									{dataBestStaff?.bestStaff?.map((item: { year: number }) => (
										<option key={item.year} value={item.year}>
											{item.year}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className="divide-y bg-gray-200 rounded-xl shadow-xl text-gray-800 hover:shadow-2xl hover:scale-105 hover:cursor-pointer hover:text-cyan-950 hover:shadow-gray-300 hover:border-2 hover:border-gray-300 hover:border-solid transition-shadow duration-300">
							<div className="grid grid-cols-6 text-sm font-semibold items-center my-3 px-2 pt-3">
								<div>Staff</div>

								<div
									onClick={() => handleSort("bloodUnits")}
									className="cursor-pointer flex items-center gap-1"
								>
									Blood Units
									{sortBy === "bloodUnits" ? (
										sortDirection === "asc" ? (
											<FaSortUp />
										) : (
											<FaSortDown />
										)
									) : (
										<FaSort className="text-gray-400" />
									)}
								</div>

								<div
									onClick={() => handleSort("donations")}
									className="cursor-pointer flex items-center gap-1"
								>
									Donations
									{sortBy === "donations" ? (
										sortDirection === "asc" ? (
											<FaSortUp />
										) : (
											<FaSortDown />
										)
									) : (
										<FaSort className="text-gray-400" />
									)}
								</div>

								<div
									onClick={() => handleSort("cancels")}
									className="cursor-pointer flex items-center gap-1"
								>
									Cancels
									{sortBy === "cancels" ? (
										sortDirection === "asc" ? (
											<FaSortUp />
										) : (
											<FaSortDown />
										)
									) : (
										<FaSort className="text-gray-400" />
									)}
								</div>

								<div
									onClick={() => handleSort("rating")}
									className="cursor-pointer flex items-center gap-1"
								>
									Rating
									{sortBy === "rating" ? (
										sortDirection === "asc" ? (
											<FaSortUp />
										) : (
											<FaSortDown />
										)
									) : (
										<FaSort className="text-gray-400" />
									)}
								</div>

								<div>Status</div>
							</div>

							{bestStaffData.length > 0 ? (
								bestStaffData.slice(0, 5).map((staff, index) => (
									<div
										key={staff.idStaff}
										className="grid grid-cols-6 text-sm py-3 px-2 items-center hover:bg-gray-50"
									>
										<div className="flex items-center gap-2">
											<img
												src={staff.avatarStaff || "/default-avatar.png"}
												alt={staff.nameStaff}
												className="w-8 h-8 rounded-full object-cover"
											/>
											<div className="truncate">
												<div className="font-medium">{staff.nameStaff}</div>
												<div className="text-xs text-gray-500">
													#{index + 1}
												</div>
											</div>
										</div>

										<div className="font-semibold text-red-600">
											{formatBloodUnits(staff.totalBloodUnitsInMonth)}
										</div>

										<div className="font-semibold text-purple-600">
											{formatCurrency(staff.totalDonationsInMonth)}
										</div>

										<div className="font-semibold text-orange-600">
											{formatCurrency(staff.totalCancelInMonth)}
										</div>

										<div className="flex items-center gap-1">
											{renderStarRating(staff.avgRating)}
											<span className="text-xs text-gray-500 ml-1">
												({staff.avgRating.toFixed(1)})
											</span>
										</div>

										<div>
											<span
												className={`px-2 py-1 rounded-full text-xs ${
													staff.status === 1
														? "bg-green-100 text-green-800"
														: "bg-red-100 text-red-800"
												}`}
											>
												{staff.status === 1 ? "Active" : "Inactive"}
											</span>
										</div>
									</div>
								))
							) : (
								<div className="text-center py-8 text-gray-500">
									No staff data available
								</div>
							)}
						</div>
					</div>
				</div>

				{/* B. Right Side - 1/3 */}
				<div className="w-1/3 space-y-4">
					{/* 5. Best Blood Type */}
					<div className="bg-white p-4 rounded-2xl shadow">
						<div className="flex justify-between items-center mb-2">
							<h2 className="text-lg font-semibold">Best Blood Type</h2>
							<div className="flex gap-2">
								<select
									value={monthBestBloodType}
									onChange={(e) => setMonthBestBloodType(e.target.value)}
									className="text-sm px-2 py-1 rounded-xl bg-gradient-to-r from-red-100 to-rose-100"
								>
									{monthNames.map((m) => (
										<option key={m} value={m}>
											{m.toUpperCase()}
										</option>
									))}
								</select>
								<select
									value={yearBestBloodType}
									onChange={(e) => setYearBestBloodType(e.target.value)}
									className="text-sm px-2 py-1 rounded-xl bg-gradient-to-r from-rose-50 to-red-50"
								>
									{dataBestBloodType?.bestBloodType?.map(
										(item: { year: number }) => (
											<option key={item.year} value={item.year}>
												{item.year}
											</option>
										),
									)}
								</select>
							</div>
						</div>
						<div className="space-y-2">
							{bestBloodTypeData.length > 0 ? (
								bestBloodTypeData.slice(0, 8).map((bloodType, index) => (
									<div
										key={bloodType.idBloodType}
										className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl hover:from-red-100 hover:to-rose-100 transition-colors duration-200"
									>
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
												{bloodType.nameBloodType}
											</div>
											<div>
												<div className="font-medium">
													{bloodType.nameBloodType}
												</div>
												<div className="text-xs text-gray-500">
													Rank #{index + 1}
												</div>
											</div>
										</div>
										<div className="text-right">
											<div className="font-semibold text-red-600">
												{bloodType.avgDemand.toFixed(1)}%
											</div>
											<div className="text-xs text-gray-500">Demand</div>
										</div>
									</div>
								))
							) : (
								<div className="text-center py-8 text-gray-500">
									No blood type data available
								</div>
							)}
						</div>
					</div>

					{/* 6. Users Statistics */}
					<div className="bg-white p-4 rounded-2xl shadow">
						<div className="flex justify-between items-center mb-2">
							<h2 className="text-lg font-semibold">Users Statistics</h2>
							<div className="flex gap-2">
								<select
									value={monthUsers}
									onChange={(e) => setMonthUsers(e.target.value)}
									className="text-sm px-2 py-1 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100"
								>
									{monthNames.map((m) => (
										<option key={m} value={m}>
											{m.toUpperCase()}
										</option>
									))}
								</select>
								<select
									value={yearUsers}
									onChange={(e) => setYearUsers(e.target.value)}
									className="text-sm px-2 py-1 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50"
								>
									{dataUsers?.totalUsers?.perYear?.map(
										(item: { year: number }) => (
											<option key={item.year} value={item.year}>
												{item.year}
											</option>
										),
									)}
								</select>
							</div>
						</div>
						<div className="text-center mb-4">
							<div className="text-3xl font-bold text-gray-800">
								{totalUsers}
							</div>
							<div className="text-sm text-gray-500">Total Users</div>
						</div>
						<div className="h-48 mb-4">
							{chartDataUsers.some((item) => item.value > 0) ? (
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={chartDataUsers}
											cx="50%"
											cy="50%"
											innerRadius={40}
											outerRadius={80}
											paddingAngle={5}
											dataKey="value"
										>
											{chartDataUsers.map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={getUserColors()[index % getUserColors().length]}
												/>
											))}
										</Pie>
										<Tooltip
											formatter={(value) => [value, "Users"]}
											labelFormatter={(label) => `${label} Users`}
										/>
										<Legend />
									</PieChart>
								</ResponsiveContainer>
							) : (
								<div className="h-full flex items-center justify-center text-gray-400">
									No user data available
								</div>
							)}
						</div>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-gray-600">New Users:</span>
								<span className="font-semibold text-green-600">{newUsers}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Returning Users:</span>
								<span className="font-semibold text-blue-600">
									{returnUsers}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Canceled Users:</span>
								<span className="font-semibold text-red-600">
									{cancelUsers}
								</span>
							</div>
						</div>
					</div>

					{/* 7. Staff Statistics */}
					<div className="bg-white p-4 rounded-2xl shadow">
						<div className="flex justify-between items-center mb-2">
							<h2 className="text-lg font-semibold">Staff Statistics</h2>
							<div className="flex gap-2">
								<select
									value={monthStaff}
									onChange={(e) => setMonthStaff(e.target.value)}
									className="text-sm px-2 py-1 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100"
								>
									{monthNames.map((m) => (
										<option key={m} value={m}>
											{m.toUpperCase()}
										</option>
									))}
								</select>
								<select
									value={yearStaff}
									onChange={(e) => setYearStaff(e.target.value)}
									className="text-sm px-2 py-1 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50"
								>
									{dataStaff?.totalStaff?.perYear?.map(
										(item: { year: number }) => (
											<option key={item.year} value={item.year}>
												{item.year}
											</option>
										),
									)}
								</select>
							</div>
						</div>
						<div className="text-center mb-4">
							<div className="text-3xl font-bold text-gray-800">
								{totalStaffCount}
							</div>
							<div className="text-sm text-gray-500">Total Staff</div>
						</div>
						<div className="h-48 mb-4">
							{chartDataStaff.some((item) => item.value > 0) ? (
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={chartDataStaff}
											cx="50%"
											cy="50%"
											innerRadius={40}
											outerRadius={80}
											paddingAngle={5}
											dataKey="value"
										>
											{chartDataStaff.map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={
														getStaffColors()[index % getStaffColors().length]
													}
												/>
											))}
										</Pie>
										<Tooltip
											formatter={(value) => [value, "Staff"]}
											labelFormatter={(label) => `${label} Staff`}
										/>
										<Legend />
									</PieChart>
								</ResponsiveContainer>
							) : (
								<div className="h-full flex items-center justify-center text-gray-400">
									No staff data available
								</div>
							)}
						</div>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-gray-600">New Staff:</span>
								<span className="font-semibold text-green-600">{newStaff}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Banned Staff:</span>
								<span className="font-semibold text-red-600">
									{bannedStaff}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

// Helper functions
const monthNames = [
	"jan",
	"feb",
	"mar",
	"apr",
	"may",
	"jun",
	"jul",
	"aug",
	"sep",
	"oct",
	"nov",
	"dec",
];

const formatBloodUnits = (value: number) => {
	if (value >= 1000000) {
		return `${(value / 1000000).toFixed(1)}M units`;
	} else if (value >= 1000) {
		return `${(value / 1000).toFixed(1)}K units`;
	}
	return `${value} units`;
};

const formatCurrency = (value?: number) => {
	if (typeof value !== "number" || isNaN(value)) {
		return "0";
	}

	if (value >= 1_000_000) {
		return `${(value / 1_000_000).toFixed(1)}M`;
	} else if (value >= 1_000) {
		return `${(value / 1_000).toFixed(1)}K`;
	}
	return value.toString();
};


const renderStarRating = (rating: number) => {
	const stars = [];
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating % 1 !== 0;

	for (let i = 0; i < fullStars; i++) {
		stars.push(<FaStar key={i} className="text-yellow-400" />);
	}

	if (hasHalfStar) {
		stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
	}

	const emptyStars = 5 - Math.ceil(rating);
	for (let i = 0; i < emptyStars; i++) {
		stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
	}

	return stars;
};

const renderBestDot = ({
	month,
	value,
	label,
	color,
	position,
}: {
	month: string;
	value: number;
	label: string;
	color: string;
	position: "top" | "bottom";
}) => {
	if (!month || !value) return null;

	return (
		<ReferenceDot
			x={month.charAt(0).toUpperCase() + month.slice(1)}
			y={value}
			r={6}
			fill={color}
			stroke="#fff"
			strokeWidth={2}
		>
			<Label
				value={`Best ${label}`}
				position={position}
				className="text-xs font-semibold"
				fill={color}
			/>
		</ReferenceDot>
	);
};

const getUserColors = () => ["#10b981", "#3b82f6", "#ef4444"];

const getStaffColors = () => ["#10b981", "#ef4444"];

// Card component
const Card = ({
	className,
	title,
	value,
	icon,
	...props
}: {
	className?: string;
	title: string;
	value: string | number;
	icon: any;
	[key: string]: any;
}) => {
	return (
		<div className={className} {...props}>
			<div className="flex items-center gap-4">
				<div className="p-3 bg-white bg-opacity-50 rounded-xl">
					<FontAwesomeIcon icon={icon} className="text-2xl" />
				</div>
				<div>
					<div className="text-sm font-medium opacity-80">{title}</div>
					<div className="text-2xl font-bold">{value}</div>
				</div>
			</div>
		</div>
	);
};
