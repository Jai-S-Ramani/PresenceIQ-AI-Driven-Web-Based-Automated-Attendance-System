import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	FiMail,
	FiLock,
	FiUser,
	FiEye,
	FiEyeOff,
	FiAlertCircle,
	FiPhone,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Signup = () => {
	const navigate = useNavigate();
	const { login } = useAuth();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		password: "",
		confirmPassword: "",
		role: "student",
		agreeToTerms: false,
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [apiError, setApiError] = useState("");

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
		setApiError("");
	};

	const validate = () => {
		const newErrors = {};

		if (!formData.name) {
			newErrors.name = "Full name is required";
		} else if (formData.name.length < 3) {
			newErrors.name = "Name must be at least 3 characters";
		}

		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}

		if (!formData.phone) {
			newErrors.phone = "Phone number is required";
		} else if (!/^\d{10}$/.test(formData.phone)) {
			newErrors.phone = "Phone number must be 10 digits";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 8) {
			newErrors.password = "Password must be at least 8 characters";
		} else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
			newErrors.password =
				"Password must contain uppercase, lowercase and number";
		}

		if (!formData.confirmPassword) {
			newErrors.confirmPassword = "Please confirm your password";
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		if (!formData.agreeToTerms) {
			newErrors.agreeToTerms =
				"You must agree to the terms and conditions";
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
			// Registration logic - integrate with your API
			toast.success("Account created successfully!");

			const roleRoutes = {
				admin: "/admin/dashboard",
				teacher: "/teacher/dashboard",
				student: "/student/dashboard",
			};

			setTimeout(() => {
				navigate(roleRoutes[formData.role] || "/login");
			}, 1500);
		} catch (error) {
			console.error("Registration error:", error);
			setApiError(
				error.message || "Registration failed. Please try again."
			);
			toast.error("Registration failed. Please try again.");
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
			{/* Animated Background */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
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
			</div>

			{/* Left Side */}
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
						Join PresenceIQ Today
					</h2>
					<p className="text-xl text-[#080000]/90 font-medium">
						Start your journey with the most advanced AI-powered
						attendance management system
					</p>
					<div className="space-y-4">
						{[
							"Quick & Easy Registration",
							"Secure Face Recognition Setup",
							"Instant Access to Dashboard",
							"24/7 Support Available",
						].map((feature, idx) => (
							<div
								key={idx}
								className="flex items-center gap-4 bg-white/30 backdrop-blur-md p-4 rounded-xl border-2 border-white/40 hover:bg-white/40 hover:border-white/60 transition-all shadow-lg"
							>
								<span className="flex-shrink-0 w-10 h-10 bg-[#080000]/80 rounded-full flex items-center justify-center text-2xl text-white font-bold">
									✓
								</span>
								<span className="text-lg text-[#080000] font-semibold">
									{feature}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Right Side - Form */}
			<div className="flex-1 max-w-2xl bg-white/30 backdrop-blur-xl p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center shadow-2xl z-10 overflow-y-auto border-l border-white/30">
				{/* Mobile Logo */}
				<div className="text-center mb-6 animate-fade-in lg:hidden">
					<div className="flex items-center justify-center gap-3 mb-4">
						<img
							src="https://cdn-icons-gif.flaticon.com/18173/18173958.gif"
							alt="Logo"
							className="w-12 h-12 sm:w-16 sm:h-16"
						/>
						<h1
							className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent"
							style={{
								backgroundImage:
									"linear-gradient(to right, #8ecae6, #5f0f40, #fb5607)",
							}}
						>
							PresenceIQ
						</h1>
					</div>
				</div>

				<div className="text-center mb-6">
					<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#080000] mb-2 animate-slide-up">
						Create Account 🎉
					</h2>
					<p className="text-[#080000] text-sm sm:text-base">
						Join us and start tracking your attendance
					</p>
				</div>

				{apiError && (
					<div className="mb-4 p-3 bg-red-500/20 border border-red-300/30 rounded-xl flex items-center gap-3 text-white animate-shake">
						<FiAlertCircle size={20} />
						<span className="text-sm">{apiError}</span>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Role Selection */}
					<div>
						<label className="block text-sm font-semibold text-[#080000] mb-2">
							Select Your Role
						</label>
						<div className="flex gap-2">
							{["student", "teacher", "admin"].map((role) => (
								<label
									key={role}
									className="flex-1 cursor-pointer"
								>
									<input
										type="radio"
										name="role"
										value={role}
										checked={formData.role === role}
										onChange={handleChange}
										className="sr-only"
									/>
									<div
										className={`px-3 py-2 sm:px-4 sm:py-3 rounded-xl border-2 text-center text-xs sm:text-sm font-medium transition-all ${
											formData.role === role
												? "border-[#5f0f40] bg-[#5f0f40]/20 text-[#5f0f40] font-bold"
												: "border-gray-400/50 bg-white/40 text-[#080000]"
										}`}
									>
										{role.charAt(0).toUpperCase() +
											role.slice(1)}
									</div>
								</label>
							))}
						</div>
					</div>

					{/* Name */}
					<div className="group">
						<label className="block text-sm font-semibold text-[#080000] mb-2">
							Full Name
						</label>
						<div className="relative">
							<FiUser
								className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#080000]/70"
								size={18}
							/>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleChange}
								placeholder="Enter your full name"
								className={`w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-md border-2 rounded-xl focus:ring-4 focus:ring-gray-400/50 text-[#080000] ${
									errors.name
										? "border-red-500/70"
										: "border-gray-400/50"
								}`}
							/>
						</div>
						{errors.name && (
							<p className="mt-2 text-sm text-red-700 flex items-center gap-1">
								<FiAlertCircle size={14} />
								{errors.name}
							</p>
						)}
					</div>

					{/* Email & Phone */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="group">
							<label className="block text-sm font-semibold text-[#080000] mb-2">
								Email
							</label>
							<div className="relative">
								<FiMail
									className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#080000]/70"
									size={18}
								/>
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									placeholder="your.email@example.com"
									className={`w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-md border-2 rounded-xl focus:ring-4 focus:ring-gray-400/50 text-[#080000] ${
										errors.email
											? "border-red-500/70"
											: "border-gray-400/50"
									}`}
								/>
							</div>
							{errors.email && (
								<p className="mt-2 text-sm text-red-700 flex items-center gap-1">
									<FiAlertCircle size={14} />
									{errors.email}
								</p>
							)}
						</div>
						<div className="group">
							<label className="block text-sm font-semibold text-[#080000] mb-2">
								Phone
							</label>
							<div className="relative">
								<FiPhone
									className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#080000]/70"
									size={18}
								/>
								<input
									type="tel"
									name="phone"
									value={formData.phone}
									onChange={handleChange}
									placeholder="10-digit number"
									className={`w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-md border-2 rounded-xl focus:ring-4 focus:ring-gray-400/50 text-[#080000] ${
										errors.phone
											? "border-red-500/70"
											: "border-gray-400/50"
									}`}
								/>
							</div>
							{errors.phone && (
								<p className="mt-2 text-sm text-red-700 flex items-center gap-1">
									<FiAlertCircle size={14} />
									{errors.phone}
								</p>
							)}
						</div>
					</div>

					{/* Passwords */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="group">
							<label className="block text-sm font-semibold text-[#080000] mb-2">
								Password
							</label>
							<div className="relative">
								<FiLock
									className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#080000]/70"
									size={18}
								/>
								<input
									type={showPassword ? "text" : "password"}
									name="password"
									value={formData.password}
									onChange={handleChange}
									placeholder="Min 8 characters"
									className={`w-full pl-12 pr-12 py-3 bg-white/50 backdrop-blur-md border-2 rounded-xl focus:ring-4 focus:ring-gray-400/50 text-[#080000] ${
										errors.password
											? "border-red-500/70"
											: "border-gray-400/50"
									}`}
								/>
								<button
									type="button"
									onClick={() =>
										setShowPassword(!showPassword)
									}
									className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#080000]/70"
								>
									{showPassword ? (
										<FiEyeOff size={18} />
									) : (
										<FiEye size={18} />
									)}
								</button>
							</div>
							{errors.password && (
								<p className="mt-2 text-sm text-red-700 flex items-center gap-1">
									<FiAlertCircle size={14} />
									{errors.password}
								</p>
							)}
						</div>
						<div className="group">
							<label className="block text-sm font-semibold text-[#080000] mb-2">
								Confirm Password
							</label>
							<div className="relative">
								<FiLock
									className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#080000]/70"
									size={18}
								/>
								<input
									type={
										showConfirmPassword
											? "text"
											: "password"
									}
									name="confirmPassword"
									value={formData.confirmPassword}
									onChange={handleChange}
									placeholder="Re-enter password"
									className={`w-full pl-12 pr-12 py-3 bg-white/50 backdrop-blur-md border-2 rounded-xl focus:ring-4 focus:ring-gray-400/50 text-[#080000] ${
										errors.confirmPassword
											? "border-red-500/70"
											: "border-gray-400/50"
									}`}
								/>
								<button
									type="button"
									onClick={() =>
										setShowConfirmPassword(
											!showConfirmPassword
										)
									}
									className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#080000]/70"
								>
									{showConfirmPassword ? (
										<FiEyeOff size={18} />
									) : (
										<FiEye size={18} />
									)}
								</button>
							</div>
							{errors.confirmPassword && (
								<p className="mt-2 text-sm text-red-700 flex items-center gap-1">
									<FiAlertCircle size={14} />
									{errors.confirmPassword}
								</p>
							)}
						</div>
					</div>

					{/* Terms */}
					<div>
						<label className="flex items-start gap-2 cursor-pointer">
							<input
								type="checkbox"
								name="agreeToTerms"
								checked={formData.agreeToTerms}
								onChange={handleChange}
								className="w-5 h-5 mt-1 rounded"
							/>
							<span className="text-sm text-[#080000]">
								I agree to the{" "}
								<Link
									to="/terms"
									className="text-[#5f0f40] hover:underline font-semibold"
								>
									Terms & Conditions
								</Link>{" "}
								and{" "}
								<Link
									to="/privacy"
									className="text-[#5f0f40] hover:underline font-semibold"
								>
									Privacy Policy
								</Link>
							</span>
						</label>
						{errors.agreeToTerms && (
							<p className="mt-2 text-sm text-red-700 flex items-center gap-1">
								<FiAlertCircle size={14} />
								{errors.agreeToTerms}
							</p>
						)}
					</div>

					{/* Submit */}
					<button
						type="submit"
						disabled={loading}
						className="w-full py-4 px-6 bg-white/40 backdrop-blur-md border-2 border-gray-400/50 text-[#080000] font-bold rounded-xl shadow-xl hover:shadow-2xl hover:bg-white/50 transform hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
					>
						{loading ? (
							<>
								<div className="w-6 h-6 border-3 border-[#080000] border-t-transparent rounded-full animate-spin"></div>
								<span>Creating your account...</span>
							</>
						) : (
							<span>Create Account ✨</span>
						)}
					</button>
				</form>

				{/* Footer */}
				<div className="mt-6 text-center">
					<p className="text-[#080000]">
						Already have an account?{" "}
						<Link to="/login" className="font-bold hover:underline">
							Sign In →
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Signup;
