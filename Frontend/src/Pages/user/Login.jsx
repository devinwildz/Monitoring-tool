import React, { useState } from "react";
import { Circle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../Context/authContext";

const Login = () => {
    const { loginUser, isLoading, error } = useAuth(); // ✅ context se state
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [validationError, setValidationError] = useState(""); // ✅ local validation error

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (validationError) setValidationError(""); // error reset on typing
    };

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // --- Validations ---
        if (!formData.email.trim() || !formData.password.trim()) {
            setValidationError("Please fill in all fields.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setValidationError("Please enter a valid email address.");
            return;
        }

        if (formData.password.length < 6) {
            setValidationError("Password must be at least 6 characters long.");
            return;
        }

        // --- API Call via AuthContext ---
        const success = await loginUser(formData.email, formData.password, rememberMe);

        if (success) {
            console.log("✅ Login success, context handled");
            // Redirect logic yahan daal sakte ho (e.g., navigate('/dashboard'))
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0c1624] to-[#1a2a44] flex items-center justify-center px-4">
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-800">
                <div className="flex items-center justify-center mb-6">
                    <Circle className="text-green-500 fill-green-500 w-4 h-4 mr-2" />
                    <h1 className="text-2xl font-bold text-white">MonitorPro</h1>
                </div>
                <h2 className="text-3xl font-semibold text-white text-center mb-6">
                    Welcome <span className="text-green-500">back!</span>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
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

                    {/* Password */}
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
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Remember me */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center text-gray-300">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={() => setRememberMe((prev) => !prev)}
                                className="mr-2 accent-green-500"
                            />
                            Remember me for 30 days
                        </label>
                        <a href="/forgot-password" className="text-green-500 hover:underline">
                            Forgot your password?
                        </a>
                    </div>

                    {/* Errors */}
                    {validationError && (
                        <p className="text-red-500 text-sm text-center">{validationError}</p>
                    )}
                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-green-700 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Logging in..." : "Log in"}
                    </button>
                </form>

                <p className="text-center text-gray-400 text-sm mt-4">
                    Don&apos;t have an account?{" "}
                    <a href="/signup" className="text-green-500 hover:underline">
                        Sign up here
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
