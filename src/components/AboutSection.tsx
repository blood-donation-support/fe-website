import { Link } from "react-router-dom";
import GroupedHeadingComponent from "./commons/grouped-heading-component";
import ParaComponent from "./commons/para-component";
import SectionMotionWrapper from "./commons/SectionMotionWrapper";
import { motion } from "framer-motion";

export default function AboutSection() {
	return (
		<SectionMotionWrapper className="w-full h-full relative items-stretch snap-start overflow-hidden">
			{(inView) => (
				<>
					<div className="flex relative w-full h-full">
						<motion.div
							initial={{
								opacity: 0.5,
								x: 0,
								width: "40vw",
							}}
							animate={
								inView
									? { opacity: 1, x: "-5vw", width: "40vw" }
									: { opacity: 0.5, x: "3vw", width: "43vw" }
							}
							transition={{ duration: 1 }}
							className="flex flex-col justify-between pl-[2vw] pr-[6vw] py-[5vh] bg-blue-600 text-white z-20 rounded-r-[4vw] h-full"
						>
							<div className="mt-[7vh] pl-[7vw] pr-[4vw]">
								<h2 className="text-[2.3vw] font-bold mb-2 leading-snug">
									Hiến máu an toàn <br />– Không lo ngại
								</h2>
								<p className="text-[1.1vw] opacity-80 leading-snug">
									<span className="font-semibold">
										Quy trình hiến máu hiện đại
									</span>
									, thiết bị tiên tiến và đội ngũ chuyên nghiệp – đảm bảo an toàn tuyệt đối cho bạn. Mỗi giọt máu cho đi là một hy vọng được trao gửi.
								</p>
							</div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, x: "3vw" }}
							animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: "3vw" }}
							transition={{ duration: 0.8, delay: 0.4 }}
							className="absolute right-0 top-0 h-full w-[44vw] flex flex-col justify-center pl-[5vw] pr-[7vw] bg-white z-10"
						>
							<div className="pt-[5vh] pb-[2vh] flex flex-col justify-center">
								<GroupedHeadingComponent
									subheadingText={"Hiến máu hôm nay"}
									headingText={"Tại sao bạn nên hiến máu?"}
									boxWidth="large"
								/>
								<ParaComponent
									innerText={
										"Hiến máu là một hành động vô tư có sức mạnh cứu sống. Bạn có thể cứu tới ba mạng người chỉ bằng một lần hiến máu. Máu luôn cần thiết trong tình huống khẩn cấp, phẫu thuật, điều trị... Và máu chỉ có thể đến từ những người tình nguyện."
									}
									size="small"
								/>
							</div>
							<button className="w-fit px-[2vw] py-[1vh] bg-gradient-to-r from-blue-500 to-blue-400 rounded-full text-white font-bold text-[1.2vw] shadow hover:scale-105 transition mb-[1.5vh]">
								<Link to="/donateBlood">Hiến máu</Link>
							</button>
							<div className="flex items-center gap-[2vw]">
								<div className="flex flex-col items-center">
									<span className="text-[1.7vw] font-bold text-blue-500">10+</span>
									<span className="text-[0.9vw] text-gray-600">năm kinh nghiệm</span>
								</div>
								<div className="flex flex-col items-center">
									<span className="text-[1.7vw] font-bold text-blue-500">20+</span>
									<span className="text-[0.9vw] text-gray-600">bác sĩ chất lượng</span>
								</div>
								<div className="flex flex-col items-center">
									<span className="text-[1.7vw] font-bold text-blue-500">100%</span>
									<span className="text-[0.9vw] text-gray-600">chẩn đoán kỹ thuật số</span>
								</div>
							</div>
						</motion.div>
					</div>
					<motion.div
						initial={{ opacity: 1, scale: 0.8, y: 0, x: 0 }}
						animate={
							inView
								? { opacity: 1, scale: 0.6, y: "-60vh", x: "-10vw" }
								: { opacity: 1, scale: 0.8, y: "2vh", x: "-10vw" }
						}
						transition={{ duration: 1 }}
						className="absolute top-1  w-[90vw] h-[300vh] -translate-x-1/2 -translate-y-1/2 z-30"
					>
						<div className="relative w-full h-full flex items-center justify-center">
							<img
								src="https://purepng.com/public/uploads/large/purepng.com-nursedoctorsdoctors-and-nursesclinicianmedical-practitionernotepadfemalenurse-1421526857377p8jeg.png"
								alt="Doctor"
								className="w-full h-full object-cover"
								style={{ zIndex: 2 }}
							/>
						</div>
					</motion.div>
				</>
			)}
		</SectionMotionWrapper>
	);
}
