import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs, deleteBlog, createBlog } from "@/api/blogService";
import { toast } from "react-toastify";
import { Eye, Trash2 } from "lucide-react";
import { getPreviewText } from "@/utils/prettier";
import BlogModalForm from "@/components/blogComponents/BlogModalForm ";

export interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
  created_at: string;
  updated_at: string;
  author: string;
}

const dateSortOptions = [
  { label: "Mới nhất", value: "desc" },
  { label: "Cũ nhất", value: "asc" },
];

export default function BlogAdminPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const blogs = useSelector((state: any) => state.blog.blogs);
  const loading = useSelector((state: any) => state.blog.loading);
  const error = useSelector((state: any) => state.blog.error);

  useEffect(() => {
    dispatch(fetchBlogs() as any);
  }, [dispatch]);

  // Hàm xác nhận xoá blog
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await dispatch(deleteBlog(deleteId) as any).unwrap();
      toast.success("Xóa blog thành công!");
      dispatch(fetchBlogs() as any);
    } catch {
      toast.error("Có lỗi khi xóa blog!");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  // Hàm tạo blog mới
  const handleCreate = async (blog: Partial<Blog>) => {
    try {
      await dispatch(createBlog(blog) as any).unwrap();
      setModalOpen(false);
      toast.success("Tạo blog thành công!");
      dispatch(fetchBlogs() as any);
    } catch {
      toast.error("Có lỗi khi tạo blog!");
    }
  };

  // Filter và sort blog
  const filteredBlogs = useMemo(() => {
    let arr = blogs;
    if (search) {
      arr = arr.filter((item: Blog) =>
        item.title?.toLowerCase().includes(search.toLowerCase())
      );
    }
    arr = [...arr].sort((a, b) =>
      sortOrder === "desc"
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    return arr;
  }, [blogs, search, sortOrder]);

  const pagedBlogs = filteredBlogs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <h1 className="text-[2rem] font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded shadow text-center mb-6">
          Quản lý Blogs
        </h1>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
       
        <div className="flex gap-3 flex-wrap">
          <input
            className="h-10 px-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tìm kiếm theo tiêu đề..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
          <select
            className="h-10 px-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={sortOrder}
            onChange={e => {
              setSortOrder(e.target.value as "desc" | "asc");
              setPage(0);
            }}
          >
            {dateSortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          
        </div>
        <button
            onClick={() => setModalOpen(true)}
            className="h-10 px-5 rounded-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow"
          >
            + Thêm Blog
          </button>
      </div>
      {error && (
        <div className="text-red-600 font-semibold mb-2">{error}</div>
      )}

      <div className="overflow-x-auto bg-white rounded-xl shadow border">
        <table className="min-w-[900px] w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-purple-600">
              <th className="text-white font-semibold px-4 py-3 text-center w-14">STT</th>
              <th className="text-white font-semibold px-4 py-3 text-left w-20">Ảnh</th>
              <th className="text-white font-semibold px-4 py-3 text-left min-w-[3.2vh]">Tiêu đề</th>
              <th className="text-white font-semibold px-4 py-3 text-left min-w-[140px]">Tác giả</th>
              <th className="text-white font-semibold px-4 py-3 text-center min-w-[180px]">Ngày tạo</th>
              <th className="text-white font-semibold px-4 py-3 text-center min-w-[120px]">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6}>
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                </td>
              </tr>
            ) : pagedBlogs.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="text-center py-8 text-gray-500">
                    Không có dữ liệu
                  </div>
                </td>
              </tr>
            ) : (
              pagedBlogs.map((item: Blog, idx: number) => (
                <tr
                  key={item._id}
                  className={`hover:bg-blue-50 transition-all ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3 text-center font-medium">
                    {page * rowsPerPage + idx + 1}
                  </td>
                  <td className="px-4 py-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt="img"
                        className="w-12 h-12 object-cover rounded-md mx-auto"
                      />
                    ) : (
                      <span className="text-gray-400 italic">Không có ảnh</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap max-w-[220px] overflow-hidden text-ellipsis">
                    {getPreviewText(item.title, 140)}
                  </td>
                  <td className="px-4 py-3 text-gray-700 font-medium max-w-[140px] whitespace-nowrap overflow-hidden text-ellipsis">
                    {getPreviewText(item.author, 40)}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : ""}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="px-3 py-1 rounded-md bg-green-50 hover:bg-green-100 text-green-700 font-semibold"
                        onClick={() =>
                          navigate(`/dashboard-admin/blogs/${item._id}/preview`)
                        }
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="px-3 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold"
                        onClick={() =>
                          navigate(`/dashboard-admin/blogs/${item._id}/edit`)
                        }
                      >
                        <svg
															className="w-4 h-4"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
															/>
														</svg>
                      </button>
                      <button
                        className="px-3 py-1 rounded-md bg-red-50 hover:bg-red-100 text-red-700 font-semibold"
                        onClick={() => setDeleteId(item._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
        <span className="text-gray-500 text-sm">
       
        </span>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-500">Số dòng/trang:</span>
          <select
            className="h-8 px-2 border border-gray-300 rounded bg-white"
            value={rowsPerPage}
            onChange={e => {
              setRowsPerPage(+e.target.value);
              setPage(0);
            }}
          >
            {[5, 10, 20, 50].map(num => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <button
            onClick={() => setPage(Math.max(page - 1, 0))}
            className="ml-2 px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
            disabled={page === 0}
          >
            &lt;
          </button>
          <span className="mx-2 text-sm text-gray-700">
            {page + 1}/{Math.ceil(filteredBlogs.length / rowsPerPage) || 1}
          </span>
          <button
            onClick={() =>
              setPage(
                Math.min(
                  page + 1,
                  Math.floor(filteredBlogs.length / rowsPerPage)
                )
              )
            }
            className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
            disabled={
              (page + 1) * rowsPerPage >= filteredBlogs.length
            }
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Dialog xác nhận xoá */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Bạn chắc chắn muốn xoá blog này?</h2>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold"
                onClick={() => setDeleteId(null)}
                disabled={deleting}
              >
                Huỷ
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white font-semibold"
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? "Đang xoá..." : "Xoá"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm Blog */}
      {modalOpen && (
        <BlogModalForm
          onClose={() => setModalOpen(false)}
          onSave={handleCreate}
          loading={loading}
        />
      )}
    </div>
  );
}
