import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../Api/axios.js'
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [user, setUser] = useState(null); // ✅ user state
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [otp, setOtp] = useState("");
  const [pendingUserId, setPendingUserId] = useState(null);  // renamed here
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [message, setMessage] = useState("");

  const [error, setError] = useState(""); // register form error
  const [otpError, setOtpError] = useState(""); // otp modal error

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setMessage(`Welcome back, ${JSON.parse(storedUser).name}!`);
    }
  }, [token]);

  // Form field update
  const updateFormData = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword((prev) => !prev);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword((prev) => !prev);
    }
  };

  // Register user API call
  const registerUser = async () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return false;
    }
    if (name.trim().length < 3) {
      setError("Name must be at least 3 characters long.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    setIsLoading(true);
    setError("");

    try {
      const { data } = await api.post("/register", { name, email, password });

      setPendingUserId(data.pendingUserId);  // save pendingUserId
      setShowOtpModal(true);
      return true;

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      return false;

    } finally {
      setIsLoading(false);
    }
  };


  const loginUser = async (email, password) => {
    try {
      setIsLoading(true);
      setError("");
      const { data } = await api.post("/login", { email, password });
      localStorage.setItem("token", data.accessToken); // fix key name
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.accessToken);
      setUser(data.user);
      setMessage(`Welcome back, ${data.user.name}!`);
      navigate("/user/dashboard");
      return true;
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Clear user
    setUser(null);
    setToken(null);
    setMessage("Logged out successfully");
    navigate("/login");
  };


  // Verify OTP API call
  const verifyOtp = async () => {
    if (!otp.trim()) {
      setOtpError("Please enter the OTP");
      return false;
    }

    setIsLoading(true);
    setOtpError("");

    try {
      await api.post("/verify-email-otp", { pendingUserId, otp }); // send pendingUserId
      setShowOtpModal(false);
      navigate("/user/dashboard");
      return true;

    } catch (err) {
      setOtpError(err.response?.data?.message || "Invalid OTP");
      return false;

    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP API call
  const resendOtp = async () => {
    setIsLoading(true);
    setOtpError("");

    try {
      await api.post("/resend-email-otp", { pendingUserId, email: formData.email });
      setOtp(""); // Clear previous OTP
      return true;  // Success flag
    } catch (err) {
      setOtpError(err.response?.data?.message || "Failed to resend OTP");
      return false; // Failure flag
    } finally {
      setIsLoading(false);
    }
  };


  const closeOtpModal = () => {
    setShowOtpModal(false);
    setOtp("");
    setOtpError("");
  };

  return (
    <AuthContext.Provider
      value={{
        formData,
        updateFormData,
        showPassword,
        showConfirmPassword,
        togglePasswordVisibility,
        showOtpModal,
        setShowOtpModal,
        otp,
        setOtp,
        error,
        isLoading,
        setOtpError,
        registerUser,
        resendOtp,
        verifyOtp,
        closeOtpModal,
        loginUser, // Updated function name
        logout,
        otpError,
        user,
        token,
        message,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
