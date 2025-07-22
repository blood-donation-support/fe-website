
import { Link } from "react-router-dom";
import HeaderComponent from "./commons/header-component";
import { motion } from "framer-motion";
 
const HomePageSection = () => {
    return ( 
        <section className="w-full h-screen relative  items-stretch snap-start overflow-hidden">
                        
        <HeaderComponent isHomepage ={true}/>
				{/* Trái 50% */}
	<div className="flex w-full h-full ">
		<motion.div
		initial={{ opacity: 0, x: -60 }}
		animate={{ opacity: 1, x: 0 }}
		transition={{ duration: 0.8, delay: 0.4 }}
		className="w-1/2 flex flex-col justify-center pl-24 pr-6 bg-white z-10"
		>
			<h1 className="text-7xl font-extrabold leading-none text-gray-900 mb-8">
			Donate<br />Blood
			</h1>
			<p className="text-lg text-gray-700 mb-6">
			<span className="font-semibold">Hiến máu</span> hôm nay<br />
			<span className="font-semibold">- Sức khỏe </span> ngày mai.
			</p>
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
				<span className="text-sm text-gray-600">bác sĩ chất lượng</span>
			</div>
			{/* <div className="flex flex-col items-center">
				<span className="text-xl font-bold text-blue-500">100%</span>
				<span className="text-sm text-gray-600">chẩn đoán kỹ thuật số</span>
			</div> */}
			</div>
		</motion.div>

		{/* Phải 50% */}
		<motion.div
		initial={{ opacity: 0, x: 60 }}
		animate={{ opacity: 1, x: 0 }}
		transition={{ duration: 0.8, delay: 1.5 }}
		className="w-1/2 flex flex-col justify-between pl-6 pr-24 py-12 bg-blue-500/90 text-white z-10 rounded-l-[56px] h-full"
		>
			<div className="mt-32 pl-80 pr-40">
			<h2 className="text-4xl font-bold mb-2 ">Hiến máu an toàn <br />– Không lo ngại</h2>
			<p className="text-lg opacity-80">
				<span className="font-semibold">Quy trình hiến máu hiện đại</span>, thiết bị tiên tiến và đội ngũ chuyên nghiệp – đảm bảo an toàn tuyệt đối cho bạn. Mỗi giọt máu cho đi là một hy vọng được trao gửi.
			</p>
			</div>
			{/* Góc dưới: Feedback */}
			<div className="flex items-end justify-end mt-auto">
			<div className="flex items-center gap-3">
				<span className="text-xs opacity-70">We appreciate every feedback,<br />because it inspires us to <span className="font-semibold">become better.</span></span>
				<img src="https://randomuser.me/api/portraits/women/65.jpg" className="w-10 h-10 rounded-full border-2 border-white -ml-4" />
				<img src="https://randomuser.me/api/portraits/men/44.jpg" className="w-10 h-10 rounded-full border-2 border-white -ml-4" />
				<img src="https://randomuser.me/api/portraits/women/35.jpg" className="w-10 h-10 rounded-full border-2 border-white -ml-4" />
			</div>
			</div>

		
		</motion.div>
	</div>
	{/* Ảnh bác sĩ nằm đè giữa 2 phần */}
	<motion.div
		initial={{ opacity: 0.3,scale:0.5, y: 100, x: 0 }}
		animate={{ opacity: 1,scale:1, y: 0, x: 0 }}
		transition={{ duration: 1, delay: 0.8 }}
		className="absolute top-1 left-1/4 w-[80rem] h-[95rem] -translate-x-1/2 origin-bottom -translate-y-1/2 z-20"
		>
		<div className="relative w-[80rem] h-[95rem] flex items-center justify-center">
			<img
				src="https://www.secondmedic.com/app/asset/consult/image/apollo-banner-doctor.webp"
				alt="Doctor"
				className="w-[80rem] h-[95rem] object-cover "

				style={{ zIndex: 2 }}
				/>
		</div>
	</motion.div>
				</section>
     );
}
 
export default HomePageSection;