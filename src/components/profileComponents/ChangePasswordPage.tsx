import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import type { UserProfile } from "@/redux/slices/userSlice";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import { changePassword } from "@/api/userService"; // Thay đổi theo vị trí file của bạn
import roleVN from "@/utils/roleVN";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=dedede&color=222&rounded=true&size=128";

// Regex rule: 6-50 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{6,50}$/;

const ChangePasswordPage: React.FC = () => {
  const profile = useSelector((state: RootState) => state.user.profile) as UserProfile | null;

  const [formData, setFormData] = useState({
    old_password: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState<{ old?: string; password?: string; confirm?: string; common?: string }>({});
  const [loading, setLoading] = useState(false);

  if (!profile) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="text-gray-400 text-lg">Đang tải thông tin người dùng...</span>
      </div>
    );
  }

  const handleFieldChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError({});
  };

  const validateFields = () => {
    const errors: typeof error = {};
    if (!formData.old_password) errors.old = "Nhập mật khẩu hiện tại!";
    else if (!passwordRegex.test(formData.old_password))
      errors.old = "Mật khẩu hiện tại phải từ 6-50 ký tự, chứa chữ hoa, chữ thường, số, ký tự đặc biệt.";
    if (!formData.password) errors.password = "Nhập mật khẩu mới!";
    else if (!passwordRegex.test(formData.password))
      errors.password = "Mật khẩu mới phải từ 6-50 ký tự, chứa chữ hoa, chữ thường, số, ký tự đặc biệt.";
    if (!formData.confirm_password) errors.confirm = "Xác nhận mật khẩu mới!";
    else if (formData.password !== formData.confirm_password)
      errors.confirm = "Xác nhận mật khẩu không khớp!";
    return errors;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }
    try {
      setLoading(true);
      await changePassword({
        old_password: formData.old_password,
        password: formData.password,
        confirm_password: formData.confirm_password,
      });
      toast.success("Đổi mật khẩu thành công!");
      setFormData({
        old_password: "",
        password: "",
        confirm_password: "",
      });
      setError({});
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setError({ old: "Mật khẩu hiện tại không đúng!" });
      } else if (err.response?.data?.message) {
        setError({ common: err.response.data.message });
      } else {
        setError({ common: "Có lỗi xảy ra. Vui lòng thử lại!" });
      }
      toast.error("Đổi mật khẩu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mb-20">
      <div
        className="bg-white shadow-md rounded-2xl p-8"
        style={{
          maxWidth: "90%",
          margin: "0 auto",
          borderRadius: "1rem",
        }}
      >
        {/* Header giống trang profile */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <img
              src={profile.avatar_url || DEFAULT_AVATAR}
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow"
            />
          </div>
          <div className="mt-3 text-xl font-bold text-gray-700">{profile.full_name}</div>
          <div className="text-gray-400">{profile.email}</div>
          <div className="text-sm text-blue-600 font-semibold mt-1">{roleVN(profile.role)}</div>
        </div>

        {/* Form đổi mật khẩu */}
        <form onSubmit={handleChangePassword} className="pl-24 max-w-2xl mx-auto">
          <TextField
            label="Mật khẩu hiện tại"
            type="password"
            value={formData.old_password}
            onChange={(e) => handleFieldChange("old_password", e.target.value)}
            fullWidth
            margin="normal"
            required
            error={!!error.old}
            helperText={error.old}
            autoComplete="current-password"
          />
          <TextField
            label="Mật khẩu mới"
            type="password"
            value={formData.password}
            onChange={(e) => handleFieldChange("password", e.target.value)}
            fullWidth
            margin="normal"
            required
            error={!!error.password}
            helperText={error.password}
            autoComplete="new-password"
          />
          <TextField
            label="Xác nhận mật khẩu mới"
            type="password"
            value={formData.confirm_password}
            onChange={(e) => handleFieldChange("confirm_password", e.target.value)}
            fullWidth
            margin="normal"
            required
            error={!!error.confirm}
            helperText={error.confirm}
            autoComplete="new-password"
          />
          {error.common && <div className="text-red-500 text-sm mt-2">{error.common}</div>}
          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              Đổi mật khẩu
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
