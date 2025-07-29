import { useEffect, useRef, useState } from "react";
import { WrapperSection } from "@/components";
import DateInputVi from "@/components/datePicker";
import { donationTypeList } from "@/constants/donationType";
import type { BloodComponent, BloodGroup } from "@/api/bloodService";
import { bloodService } from "@/api/bloodService";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { fetchUserProfile } from "@/redux/slices/userSlice";

interface Field {
	key: string;
	name: string;
	placeholder: string;
	required?: boolean;
}

interface FormComponentProps<T> {
	fields: Field[];
	heading: string;
	buttonText: string;
	formData: T;
	setFormData: React.Dispatch<React.SetStateAction<T>>;
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	statusForm: string;
	dateValue: Date | null;
	setDateValue: (date: Date | null) => void;
}

function FormComponent<T extends Record<string, any>>({
	fields,
	heading,
	buttonText,
	formData,
	setFormData,
	handleSubmit,
	statusForm,
	dateValue,
	setDateValue,
}: FormComponentProps<T>) {
	const [bloodGroups, setBloodGroups] = useState<BloodGroup[]>([]);
	const formWrapperRef = useRef<HTMLDivElement>(null);
	const dispatch = useDispatch<AppDispatch>();
	const profile = useSelector((state: RootState) => state.users.profile);
	useEffect(() => {
		if (!profile) dispatch(fetchUserProfile());
	}, [dispatch, profile]);
	useEffect(() => {
		const fetchBloodGroups = async () => {
			const bloodGrofetch = await bloodService.getBloodGroups();
			setBloodGroups(bloodGrofetch);
		};
		fetchBloodGroups();
	}, []);
	useEffect(() => {
		if (profile?.blood_group_id && bloodGroups.length) {
			setFormData((prev) => ({
				...prev,
				[fields[0].name]:
					(prev as Record<string, any>)[fields[0].name] ||
					profile.blood_group_id, // chỉ set nếu chưa có
			}));
		}
	}, [profile, bloodGroups]);
	// Fade-up effect
	useEffect(() => {
		const wrapper = formWrapperRef.current;
		if (wrapper) {
			setTimeout(() => {
				wrapper.style.transform = "translateY(0)";
				wrapper.style.opacity = "1";
			}, 500);
		}
	}, []);

	const inputStyles =
		"w-full p-4 border-none bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 text-base";

	return (
		<WrapperSection>
			<div
				ref={formWrapperRef}
				className={`
          w-full relative p-6 py-10 lg:p-20 lg:pb-10 rounded-xl z-[25] overflow-visible
          -mt-[10em] form-wrapper-custom
        `}
				style={{
					backgroundColor: "rgb(37,99,235)", // blue-600
					backgroundImage: `url("../../assets/black texturized hemocell blood bank.jpg")`,
					backgroundPosition: "center",
					backgroundSize: "cover",
					backgroundRepeat: "no-repeat",
				}}
			>
				<h3 className="not-italic text-center font-medium text-[16px] sm:text-[25px] leading-[34px] tracking-[0.1em] sm:tracking-[0.3em] uppercase text-white">
					{heading}
				</h3>
				{statusForm === "Submited" ? (
					<p className="text-center text-white text-sm sm:text-base mt-12">
						Cảm ơn bạn đã tương tác với DonationBlood. <br />
						Chúng tôi sẽ thông báo lịch cho bạn sớm nhất có thể.
						<Link to="/profile/blood-history">
							<span className="hover:text-blue-900 hover:underline">
								Xem lịch sử hiến máu của bạn
							</span>
						</Link>
					</p>
				) : (
					<form
						className="
              grid grid-cols-1 md:grid-cols-3 gap-5 w-full relative py-8 sm:p-10 rounded-xl z-[25] overflow-visible
              contact-form
            "
						onSubmit={handleSubmit}
					>
						{/* Select máu */}
						<div className="col-span-1">
							<select
								key={fields[0].key}
								name={fields[0].name}
								className={inputStyles}
								value={(formData[fields[0].name as keyof T] as string) || ""}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										[fields[0].name]: e.target.value,
									}))
								}
								required={fields[0].required}
							>
								<option value="">Chọn nhóm máu của bạn</option>
								{bloodGroups.map((bg) => (
									<option key={bg._id} value={bg._id}>
										{bg.name}
									</option>
								))}
							</select>
						</div>
						{/* Select blood type (DonationType) */}
						<div className="col-span-1">
							<select
								key={fields[1].key}
								name={fields[1].name}
								className={inputStyles}
								value={(formData[fields[1].name as keyof T] as string) || ""}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										[fields[1].name]: e.target.value,
									}))
								}
								required={fields[1].required}
							>
								<option value="">Chọn loại hiến máu</option>
								{donationTypeList.map(([value, label]) => (
									<option key={value} value={value}>
										{label}
									</option>
								))}
							</select>
						</div>
						{/* Datepicker */}
						<div className="col-span-1 flex items-center">
							<DateInputVi
								value={dateValue}
								onChange={setDateValue}
								disabled={statusForm === "Submited"}
							/>
						</div>
						{/* Button dưới cùng full width */}
						<div className="col-span-1 md:col-span-3 mt-6 flex justify-center">
							<button
								type="submit"
								name="submit"
								className="rounded-md border border-white hover:border-red-900 text-dark bg-white hover:bg-red-900 hover:text-white transition px-10 py-4 text-base w-full max-w-xs font-bold cursor-pointer"
							>
								{buttonText}
							</button>
						</div>
					</form>
				)}
			</div>
		</WrapperSection>
	);
}

export default FormComponent;
