import React from "react";
import "react-markdown-editor-lite/lib/index.css";
import MdEditor from "react-markdown-editor-lite";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

type EditorTextWithPreviewProps = {
  value: string;
  onChange: (val: string) => void;
};

async function uploadImage(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

export default function EditorTextWithPreview({
  value,
  onChange,
}: EditorTextWithPreviewProps) {
  return (
    <MdEditor
      value={value}
      style={{ height: "50vh" }}
      renderHTML={text => (
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {text}
        </ReactMarkdown>
      )}
      onChange={({ text }) => onChange(text)}
      view={{ menu: true, md: true, html: true }}
      placeholder="Nhập nội dung, dùng markdown hoặc html đều được, có thể chèn lẫn!"
      onImageUpload={async (file: File) => {
        const link = await uploadImage(file);
        return link;
      }}
    />
  );
}
