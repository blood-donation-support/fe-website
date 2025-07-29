const bloodComponentVN = (en: string) => {
	switch (en) {
		case "Whole Blood":
			return "Toàn phần";
		case "Red Blood Cells":
			return "Tế bào hồng cầu";
		case "Platelets":
			return "Tiểu cầu";
		case "Plasma":
			return "Huyết tương";
		case "White Blood Cells":
			return "Tế bào bạch cầu";
		case "Platelets - Plasma":
			return "Tiểu cầu + Huyết tương";
		case "Plasma - Red Blood Cells":
			return "Huyết tương + Hồng cầu";
		case "Platelets - Red Blood Cells":
			return "Tiểu cầu + Hồng cầu";
		default:
			return "Chưa cập nhật";
	}
};
export default bloodComponentVN;
