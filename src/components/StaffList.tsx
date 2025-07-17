import { useState, useEffect } from "react";
import StaffItem from "./StaffItem";
import Pagination from "./Pagination";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { fetchStaffList } from "@/redux/slices/staffListSlice";

export default function StaffList() {
	const dispatch = useDispatch<AppDispatch>();
	const { staffList: dataStaffList, loading, error } = useSelector(
		(state: RootState) => state.staffList,
	);

	useEffect(() => {
		console.log("Dispatch fetchStaffList");
		dispatch(fetchStaffList());
	}, [dispatch]);

	const staffSearch = useSelector(
		(state: RootState) => state.search.staffSearch,
	);
	const staffStatusFilter = useSelector(
		(state: RootState) => state.search.staffStatusFilter,
	);

	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	const filteredStaffs = dataStaffList.filter((staff) => {
		const matchesSearch = staff.full_name
			.toLowerCase()
			.includes(staffSearch.toLowerCase());

		const matchesStatus =
			staffStatusFilter === "" || staff.status === Number(staffStatusFilter);

		return matchesSearch && matchesStatus;
	});

	useEffect(() => {
		setCurrentPage(1);
	}, [staffSearch]);

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = filteredStaffs?.slice(indexOfFirstItem, indexOfLastItem);
	const totalItems = filteredStaffs.length;

	const handlePageChange = (page: number) => {
		console.log("Page changed to:", page);
		setCurrentPage(page);
	};

	const handleItemsPerPageChange = (newItemsPerPage: number) => {
		console.log("Items per page changed to:", newItemsPerPage);
		setItemsPerPage(newItemsPerPage);
		setCurrentPage(1);
	};

	console.log("Loading:", loading);
	console.log("Error:", error);
	console.log("Total staff in store:", dataStaffList.length);
	console.log("Filtered staff count:", filteredStaffs.length);
	console.log("Current items on page:", currentItems.length);

	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{loading ? (
					<p className="text-center py-8">Loading staff data...</p>
				) : error ? (
					<p className="text-center text-red-500 font-semibold py-8">
						Error: {error}
					</p>
				) : currentItems.length === 0 ? (
					<p className="text-center text-gray-400 font-semibold py-8">
						No matching results found
					</p>
				) : (
					currentItems.map((staff) => (
						<StaffItem
							key={staff._id}
							full_name={staff.full_name}
							_id={staff._id}
							role={staff.role}
							phone={staff.phone}
							avatar_url={staff.avatar_url}
							bgColor={
								staff.status === 0
									? "#dbeafe"
									: staff.status === 1
									? "#d1fae5"
									: staff.status === 2
									? "#fee2e2"
									: "#f3f4f6"
							}
							status={staff.status}
						/>
					))
				)}
			</div>
			<Pagination
				currentPage={currentPage}
				totalItems={totalItems}
				itemsPerPage={itemsPerPage}
				onPageChange={handlePageChange}
				onItemsPerPageChange={handleItemsPerPageChange}
			/>
		</>
	);
}
