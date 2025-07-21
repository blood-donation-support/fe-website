
import { NavLink } from "react-router-dom";

const FooterComponent = () => {
	const exploreLinks = [
		{
			title: "Trang chủ",
			link: "/",
		},
		{
			title: "Hiến máu",
			link: "/donateBlood",
		},
		{
			title: "Yêu cầu máu",
			link: "/",
		},
		{
			title: "Donate Money",
			link: "https://www.facebook.com/dustin.tsan.181003",
		},
		{
			title: "Trợ giúp",
			link: "/",
		}
	];

	const contactLinks = [
		{
			title: "(+92) 899353935",
			link: "tel:+899353935",
		},
		{
			title: "help@BloodDonation.com",
			link: "mailto:help@BloodDonation.com",
		},
		{
			title: "Di An,Binh Duong",
			link: "https://maps.app.goo.gl/oLicVPMzHJ1XvgmS6",
		},
		{
			title: "Open 24/7",
			link: "/contact",
		},
	];

	return (
		<section className="flex flex-col justify-center items-center w-full mx-auto my-0 px-2.5 pt-[70px] pb-[40px] bg-dark bg-blue-500/90 rounded-t-[20px]">

			<div className="relative w-[min(100%_-_15px,1250px)]  mx-auto my-0 p-2.5 ">
				<div className="first-section-wrapper grid sm:grid-cols-[1.5fr_1fr_1fr] gap-10">
					<div className="flex flex-col footer-col first-col">
						<h2 className="not-italic font-bold text-[40px] leading-[55px] text-white">
							Donation<span className="text-[red]">Blood</span>
						</h2>
						<h3 className="not-italic font-normal text-[20px] leading-10 text-[#D9D9D9]">
							Bạn không cần phải là bác sĩ để cứu mạng người:
							 <br/>Chỉ cần hiến máu
						</h3>
					</div>
					<div className="footer-col second-col">
						<h3 className="not-italic font-bold text-[26px] leading-[27px] tracking-[0.05em] uppercase text-white mb-3">
							Khám phá
						</h3>
						<ul className="flex flex-col gap-2">
							{exploreLinks.map((link, index) => (
								<li key={index}>
									<NavLink
										className="not-italic font-medium text-[18px] leading-[34px] text-white"
										to={link.link}
									>
										{link.title}
									</NavLink>
								</li>
							))}
						</ul>
					</div>
					<div className="footer-col third-col">
						<h3 className="not-italic font-bold text-[26px] leading-[27px] tracking-[0.05em] uppercase text-white mb-3">
							Liên hệ
						</h3>
						<ul className="flex flex-col gap-2">
							{contactLinks.map((link, index) => (
								<li key={index}>
									<NavLink
										className="not-italic font-medium text-[18px] leading-[34px] text-white"
										to={link.link}
									>
										{link.title}
									</NavLink>
								</li>
							))}
						</ul>
					</div>
				</div>
				<div className="footer-col fourth-col text-center mt-10 border-t-[1px] border-off_white/[.2] pt-6">
					<h3 className="not-italic text-center font-regular text-[18px] leading-[34px] text-[#D9D9D9] ">
						©️ 2025 Donation Blood
					</h3>
				</div>
			</div>
		</section>
	);
};

export default FooterComponent;
