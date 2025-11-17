import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const UserFormModal = ({ isOpen, onClose, onSave, userData = null }) => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		role: "student",
		rollNumber: "",
		employeeId: "",
		phoneNumber: "",
		department: "",
	});
	const [errors, setErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (userData) {
			setFormData({
				firstName: userData.firstName || "",
				lastName: userData.lastName || "",
				email: userData.email || "",
				role: userData.role || "student",
				rollNumber: userData.rollNumber || "",
				employeeId: userData.employeeId || "",
				phoneNumber: userData.phoneNumber || "",
				department: userData.department || "",
			});
		} else {
			setFormData({
				firstName: "",
				lastName: "",
				email: "",
				role: "student",
				rollNumber: "",
				employeeId: "",
				phoneNumber: "",
				department: "",
			});
		}
		setErrors({});
	}, [userData, isOpen]);

	const validateForm = () => {
		const newErrors = {};

		if (!formData.firstName.trim()) {
			newErrors.firstName = "First name is required";
		}

		if (!formData.lastName.trim()) {
			newErrors.lastName = "Last name is required";
		}

		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Invalid email format";
		}

		if (!formData.role) {
			newErrors.role = "Role is required";
		}

		if (formData.role === "student" && !formData.rollNumber.trim()) {
			newErrors.rollNumber = "Roll number is required for students";
		}

		if (formData.role === "teacher" && !formData.employeeId.trim()) {
			newErrors.employeeId = "Employee ID is required for teachers";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setSubmitting(true);
		try {
			await onSave(formData);
			onClose();
		} catch (error) {
			console.error("Failed to save user:", error);
			alert("Failed to save user. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		// Clear error for this field when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-pink-100">
					<h2 className="text-2xl font-bold text-gray-800">
						{userData ? "Edit User" : "Add New User"}
					</h2>
					<button
						onClick={onClose}
						className="p-2 hover:bg-pink-100 rounded-lg transition-colors"
					>
						<X className="w-6 h-6 text-gray-600" />
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="p-6 space-y-6">
					{/* Name Row */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								First Name *
							</label>
							<input
								type="text"
								name="firstName"
								value={formData.firstName}
								onChange={handleChange}
								placeholder="John"
								className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
									errors.firstName
										? "border-red-500"
										: "border-gray-300"
								}`}
							/>
							{errors.firstName && (
								<p className="mt-1 text-sm text-red-600">
									{errors.firstName}
								</p>
							)}
						</div>
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Last Name *
							</label>
							<input
								type="text"
								name="lastName"
								value={formData.lastName}
								onChange={handleChange}
								placeholder="Doe"
								className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
									errors.lastName
										? "border-red-500"
										: "border-gray-300"
								}`}
							/>
							{errors.lastName && (
								<p className="mt-1 text-sm text-red-600">
									{errors.lastName}
								</p>
							)}
						</div>
					</div>

					{/* Email */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Email *
						</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							placeholder="john.doe@university.edu"
							className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
								errors.email
									? "border-red-500"
									: "border-gray-300"
							}`}
						/>
						{errors.email && (
							<p className="mt-1 text-sm text-red-600">
								{errors.email}
							</p>
						)}
					</div>

					{/* Role */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Role *
						</label>
						<select
							name="role"
							value={formData.role}
							onChange={handleChange}
							className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
								errors.role
									? "border-red-500"
									: "border-gray-300"
							}`}
						>
							<option value="student">Student</option>
							<option value="teacher">Teacher</option>
							<option value="admin">Admin</option>
						</select>
						{errors.role && (
							<p className="mt-1 text-sm text-red-600">
								{errors.role}
							</p>
						)}
					</div>

					{/* Conditional Fields */}
					{formData.role === "student" && (
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Roll Number *
							</label>
							<input
								type="text"
								name="rollNumber"
								value={formData.rollNumber}
								onChange={handleChange}
								placeholder="CS001"
								className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
									errors.rollNumber
										? "border-red-500"
										: "border-gray-300"
								}`}
							/>
							{errors.rollNumber && (
								<p className="mt-1 text-sm text-red-600">
									{errors.rollNumber}
								</p>
							)}
						</div>
					)}

					{formData.role === "teacher" && (
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Employee ID *
							</label>
							<input
								type="text"
								name="employeeId"
								value={formData.employeeId}
								onChange={handleChange}
								placeholder="EMP001"
								className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
									errors.employeeId
										? "border-red-500"
										: "border-gray-300"
								}`}
							/>
							{errors.employeeId && (
								<p className="mt-1 text-sm text-red-600">
									{errors.employeeId}
								</p>
							)}
						</div>
					)}

					{/* Phone Number */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Phone Number (Optional)
						</label>
						<input
							type="tel"
							name="phoneNumber"
							value={formData.phoneNumber}
							onChange={handleChange}
							placeholder="+1 234 567 8900"
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
						/>
					</div>

					{/* Department */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Department (Optional)
						</label>
						<input
							type="text"
							name="department"
							value={formData.department}
							onChange={handleChange}
							placeholder="Computer Science"
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
						/>
					</div>

					{/* Action Buttons */}
					<div className="flex space-x-4 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={submitting}
							className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
						>
							{submitting
								? "Saving..."
								: userData
								? "Update User"
								: "Add User"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default UserFormModal;
