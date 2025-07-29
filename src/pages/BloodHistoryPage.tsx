import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom"; 
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  TextField,
  MenuItem,
  IconButton
} from "@mui/material";
import type { AppDispatch, RootState } from "@/redux/store";
import { DonationType, donationTypeVN } from "@/constants/donationType";
import statusVN from "@/utils/statusVN";
import dayjs from "dayjs";
import { motion } from "framer-motion"; 
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "dayjs/locale/vi";

// Redux actions for donation
import { fetchDonationRegistrationsByUser } from "@/redux/slices/donationRegistrationSlice";
import { fetchDonationHealthProcess, resetHealthProcess } from "@/redux/slices/donationHealthProcessSlice";

const statusOptions = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "Approved", label: "Đã duyệt" },
  { value: "Checked In", label: "Đã check in" },
  { value: "Pending", label: "Đang chờ" },
  { value: "Rejected", label: "Đã từ chối" },
];

const statusChipStyle = (status: string) => {
  switch (status) {
    case "Approved": return { bg: "#E3FCEF", border: "#21B573", color: "#21B573" };
    case "Checked In": return { bg: "#E0F7FA", border: "#03A9F4", color: "#03A9F4" };
    case "Pending": return { bg: "#FFF3CD", border: "#FFC107", color: "#856404" };
    case "Rejected": return { bg: "#FEE2E2", border: "#F44336", color: "#F44336" };
    default: return { bg: "#F3F4F6", border: "#E5E7EB", color: "#333" };
  }
};

dayjs.locale("vi");

export default function BloodHistoryPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { donationRegistrationId } = useParams<{ donationRegistrationId: string }>();
  console.log('donationRegistrationId:', donationRegistrationId);
  
  const { donationRegistrations, loading, error } = useSelector(
    (state: RootState) => state.donationRegistration
  );
  const { donationHealthProcess, loadingHealthProcess } = useSelector(
    (state: RootState) => state.donationHealthProcess
  );

  const [status, setStatus] = useState<string>("ALL");
  const [type, setType] = useState<string>("ALL");
  const [fromDate, setFromDate] = useState<dayjs.Dayjs | null>(null);
  const [toDate, setToDate] = useState<dayjs.Dayjs | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  // Fetch donation registrations if not yet loaded
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      dispatch(fetchDonationRegistrationsByUser(accessToken));
    }
  }, [dispatch]);

  const filtered = useMemo(() => {
    let result = [...donationRegistrations];
    if (status !== "ALL") result = result.filter(r => r.status === status);
    if (type !== "ALL") result = result.filter(r => (r.donation_type || "") === type);
    if (fromDate)
      result = result.filter(r =>
        dayjs(r.start_date_donation).isAfter(fromDate.startOf("day").subtract(1, "minute"))
      );
    if (toDate)
      result = result.filter(r =>
        dayjs(r.start_date_donation).isBefore(toDate.endOf("day").add(1, "minute"))
      );
    result.sort((a, b) => dayjs(b.start_date_donation).valueOf() - dayjs(a.start_date_donation).valueOf());
    return result;
  }, [donationRegistrations, status, type, fromDate, toDate]);

  useEffect(() => {
    if (donationRegistrationId) {
      const selectedDonation = donationRegistrations.find(
        (record) => record._id === donationRegistrationId
      );
      if (selectedDonation) {
        setSelectedRecord(selectedDonation);
        dispatch(fetchDonationHealthProcess(selectedDonation._id));

        const filteredRegistrations = filtered;
        const recordIndex = filteredRegistrations.indexOf(selectedDonation);
        const calculatedPage = Math.floor(recordIndex / rowsPerPage);
        setPage(calculatedPage); 
      }
    }
  }, [donationRegistrationId, donationRegistrations, dispatch, rowsPerPage]);

  const handleSelectRecord = (record: any) => {
    setSelectedRecord(record); 
    dispatch(fetchDonationHealthProcess(record._id));
  };

  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleBack = () => {
    setSelectedRecord(null);
    dispatch(resetHealthProcess());
  };

  const pagedData = useMemo(() => {
    return filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  if (loading) return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,0.6)",
        minHeight: "100vh",
      }}
    >
      <CircularProgress size={64} />
    </Box>
  );
  if (error) return <div>{error}</div>;

  const typeOptions = Object.values(DonationType);

  return (
    <Box sx={{ maxWidth: "90%", margin: "0 auto", padding: 4, borderRadius: "1rem", boxShadow: 3, background: "#fff" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
        <Box sx={{ display: "flex", gap: 4, mb: 4 }}>
          <TextField
            select
            label="Trạng thái"
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(0); }}
            size="small"
            sx={{ minWidth: 180, flex: 1 }}
          >
            {statusOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Loại hiến"
            value={type}
            onChange={e => { setType(e.target.value); setPage(0); }}
            size="small"
            sx={{ minWidth: 180, flex: 1 }}
          >
            <MenuItem value="ALL">Tất cả loại hiến</MenuItem>
            {typeOptions.map(typeKey => (
              <MenuItem key={typeKey} value={typeKey}>
                {donationTypeVN[typeKey as DonationType]}
              </MenuItem>
            ))}
          </TextField>

          <DatePicker
            label="Từ ngày"
            value={fromDate}
            onChange={date => { setFromDate(date); setPage(0); }}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                size: "small",
                sx: { minWidth: 150, flex: 1 },
                placeholder: "",
                variant: "outlined"
              }
            }}
            localeText={{
              clearButtonLabel: "Xóa",
              todayButtonLabel: "Hôm nay"
            }}
          />

          <DatePicker
            label="Đến ngày"
            value={toDate}
            onChange={date => { setToDate(date); setPage(0); }}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                size: "small",
                sx: { minWidth: 150, flex: 1 },
                placeholder: "",
                variant: "outlined"
              }
            }}
            localeText={{
              clearButtonLabel: "Xóa",
              todayButtonLabel: "Hôm nay"
            }}
          />
        </Box>
      </LocalizationProvider>

      <Box sx={{ display: "flex", gap: 4 }}>
        <TableContainer sx={{ flex: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên người hiến</TableCell>
                <TableCell>Nhóm máu</TableCell>
                <TableCell>Loại hiến</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Thời gian hiến máu</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ color: "gray" }}>
                    Không có đơn nào phù hợp
                  </TableCell>
                </TableRow>
              ) : (
                pagedData.map((donation) => (
                  <TableRow
                    key={donation._id}
                    onClick={() => handleSelectRecord(donation)} // Select record on click
                    sx={{
                      cursor: "pointer",
                      border: selectedRecord?._id === donation._id ? "2px solid #0EA5E9" : "none", // Border for selected record
                      backgroundColor: selectedRecord?._id === donation._id ? "#E0F2FE" : "transparent",
                    }}
                  >
                    <TableCell>{donation.full_name}</TableCell>
                    <TableCell>{donation.blood_group_name}</TableCell>
                    <TableCell>{donation.donation_type ? donationTypeVN[donation.donation_type as DonationType] : ""}</TableCell>
                    <TableCell>{donation.phone}</TableCell>
                    <TableCell>{dayjs(donation.start_date_donation).format("DD/MM/YYYY HH:mm")}</TableCell>
                    <TableCell>
                      <span
                        style={{
                          display: "inline-block",
                          background: statusChipStyle(donation.status).bg,
                          color: statusChipStyle(donation.status).color,
                          border: `1.5px solid ${statusChipStyle(donation.status).border}`,
                          borderRadius: "999px",
                          padding: "2px 16px",
                          fontWeight: 600,
                          fontSize: 14,
                          minWidth: 110,
                          textAlign: "center",
                        }}
                      >
                        {statusVN(donation.status)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Detail Panel with Motion Animation */}
        {donationHealthProcess && !loadingHealthProcess && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5 }}
            style={{
              flex: 0.4,
              padding: "20px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
            }}
          >
            {/* <IconButton onClick={handleBack} sx={{ position: "relative"}}>
              ←
            </IconButton> */}
            <h3 className="text-lg font-semibold text-center">Thông tin chi tiết</h3>
            <div><strong>ID đơn:</strong> {donationHealthProcess._id}</div>
            <div><strong>Trạng thái:</strong> {statusVN(donationHealthProcess.status)}</div>
            <div><strong>Trọng lượng:</strong> {donationHealthProcess.weight}</div>
            <div><strong>Nhiệt độ:</strong> {donationHealthProcess.temperature}</div>
            <div><strong>Tần số tim:</strong> {donationHealthProcess.heart_rate}</div>
            <div><strong>Huyết áp:</strong> {donationHealthProcess.systolic_blood_pressure}/{donationHealthProcess.diastolic_blood_pressure}</div>
            <div><strong>Điều kiện sức khỏe:</strong> {(donationHealthProcess.underlying_health_condition && donationHealthProcess.underlying_health_condition.length > 0) ? donationHealthProcess.underlying_health_condition : "Chưa cập nhật"}</div>
            <div><strong>Hemoglobin:</strong> {donationHealthProcess.hemoglobin}</div>
            <div><strong>Mô tả:</strong> {donationHealthProcess.description || "Chưa cập nhật"}</div>
            <div><strong>Thể tích lấy máu:</strong> {donationHealthProcess.volume_collected}</div>
            <div><strong>Ngày hiến máu:</strong> {dayjs(donationHealthProcess.donation_date).format("DD/MM/YYYY HH:mm")}</div>
            <div><strong>Nhóm máu:</strong> {donationHealthProcess.blood_group}</div>
          </motion.div>
        )}
      </Box>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filtered.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số dòng/trang:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} của ${count}`}
      />
    </Box>
  );
}
