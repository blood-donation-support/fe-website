import { useEffect, useState } from "react";
import {
	FooterComponent,
	FormComponent,
	HeaderComponent,
	HeroComponent,
	SideBySideComponent,
} from "@/components";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/authStore";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";

import {
	registerDonationThunk,
	resetDonationStatus,
} from "@/redux/slices/donationRegistrationSlice"; // Redux action
import { fetchUserProfile } from "@/redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const DonateBloodPage = () => {
	const profile = useSelector((state: RootState) => state.users.profile);
	const navigate = useNavigate();
	const today = new Date();
	const accessToken = useAuthStore((state) => state.accessToken) || "";
	const [statusForm, setStatusForm] = useState("Pending");
	const dispatch = useDispatch<AppDispatch>();
	const { loading, error, success } = useSelector(
		(state: RootState) => state.donationRegistration,
	);
	const [dateValue, setDateValue] = useState<Date | null>(today);
	const [formData, setFormData] = useState({
		blood_group_id: "",
		donation_type: "",
		start_date_donation: today.toISOString(),
		answers: [] as { question_id: string; answer: boolean }[],
	});
	useEffect(() => {
		if (!profile) dispatch(fetchUserProfile());
	}, [dispatch, profile]);
	useEffect(() => {
		if (success) {
			setStatusForm("Submited");
			toast.success("Đăng ký hiến máu thành công!");
			dispatch(resetDonationStatus());
		}
		if (error) {
			toast.error(error);
			dispatch(resetDonationStatus());
		}
	}, [success, error, dispatch]);

	// Update formData when date changes
	useEffect(() => {
		if (dateValue) {
			setFormData((prev) => ({
				...prev,
				start_date_donation: dateValue.toISOString(),
			}));
		}
	}, [dateValue]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!profile) {
			toast.warn("Bạn phải đăng nhập để đăng ký hiến máu!");
			navigate("/login");
			return;
		}
		dispatch(registerDonationThunk({ payload: formData, accessToken })); // Dispatch Redux action
	};

	const DonateBloodPageDetails = {
		why_donate_blood: {
			subheadingText: "Hiến máu hôm nay",
			headingText: "Tại sao bạn nên hiến máu?",
			classHint: "side-col-image why-donate-blood",
			paraText: `Hiến máu là một hành động vô tư có sức mạnh cứu sống. Bạn có thể cứu tới ba mạng người chỉ bằng một lần hiến máu. Máu luôn cần thiết trong tình huống khẩn cấp, phẫu thuật, điều trị... Và máu chỉ có thể đến từ những người tình nguyện.`,
			imageUrl: "../../assets/blood-donation(1).jpg",
			buttonText: "Hiến máu ngay",
			buttonLink: "/donateBlood",
			buttonHave: true,
		},
		hero: {
			subheadingText: "Donate Blood",
			headingText: "Sẻ chia sự sống, trao gửi yêu thương.",
			classHint: "donate-blood-page-hero",
		},
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
		},
	];

	return (
		<>
			<HeaderComponent />
			<HeroComponent {...DonateBloodPageDetails.hero} />
			<FormComponent
				fields={fields}
				heading={"Đăng kí thông tin hiến máu"}
				buttonText={"Lên lịch đăng kí"}
				handleSubmit={handleSubmit}
				formData={formData}
				setFormData={setFormData}
				statusForm={statusForm}
				dateValue={dateValue}
				setDateValue={setDateValue}
			/>
			<SideBySideComponent {...DonateBloodPageDetails.why_donate_blood} />
			<FooterComponent />
		</>
	);
};

export default DonateBloodPage;
