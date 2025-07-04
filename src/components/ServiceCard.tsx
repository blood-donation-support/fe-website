import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  number: string;
  title: string;
  description: string;
  links: { label: string; href: string }[];
  icon: JSX.Element;
  inview: boolean;
}

export default function ServiceCard({ number, title, description, links, icon, inview }: ServiceCardProps) {
  return (
    <motion.div
        initial={{ opacity: 1,scale:1, y: -150, x: 0 ,height:'60%'}}
        animate={inview?{ opacity: 1,scale:1, y: 0, x: 0 ,height:'100%' }:{ opacity: 1,scale:1, y: -150, x: 0,height:'60%' }}
        transition={{ duration: 1, delay: 0 }}
            className="relative bg-white rounded-3xl p-8 shadow-md flex flex-col border border-gray-100 min-h-[18rem] overflow-hidden"
        >
            <motion.span 
            initial={{ opacity: 1,scale:1, y: 40, x: 0 }}
            animate={inview?{ opacity: 1,scale:1, y: 0, x: 0 }:{ opacity: 1,scale:1, y: 40, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute z-0 left-8 top-6 text-[3.8rem] font-extrabold text-black  select-none pointer-events-none leading-none">
                {number}
            </motion.span>
            <span
                className="
                absolute
                left-10  // điều chỉnh vị trí gạch cho đúng (tùy layout)
                top-[4.4rem]    // nên để trùng với top của số
                h-2     // chiều cao gạch (tùy chiều cao content)
                w-12      // độ dày gạch
                bg-black // màu nền card
                rounded-full
                shadow-md // tạo hiệu ứng “nổi nhẹ”
                z-10
                pointer-events-none
                "
                style={{}}
                ></span>
            {/* Nội dung chính */}
            <motion.div
            initial={{ opacity: 1,scale:1, y: -150, x: 0 }}
            animate={inview?{ opacity: 1,scale:1, y: 0, x: 0 }:{ opacity: 1,scale:1, y: -150, x: 0 }}
            transition={{ duration: 1, delay: 0 }}
            className="relative z-10 pt-6 flex-1 flex flex-col bg-white mt-10">
                <span className="font-bold text-sm flex items-center gap-2 mb-1">
                    {icon}
                    {title}
                </span>
                <motion.span
                    initial={{ opacity: 0,scale:1, y: 0, x: -30 }}
                    animate={inview?{ opacity: 1,scale:1, y: 0, x: 0 }:{ opacity: 0,scale:1, y: 0, x: -30 }}
                    transition={{ duration: 1, delay: 0.8 }}
                className="text-gray-500 text-[2vh] mb-8 block pl-10 pr-6">
                {description}
                </motion.span>
                <div className="flex justify-between items-center w-full mt-auto">
                    <Link to={links[0]?.href || "#"} className="text-blue-600 font-medium hover:underline text-[10px]">Đăng ký hiến máu</Link>
                    {/* <Link to={links[1]?.href || "#"} className="text-gray-400 hover:text-blue-600 text-[10px]">Tìm hiểu</Link> */}
                </div>
            </motion.div>
        </motion.div>
  );
}
