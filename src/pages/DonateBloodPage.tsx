import { useEffect, useState } from "react";
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
      paraText: `Hiến máu là một hành động vô tư có sức mạnh cứu sống. ...`,
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
    key: "bt",
    name: "donation_type",
    placeholder: "donation_type",
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
