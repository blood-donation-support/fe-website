import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogById, updateBlog, type Blog } from "@/api/blogService";
import type { RootState } from "@/redux/store";
import EditorTextWithPreview from "@/components/blogComponents/EditorTextWithPreview";
import TextField from "@mui/material/TextField";
import { validateBlogForm, type BlogFormErrors } from "@/utils/blogFormValidate";
import { toast } from "react-toastify";
import axios from "axios";

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
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    setBlog(currentBlog);
    setContent(currentBlog?.content || "");
    setPreviewUrl(currentBlog?.image || "");
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
      navigate(-1);
    } catch (e: any) {
      toast.error("Cập nhật blog thất bại!");
    }
  }
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "BloodDonation");

    try {
      const resp = await axios.post(
        "https://api.cloudinary.com/v1_1/dpf7yfupt/image/upload",
        formData
      );
      const imageUrl = resp.data.secure_url;
      setPreviewUrl(imageUrl);
      setBlog((prev) => prev ? { ...prev, image: imageUrl } : null);
      setErrors((prev) => ({ ...prev, image: "" }));
    } catch {
      setErrors((prev) => ({ ...prev, image: "Không thể upload ảnh" }));
    }
  };
  if (loading) return (
    <div className="flex items-center justify-center h-[80vh] w-full">
      <span className="text-blue-500 font-medium text-lg">Loading...</span>
    </div>
  );
  if (error) return (
    <div className="flex items-center justify-center h-[80vh] w-full text-red-500 text-lg">
      {error}
    </div>
  );
  if (!blog) return null;

  return (
    <div className="flex justify-center items-center min-h-[85vh] bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 px-2">
      <div
        className="bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-blue-100"
        style={{
          width: "80vw",
          minWidth: 360,
          maxWidth: 1200, // có thể để maxWidth nếu không muốn rộng toàn màn hình lớn
          minHeight: 500,
          maxHeight: 800,
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-3xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-white opacity-90 hover:opacity-100 font-semibold rounded-full px-2 py-1 transition"
            title="Quay lại"
          >
            <svg width={20} height={20} fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
            <span className="hidden sm:block">Quay lại</span>
          </button>
          <h2 className="flex-1 text-lg sm:text-2xl font-bold text-white text-center">Chỉnh sửa Blog</h2>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-10 py-7 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                InputProps={{
                  className: "bg-white rounded-xl text-base"
                }}
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
                InputProps={{
                  className: "bg-white rounded-xl text-base"
                }}
              />
            </div>
            {/* ảnh */}
            <div className="flex flex-col items-center gap-2 mt-2">
              <div className="relative w-32 h-32 rounded-lg border-2 border-dashed border-blue-300 flex items-center justify-center group overflow-hidden bg-white">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-gray-400">Không có ảnh</span>
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm10 4a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <label
                htmlFor="upload-image"
                className="text-sm font-medium text-blue-600 hover:underline cursor-pointer"
              >
                {previewUrl ? "Đổi ảnh" : "Chọn ảnh"}
              </label>
              {errors.image && (
                <div className="text-red-600 text-sm mt-1">{errors.image}</div>
              )}
            </div>
            {errors.content && (
              <div className="text-red-600 text-sm mb-1">{errors.content}</div>
            )}
            <div className="flex-1 min-h-[110px]">
              <EditorTextWithPreview value={content} onChange={setContent} />
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-white rounded-b-3xl px-10 py-4 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-100">
          <button
            className="w-full sm:w-auto px-6 py-2 rounded-lg font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 text-base"
            onClick={() => navigate(-1)}
          >
            Huỷ
          </button>
          <button
            className="w-full sm:w-auto px-6 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow text-base"
            onClick={handleSave}
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}
