import React, { useState } from "react";
import EditorTextWithPreview from "@/components/blogComponents/EditorTextWithPreview";
import TextField from "@mui/material/TextField";
import { useDispatch } from "react-redux";
import { createBlog } from "@/api/blogService";
import { validateBlogForm, type BlogFormErrors } from "@/utils/blogFormValidate";

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
  const [errors, setErrors] = useState<BlogFormErrors>({});

  // Hàm validate & save
  async function handleSave() {
    const formValues = { title, content, image, author };
    const validate = validateBlogForm(formValues);
    setErrors(validate);
    if (Object.keys(validate).length > 0) return;

    try {
      await dispatch(createBlog(formValues) as any).unwrap();
      onClose();
    } catch (e) {
      // Có thể hiện alert/toast lỗi nếu cần
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-xl shadow-xl flex flex-col gap-4 border border-gray-300"
        style={{
          width: "90vw",
          height: "90vh",
          maxWidth: "1800px",
          maxHeight: "1000px",
          padding: "2rem",
          overflow: "auto",
        }}
      >
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Thêm Blog mới</h3>
        <div className="flex flex-col md:flex-row gap-6 flex-1 max-h-[70vw]">
          <div className="flex flex-col flex-1 min-w-0 gap-3">
            <TextField
              label="Tiêu đề blog"
              variant="outlined"
              className="mb-4"
              fullWidth
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              error={!!errors.title}
              helperText={errors.title}
            />
            <TextField
              label="Link ảnh đại diện blog"
              variant="outlined"
              className="mb-4"
              fullWidth
              value={image}
              onChange={e => setImage(e.target.value)}
              error={!!errors.image}
              helperText={errors.image}
              placeholder="https://...jpg"
            />
            <TextField
              label="Tác giả"
              variant="outlined"
              className="mb-4"
              fullWidth
              value={author}
              onChange={e => setAuthor(e.target.value)}
              error={!!errors.author}
              helperText={errors.author}
              placeholder="Nhập tên tác giả"
            />
            {errors.content && (
              <div className="text-red-600 text-sm mb-1">{errors.content}</div>
            )}
            <div className="flex-1 min-h-[220px]">
              <EditorTextWithPreview value={content} onChange={setContent} />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 text-lg"
            onClick={onClose}
            disabled={loading}
          >
            Huỷ
          </button>
          <button
            className="px-6 py-3 text-white rounded-md text-lg"
            style={{ backgroundColor: "#236AFE" }}
            disabled={loading}
            onClick={handleSave}
          >
            {loading ? "Đang tạo..." : "Tạo"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlogModalForm;
