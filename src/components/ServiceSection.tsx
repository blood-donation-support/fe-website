import SectionMotionWrapper from "./commons/SectionMotionWrapper";
import { motion } from "framer-motion";
import ServiceCard from "./ServiceCard";
import SloganCard from "./SloganCard";
const serviceIcons = {
  bloodDonation: (
    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21C12 21 19 13.657 19 9.5C19 6.462 16.5 4 13.5 4C11.74 4 10.21 4.95 9.42 6.34C8.62 4.95 7.09 4 5.33 4C2.3 4 0 6.46 0 9.5C0 13.657 7 21 7 21H12Z" />
    </svg>
  ),
  emergencyReceive: (
    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C7 2 3 6 3 11C3 17 12 22 12 22C12 22 21 17 21 11C21 6 17 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  healthCheck: (
    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  bloodStorage: (
    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 6V4a4 4 0 00-8 0v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  communityConnect: (
    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" stroke="currentColor" strokeWidth="2" />
    </svg>
    ),
};
const serviceData = {
    serviceCardData : [
        {
        number: "01",
        title: "Hiến máu tình nguyện",
        description: "Tham gia hiến máu nhân đạo, mỗi giọt máu bạn trao đi là một hy vọng sống cho người khác.",
        links: [
            { label: "Đăng ký hiến máu", href: "/donateBlood" },
            { label: "Tìm hiểu", href: "#" },
        ],
        icon: serviceIcons.bloodDonation,
        },
        {
        number: "02",
        title: "Nhận máu cấp cứu",
        description: "Hỗ trợ tiếp nhận máu cho người bệnh trong tình trạng nguy cấp, đảm bảo nhanh chóng và an toàn.",
        links: [
            { label: "Liên hệ nhận máu", href: "#" },
            { label: "Hỗ trợ 24/7", href: "#" },
        ],
        icon: serviceIcons.emergencyReceive,
        },
        {
        number: "03",
        title: "Tư vấn & kiểm tra sức khỏe",
        description: "Tư vấn trước và sau khi hiến máu, kiểm tra miễn phí sức khỏe, đảm bảo an toàn cho người hiến.",
        links: [
            { label: "Tư vấn miễn phí", href: "/donateBlood" },
            { label: "Chi tiết", href: "#" },
        ],
        icon: serviceIcons.healthCheck,
        },
        {
        number: "04",
        title: "Lưu trữ và quản lý máu",
        description: "Đảm bảo lưu trữ máu an toàn, quản lý hiệu quả để phục vụ kịp thời nhu cầu cấp cứu.",
        links: [
            { label: "Chi tiết", href: "/donateBlood"},
            { label: "Hỗ trợ", href: "#" },
        ],
        icon: serviceIcons.bloodStorage,
        },
        {
        number: "05",
        title: "Kết nối cộng đồng",
        description: "Xây dựng mạng lưới kết nối giữa những người hiến máu và bệnh nhân cần máu.",
        links: [
            { label: "Tham gia cộng đồng", href: "/donateBlood" },
            { label: "Xem hoạt động", href: "#" },
        ],
        icon: serviceIcons.communityConnect,
        }]
    ,
    sloganData: {
        title: "Một giọt máu cho đi – Một cuộc đời ở lại",
        description: "Đồng hành cùng hàng ngàn người trao gửi hy vọng và sự sống qua từng lần hiến máu."
    }}
;
export const ServiceSection = () => {
  return (
    <SectionMotionWrapper className="w-full h-screen flex flex-col items-center justify-start bg-blue-50 snap-start">
        {(inview)=>(
            <>
            <h2 className="text-2xl font-bold mt-4 mb-10 text-gray-800">Dịch vụ Hiến máu – Nhận máu</h2>
            <div className="grid grid-cols-4 grid-rows-2 gap-6 w-5/6 h-[90vh]">
              {serviceData.serviceCardData.map((card, idx) => (
                  <ServiceCard key={idx} {...card} inview={inview} />
              ))}
              <SloganCard title={serviceData.sloganData.title} description={serviceData.sloganData.description}/>
              <motion.div
              initial={{ opacity: 1,scale:1, y: -150, x: 0, }}
              animate={inview?{ opacity: 1,scale:1, y: 0, x: 0,height:'93%' }:{ opacity: 1,scale:1, y: -150, x: 0, }}
              transition={{ duration: 1, delay: 0 }}
              className="row-span-2 col-span-2 bg-white rounded-3xl shadow-md flex items-center justify-center overflow-hidden h-[31rem]">
                  <img
                      src="src/assets/blood-donation(5).jpg"
                      alt="Hiến máu – Lan tỏa yêu thương"
                      className="w-full h-full object-cover"
                      />
              </motion.div>
            </div>
            </>
        )}
	</SectionMotionWrapper>
  );
}