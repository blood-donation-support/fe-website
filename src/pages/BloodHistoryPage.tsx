import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchDonationRegistrationsByUser } from "@/redux/slices/donationRegistrationSlice"; // Action từ Redux slice
import { FooterComponent, HeaderComponent } from "@/components"; // Các thành phần UI có sẵn của bạn
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Typography, Box } from "@mui/material"; // Material UI components
import type { AppDispatch, RootState } from "@/redux/store";// Import donationTypeVN từ service
import { DonationType, donationTypeVN } from "@/constants/donationType";

export default function BloodHistoryPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { donationRegistrations, loading, error } = useSelector(
    (state: RootState) => state.donationRegistration
  );

  // State cho phân trang
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch data khi component được mount
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken"); // Lấy token từ localStorage
    if (accessToken) {
      dispatch(fetchDonationRegistrationsByUser(accessToken)); // Gọi action để fetch dữ liệu
    }
    console.log('donationRegistrations:', donationRegistrations);
  }, [dispatch]);

  // Hàm thay đổi trang
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Hàm thay đổi số lượng hàng mỗi trang
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Hiển thị khi đang loading
  if (loading) return <CircularProgress />;

  // Hiển thị lỗi nếu có
  if (error) return <div>{error}</div>;

  return (
    <>
      <HeaderComponent />
      <div className="container mx-auto my-20">
        <Typography variant="h4" gutterBottom align="center">
          Đơn của bạn
        </Typography>

        <Box 
          sx={{
            maxWidth: "90%", // Giới hạn chiều rộng của bảng
            margin: "0 auto", // Căn giữa theo chiều ngang
            padding: 2,
            borderRadius: 2,
            boxShadow: 3, // Thêm bóng đổ cho bảng
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Tên người yêu cầu</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Nhóm máu</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Loại máu</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Trạng thái</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Số điện thoại</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Thời gian hiến máu</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Địa điểm</TableCell> 
                  <TableCell sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Lưu ý</TableCell> 
                </TableRow>
              </TableHead>
              <TableBody>
                {donationRegistrations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((donation) => (
                  <TableRow key={donation._id}>
                    <TableCell>{donation.full_name}</TableCell>
                    <TableCell>{donation.blood_group_name}</TableCell>
                    <TableCell>{donationTypeVN[donation.donation_type as DonationType]}</TableCell> {/* Sử dụng donationTypeVN để chuyển đổi */}
                    <TableCell>{donation.status}</TableCell>
                    <TableCell>{donation.phone}</TableCell>
                    <TableCell>{new Date(donation.start_date_donation).toLocaleString()}</TableCell>
                    <TableCell>Phòng 203, Tầng 4, Nhà Văn Hóa Sinh Viên</TableCell> {/* Địa điểm cố định */}
                    <TableCell>Lưu ý đến đúng giờ và địa chỉ</TableCell> {/* Lưu ý cố định */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={donationRegistrations.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </div>
      <FooterComponent />
    </>
  );
}
