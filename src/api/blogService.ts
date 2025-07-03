import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from './apiClient'; 

export interface User {
  _id: string;
  name: string;
  avatar: string;
}
export interface BlogWithAuthor extends Blog {
  authorInfo?: User | null;
}
export interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
  created_at: string;
  updated_at: string;
  author: string;
}
export interface ApiResponse<T> {
  message: string;
  result: T;
}
export interface ApiResponseCreateBlog{
  insertedId: string;
  message: string;
}

export const fetchBlogs = createAsyncThunk(
  'blog/fetchBlogs',
  async () => {
    const res = await apiClient.get<ApiResponse<Blog[]>>("/blogs");
    console.log("Blogs fetched:", res);
    return res.data.result;
  }
);
export const fetchBlogById = createAsyncThunk(
  'blog/fetchBlogById',
  async (id: string) => {
    const res = await apiClient.get<ApiResponse<Blog>>(`/blogs/${id}`);
    return res.data.result;
  }
);
// Xoá blog
export const deleteBlog = createAsyncThunk(
  'blog/deleteBlog',
  async (id: string) => {
    await apiClient.delete(`/blogs/${id}`);
    return id;
  }
);

// Tạo blog mới
export const createBlog = createAsyncThunk(
  'blog/createBlog',
  async (blog: Partial<Blog>) => {
    const res = await apiClient.post<ApiResponse<{ acknowledged: boolean, insertedId: string }>>("/blogs", blog);
    // trả về insertedId + dữ liệu form vừa nhập (bổ sung)
    return { ...blog, _id: res.data.result.insertedId };
  }
);

export const updateBlog = createAsyncThunk(
  'blog/updateBlog',
  async (blog: Blog) => {
    const res = await apiClient.patch<ApiResponse<Blog>>(`/blogs/${blog._id}`, blog);
    return res.data.result;
  }
);
export const fetchBlogsWithAuthors = createAsyncThunk(
  'blog/fetchBlogsWithAuthors',
  async () => {
    const res = await apiClient.get<ApiResponse<Blog[]>>("/blogs");
    const blogs = res.data.result;
    console.log("Blogs fetched with authors: 75", blogs);
    const authorIds = Array.from(new Set(blogs.map(blog => blog.author)));
    console.log("Unique author IDs: 78", authorIds);
    const users = await Promise.all(
      authorIds.map(id =>
        apiClient.get<ApiResponse<User>>(`/users/${id}`).then(res => res.data.result)
      )
    );
    console.log("Users fetched for authors: 82", users);
    const userMap = new Map(users.map(u => [u._id, u]));

    const blogsWithAuthor: BlogWithAuthor[] = blogs.map(blog => ({
      ...blog,
      authorInfo: userMap.get(blog.author) ?? null,
    }));
    console.log("Blogs with author info: 90", blogsWithAuthor);
    return blogsWithAuthor;
  }
);