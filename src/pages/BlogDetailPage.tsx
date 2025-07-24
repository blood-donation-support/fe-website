import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogById } from "@/api/blogService";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { FooterComponent, HeaderComponent } from "@/components";
import BlogCarousel from "@/components/BlogCarousel";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { RootState } from "@/redux/store";

// Inline styles for Markdown content
// Inline styles for Markdown content
const markdownStyles = {
  h1: {
    fontWeight: "bold",
    marginTop: "20px",
    marginBottom: "10px",
    fontSize: "2.5rem",
  },
  h2: {
    fontWeight: "bold",
    marginTop: "20px",
    marginBottom: "10px",
    fontSize: "2rem",
  },
  h3: {
    fontWeight: "bold",
    marginTop: "20px",
    marginBottom: "10px",
    fontSize: "1.75rem",
  },
  h4: {
    fontWeight: "bold",
    marginTop: "20px",
    marginBottom: "10px",
    fontSize: "1.5rem",
  },
  strong: {
    fontWeight: "600",
    color: "#333",
  },
  em: {
    fontStyle: "italic",
    color: "#555",
  },
  u: {
    textDecoration: "underline",
  },
  del: {
    textDecoration: "line-through",
  },
  ul: {
    listStyleType: "disc",
    marginLeft: "20px",
  },
  ol: {
    listStyleType: "decimal",
    marginLeft: "20px",
  },
  blockquote: {
    borderLeft: "4px solid #ccc",
    paddingLeft: "20px",
    fontStyle: "italic",
    color: "#777",
    margin: "10px 0",
  },
  table: {
    width: "80%", /* Set table width to 80% */
    marginLeft: "auto", /* Center the table horizontally */
    marginRight: "auto", /* Center the table horizontally */
    borderCollapse: "collapse" as "collapse", /* Correct value for borderCollapse */
    marginTop: "20px", /* Add space above the table */
    marginBottom: "20px", /* Add space below the table */
  },
  th: {
    backgroundColor: "#f4f4f4", /* Light background for headers */
    fontWeight: "bold", /* Make header text bold */
    padding: "8px 12px", /* Add padding to header cells */
    textAlign: "left" as "left", /* Correct value for textAlign */
    border: "1px solid #ddd", /* Add border to header cells */
  },
  td: {
    padding: "8px 12px", /* Add padding to table cells */
    textAlign: "left" as "left", /* Correct value for textAlign */
    border: "1px solid #ddd", /* Add border to table cells */
  },
  img: {
    width: "100%", /* Make image span full width */
    height: "auto", /* Maintain aspect ratio */
    display: "block", /* Removes extra space below image */
    marginTop: "10px",
    marginBottom: "10px",
  },
};

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
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#181A20cc] to-[#181A20] z-10" />
          <div className="relative z-20 px-4 md:px-10 pb-12 max-w-5xl w-full mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-2 opacity-85 text-sm">
              <span className="flex items-center gap-1">
                <svg width={18} height={18} fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 4h8m-4 13v3m7 0H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2.5a2 2 0 0 1 1.8 1.1l.7 1.4A2 2 0 0 0 12 7h0a2 2 0 0 0 1.8-1.1l.7-1.4A2 2 0 0 1 16.5 3H19a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2Z"
                  />
                </svg>
                 {dayjs(blog.created_at).format("DD/MM/YYYY HH:mm:ss")}
              </span>
              <span className="italic">
                bởi <b>{blog.author || "Unknown"}</b>
              </span>
            </div>
            <h1 className="text-5xl md:text-5xl font-extrabold leading-tight drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)]">
              {blog.title}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[85%] w-[85%] mx-auto px-3 md:px-0 py-10">
          <div className="prose prose-invert prose-2xl max-w-none text-black">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 style={markdownStyles.h1}>{children}</h1>,
                h2: ({ children }) => <h2 style={markdownStyles.h2}>{children}</h2>,
                h3: ({ children }) => <h3 style={markdownStyles.h3}>{children}</h3>,
                h4: ({ children }) => <h4 style={markdownStyles.h4}>{children}</h4>,
                strong: ({ children }) => <strong style={markdownStyles.strong}>{children}</strong>,
                em: ({ children }) => <em style={markdownStyles.em}>{children}</em>,
                u: ({ children }) => <u style={markdownStyles.u}>{children}</u>,
                del: ({ children }) => <del style={markdownStyles.del}>{children}</del>,
                ul: ({ children }) => <ul style={markdownStyles.ul}>{children}</ul>,
                ol: ({ children }) => <ol style={markdownStyles.ol}>{children}</ol>,
                blockquote: ({ children }) => (
                  <blockquote style={markdownStyles.blockquote}>{children}</blockquote>
                ),
                table: ({ children }) => <table style={markdownStyles.table}>{children}</table>,
                th: ({ children }) => <th style={markdownStyles.th}>{children}</th>,
                td: ({ children }) => <td style={markdownStyles.td}>{children}</td>,
                img: ({ src, alt }) => <img src={src} alt={alt} style={markdownStyles.img} />,
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </div>

          <button
            className="mt-6 px-7 py-3 rounded-full bg-black/10 border border-black/20 text-black font-semibold hover:bg-black/20 transition"
            onClick={() => navigate(-1)}
          >
            ← Quay lại
          </button>
        </div>

        {/* Blog Carousel */}
        <div className="w-[full] mx-auto px-3 md:px-3 m-6">
          <h2 className="text-3xl font-bold mb-4 text-black content-center justify-center text-center">
            Bài viết liên quan
          </h2>
          <BlogCarousel
            blogs={blogs}
            cardWidthVW={24}
            gapVW={3}
            widthVW={80}
            heightVH={70}
          />
        </div>
      </div>

      <FooterComponent />
    </>
  );
}

