
const roleVN = (en: string): string => {
  switch (en) {
    case "Staff":
      return 'Nhân viên';
    case "Staff Warehouse":
      return 'Nhân viên kho';
    case "Other":
      return 'Khác';
    default:
      return en;
  }
};

export default roleVN;
