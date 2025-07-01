import GroupedHeadingComponent from "./commons/grouped-heading-component";
import ParaComponent from "./commons/para-component";
import SectionMotionWrapper from "./commons/SectionMotionWrapper";
import { motion } from "framer-motion";
export default function BlogSection() {
	return (
		<SectionMotionWrapper className="w-full h-screen relative  items-stretch snap-start overflow-hidden">
			{(inView) => (
				<>
					<div className="flex relative w-full h-full ">
						<motion.div
							initial={{
								opacity: 0.5,
								x: 0,
								width: "70%",
							}}
							animate={
								inView
									? { opacity: 1, x: -120, width: "44%" }
									: { opacity: 0.5, x: 60, width: "50%" }
							}
							transition={{ duration: 1 }}
							className="flex flex-col justify-between pl-2 pr-64 py-12 bg-blue-500/90 text-white z-20 rounded-r-[56px] h-full"
						>
							<div className="mt-44 pl-56 pr-40">
								<h2 className="text-4xl font-bold mb-2 ">
									Hiến máu an toàn <br />– Không lo ngại
								</h2>
								<p className="text-lg opacity-80">
									<span className="font-semibold">
										Quy trình hiến máu hiện đại
									</span>
									, thiết bị tiên tiến và đội ngũ chuyên nghiệp – đảm bảo an
									toàn tuyệt đối cho bạn. Mỗi giọt máu cho đi là một hy vọng
									được trao gửi.
								</p>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 60 }}
							animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
							transition={{ duration: 0.8, delay: 0.4 }}
							className="absolute right-0 top-0 h-full w-1/2 flex flex-col justify-center pl-24 pr-[15rem] bg-white z-10"
						>
							<div className="content-wrapper  pt-[10rem] pb-[2rem] flex flex-col justify-center ">
								<GroupedHeadingComponent
									subheadingText={"Hiến máu hôm nay"}
									headingText={"Tại sao bạn nên hiến máu?"}
									boxWidth="large"
								/>
								<ParaComponent
									innerText={
										"Hiến máu là một hành động vô tư có sức mạnh cứu sống. Sau đây là một số lý do tại sao bạn nên cân nhắc hiến máu: ― Bạn có thể cứu được tới ba mạng người chỉ bằng một lần hiến máu. ― Máu luôn cần thiết trong những tình huống khẩn cấp như thiên tai và tai nạn. ― Máu cần thiết cho những bệnh nhân trải qua phẫu thuật, điều trị ung thư và các thủ thuật y tế khác. ― Máu không thể sản xuất được, nghĩa là nguồn máu duy nhất là từ sự hiến tặng của những người tình nguyện. ― Hiến máu cũng có thể mang lại lợi ích cho sức khỏe của người hiến, chẳng hạn như giảm nguy cơ mắc bệnh tim và ung thư."
									}
									size="large"
								/>
							</div>
							<button className="w-fit px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full text-white font-bold text-lg shadow hover:scale-105 transition mb-8">
								Hiến máu
							</button>
							<div className="flex items-center gap-10">
								<div className="flex flex-col items-center">
									<span className="text-2xl font-bold text-blue-500">10+</span>
									<span className="text-sm text-gray-600">năm kinh nghiệm</span>
								</div>
								<div className="flex flex-col items-center">
									<span className="text-2xl font-bold text-blue-500">20+</span>
									<span className="text-sm text-gray-600">
										bác sĩ chất lượng
									</span>
								</div>
								<div className="flex flex-col items-center">
									<span className="text-2xl font-bold text-blue-500">100%</span>
									<span className="text-sm text-gray-600">
										chẩn đoán kỹ thuật số
									</span>
								</div>
							</div>
						</motion.div>
					</div>
					<motion.div
						initial={{ opacity: 1, scale: 0.5, y: 0, x: 0 }}
						animate={
							inView
								? { opacity: 1, scale: 1, y: 0, x: -225 }
								: { opacity: 1, scale: 0.9, y: 60, x: -300 }
						}
						transition={{ duration: 1 }}
						className="absolute top-96 left-[30rem] w-[70rem] h-[1000rem] -translate-x-1/2 origin-bottom -translate-y-1/2 z-30"
					>
						<div className="relative w-[60rem] h-[70rem] flex items-center justify-center">
							<img
								src="https://purepng.com/public/uploads/large/purepng.com-nursedoctorsdoctors-and-nursesclinicianmedical-practitionernotepadfemalenurse-1421526857377p8jeg.png"
								alt="Doctor"
								className="w-[120rem] h-[120rem] object-cover "
								style={{ zIndex: 2 }}
							/>
						</div>
					</motion.div>
				</>
			)}
		</SectionMotionWrapper>
	);
}
