import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Eye, EyeOff, User, Lock, Sparkles, Mail, Phone, VenetianMask, CalendarDays, IdCard, Droplet, } from "lucide-react";
import Logo from "../assets/logo2.png";
import authService from "@/api/authService";
import GoogleLoginButton from "./GoogleAuth";
import { motion } from "framer-motion";
import {
    Card,
    CardContent,
    TextField,
    Button,
    CircularProgress,
    InputAdornment,
    IconButton,
    createTheme,
    ThemeProvider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
} from "@mui/material";
import { bloodService, type BloodGroup } from "@/api/bloodService";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { CalendarToday } from "@mui/icons-material";
import dayjs from "dayjs";

const customTheme = createTheme({
    palette: {
        primary: {
            main: "#236AFE", // xanh dương đậm
        },
        secondary: {
            main: "#F7F9FF", // nền nhạt
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "16px",
                        backgroundColor: "#F7F9FF",
                        transition: "all 0.3s ease",
                        "&:hover": {
                            backgroundColor: "#ffffff",
                        },
                        "&.Mui-focused": {
                            backgroundColor: "#fff",
                            boxShadow: "0 0 0 2px rgba(35, 106, 254, 0.2)",
                        },
                        "& fieldset": {
                            borderColor: "#e5e7eb",
                            borderWidth: "2px",
                        },
                        "&:hover fieldset": {
                            borderColor: "#236AFE",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#236AFE",
                            borderWidth: "2px",
                        },
                    },
                    "& .MuiInputLabel-root": {
                        fontWeight: 600,
                        color: "#6b7280",
                        "&.Mui-focused": {
                            color: "#236AFE",
                        },
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "16px",
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: "16px",
                    padding: "12px 24px",
                    backgroundColor: "#236AFE",
                    color: "#fff",
                    transition: "all 0.3s ease",
                    "&:hover": {
                        backgroundColor: "#1e5ce3",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(35, 106, 254, 0.3)",
                    },
                },
            },
        },
    },
});
const Register: React.FC = () => {
    const [citizenIdNumber, setCitizenIdNumber] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [fullName, setFullName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [gender, setGender] = useState('');
    const [error, setError] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState<string>("");
    const [bloodGroupId, setBloodGroupId] = useState<string>("");

    const [bloodGroups, setBloodGroups] = useState<BloodGroup[]>([]);
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        const fetchBloodGroups = async () => {
          const bloodGroupFetch = await bloodService.getBloodGroups();
          console.log('bloodGroupFetch', bloodGroupFetch);
          setBloodGroups(bloodGroupFetch);
        };
        fetchBloodGroups();
      }, []);
    const navigate = useNavigate();
     const [open, setOpen] = useState(false);

    function mapErrorMessage(msg : string): string {
        if (msg === "Citizen already exists") return "CCCD đã tồn tại trong hệ thống";
        if (msg === "Phone already exists") return "Số điện thoại đã tồn tại trong hệ thống";
        if (msg === "Email already exists") return "Email đã tồn tại trong hệ thống";
        return msg; 
    }
    const validatePhone = (phone: string): boolean => {
        const phoneRegex = /^(0|\+84)[0-9]{9}$/;
        return phoneRegex.test(phone.trim());
    };
    const validatePassword = (password: string): boolean => password.length >= 8;
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    };

    const validateName = (name: string): boolean => {
        const nameRegex = /^[A-Za-zÀ-Ỹà-ỹ\s]{2,50}$/;
        return nameRegex.test(name.trim());
    };
    const validateGender = (gender: string): boolean => {
        const validGenders = ['male', 'female', 'other'];
        return validGenders.includes(gender.toLowerCase());
    };
    const handleRegisterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validatePhone(phone)) {
            toast.error("Số điện thoại không tồn tại");
            return;
        }
        if (!validateEmail(email)) {
            toast.error("Email không đúng định dạng");
            return;
        }
        if (!validateName(fullName)) {
            toast.error("Họ và tên không được để trống");
            return;
        }
        if (!validateGender(gender)) {
            toast.error("Giới tính ko thể để trống");
            return;
        }
        if (!validatePassword(password)) {
            toast.error("Mật khẩu ít nhất phải 8 kí tự");
            return;
        }

        try {
            console.log('bắt đầu call api đăng ký');
            const response = await authService.register({
                citizen_id_number: citizenIdNumber,
                full_name: fullName,
                email,
                phone,
                password,
                confirm_password: confirmPassword,
                gender,
                date_of_birth: dateOfBirth,
                blood_group_id: bloodGroupId,
            });

            if (response?.access_token && response?.user) {
                // localStorage.setItem("access_token", response.access_token);
                // localStorage.setItem("refresh_token", response.refresh_token);
                // localStorage.setItem("user", JSON.stringify(response.user));

                // console.log(localStorage.setItem("access_token", response.access_token),
                // localStorage.setItem("refresh_token", response.refresh_token),
                // localStorage.setItem("user", JSON.stringify(response.user)))

                toast.success("Đăng kí thành công");
                navigate("/");
            } else {
                console.log("First error:", response?.errorMessage);
               if (response?.errorMessage?.errors) {
                    const errorsObj = response.errorMessage.errors;
                    Object.keys(errorsObj).forEach((field) => {
                        console.log(`Field: ${field}, Error:`, errorsObj[field]);
                        toast.error(mapErrorMessage(errorsObj[field].msg) || "Lỗi không xác định");
                    });
                } else if (typeof response?.errorMessage === "string") {
                    toast.error(mapErrorMessage(response.errorMessage));
                } else {
                    toast.error("Đăng ký thất bại");
                }
            }

        } catch (error: any) {
            toast.error(mapErrorMessage("Lỗi không xác định"));
        }
    };


    return (
        <ThemeProvider theme={customTheme}>
            <div className="min-h-screen flex items-center justify-center px-4 bg-[#F7F9FF]">
                {/* <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    toastClassName="rounded-2xl shadow-lg"
                /> */}

                {/* Floating background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -left-40 w-80 h-80bg-[#236AFE]/20
 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
                    <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-200/30
 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-200/20
 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-5xl relative z-10"
                >
                    <Card
                        className="border-none shadow-2xl bg-white/95 backdrop-blur-md overflow-hidden"
                        sx={{ borderRadius: "24px" }}
                    >
                        <CardContent className="p-0">
                            <div className="flex flex-col lg:flex-row">
                                {/* Left side - Brand section */}
                                <motion.div
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.8 }}
                                    className="flex-1 bg-gradient-to-br from-[#236AFE] via-[#4D7CFE] to-[#89A7FF] p-8 lg:p-12 flex items-center justify-center relative overflow-hidden rounded-[10px]"
                                >
                                    {/* Decorative elements */}
                                    <div className="absolute top-10 right-10 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
                                    <div className="absolute bottom-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

                                    <div className="relative w-full max-w-md text-center ">
                                        <motion.div
                                            initial={{ y: 30, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.5, duration: 0.8 }}
                                            className="text-white mb-8 "
                                        >
                                            <div className="flex justify-center mb-6 ">
                                                <div className="relative">
                                                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                                                        <Sparkles className="w-10 h-10 text-white " />
                                                    </div>
                                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                                        <div className="w-2 h-2 bg-[#BD9EB7] rounded-full"></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h2 className="font-bold text-3xl lg:text-4xl mb-4 tracking-tight leading-tight">
                                                Chào mừng đến với
                                                <br />
                                                <span className="font-black bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                                                    Blood Donation
                                                </span>
                                            </h2>
                                            <p className="text-white/90 text-lg leading-relaxed">
                                                Dịch vụ đăng kí hiến và nhận máu
                                                <br />
                                                Hàng đầu việt nam
                                            </p>
                                        </motion.div>

                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.7, duration: 0.8 }}
                                            className="relative"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-pink-100/20 rounded-full blur-lg"></div>
                                            <img
                                                src={Logo}
                                                alt="logo"
                                                className="w-full h-auto max-w-md mx-auto rounded-full ring-4 ring-[#236AFE]/50
 shadow-2xl transform transition-all duration-500 hover:scale-105 relative z-10"
                                            />


                                        </motion.div>
                                    </div>
                                </motion.div>

                                {/* Right side - Login form */}
                                <div className="flex-1 px-8 lg:px-16 py-10 flex items-center justify-center">
                                    <motion.div
                                        initial={{ y: 30, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.6 }}
                                        className="w-full max-w-4xl bg-white p-12 rounded-lg shadow-md"
                                    >
                                        <div className="text-center mb-10">
                                            <h1 className="text-4xl font-black text-gray-800 mb-3 tracking-tight">
                                                Đăng Kí
                                            </h1>
                                            <p className="text-gray-600 text-base">
                                                Đăng kí để tiếp tục
                                            </p>
                                        </div>

                                        <motion.form
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.6, duration: 0.6 }}
                                            onSubmit={handleRegisterSubmit}
                                            className="space-y-6"
                                        >
                                            <TextField
                                                fullWidth
                                                id="fullName"
                                                label="Họ và tên"
                                                variant="outlined"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                size="medium"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <User className="text-blue-600 w-5 h-5" />
                                                        </InputAdornment>
                                                    ),
                                                    style: { height: "56px" },
                                                }}
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        height: "56px",
                                                    },
                                                }}
                                            />

                                            <TextField
                                                fullWidth
                                                id="email"
                                                label="Email"
                                                variant="outlined"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                size="medium"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Mail className="text-blue-600 w-5 h-5" />
                                                        </InputAdornment>
                                                    ),
                                                    style: { height: "56px" },
                                                }}
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        height: "56px",
                                                    },
                                                }}
                                            />



                                            <TextField
                                                fullWidth
                                                id="phone"
                                                label="Số điện thoại"
                                                variant="outlined"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                size="medium"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Phone className="text-blue-600 w-5 h-5" />
                                                        </InputAdornment>
                                                    ),
                                                    style: { height: "56px" },
                                                }}
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        height: "56px",
                                                    },
                                                }}
                                            />
                                            <TextField
                                                fullWidth
                                                select
                                                id="gender"
                                                label="Giới tính"
                                                value={gender}
                                                onChange={(e) => setGender(e.target.value)}
                                                size="medium"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <VenetianMask className="text-blue-600 w-5 h-5" />
                                                        </InputAdornment>
                                                    ),
                                                    style: { height: "56px" },
                                                }}
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        height: "56px",
                                                    },
                                                }}
                                                error={error}
                                                helperText={error ? "Vui lòng chọn giới tính hợp lệ" : ""}
                                            >
                                                <MenuItem value="">
                                                    -- Chọn giới tính --
                                                </MenuItem>
                                                <MenuItem value="Male">Nam</MenuItem>
                                                <MenuItem value="Female">Nữ</MenuItem>
                                                <MenuItem value="Other">Khác</MenuItem>
                                            </TextField>
                                            <TextField
                                                fullWidth
                                                id="citizen_id_number"
                                                label="Số CMND/CCCD"
                                                variant="outlined"
                                                value={citizenIdNumber}
                                                onChange={(e) => setCitizenIdNumber(e.target.value)}
                                                size="medium"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <IdCard className="text-blue-600 w-5 h-5" />
                                                        </InputAdornment>
                                                    ),
                                                    style: { height: "56px" },
                                                }}
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        height: "56px",
                                                    },
                                                }}
                                            />

<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
      <DatePicker
        label="Ngày sinh"
        value={dateOfBirth ? dayjs(dateOfBirth) : null}
        onChange={(val) => {
            setDateOfBirth(val ? val.toISOString() : "")
            console.log('Selected date:', val ? val.toISOString() : 'No date selected');
        }}
        format="DD/MM/YYYY"
        maxDate={dayjs()}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        slotProps={{
          textField: {
            fullWidth: true,
            required: true,
            size: "medium",
            InputProps: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton onClick={() => setOpen(true)}>
                    <CalendarToday className="text-blue-600" />
                  </IconButton>
                </InputAdornment>
              ),
              style: {
                height: "56px",
                borderRadius: "14px",
                backgroundColor: "#F7F9FF",
              },
            },
            sx: {
              "& .MuiOutlinedInput-root": {
                height: "56px",
                borderRadius: "14px",
                "& fieldset": {
                  borderWidth: "1.5px",
                },
              },
            },
          },
          openPickerButton: {
            sx: { display: "none" }, // ẩn icon mặc định bên phải
          },
        }}
      />
    </LocalizationProvider>


                                            <TextField
                                                fullWidth
                                                select
                                                id="blood_group_id"
                                                label="Nhóm máu"
                                                value={bloodGroupId}
                                                onChange={e => setBloodGroupId(e.target.value)}
                                                size="medium"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Droplet className="text-blue-600 w-5 h-5" />
                                                        </InputAdornment>
                                                    ),
                                                    style: { height: "56px" },
                                                }}
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        height: "56px",
                                                    },
                                                }}
                                                >
                                                <MenuItem value="">
                                                    -- Chọn nhóm máu của bạn --
                                                </MenuItem>
                                                {bloodGroups.map(bg => (
                                                    <MenuItem key={bg._id} value={bg._id}>
                                                    {bg.name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>

                                            <TextField
                                                fullWidth
                                                id="password"
                                                label="Mật khẩu"
                                                variant="outlined"
                                                type={passwordVisible ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                size="medium"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Lock className="text-blue-600 w-5 h-5" />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => setPasswordVisible(!passwordVisible)}
                                                                edge="end"
                                                                sx={{ color: "#3B82F6" }}
                                                            >
                                                                {passwordVisible ? (
                                                                    <EyeOff className="w-5 h-5" />
                                                                ) : (
                                                                    <Eye className="w-5 h-5" />
                                                                )}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                    style: { height: "56px" },
                                                }}
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        height: "56px",
                                                    },
                                                }}
                                            />
                                            <TextField
                                                fullWidth
                                                id="confirmPassword"
                                                label="Xác nhận mật khẩu"
                                                variant="outlined"
                                                type={passwordVisible ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                size="medium"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Lock className="text-blue-600 w-5 h-5" />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => setPasswordVisible(!passwordVisible)}
                                                                edge="end"
                                                                sx={{ color: "#3B82F6" }}
                                                            >
                                                                {passwordVisible ? (
                                                                    <EyeOff className="w-5 h-5" />
                                                                ) : (
                                                                    <Eye className="w-5 h-5" />
                                                                )}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                    style: { height: "56px" },
                                                }}
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        height: "56px",
                                                    },
                                                }}
                                            />
                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                disabled={loading}
                                                sx={{
                                                    height: 56,
                                                    background: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
                                                    "&:hover": {
                                                        background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
                                                    },
                                                    "&:disabled": {
                                                        background: "#e5e7eb",
                                                    },
                                                }}
                                            >
                                                {loading ? (
                                                    <div className="flex items-center justify-center">
                                                        <CircularProgress size={24} color="inherit" sx={{ mr: 2 }} />
                                                        Đang xử lý...
                                                    </div>
                                                ) : (
                                                    "Đăng Kí"
                                                )}
                                            </Button>
                                            <div className="flex items-center justify-between pt-2 text-sm">
                                                {/* <Link
          to="/forgot-password"
          className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200"
        >
          Quên mật khẩu?
        </Link> */}
                                                <Link
                                                    to="/login"
                                                    className="text-blue-600 font-semibold hover:text-blue-800 hover:underline transition-colors duration-200"
                                                >
                                                    Đã có tài khoản?
                                                </Link>
                                            </div>
                                        </motion.form>

                                    </motion.div>
                                </div>

                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <style>{`
                    @keyframes blob {
                        0% {
                            transform: translate(0px, 0px) scale(1);
                        }
                        33% {
                            transform: translate(30px, -50px) scale(1.1);
                        }
                        66% {
                            transform: translate(-20px, 20px) scale(0.9);
                        }
                        100% {
                            transform: translate(0px, 0px) scale(1);
                        }
                    }
                    .animate-blob {
                        animation: blob 7s infinite;
                    }
                    .animation-delay-2000 {
                        animation-delay: 2s;
                    }
                    .animation-delay-4000 {
                        animation-delay: 4s;
                    }
                `}</style>
            </div>
        </ThemeProvider>
    );
};

export default Register;
