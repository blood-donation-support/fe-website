import { setStaffSearch, setStaffStatusFilter } from "@/redux/slices/searchSlice";
import type { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

interface SearchFilterBarProps {
  context: string;
}

export default function SearchFilterBar({ context }: SearchFilterBarProps) {
  const dispatch = useDispatch();
  const staffSearch = useSelector((state: RootState) => state.search.staffSearch);
  const staffStatusFilter = useSelector((state: RootState) => state.search.staffStatusFilter);

  // Nếu muốn dựa vào context để dispatch action khác hoặc hiển thị UI khác
  // bạn có thể xử lý tại đây

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ví dụ tùy context mà dispatch khác
    if (context === "staff") {
      dispatch(setStaffSearch(e.target.value));
    }
    // nếu có context khác thì xử lý khác...
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (context === "staff") {
      dispatch(setStaffStatusFilter(e.target.value));
    }
    // tương tự cho các context khác
  };

  return (
    <div className="flex gap-4 items-center mb-4">
      <input
        type="text"
        placeholder={`Search ${context} by name...`}
        value={staffSearch}
        onChange={handleSearchChange}
        className="border border-gray-300 rounded px-3 py-2 flex-grow"
      />

      <select
        value={staffStatusFilter}
        onChange={handleStatusFilterChange}
        className="border border-gray-300 rounded px-3 py-2"
      >
        <option value="">All statuses</option>
        <option value="0">Requested</option>
        <option value="1">Accepted</option>
        <option value="2">Rejected</option>
      </select>
    </div>
  );
}
