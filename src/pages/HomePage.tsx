import { FaBars, FaPhone, FaBell, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import BlogCarousel from "@/components/BlogCarousel";
import SectionMotionWrapper from "@/components/commons/SectionMotionWrapper";
import { ButtonComponent, GroupedHeadingComponent, HeaderComponent, ParaComponent } from "@/components";
import HomePageSection from "@/components/HomepageSection";
import { ServiceSection } from "@/components/ServiceSection";
import BlogSection from "@/components/BlogSection";
export default function HomePage() {
	const demoBlogs = [
  {
    image: "/blog1.jpg",
    title: "30 Best UX Design Blogs to Educate and Inspire You (Updated for 2025)",
    summary: "Here are 30 of the best UX design blogs (and design related blogs) to follow to expand your knowledge and inspire your design career journey in 2025 and beyond....",
    logo: "/logo-dl.png",
    blogUrl: "../assets/blood-donation(6).jpg",
    author: "Designlab",
    domain: "designlab.com"
  },
  {
    image: "/blog1.jpg",
    title: "30 Best UX Design Blogs to Educate and Inspire You (Updated for 2025)",
    summary: "Here are 30 of the best UX design blogs (and design related blogs) to follow to expand your knowledge and inspire your design career journey in 2025 and beyond....",
    logo: "/logo-dl.png",
    blogUrl: "https://designlab.com/blog/top-ux-design-blogs/",
    author: "Designlab",
    domain: "designlab.com"
  },
  {
    image: "/blog1.jpg",
    title: "30 Best UX Design Blogs to Educate and Inspire You (Updated for 2025)",
    summary: "Here are 30 of the best UX design blogs (and design related blogs) to follow to expand your knowledge and inspire your design career journey in 2025 and beyond....",
    logo: "/logo-dl.png",
    blogUrl: "https://designlab.com/blog/top-ux-design-blogs/",
    author: "Designlab",
    domain: "designlab.com"
  },{
    image: "/blog1.jpg",
    title: "30 Best UX Design Blogs to Educate and Inspire You (Updated for 2025)",
    summary: "Here are 30 of the best UX design blogs (and design related blogs) to follow to expand your knowledge and inspire your design career journey in 2025 and beyond....",
    logo: "/logo-dl.png",
    blogUrl: "https://designlab.com/blog/top-ux-design-blogs/",
    author: "Designlab",
    domain: "designlab.com"
  },{
    image: "/blog1.jpg",
    title: "30 Best UX Design Blogs to Educate and Inspire You (Updated for 2025)",
    summary: "Here are 30 of the best UX design blogs (and design related blogs) to follow to expand your knowledge and inspire your design career journey in 2025 and beyond....",
    logo: "/logo-dl.png",
    blogUrl: "https://designlab.com/blog/top-ux-design-blogs/",
    author: "Designlab",
    domain: "designlab.com"
  },{
    image: "/blog1.jpg",
    title: "30 Best UX Design Blogs to Educate and Inspire You (Updated for 2025)",
    summary: "Here are 30 of the best UX design blogs (and design related blogs) to follow to expand your knowledge and inspire your design career journey in 2025 and beyond....",
    logo: "/logo-dl.png",
    blogUrl: "https://designlab.com/blog/top-ux-design-blogs/",
    author: "Designlab",
    domain: "designlab.com"
  },{
    image: "/blog1.jpg",
    title: "30 Best UX Design Blogs to Educate and Inspire You (Updated for 2025)",
    summary: "Here are 30 of the best UX design blogs (and design related blogs) to follow to expand your knowledge and inspire your design career journey in 2025 and beyond....",
    logo: "/logo-dl.png",
    blogUrl: "https://designlab.com/blog/top-ux-design-blogs/",
    author: "Designlab",
    domain: "designlab.com"
  },{
    image: "/blog1.jpg",
    title: "30 Best UX Design Blogs to Educate and Inspire You (Updated for 2025)",
    summary: "Here are 30 of the best UX design blogs (and design related blogs) to follow to expand your knowledge and inspire your design career journey in 2025 and beyond....",
    logo: "/logo-dl.png",
    blogUrl: "https://designlab.com/blog/top-ux-design-blogs/",
    author: "Designlab",
    domain: "designlab.com"
  },{
    image: "/blog1.jpg",
    title: "30 Best UX Design Blogs to Educate and Inspire You (Updated for 2025)",
    summary: "Here are 30 of the best UX design blogs (and design related blogs) to follow to expand your knowledge and inspire your design career journey in 2025 and beyond....",
    logo: "/logo-dl.png",
    blogUrl: "https://designlab.com/blog/top-ux-design-blogs/",
    author: "Designlab",
    domain: "designlab.com"
  },{
    image: "/blog1.jpg",
    title: "30 Best UX Design Blogs to Educate and Inspire You (Updated for 2025)",
    summary: "Here are 30 of the best UX design blogs (and design related blogs) to follow to expand your knowledge and inspire your design career journey in 2025 and beyond....",
    logo: "/logo-dl.png",
    blogUrl: "https://designlab.com/blog/top-ux-design-blogs/",
    author: "Designlab",
    domain: "designlab.com"
  },
  // ...Thêm 5-10 blog mẫu nữa
];
  return (
    <>
      <div className="relative ">
        <div
          className="h-screen overflow-y-scroll snap-y snap-mandatory"
          style={{ scrollBehavior: "smooth" }}
        >
		  	<HomePageSection/>
			{/* Slide 2: Medical Services */}
			<ServiceSection/>
			{/* section 3 : blog*/}
			<SectionMotionWrapper className="w-full h-screen flex flex-col items-center justify-center bg-blue-50 snap-start">
				{(inView) => (
					<>
				<h2 className="text-3xl font-bold mb-20">Danh sách Blog UX nổi bật</h2>
				<BlogCarousel blogs={demoBlogs} />
					</>
				)}
			</SectionMotionWrapper>
			{/* section 4 */}
			<BlogSection/>
        </div>
      	</div>
    </>
  );

}
