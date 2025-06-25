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
			<header
			
			className="w-full px-8 pb-10 pt-5 flex items-center justify-between bg-white/100 transition absolute top-0 left-0 z-20 "
			>
			{/* Logo và menu */}
			<div className="flex items-center gap-20">
				<div className="flex items-center gap-2">
				<img src="/logo.png" alt="Donate Blood" className="w-8 h-8 rounded-full" />
				<span className="font-bold text-2xl text-blue-600">Donate Blood</span>
				</div>
				<button className="md:hidden p-2 rounded-full hover:bg-gray-200">
				<FaBars size={20} />
				</button>
				<nav className="hidden md:flex items-center gap-3 ml-4">
				{["Chúng tôi", "Hiến máu", "Nhận máu", "Hỗ trợ"].map((item) => (
					<Link to='/donateBlood'
					key={item}
					className="px-6 py-2 text-lg bg-white rounded-full border border-gray-200 shadow-sm font-medium text-gray-700 hover:bg-blue-50 transition"
					>
					{item}
					</Link>
				))}
				</nav>
			</div>
			<div className="flex items-center gap-4">
				<div className="hidden md:block text-2xl text-gray-500 mr-4 bg-neutral-900 rounded-full px-6 py-3">
				<span className="inline-block align-middle mr-1">
					<svg width="14" height="14" fill="none" viewBox="0 0 24 24">
					<circle cx="12" cy="10" r="6" stroke="#7C8DB0" strokeWidth="2" />
					<path d="M12 16v4" stroke="#7C8DB0" strokeWidth="2" strokeLinecap="round" />
					</svg>
				</span>
				Nhà văn hóa sinh viên,Q9
				</div>
				<div className="flex gap-2">
				<button className="w-14 h-14 flex items-center justify-center rounded-full bg-black text-white hover:bg-blue-600 transition">
					<FaPhone size={16} />
				</button>
				<button className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 hover:bg-blue-600 hover:text-white transition">
					<FaBell size={16} />
				</button>
				<button className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 hover:bg-blue-600 hover:text-white transition">
					<FaUser size={16} />
				</button>
				</div>
			</div>
        </header>
			{/* <HeaderComponent /> */}
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
			<SideBySideComponent {...DonateBloodPageDetails.why_donate_blood} />
			<FooterComponent />
			</section>
		</>
	);
};

export default DonateBloodPage;
