import React from 'react';
import { Stack, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { Dot } from 'lucide-react';

// Dữ liệu mẫu
interface RowData {
  tracking_no: number;
  name: string;
  blood_type: string; // Thay 'fat' bằng 'blood_type'
  status: number; // Thay 'carbs' bằng 'status'
  amount_donated: number; // Thay 'protein' bằng 'amount_donated'
}

function createData(tracking_no: number, name: string, blood_type: string, status: number, amount_donated: number): RowData {
  return { tracking_no, name, blood_type, status, amount_donated };
}

const rows: RowData[] = [
  createData(84564564, 'John Doe', 'A+', 1, 500),  // Sample data
  createData(98764564, 'Jane Smith', 'B+', 0, 450),
  createData(98756325, 'Paul Wilson', 'AB-', 1, 600),
  createData(98652366, 'Mary Johnson', 'O+', 2, 400),
  createData(13286564, 'Lucas Brown', 'A-', 0, 300),
  createData(86739658, 'Sarah White', 'B-', 1, 550),
  createData(13256498, 'David Green', 'O-', 2, 350),
  createData(98753263, 'Michael Blue', 'AB+', 0, 600),
  createData(98753275, 'Sophia Black', 'A+', 1, 700),
  createData(98753291, 'Daniel Red', 'B+', 1, 650)
];

type Order = 'asc' | 'desc';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number): T[] {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// Cập nhật lại với thông tin hiến máu
const headCells: { id: keyof RowData; align: 'left' | 'right' | 'center' | 'justify'; disablePadding: boolean; label: string }[] = [
  { id: 'tracking_no', align: 'left', disablePadding: false, label: 'Mã id' },
  { id: 'name', align: 'left', disablePadding: true, label: 'Tên người hiến' },
  { id: 'blood_type', align: 'left', disablePadding: false, label: 'Nhóm máu' },
  { id: 'status', align: 'left', disablePadding: false, label: 'Trạng thái' },
  { id: 'amount_donated', align: 'right', disablePadding: false, label: 'Số lượng hiến (ml)' }
];

interface OrderTableHeadProps {
  order: Order;
  orderBy: keyof RowData;
}

function OrderTableHead({ order, orderBy }: OrderTableHeadProps) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align} padding={headCell.disablePadding ? 'none' : 'normal'} sortDirection={orderBy === headCell.id ? order : false}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface OrderStatusProps {
  status: number;
}

function OrderStatus({ status }: OrderStatusProps) {
  let color: 'warning' | 'success' | 'error' | 'primary';
  let title: string;

  switch (status) {
    case 0:
      color = 'warning';
      title = 'Đang xử lý';  // Cập nhật thông báo là "Đang xử lý" thay cho "Pending"
      break;
    case 1:
      color = 'success';
      title = 'Đã chấp nhận';  // Cập nhật thông báo là "Đã chấp nhận" thay cho "Accepted"
      break;
    case 2:
      color = 'error';
      title = 'Đã từ chối';  // Cập nhật thông báo là "Đã từ chối" thay cho "Rejected"
      break;
    default:
      color = 'primary';
      title = 'Chưa xác định'; // Cập nhật thông báo là "Chưa xác định" nếu không có trạng thái hợp lệ
  }

  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}


// ==============================|| BLOOD DONATION TABLE ||============================== //

const BloodDonationTable: React.FC = () => {
  const order: Order = 'asc';
  const orderBy: keyof RowData = 'tracking_no';

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <OrderTableHead order={order} orderBy={orderBy} />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow hover role="checkbox" sx={{ '&:last-child td, &:last-child th': { border: 0 } }} tabIndex={-1} key={row.tracking_no}>
                  <TableCell component="th" id={labelId} scope="row">
                    <Link color="secondary">{row.tracking_no}</Link>
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.blood_type}</TableCell>
                  <TableCell>
                    <OrderStatus status={row.status} />
                  </TableCell>
                  <TableCell align="right">
                    <NumericFormat value={row.amount_donated} displayType="text" thousandSeparator prefix="ml " />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BloodDonationTable;
