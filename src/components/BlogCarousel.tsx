import React, { useState } from "react";
import BlogCard from "./BlogCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type BlogType = {
  image: string;
  title: string;
  summary: string;
  logo?: string;
  blogUrl: string;
  author: string;
  domain?: string;
};

type BlogCarouselProps = {
  blogs: BlogType[];
};

const CARD_WIDTH = 650; // px
const VISIBLE_COUNT = 3;

const BlogCarousel: React.FC<BlogCarouselProps> = ({ blogs }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = Math.max(0, blogs.length - VISIBLE_COUNT);

  const handlePrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () => setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));

  // Để mượt mà: dùng transform slide, container đủ width
  return (
    <div className="relative w-full flex flex-col items-center select-none">
      {/* Arrow trái */}
      <button
        onClick={handlePrev}
        disabled={currentIndex === 0}
        className={`absolute left-6 z-10 w-20 h-16 bg-white shadow p-2 rounded-xl border text-blue-600 hover:bg-blue-50 transition ${
         currentIndex === 0 ? "opacity-40 cursor-not-allowed" : "hover:scale-105"
        }`}

        style={{ top: "50%", transform: "translateY(-50%)" }}
        aria-label="Trước"
      >
        <FaChevronLeft size={28} />
      </button>

      {/* Slide wrapper */}
      <div
        className="overflow-hidden w-full h-full"
        style={{ maxWidth: `${CARD_WIDTH * VISIBLE_COUNT + 48}px` }} // +gap cho đẹp
      >
        <div
          className="flex transition-transform duration-500 ease-in-out gap-8"
          style={{
            width: blogs.length * (CARD_WIDTH + 32),
            transform: `translateX(-${currentIndex * (CARD_WIDTH + 32)}px)`,
          }}
        >
          {blogs.map((blog, idx) => (
            <div key={idx} style={{ width: CARD_WIDTH, minWidth: CARD_WIDTH ,gap:"18px" }}>

              <BlogCard {...blog} />
            </div>
          ))}
        </div>
      </div>

      {/* Arrow phải */}
      <button
        onClick={handleNext}
        disabled={currentIndex >= maxIndex}
        className={`absolute right-6 z-10 w-20 h-16 bg-white shadow rounded-xl border text-blue-600 hover:bg-blue-50 transition ${
          currentIndex >= maxIndex ? "opacity-40 cursor-not-allowed" : "hover:scale-105"
        } flex items-center justify-end pr-4`}

        style={{ top: "50%", transform: "translateY(-50%)" }}
        aria-label="Tiếp theo"
      >
        <FaChevronRight size={28} />
      </button>

      {/* Dots */}
      <div className="flex gap-2 mt-5">

        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full border transition-all ${
              currentIndex === idx
                ? "bg-blue-600 border-blue-600 scale-125"
                : "bg-gray-300 border-gray-300"
            }`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BlogCarousel;
