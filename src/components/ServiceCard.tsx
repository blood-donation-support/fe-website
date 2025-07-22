import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

interface ServiceCardProps {
  number: string;
  title: string;
  description: string;
  links: { label: string; href: string };
  icon: JSX.Element;
  inview: boolean;
}

export default function ServiceCard({ number, title, description, links, icon, inview }: ServiceCardProps) {
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng trang

  const handleLinkClick = (href: string, slideNumber: number) => {
    navigate(href);  
    const slideElement = document.getElementById(`slide-${slideNumber}`);
    if (slideElement) {
      slideElement.scrollIntoView({ behavior: "smooth" });
    }
  };
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
            className="absolute z-0 left-7 top-6 text-[8rem] font-extrabold text-black  select-none pointer-events-none leading-none">

                {number}
            </motion.span>
            <span
                className="
                absolute
                left-10  // điều chỉnh vị trí gạch cho đúng (tùy layout)
                top-[7.8rem]    // nên để trùng với top của số
                h-2     // chiều cao gạch (tùy chiều cao content)
                w-28      // độ dày gạch

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
            className="relative z-10 pt-12 flex-1 flex flex-col bg-white mt-24">
                <span className="font-bold text-2xl flex items-center gap-2 mb-1">

                    {icon}
                    {title}
                </span>
                <motion.span
                    initial={{ opacity: 0,scale:1, y: 0, x: -30 }}
                    animate={inview?{ opacity: 1,scale:1, y: 0, x: 0 }:{ opacity: 0,scale:1, y: 0, x: -30 }}
                    transition={{ duration: 1, delay: 0.8 }}
                className="text-gray-500 text-lg mb-8 block">
                {description}
                </motion.span>
                <div className="flex justify-between items-center w-full mt-auto">

                    <Link
                        to={links.href || "#"}
                        className="text-blue-600 font-medium hover:underline text-[10px]"
                        onClick={() => handleLinkClick(links.href, parseInt(number))}
                    >
                        {links.label}
                    </Link>
                </div>
            </motion.div>
        </motion.div>
  );
}
