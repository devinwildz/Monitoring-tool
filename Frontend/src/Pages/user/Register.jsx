
import { Circle, Eye, EyeOff } from "lucide-react";
import OtpModal from "../../Components/otpModal";
import { useAuth } from "../../Context/authContext";
import { toast } from "react-toastify";  // Adjust path as needed
import { Link } from "react-router-dom";



const Register = () => {
    const {
        formData,
        updateFormData,
        showPassword,
        showConfirmPassword,
        togglePasswordVisibility,
        error,
        otpError,
        isLoading,
        resendOtp,
        showOtpModal,
        setShowOtpModal,
        otp,
        setOtp,
        setOtpError,
        registerUser,
        verifyOtp,
        closeOtpModal,
    } = useAuth();




    const handleChange = (e) => {
        updateFormData(e.target.name, e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await registerUser();
    };

    
    const handleOtpSubmit = async () => {
        try {
            // Empty OTP check
            if (!otp.trim()) {
                setOtpError("Please enter the OTP");
                return;
            }

            setOtpError(""); // Clear any previous OTP error

            const success = await verifyOtp();
            if (success) {
                toast.success("Account created successfully! 🎉");
                setShowOtpModal(false);
            }
        } catch (err) {
            setOtpError(err?.response?.data?.message || "Invalid OTP");
        }
    };


    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-[#0c1624] to-[#1a2a44] flex items-center justify-center px-4">
                <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-800">
                    <div className="flex items-center justify-center mb-6">
                        <Circle className="text-green-500 fill-green-500 w-4 h-4 mr-2" />
                        <h1 className="text-2xl font-bold text-green-500">MonitorPro</h1>
                    </div>
                    <h2 className="text-3xl font-semibold text-white text-center mb-6">
                        Create your account
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-300 mb-1"
                            >
                                Your name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="E.g. John Doe"
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                                aria-label="Full name"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-300 mb-1"
                            >
                                Your e-mail
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="E.g. info@example.com"
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                                aria-label="Email address"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-300 mb-1"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                                    aria-label="Password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility("password")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-300 mb-1"
                            >
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                                    aria-label="Confirm password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility("confirmPassword")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide confirm password"
                                            : "Show confirm password"
                                    }
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                        {error && (
                            <p className="text-red-500 text-sm text-center">{error}</p>
                        )}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-green-500 cursor-pointer text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-green-700 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Registering..." : "Sign up"}
                        </button>
                    </form>
                    <p className="text-center text-gray-400 text-sm mt-4">
                        Already have an account?{" "}
                        <Link to="/login" className="text-green-500 hover:underline">
                            Log in here
                        </Link>
                    </p>
                </div>
            </div>

            <OtpModal
                isOpen={showOtpModal}
                otp={otp}
                setOtp={setOtp}
                otpError={otpError} // pass OTP error
                onVerify={handleOtpSubmit}
                onResend={resendOtp}   // <-- Pass resendOtp here
                onClose={() => setShowOtpModal(false)}
            />
        </>
    );
};

export default Register;
