import React, { useRef, useState } from "react";

type UploadImageBlogProps = {
  value: string;
  onChange: (url: string) => void;
};

export default function UploadImageBlog({ value, onChange }: UploadImageBlogProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    // const file = e.target.files?.[0];
    // if (!file) return;
    // setUploading(true);
    // try {
    //   const formData = new FormData();
    //   formData.append("file", file);

    //   // Thay bằng API upload ảnh thực tế của bạn
    //   const response = await fetch("/api/upload", {
    //     method: "POST",
    //     body: formData,
    //   });
    //   if (!response.ok) throw new Error("Upload thất bại");
    //   const data = await response.json();
    //   onChange(data.url); // Server trả về { url: "https://..." }
    // } catch (e) {
    //   alert("Upload ảnh thất bại!");
    // }
    // setUploading(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? "Đang upload..." : "Thêm ảnh"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleUpload}
      />
      {value && (
        <img
          src={value}
          alt="Avatar"
          style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 12 }}
        />
      )}
    </div>
  );
}
