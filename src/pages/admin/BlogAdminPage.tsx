import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs, deleteBlog, createBlog } from "@/api/blogService";
import BlogModalForm from "../../components/blogComponents/BlogModalForm ";
import { toast } from "react-toastify";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TablePagination, CircularProgress, Box,
  Dialog, DialogTitle, DialogActions
} from "@mui/material";

export interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
  created_at: string;
  updated_at: string;
  author: string;
}
const PRIMARY_COLOR = "#236AFE";

export default function BlogAdminPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0); // Bắt đầu từ 0
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const blogs = useSelector((state: any) => state.blog.blogs);
  const loading = useSelector((state: any) => state.blog.loading);
  const error = useSelector((state: any) => state.blog.error);

  useEffect(() => {
    dispatch(fetchBlogs() as any);
  }, [dispatch]);

  // Hàm xác nhận xoá blog (gọi API + toast + refresh lại list)
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await dispatch(deleteBlog(deleteId) as any).unwrap();
      toast.success("Xóa blog thành công!");
      dispatch(fetchBlogs() as any); // Refresh lại danh sách
    } catch {
      toast.error("Có lỗi khi xóa blog!");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  // Hàm tạo blog mới (toast kết quả)
  const handleCreate = async (blog: Partial<Blog>) => {
    try {
      await dispatch(createBlog(blog) as any).unwrap();
      setModalOpen(false);
      toast.success("Tạo blog thành công!");
      dispatch(fetchBlogs() as any); // reload lại luôn cho chắc
    } catch {
      toast.error("Có lỗi khi tạo blog!");
    }
  };

  // Phân trang client
  const pagedBlogs = blogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ px: 3, py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <h2 style={{ fontSize: 24, fontWeight: 600, color: "#222" }}>Quản lý Blogs</h2>
        <Button
          variant="contained"
          sx={{ bgcolor: PRIMARY_COLOR, color: "#fff", fontWeight: 500 }}
          onClick={() => setModalOpen(true)}
        >
          + Thêm Blog
        </Button>
      </Box>

      {error && <Box color="red" mb={2}>{error}</Box>}

      <Paper>
        {loading ? (
          <Box display="flex" alignItems="center" justifyContent="center" height={220}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ảnh</TableCell>
                    <TableCell>Tiêu đề</TableCell>
                    <TableCell>Tác giả</TableCell>
                    <TableCell>Ngày tạo</TableCell>
                    <TableCell>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagedBlogs.map((item: Blog) => (
                    <TableRow key={item._id} hover>
                      <TableCell>
                        {item.image ? (
                          <img src={item.image} alt="img" style={{ width: 48, height: 48, borderRadius: 6, objectFit: "cover" }} />
                        ) : (
                          <span style={{ color: "#888", fontStyle: "italic" }}>No image</span>
                        )}
                      </TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.author}</TableCell>
                      <TableCell>
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="text"
                          size="small"
                          style={{ color: "#10b981", fontWeight: 600 }}
                          onClick={() => navigate(`/dashboard-admin/blogs/${item._id}/preview`)}
                        >
                          Xem trước
                        </Button>
                        <Button
                          variant="text"
                          size="small"
                          color="primary"
                          onClick={() => navigate(`/dashboard-admin/blogs/${item._id}/edit`)}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="text"
                          size="small"
                          color="error"
                          onClick={() => setDeleteId(item._id)}
                        >
                          Xoá
                        </Button>
                      </TableCell>

                    </TableRow>
                  ))}
                  {pagedBlogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" style={{ color: "#888", fontStyle: "italic" }}>
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={blogs.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={e => {
                setRowsPerPage(+e.target.value);
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 20]}
              labelRowsPerPage="Số dòng mỗi trang"
            />
          </>
        )}
      </Paper>
      {modalOpen && (
        <BlogModalForm
          onClose={() => setModalOpen(false)}
          onSave={handleCreate}
          loading={loading}
        />
      )}
      {/* Dialog xác nhận xoá */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Bạn chắc chắn muốn xoá blog này?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} disabled={deleting}>Huỷ</Button>
          <Button color="error" onClick={handleDeleteConfirm} disabled={deleting}>
            {deleting ? "Đang xoá..." : "Xoá"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
