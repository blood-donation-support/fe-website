import BlogCarousel from "@/components/BlogCarousel";
import SectionMotionWrapper from "@/components/commons/SectionMotionWrapper";
import HomePageSection from "@/components/HomepageSection";
import { ServiceSection } from "@/components/ServiceSection";
import FooterSection from "@/components/FooterSection";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { fetchBlogs, fetchBlogsWithAuthors } from "@/api/blogService";
import { FooterComponent } from "@/components";
export default function HomePage() {
	const dispatch = useDispatch<AppDispatch>();
	const blogs = useSelector((state: RootState) => state.blog.blogs);
	const loading = useSelector((state: RootState) => state.blog.loading);
	const error = useSelector((state: RootState) => state.blog.error);

	useEffect(() => {
		dispatch(fetchBlogs());
		console.log('blogs', blogs);
	}, [dispatch]);
	if (loading) return null;
	return (
		<>
			<div className="relative ">
				<div
					className="h-screen overflow-y-scroll snap-y snap-mandatory"
					style={{ scrollBehavior: "smooth" }}
				>
					<HomePageSection />
					{/* Slide 2: Medical Services */}
					<ServiceSection />
					{/* section 3 : blog*/}
					<SectionMotionWrapper className="w-full h-screen flex flex-col items-center justify-center bg-blue-50 snap-start">
						{(inView) => (
							<>
								<h2 className="text-3xl font-bold pb-[2%]">
									Danh sách Blogs
								</h2>
								<BlogCarousel
									blogs={blogs}
									cardWidthVW={24}
									gapVW={3}
									widthVW={80}
									heightVH={70}
								/>
							</>
						)}
					</SectionMotionWrapper>
					{/* section 4 */}
					<FooterSection />
					{/* section 5 */}
					{/* <FooterComponent /> */}
				</div>
			</div>
		</>
	);
}
