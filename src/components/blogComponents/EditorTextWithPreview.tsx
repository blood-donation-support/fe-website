import React, { useState } from "react";
import "react-markdown-editor-lite/lib/index.css";
import MdEditor from "react-markdown-editor-lite";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Inline styles for Markdown content (same as before)
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

type EditorTextWithPreviewProps = {
  value: string;
  onChange: (val: string) => void;
};

export default function EditorTextWithPreview({
  value,
  onChange,
}: EditorTextWithPreviewProps) {
  const [previewContent, setPreviewContent] = useState<string>(value);

  const handleEditorChange = ({ text }: { text: string }) => {
    onChange(text);
    setPreviewContent(text); // Update preview content when editor content changes
  };

  return (
    <div className="flex flex-row space-x-4">
      {/* Markdown Editor */}
      <div className="flex-1">
        <MdEditor
          value={value}
          style={{ height: "50vh" }}
          renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
          onChange={handleEditorChange}
          view={{ menu: true, md: true, html: false }} // Only show markdown, not HTML
          placeholder="Nhập nội dung blog, chèn ảnh trực tiếp nếu muốn"
        />
      </div>

      {/* Preview */}
      <div
        className="flex-1 bg-gray-100 p-4 border rounded-lg overflow-auto"
        style={{ height: "50vh", maxHeight: "50vh", paddingRight: "20px" }}
      >
        <div className="prose max-w-none">
          {/* Render Markdown preview with inline styles */}
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
            {previewContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
