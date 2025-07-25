
const roleVN = (en: string): string => {
  switch (en) {
        case "Admin":
      return "Quản trị viên";
    case "Staff":
      return 'Nhân viên';
    case "Staff Warehouse":
      return 'Nhân viên kho';
      case "Customer":
      return "Khách hàng";
    case "Other":
      return 'Khác';
  }
};

export default roleVN;
