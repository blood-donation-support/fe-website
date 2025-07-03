import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { getPreviewText } from "@/utils/prettier";

interface BlogCardProps {
  _id: string;
  image: string;
  title: string;
  content: string;
  avatar?: string;
  author: string;
  heightVH?: number;        // tổng chiều cao card (mặc định 60)
  imageRatio?: number;      // tỷ lệ ảnh/trên card (vd: 0.4 là 40%)
}

export default function BlogCard({
  _id,
  image,
  title,
  content,
  author,
  avatar,
  heightVH = 60,
  imageRatio = 0.6,
}: BlogCardProps) {
  const imageHeight = heightVH * imageRatio;
  const contentHeight = heightVH - imageHeight;

  return (
    <Link to={`blogDetail/${_id}`}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col w-full h-full"
        style={{ height: `${heightVH}vh` }}
      >
        <div style={{ height: `${imageHeight}vh`, minHeight: 100 }}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="p-4 flex flex-col flex-1"
          style={{ height: `${contentHeight}vh` }}
        >
          <h2 className="font-semibold text-xl line-clamp-3 mb-2 text-black" style={{ minHeight: 30 }}>
            {title}
          </h2>
          <div
            className="prose max-w-none text-sm text-black"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: 30,
            }}
          >
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {getPreviewText(content, 210)}
            </ReactMarkdown>
          </div>
          <div className="flex items-center mt-auto pt-2 border-t border-gray-100">
            {avatar && (
              <img src={avatar} alt="Logo" className="w-7 h-7 rounded-md mr-2 border" />
            )}
            <div>
              <div className="text-xs text-gray-500">{author}</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Link>
  );
}
