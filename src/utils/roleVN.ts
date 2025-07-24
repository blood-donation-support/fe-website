const roleVN = (en: string): string => {
  switch (en) {
    case "Admin":
      return "Quản trị viên";
    case "Staff":
      return "Nhân viên";
    case "Customer":
      return "Khách hàng";
    default:
      return en;
  }
};

export default roleVN;
