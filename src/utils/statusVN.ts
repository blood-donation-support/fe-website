const statusVN = (en: string): string => {
  switch (en) {
    case "Pending":
      return "Đang chờ";
    case "Selected":
      return "Đã chọn";
    case "Canceled":
      return "Đã hủy";
    case "Matched":
      return "Đã khớp";
    case "Approved":
      return "Đã duyệt";
    case "Rejected":
      return "Đã từ chối";
    case "Available":
      return "Có sẵn";
    case "Reserved":
      return "Đã đặt trước";
    case "Used":
      return "Đã sử dụng";
    case "Expired":
      return "Đã hết hạn";
    case "Damaged":
      return "Bị hư";
      case "Checked In":
      return "Đã Checkin";
    default:
      return "Chưa cập nhật";
  }
};

export default statusVN;
