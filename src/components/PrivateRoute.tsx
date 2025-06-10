import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-toastify";

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  useEffect(() => {
    if (!user) {
      toast.info("Bạn phải đăng nhập để tiếp tục!", { toastId: "login-required" });
    } else if (requiredRole && user.role !== requiredRole) {
      toast.error("Bạn không có quyền truy cập trang này!", { toastId: "role-required" });
    }
  }, [user, requiredRole, location]);

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default PrivateRoute;