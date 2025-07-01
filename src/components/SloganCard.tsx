import React from "react";

interface SloganCardProps {
  title: string;
  description: string;
}

const SloganCard: React.FC<SloganCardProps> = ({ title, description }) => {
  return (
    <div className="bg-blue-500 rounded-3xl p-8 shadow-md flex flex-col items-center justify-center text-white relative min-h-[20rem]">
      <span className="text-3xl font-extrabold opacity-90 mb-2">{title}</span>
      <span className="opacity-90 text-base text-center mt-2">{description}</span>
    </div>
  );
};

export default SloganCard;
