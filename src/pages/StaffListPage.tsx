import SearchFilterBar from "../components/SearchFilterBar";
import StaffList from "../components/StaffList";

export default function StaffListPage() {
	console.log("stafflist nè");
	return (
		<>
			<SearchFilterBar context="staff" />
			<StaffList />
		</>
	);
}
