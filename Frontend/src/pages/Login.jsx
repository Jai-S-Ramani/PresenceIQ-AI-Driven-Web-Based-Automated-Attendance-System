import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Login = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		rememberMe: false,
	});
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [apiError, setApiError] = useState("");
	const navigate = useNavigate();
	const { login } = useAuth();

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
		// Clear error for this field
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
		setApiError("");
	};

	const validate = () => {
		const newErrors = {};

		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validate()) {
			return;
		}

		setLoading(true);
		setApiError("");

		try {
			const user = await login(formData);
			const roleRoutes = {
				admin: "/admin/dashboard",
				teacher: "/teacher/dashboard",
				student: "/student/dashboard",
			};
			navigate(roleRoutes[user.role] || "/");
		} catch (error) {
			console.error("Login error:", error);
			setApiError(
				error.message || "Invalid email or password. Please try again."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="min-h-screen flex relative overflow-hidden"
			style={{
				background:
					"linear-gradient(to bottom right, #99B69B, #E4E3D3, #7976B6)",
			}}
		>
			{/* Animated Background Elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{/* Floating Orbs with custom colors */}
				<div
					className="absolute top-20 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"
					style={{ backgroundColor: "#99B69B" }}
				></div>
				<div
					className="absolute top-40 right-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"
					style={{ backgroundColor: "#7976B6" }}
				></div>
				<div
					className="absolute -bottom-8 left-40 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"
					style={{ backgroundColor: "#E4E3D3" }}
				></div>

				{/* Grid Pattern */}
				<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-20"></div>
			</div>

			{/* Left Side - Welcome Content */}
			<div className="hidden lg:flex flex-1 items-center justify-center p-12 z-10">
				<div className="max-w-lg space-y-8 animate-fade-in">
					<div className="text-center mb-8">
						<div className="flex items-center justify-center gap-3 mb-4">
							<img
								src="https://cdn-icons-gif.flaticon.com/18173/18173958.gif"
								alt="PresenceIQ Logo"
								className="w-20 h-20 transform hover:scale-110 hover:rotate-12 transition-all duration-300 cursor-pointer"
							/>
							<h1
								className="text-5xl font-extrabold bg-clip-text text-transparent drop-shadow-lg"
								style={{
									backgroundImage:
										"linear-gradient(to right, #8ecae6, #5f0f40, #fb5607)",
								}}
							>
								PresenceIQ
							</h1>
						</div>
					</div>
					<h2 className="text-4xl font-bold text-[#080000] drop-shadow-lg">
						Welcome Back!
					</h2>
					<p className="text-xl text-[#080000]/90 font-medium">
						Sign in to access your AI-powered attendance management
						system
					</p>
					<div className="space-y-4">
						<div className="flex items-center gap-4 bg-white/30 backdrop-blur-md p-4 rounded-xl border-2 border-white/40 hover:bg-white/40 hover:border-white/60 transition-all shadow-lg">
							<span className="flex-shrink-0 w-10 h-10 bg-[#080000]/80 rounded-full flex items-center justify-center text-2xl text-white font-bold">
								✓
							</span>
							<span className="text-lg text-[#080000] font-semibold">
								Real-time Attendance Tracking
							</span>
						</div>
						<div className="flex items-center gap-4 bg-white/30 backdrop-blur-md p-4 rounded-xl border-2 border-white/40 hover:bg-white/40 hover:border-white/60 transition-all shadow-lg">
							<span className="flex-shrink-0 w-10 h-10 bg-[#080000]/80 rounded-full flex items-center justify-center text-2xl text-white font-bold">
								✓
							</span>
							<span className="text-lg text-[#080000] font-semibold">
								AI-Powered Face Recognition
							</span>
						</div>
						<div className="flex items-center gap-4 bg-white/30 backdrop-blur-md p-4 rounded-xl border-2 border-white/40 hover:bg-white/40 hover:border-white/60 transition-all shadow-lg">
							<span className="flex-shrink-0 w-10 h-10 bg-[#080000]/80 rounded-full flex items-center justify-center text-2xl text-white font-bold">
								✓
							</span>
							<span className="text-lg text-[#080000] font-semibold">
								Comprehensive Reports & Analytics
							</span>
						</div>
						<div className="flex items-center gap-4 bg-white/30 backdrop-blur-md p-4 rounded-xl border-2 border-white/40 hover:bg-white/40 hover:border-white/60 transition-all shadow-lg">
							<span className="flex-shrink-0 w-10 h-10 bg-[#080000]/80 rounded-full flex items-center justify-center text-2xl text-white font-bold">
								✓
							</span>
							<span className="text-lg text-[#080000] font-semibold">
								Secure & Reliable Platform
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Right Side - Login Form */}
			<div className="flex-1 max-w-2xl bg-white/30 backdrop-blur-xl p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center shadow-2xl z-10 overflow-y-auto border-l border-white/30">
				{/* Logo & Header - Mobile Only */}
				<div className="text-center mb-8 md:mb-10 animate-fade-in lg:hidden">
					<div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 md:mb-6">
						<img
							src="https://cdn-icons-gif.flaticon.com/18173/18173958.gif"
							alt="PresenceIQ Logo"
							className="w-16 h-16 sm:w-20 sm:h-20 transform hover:scale-110 hover:rotate-12 transition-all duration-300 cursor-pointer"
						/>
						<h1
							className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent drop-shadow-lg"
							style={{
								backgroundImage:
									"linear-gradient(to right, #8ecae6, #5f0f40, #fb5607)",
							}}
						>
							PresenceIQ
						</h1>
					</div>
				</div>

				{/* Form Header */}
				<div className="text-center mb-6 lg:mb-8">
					<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#080000] mb-2 animate-slide-up drop-shadow-md">
						Welcome Back! 👋
					</h2>
					<p className="text-[#080000] text-sm sm:text-base md:text-lg animate-slide-up animation-delay-100">
						Sign in to continue your journey
					</p>
				</div>

				{/* Error Alert with Animation */}
				{apiError && (
					<div className="mb-6 p-3 sm:p-4 bg-red-500/20 backdrop-blur-sm border border-red-300/30 rounded-xl flex items-center gap-3 text-white animate-shake shadow-lg">
						<FiAlertCircle size={20} className="flex-shrink-0" />
						<span className="text-xs sm:text-sm font-medium">
							{apiError}
						</span>
					</div>
				)}

				{/* Login Form */}
				<form
					onSubmit={handleSubmit}
					className="space-y-4 sm:space-y-5"
				>
					{/* Email Field with Enhanced Styling */}
					<div className="group">
						<label
							htmlFor="email"
							className="block text-xs sm:text-sm font-semibold text-[#080000] mb-2"
						>
							Email Address
						</label>
						<div className="relative">
							<FiMail
								className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-[#080000]/70 group-hover:text-[#080000] transition-colors"
								size={18}
							/>
							<input
								type="email"
								id="email"
								name="email"
								className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-white/50 backdrop-blur-md border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-gray-400/50 focus:border-gray-600 transition-all shadow-lg hover:shadow-xl text-[#080000] placeholder-[#080000]/50 text-sm sm:text-base ${
									errors.email
										? "border-red-500/70 bg-red-100/70"
										: "border-gray-400/50 hover:border-gray-600"
								}`}
								placeholder="your.email@example.com"
								value={formData.email}
								onChange={handleChange}
								autoComplete="email"
							/>
						</div>
						{errors.email && (
							<p className="mt-2 text-xs sm:text-sm text-red-700 flex items-center gap-1 animate-slide-down font-medium">
								<FiAlertCircle size={14} />
								{errors.email}
							</p>
						)}
					</div>

					{/* Password Field with Enhanced Styling */}
					<div className="group">
						<label
							htmlFor="password"
							className="block text-xs sm:text-sm font-semibold text-[#080000] mb-2"
						>
							Password
						</label>
						<div className="relative">
							<FiLock
								className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-[#080000]/70 group-hover:text-[#080000] transition-colors"
								size={18}
							/>
							<input
								type={showPassword ? "text" : "password"}
								id="password"
								name="password"
								className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-white/50 backdrop-blur-md border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-gray-400/50 focus:border-gray-600 transition-all shadow-lg hover:shadow-xl text-[#080000] placeholder-[#080000]/50 text-sm sm:text-base ${
									errors.password
										? "border-red-500/70 bg-red-100/70"
										: "border-gray-400/50 hover:border-gray-600"
								}`}
								placeholder="Enter your password"
								value={formData.password}
								onChange={handleChange}
								autoComplete="current-password"
							/>
							<button
								type="button"
								className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-[#080000]/70 hover:text-[#080000] transition-colors"
								onClick={() => setShowPassword(!showPassword)}
								tabIndex="-1"
							>
								{showPassword ? (
									<FiEyeOff size={18} />
								) : (
									<FiEye size={18} />
								)}
							</button>
						</div>
						{errors.password && (
							<p className="mt-2 text-xs sm:text-sm text-red-700 flex items-center gap-1 animate-slide-down font-medium">
								<FiAlertCircle size={14} />
								{errors.password}
							</p>
						)}
					</div>

					{/* Remember Me & Forgot Password */}
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pt-2">
						<label className="flex items-center gap-2 cursor-pointer group">
							<input
								type="checkbox"
								name="rememberMe"
								checked={formData.rememberMe}
								onChange={handleChange}
								className="w-4 h-4 sm:w-5 sm:h-5 text-[#080000] border-gray-400 bg-white/50 rounded-lg focus:ring-2 focus:ring-gray-500 cursor-pointer transition-all"
							/>
							<span className="text-xs sm:text-sm text-[#080000] group-hover:text-[#080000] font-medium transition-colors">
								Remember me
							</span>
						</label>
						<Link
							to="/forgot-password"
							className="text-xs sm:text-sm text-[#080000] hover:text-[#080000]/80 font-semibold hover:underline transition-all"
						>
							Forgot Password?
						</Link>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						className="w-full py-3 sm:py-4 px-6 bg-white/40 backdrop-blur-md border-2 border-gray-400/50 text-[#080000] font-bold rounded-xl shadow-xl hover:shadow-2xl hover:bg-white/50 hover:border-gray-600 transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none flex items-center justify-center gap-3 text-base sm:text-lg"
						disabled={loading}
					>
						{loading ? (
							<>
								<div className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-[#080000] border-t-transparent rounded-full animate-spin"></div>
								<span>Signing you in...</span>
							</>
						) : (
							<span>Sign In ✨</span>
						)}
					</button>
				</form>

				{/* Footer */}
				<div className="mt-6 sm:mt-8 text-center">
					<p className="text-[#080000] text-sm sm:text-base">
						Don't have an account?{" "}
						<Link
							to="/signup"
							className="text-[#080000] hover:text-[#080000]/80 font-bold hover:underline transition-all"
						>
							Create Account →
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
