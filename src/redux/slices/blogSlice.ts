import { createBlog, deleteBlog, fetchBlogById, fetchBlogs, fetchBlogsWithAuthors, updateBlog, type Blog, type BlogWithAuthor } from "@/api/blogService";
import { createSlice } from "@reduxjs/toolkit";

interface BlogState {
  blogs: BlogWithAuthor[]; // đổi sang BlogWithAuthor!
  loading: boolean;
  error: string | null;
  currentBlog: BlogWithAuthor | null;
}

const initialState: BlogState = {
  blogs: [],
  loading: false,
  error: null,
  currentBlog: null,
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi khi tải blogs.";
      })
        // Fetch by ID
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentBlog = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBlog = action.payload;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi khi tải blog.";
        state.currentBlog = null;
      })
      // Delete
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter(b => b._id !== action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.error = action.error.message || "Lỗi khi xóa blog.";
      })
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload = { ...blog, _id }
        const blog: Blog = {
            _id: action.payload._id,
            title: action.payload.title ?? "",
            content: action.payload.content ?? "",
            image: action.payload.image ?? "",
            author: action.payload.author ?? "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        state.blogs = [blog, ...state.blogs];
        })
      .addCase(createBlog.rejected, (state) => {
        state.loading = false;
      })
      // Update
       .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBlog = action.payload;
        const idx = state.blogs.findIndex(b => b._id === action.payload._id);
        if (idx > -1) state.blogs[idx] = action.payload;
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi khi cập nhật blog.";
      })

      // Fetch blogs with authors
      .addCase(fetchBlogsWithAuthors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogsWithAuthors.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchBlogsWithAuthors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi khi tải blogs với tác giả.";
      })
  }
});

export default blogSlice.reducer;
