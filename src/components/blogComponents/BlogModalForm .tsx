import React, { useState } from "react";
import EditorTextWithPreview from "@/components/blogComponents/EditorTextWithPreview";
import TextField from "@mui/material/TextField";
import { useDispatch } from "react-redux";
import { createBlog } from "@/api/blogService";
import { validateBlogForm, type BlogFormErrors } from "@/utils/blogFormValidate";
import axios from "axios";

function BlogModalForm({
  onClose,
  loading,
}: {
  onClose: () => void;
  onSave: (item: any) => void;
  loading: boolean;
}) {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [author, setAuthor] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [errors, setErrors] = useState<BlogFormErrors>({});

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
      setImage(resp.data.secure_url);
      setPreviewUrl(resp.data.secure_url);
      setErrors((prev) => ({ ...prev, image: "" }));
    } catch {
      setErrors((prev) => ({ ...prev, image: "Không thể upload ảnh" }));
    }
  };

  async function handleSave() {
    const formValues = { title, content, image, author };
    const validate = validateBlogForm(formValues);
    setErrors(validate);
    if (Object.keys(validate).length > 0) return;
    try {
      await dispatch(createBlog(formValues) as any).unwrap();
      onClose();
    } catch (e) {
      alert("Có lỗi khi tạo blog!");
    }
  }

  return (
    <div className="fixed inset-0 z-[99] bg-black/40 flex items-center justify-center p-2 sm:p-8">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-blue-100 p-0 flex flex-col overflow-hidden animate-fadein"
        style={{ maxHeight: 650, minHeight: 470 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 rounded-t-3xl flex items-center justify-between">
          <h3 className="text-lg sm:text-2xl font-bold text-white">Thêm Blog mới</h3>
          <button
            className="text-white opacity-80 hover:opacity-100 text-2xl font-semibold"
            onClick={onClose}
            title="Đóng"
            disabled={loading}
          >×</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-5 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="flex flex-col gap-4">
            <TextField
              label="Tiêu đề blog"
              variant="outlined"
              fullWidth
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              error={!!errors.title}
              helperText={errors.title}
              InputProps={{
                className: "bg-white rounded-xl text-base"
              }}
            />

            <div className="flex flex-col items-center gap-2">
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
                {/* Icon máy ảnh khi hover */}
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
                {/* Nút input file */}
                <input
                  id="upload-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              {/* Dòng chữ dưới hình */}
              <label
                htmlFor="upload-image"
                className="text-sm font-medium text-blue-600 hover:underline cursor-pointer"
              >
                {previewUrl ? "Đổi ảnh" : "Chọn ảnh"}
              </label>

              {/* Hiển thị lỗi nếu có */}
              {errors.image && (
                <div className="text-red-600 text-sm mt-1">{errors.image}</div>
              )}
            </div>



            <TextField
              label="Tác giả"
              variant="outlined"
              fullWidth
              value={author}
              onChange={e => setAuthor(e.target.value)}
              error={!!errors.author}
              helperText={errors.author}
              placeholder="Nhập tên tác giả"
              InputProps={{
                className: "bg-white rounded-xl text-base"
              }}
            />

            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Nội dung <span className="text-red-500">*</span>
              </label>
              <div className="rounded-xl border border-gray-200 bg-white min-h-[140px] overflow-hidden">
                <EditorTextWithPreview value={content} onChange={setContent} />
              </div>
              {errors.content && (
                <div className="text-red-600 text-sm mt-1">{errors.content}</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-b-3xl px-8 py-3 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-100">
          <button
            className="w-full sm:w-auto px-6 py-2 rounded-lg font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 text-base"
            onClick={onClose}
            disabled={loading}
          >
            Huỷ
          </button>
          <button
            className="w-full sm:w-auto px-6 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow text-base"
            disabled={loading}
            onClick={handleSave}
          >
            {loading ? "Đang tạo..." : "Tạo blog"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlogModalForm;
