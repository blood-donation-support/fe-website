
const genderVN = (en: string): string => {
  switch (en) {
    case "Male":
      return 'Nam';
    case "Female":
      return 'Nữ';
    case "Other":
      return 'Khác';
    default:
      return en;
  }
};

export default genderVN;
