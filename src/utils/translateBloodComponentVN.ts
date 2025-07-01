const bloodComponentVN = (en: string) => {
  switch (en) {
    case "Red Blood Cells":
      return "Tế bào hồng cầu";
    case "Platelets":
      return "Tiểu cầu";
    case "Plasma":
      return "Huyết tương";
    case "White Blood Cells":
      return "Tế bào bạch cầu";
    default:
      return en;
  }
};
export default bloodComponentVN;