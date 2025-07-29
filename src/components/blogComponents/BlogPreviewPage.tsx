import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogById } from "@/api/blogService";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import dayjs from "dayjs";
import type { RootState } from "@/redux/store";
import HeaderComponent from "../commons/header-component";
import FooterComponent from "../commons/footer-component";
import BlogCarousel from "../BlogCarousel";
import remarkGfm from "remark-gfm";
import { getPreviewText } from "@/utils/prettier";
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
export default function BlogPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const blog = useSelector((state: RootState) => state.blog.currentBlog);
  const blogs = useSelector((state: RootState) => state.blog.blogs);
  const loading = useSelector((state: RootState) => state.blog.loading);

  useEffect(() => {
    if (id) dispatch(fetchBlogById(id) as any);
  }, [id, dispatch]);

  if (loading || !blog) return <div className="p-8">Loading...</div>;
  const renderers = {
    img: ({ src, alt }: any) => (
      <img src={src} alt={alt} className="w-full h-auto" />
    ),
  };

  const btnTop = 100;  
  const btnRight = 50; 

  return (
    <div className="relative min-h-screen bg-white">
      {/* Nút quay lại luôn nổi trên cùng và được bấm */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "fixed",
          top: btnTop,
          right: btnRight,
          zIndex: 9999,
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #e4e4e4",
          cursor: "pointer",
          transition: "background 0.2s",
          pointerEvents: "auto" // luôn nhận được sự kiện bấm
        }}
        aria-label="Quay lại"
      >
        <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
          <path
            d="M15.5 19l-7-7 7-7"
            stroke="#181A20"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Toàn bộ overlay, phủ toàn trang, chặn mọi tương tác */}
      <div
        style={{
          position: "fixed",
          zIndex: 9998,
          inset: 0,
          pointerEvents: "auto",
          background: "rgba(0,0,0,0)", // trong suốt để vẫn nhìn được content
        }}
        onClick={e => e.stopPropagation()}
      />

      <div style={{ pointerEvents: "none" }}>
        <HeaderComponent />
        <div className="relative w-full min-h-[380px] md:min-h-[480px] flex items-end">
          <img
            src={blog.image}
            alt={blog.title}
            className="absolute inset-0 w-full h-full object-cover object-center z-0"
            style={{ filter: "brightness(0.84)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#181A20cc] to-[#181A20] z-10" />
          <div className="relative z-20 px-4 md:px-10 pb-12 max-w-5xl w-full mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-2 opacity-85 text-sm text-white">
              <span className="flex items-center gap-1">
                <svg width={18} height={18} fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M8 4h8m-4 13v3m7 0H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2.5a2 2 0 0 1 1.8 1.1l.7 1.4A2 2 0 0 0 12 7h0a2 2 0 0 0 1.8-1.1l.7-1.4A2 2 0 0 1 16.5 3H19a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2Z"/></svg>
                {dayjs(blog.created_at).format("DD/MM/YYYY")}
              </span>
              <span className="italic">bởi <b>{blog.author || "Unknown"}</b></span>
            </div>
            <h1 className="text-5xl md:text-5xl font-extrabold leading-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)]">
              {getPreviewText(blog.title, 80)}
            </h1>
          </div>
        </div>
        <div className="max-w-5xl w-[80vw] mx-auto px-3 md:px-0 py-10">
          <div className="prose prose-invert prose-2xl max-w-none text-black">
            <ReactMarkdown
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
        </div>
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
        <FooterComponent />
      </div>
    </div>
  );
}
