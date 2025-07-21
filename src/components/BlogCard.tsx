import { motion } from "framer-motion";
// BlogCard.jsx
export default function BlogCard({ image, title, summary, logo, blogUrl, author, domain }:any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 ,height:'70%'}}
      whileInView={{ opacity: 1, y: 0, height:'100%' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col w-full min-h-[60rem] snap-center h-full"
    >
      <img src='src/assets/blood-donation(5).jpg' alt={title} className="w-full h-[35rem] object-cover" />
      <motion.div
        initial={{ opacity: 0, maxHeight: 0 }}
        whileInView={{ opacity: 1, maxHeight: 600 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 2, ease: "easeOut" }}
       className="p-4 flex flex-col flex-1">
        <h2 className="font-semibold text-6xl pb-2 line-clamp-2 mb-10">{title}</h2>
        <p className="text-gray-600 text-lg mb-4 line-clamp-3">{summary}</p>
        <div className="flex items-center mt-auto pt-2 border-t border-gray-100">
          {logo &&
            <img src={logo} alt="Logo" className="w-7 h-7 rounded-md mr-2 border" />
          }
          <div>
            <div className="text-xs text-gray-500">{author}</div>
            <a href={blogUrl} className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              {domain || blogUrl}
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>

  );
}
