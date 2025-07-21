import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogById, updateBlog, type Blog } from "@/api/blogService";
import type { RootState } from "@/redux/store";
import EditorTextWithPreview from "@/components/blogComponents/EditorTextWithPreview";
import TextField from "@mui/material/TextField";
import { validateBlogForm, type BlogFormErrors } from "@/utils/blogFormValidate";
import { toast } from "react-toastify";

const PRIMARY_COLOR = "#236AFE";

export default function BlogEditPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector((state: RootState) => state.blog.loading);
  const error = useSelector((state: RootState) => state.blog.error);
  const currentBlog = useSelector((state: RootState) => state.blog.currentBlog);

  const [blog, setBlog] = useState<Blog | null>(null);
  const [content, setContent] = useState<string>("");
  const [errors, setErrors] = useState<BlogFormErrors>({});

  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setBlog(currentBlog);
    setContent(currentBlog?.content || "");
  }, [currentBlog]);

  useEffect(() => {
    if (id) dispatch(fetchBlogById(id) as any);
  }, [dispatch, id]);

  useEffect(() => {
    if (blog) setBlog({ ...blog, content });
  }, [content]);

  async function handleSave() {
    if (!blog) return;
    const validate = validateBlogForm({ ...blog, content });
    setErrors(validate);

    // Focus vào field đầu tiên có lỗi
    if (Object.keys(validate).length > 0) {
      if (validate.title && titleRef.current) titleRef.current.focus();
      else if (validate.author && authorRef.current) authorRef.current.focus();
      else if (validate.image && imageRef.current) imageRef.current.focus();
      return;
    }

    const updatedBlog = { ...blog, content };
    try {
      await dispatch(updateBlog(updatedBlog) as any).unwrap();
      toast.success("Cập nhật blog thành công!");
      // Điều hướng hoặc callback nếu cần
    } catch (e: any) {
      toast.error("Cập nhật blog thất bại!");
    }
  }

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!blog) return null;

  return (
    <div className="flex justify-start items-start min-h-[80vh] bg-[#f5f6fa] pl-10">
      <div
        className="bg-white rounded-2xl shadow-xl flex flex-col justify-between overflow-auto"
        style={{
          width: "80vw",
          height: "80vh",
          minWidth: 360,
          minHeight: 400,
          padding: "2rem",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="mb-2 flex items-center gap-1 text-blue-600 font-medium hover:underline"
        >
          <svg width={18} height={18} fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
          Quay lại
        </button>
        <h2 className="text-xl font-bold mb-2 text-gray-800">Chỉnh sửa Blog</h2>
        <div className="flex flex-col gap-3 flex-1 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <TextField
              label="Tiêu đề blog"
              variant="outlined"
              fullWidth
              value={blog.title}
              onChange={e => setBlog({ ...blog, title: e.target.value })}
              required
              inputRef={titleRef}
              error={!!errors.title}
              helperText={errors.title}
            />
            <TextField
              label="Tác giả"
              variant="outlined"
              fullWidth
              value={blog.author || ""}
              onChange={e => setBlog({ ...blog, author: e.target.value })}
              inputRef={authorRef}
              error={!!errors.author}
              helperText={errors.author}
            />
          </div>
          <TextField
            label="Link ảnh (image url)"
            variant="outlined"
            fullWidth
            value={blog.image || ""}
            onChange={e => setBlog({ ...blog, image: e.target.value })}
            inputRef={imageRef}
            error={!!errors.image}
            helperText={errors.image}
          />
          {errors.content && (
            <div className="text-red-600 text-sm mb-1">{errors.content}</div>
          )}
          <div className="flex-1 min-h-[120px]">
            <EditorTextWithPreview value={content} onChange={setContent} />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-2">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            onClick={() => navigate(-1)}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 text-white rounded-md"
            style={{ backgroundColor: PRIMARY_COLOR }}
            onClick={handleSave}
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}
