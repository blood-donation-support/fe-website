import React, { useState, useMemo } from "react";
import BlogCard from "./BlogCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { Blog } from "@/api/blogService";

type BlogCarouselProps = {
  blogs: Blog[];
  visibleCount?: number;   // Số blog hiển thị (ưu tiên khi không truyền cardWidthVW)
  gapVW?: number;          // Khoảng cách giữa các blog (vw)
  widthVW?: number;        // Tổng width carousel (vw)
  heightVH?: number;       // Chiều cao carousel (vh)
  cardWidthVW?: number;    // Độ rộng từng card (vw) (ưu tiên nếu truyền)
  style?: React.CSSProperties;
  className?: string;
};

const BlogCarousel: React.FC<BlogCarouselProps> = ({
  blogs,
  visibleCount,
  gapVW = 3,
  widthVW = 93,
  heightVH = 75,
  cardWidthVW,
  style,
  className,
}) => {
  // Tính toán số card thực tế sẽ hiển thị (auto nếu có cardWidthVW)
  const actualVisibleCount = useMemo(() => {
    if (cardWidthVW) {
      // trừ gap, lấy phần nguyên
      return Math.max(
        1,
        Math.floor((widthVW + gapVW) / (cardWidthVW + gapVW)) // +gapVW để không bị thiếu ở cuối
      );
    }
    return visibleCount ?? 3;
  }, [cardWidthVW, widthVW, gapVW, visibleCount]);

  const cardWidth = useMemo(() => {
    if (cardWidthVW) return `${cardWidthVW}vw`;
    const totalGap = gapVW * (actualVisibleCount - 1);
    return `calc((${widthVW}vw - ${totalGap}vw) / ${actualVisibleCount})`;
  }, [cardWidthVW, widthVW, gapVW, actualVisibleCount]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = Math.max(0, blogs.length - actualVisibleCount);

  const movePerIndex = useMemo(() => {
    if (cardWidthVW) return cardWidthVW + gapVW;
    const totalGap = gapVW * (actualVisibleCount - 1);
    return (widthVW - totalGap) / actualVisibleCount + gapVW;
  }, [cardWidthVW, widthVW, gapVW, actualVisibleCount]);

  return (
    <div
      className={`relative flex flex-col items-center select-none w-full ${className || ""}`}
      style={{ height: `${heightVH}vh`, ...style }}
    >
      <button
        onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
        disabled={currentIndex === 0}
        className={`absolute left-3 z-10 w-14 h-14 bg-white shadow p-2 rounded-xl border text-blue-600 hover:bg-blue-50 transition
          ${currentIndex === 0 ? "opacity-40 cursor-not-allowed" : "hover:scale-105"}`}
        style={{ top: "50%", transform: "translateY(-50%)" }}
        aria-label="Trước"
      >
        <FaChevronLeft size={28} />
      </button>

      <div className="overflow-hidden h-full p-2" style={{ maxWidth: `${widthVW + 1}vw` }}>
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            gap: `${gapVW}vw`,
            width: `calc(${blogs.length} * (${cardWidth}))`,
            transform: `translateX(-${currentIndex * movePerIndex}vw)`,
          }}
        >
          {blogs.map((blog, idx) => (
            <div
              key={idx}
              className="flex-shrink-0"
              style={{
                width: cardWidth,
                height: `${heightVH - 7}vh`,
              }}
            >
              <BlogCard {...blog} />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setCurrentIndex(prev => Math.min(maxIndex, prev + 1))}
        disabled={currentIndex >= maxIndex}
        className={`absolute right-3 z-10 w-14 h-14 bg-white shadow rounded-xl border text-blue-600 hover:bg-blue-50 transition
          ${currentIndex >= maxIndex ? "opacity-40 cursor-not-allowed" : "hover:scale-105"}`}
        style={{ top: "50%", transform: "translateY(-50%)" }}
        aria-label="Tiếp theo"
      >
        <FaChevronRight size={28} />
      </button>

      {/* Dots */}
      <div className="flex gap-2 mt-4">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full border transition-all ${currentIndex === idx ? "bg-blue-600 border-blue-600 scale-125" : "bg-gray-300 border-gray-300"}`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BlogCarousel;
