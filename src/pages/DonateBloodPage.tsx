import { useEffect, useState } from "react";


import Axios from "axios";
import { FooterComponent, FormComponent, HeaderComponent, HeroComponent, SideBySideComponent } from "@/components";
import donationService from "@/api/donationService";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/authStore";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { registerDonation, resetDonationStatus } from "@/redux/slices/donationRegistrationSlice";
import { FaBars, FaBell, FaPhone, FaUser } from "react-icons/fa";
import {motion} from "framer-motion";
import { Link } from "react-router-dom";

const DonateBloodPage = () => {
	const today = new Date().toISOString().slice(0, 10);
	const accessToken = useAuthStore((state) => state.accessToken)||"";
	const [statusForm,setStatusForm] = useState("Pending");
	const dispatch = useDispatch<AppDispatch>();
	const { loading, error, success } = useSelector(
		(state: RootState) => state.donationRegistration
	);
	const [formData, setFormData] = useState({
		blood_group_id: "",
		blood_component_id: "",
		start_date_donation:today, 
		status: "pending",
	});
	useEffect(() => {
		if (success) {
			toast.success("Đăng ký hiến máu thành công!");
			setStatusForm("Submited");
			console.log("Show toast success!");
			setTimeout(() => {
				dispatch(resetDonationStatus());
			}, 200);
		}
		if (error) {
			toast.error(error);
			setTimeout(() => {
				dispatch(resetDonationStatus());
			}, 200);
		}
	}, [success, error, dispatch]);
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		dispatch(registerDonation({ payload: formData, accessToken }));
		setFormData({
		blood_group_id: "",
		blood_component_id: "",
		start_date_donation: today,
		status: "pending",
		});
	};

	const DonateBloodPageDetails = {
		why_donate_blood: {
			subheadingText: "Hiến máu hôm nay",
			headingText: "Tại sao bạn nên hiến máu?",
			classHint: "side-col-image why-donate-blood",
			paraText: `Hiến máu là một hành động vô tư có sức mạnh cứu sống. Sau đây là một số lý do tại sao bạn nên cân nhắc hiến máu:
			\n― Bạn có thể cứu được tới ba mạng người chỉ bằng một lần hiến máu.
			― Máu luôn cần thiết trong những tình huống khẩn cấp như thiên tai và tai nạn.
			― Máu cần thiết cho những bệnh nhân trải qua phẫu thuật, điều trị ung thư và các thủ thuật y tế khác.
			― Máu không thể sản xuất được, nghĩa là nguồn máu duy nhất là từ sự hiến tặng của những người tình nguyện.
			― Hiến máu cũng có thể mang lại lợi ích cho sức khỏe của người hiến, chẳng hạn như giảm nguy cơ mắc bệnh tim và ung thư.`,
			imageUrl: "../../assets/blood-donation(1).jpg",
			buttonText: "Hiến máu ngay",
			buttonLink: "/donateBlood",
			buttonHave: true,
		},
		hero: {
			subheadingText: "Donate Blood",
			headingText: "Sẻ chia sự sống, trao gửi yêu thương.",
			classHint: "donate-blood-page-hero",
		}
	};

	const fields = [
		{
			key: "bg",
			name: "blood_group_id",
			placeholder: "blood_groups",
			required: true,
		},
		{
			key: "bc",
			name: "blood_component_id",
			placeholder: "blood_components",
			required: true,
		}
	];

	return (
		<>
			<section className="w-full h-screen relative">
			 
			<HeaderComponent /> 
			<HeroComponent {...DonateBloodPageDetails.hero} />
			<FormComponent
				fields={fields}
				heading={"Lựa chọn nhóm máu muốn hiến tặng"}
				buttonText={"Lên lịch đăng kí"}
				handleSubmit={handleSubmit}
				formData={formData}
				setFormData={setFormData}
				statusForm={statusForm}
			/>
			{/* <SideBySideComponent {...DonateBloodPageDetails.why_donate_blood} /> */}
			<FooterComponent />
			</section>
		</>
	);
};

export default DonateBloodPage;
