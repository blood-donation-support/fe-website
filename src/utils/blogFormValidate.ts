export interface BlogFormValues {
  title: string;
  content: string;
  image: string;
  author: string;
}

export interface BlogFormErrors {
  title?: string;
  content?: string;
  image?: string;
  author?: string;
}

export function validateBlogForm(values: BlogFormValues): BlogFormErrors {
  const errors: BlogFormErrors = {};

  if (!values.title.trim())
    errors.title = "Tiêu đề không được để trống";

  if (!values.content.trim())
    errors.content = "Nội dung không được để trống";

  // Validate link ảnh: phải là link ảnh, đúng format
  if (values.image.trim()) {
    const links = values.image.split(",").map(link => link.trim());
    const urlRegex = /^https?:\/\/.*\.(jpg|jpeg|png|webp|gif)$/i;
    const invalids = links.filter(link => !urlRegex.test(link));
    if (invalids.length > 0)
      errors.image = "Tất cả link ảnh phải là URL hợp lệ và kết thúc bằng jpg/jpeg/png/webp/gif";
  }

  if (values.author.trim()) {
    const authorRegex = /^[\p{L}\s.'-]{2,40}$/u;
    if (!authorRegex.test(values.author.trim()))
      errors.author = "Tên tác giả chỉ gồm chữ cái, khoảng trắng, dấu chấm, nháy, gạch ngang (2-40 ký tự)";
  } else {
    errors.author = "Tên tác giả không được để trống";
  }

  return errors;
}
