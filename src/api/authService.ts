import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "https://be-production-84a8.up.railway.app";

type DecodedToken = {
  user_id: string;
  role: string;
  token_type?: number;
  iat?: number;
  exp?: number;
};

const authService = {
  login: async (phone: string, password: string) => {
    console.log("Sending login with:", { phone, password });

    try {


      const response = await axios.post(`${API_URL}/users/login`, {
        phone,
        password,
      });

      console.log(response.data);

      if (response.data?.result?.access_token) {
  const { access_token, refresh_token } = response.data.result;
  const decodedUser: DecodedToken = jwtDecode(access_token);

  if (!decodedUser) throw new Error("Failed to decode token");

  const user = {
    id: decodedUser.user_id,
    role: decodedUser.role,
  };

  return { access_token, refresh_token, user };
}

throw new Error("Invalid login response");

    } catch (error: any) {
      return {
        token: null,
        refreshToken: null,
        role: null,
        errorMessage:
          error.response?.data?.message || error.message || "Login failed",
      };
    }
  },

 register: async ({
  full_name,
  email,
  phone,
  password,
  confirm_password,
  gender,
}: {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
  gender: string;
}) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/register`,
      {
        full_name,
        email,
        phone,
        password,
        confirm_password,
        gender,
        role: "Customer",
        date_of_birth: "2000-01-01T00:00:00.000Z", // hoặc để người dùng chọn
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        // Quan trọng nếu server yêu cầu
        withCredentials: true,
      }
    );

    if (response.data?.result?.access_token) {
      const { access_token, refresh_token } = response.data.result;
      const decodedUser: DecodedToken = jwtDecode(access_token);
      const user = {
        id: decodedUser.user_id,
        role: decodedUser.role,
      };

      return { access_token, refresh_token, user };
    }

    throw new Error("Invalid register response");
  } catch (error: any) {
    console.error("Register Error:", error.response?.data || error.message);
    return {
      token: null,
      refreshToken: null,
      role: null,
      errorMessage:
        error.response?.data?.message || error.message || "Đăng ký thất bại",
    };
  }
},

  googleSignIn: async (googleToken: string) => {
    try {
      const response = await axios.post(`${API_URL}/UserAccount/login-google`, {
        token: googleToken,
      });

      const data = response.data;

      if (!data?.isSuccess || !data?.jwtToken) {
        throw new Error(data?.errorMessage || "Xác thực Google thất bại");
      }

      // Decode token để lấy thông tin user
      const decodedUser = jwtDecode<DecodedToken>(data.jwtToken);

      const user: DecodedToken = {
        id: decodedUser.id,
        name: decodedUser.name || data.name || "No Name",
        email: decodedUser.email || data.email || "",
        role: decodedUser.role || data.role || "Customer",
        phone: decodedUser.phone || "",
        gender: decodedUser.gender || "unknown",
        dob: decodedUser.dob || "",
      };

      return {
        jwtToken: data.jwtToken,
        refreshToken: data.refreshToken,
        user,
        role: user.role,
        isSuccess: true,
        name: user.name,
      };
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      return {
        jwtToken: null,
        refreshToken: null,
        user: null,
        isSuccess: false,
        errorMessage: "Đăng nhập Google thất bại",
      };
    }
  },
};
export default authService;
