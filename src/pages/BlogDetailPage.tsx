import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogById } from "@/api/blogService";
import { useParams, useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import type { RootState } from "@/redux/store";
import dayjs from "dayjs";
import { FooterComponent, HeaderComponent } from "@/components";
import BlogCarousel from "@/components/BlogCarousel";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const blogs = useSelector((state: RootState) => state.blog.blogs);
  const blog = useSelector((state: RootState) => state.blog.currentBlog);
  const loading = useSelector((state: RootState) => state.blog.loading);

  useEffect(() => {
    if (id) dispatch(fetchBlogById(id) as any);
  }, [id, dispatch]);

  if (loading || !blog) return <div className="p-8">Loading...</div>;

  return (
    <>
      <HeaderComponent />
      <div className="min-h-screen bg-white text-white pt-12">
        {/* Banner */}
        <div className="relative w-full min-h-[380px] md:min-h-[480px] flex items-end">
          <img
            src={blog.image}
            alt={blog.title}
            className="absolute inset-0 w-full h-full object-cover object-center z-0"
            style={{ filter: "brightness(0.84)" }}
          />
          {/* Overlay gradient: mờ dần từ trên xuống dưới */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#181A20cc] to-[#181A20] z-10" />
          <div className="relative z-20 px-4 md:px-10 pb-12 max-w-5xl w-full mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-2 opacity-85 text-sm">
              <span className="flex items-center gap-1">
                <svg width={18} height={18} fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M8 4h8m-4 13v3m7 0H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2.5a2 2 0 0 1 1.8 1.1l.7 1.4A2 2 0 0 0 12 7h0a2 2 0 0 0 1.8-1.1l.7-1.4A2 2 0 0 1 16.5 3H19a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2Z"/></svg>
                {dayjs(blog.created_at).format("DD/MM/YYYY")}
              </span>
              <span className="italic">bởi <b>{blog.author || "Unknown"}</b></span>
            </div>
            <h1 className="text-5xl md:text-5xl font-extrabold leading-tight drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)]">
              {blog.title}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl w-[80vw] mx-auto px-3 md:px-0 py-10">
          <div className="prose prose-invert prose-2xl max-w-none text-black">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {blog.content || ""}
            </ReactMarkdown>
          </div>
          
          <button
            className="mt-6 px-7 py-3 rounded-full bg-black/10 border border-black/20 text-black font-semibold hover:bg-black/20 transition"
            onClick={() => navigate(-1)}
          >
            ← Quay lại
          </button>
        </div>
            <div className="w-[80vw] mx-auto px-3 md:px-3 m-6">
            <h2 className="text-3xl font-bold mb-4 text-black pl-[33vw]">Bài viết liên quan</h2>
                <BlogCarousel
                    blogs={blogs}
                    visibleCount={2} // 3 blog trên 1 slide
                    gapVW={3}
                    widthVW={50} // hoặc 100
                    heightVH={70}
                    cardWidthVW={23}
                />
            </div>
        </div>
        
      <FooterComponent />
    </>
  );
}
