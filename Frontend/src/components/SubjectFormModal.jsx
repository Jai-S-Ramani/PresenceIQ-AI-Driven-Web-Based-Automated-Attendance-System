import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const SubjectFormModal = ({ isOpen, onClose, onSave, subjectData = null }) => {
	const [formData, setFormData] = useState({
		code: "",
		name: "",
		credits: "",
		department: "",
		description: "",
	});
	const [errors, setErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (subjectData) {
			setFormData({
				code: subjectData.code || "",
				name: subjectData.name || "",
				credits: subjectData.credits || "",
				department: subjectData.department || "",
				description: subjectData.description || "",
			});
		} else {
			setFormData({
				code: "",
				name: "",
				credits: "",
				department: "",
				description: "",
			});
		}
		setErrors({});
	}, [subjectData, isOpen]);

	const validateForm = () => {
		const newErrors = {};

		if (!formData.code.trim()) {
			newErrors.code = "Subject code is required";
		}

		if (!formData.name.trim()) {
			newErrors.name = "Subject name is required";
		}

		if (!formData.credits) {
			newErrors.credits = "Credits are required";
		} else if (isNaN(formData.credits) || formData.credits <= 0) {
			newErrors.credits = "Credits must be a positive number";
		}

		if (!formData.department.trim()) {
			newErrors.department = "Department is required";
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
			console.error("Failed to save subject:", error);
			alert("Failed to save subject. Please try again.");
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
						{subjectData ? "Edit Subject" : "Add New Subject"}
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
					{/* Subject Code and Credits Row */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Subject Code *
							</label>
							<input
								type="text"
								name="code"
								value={formData.code}
								onChange={handleChange}
								placeholder="e.g., MTH 317"
								className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
									errors.code
										? "border-red-500"
										: "border-gray-300"
								}`}
							/>
							{errors.code && (
								<p className="mt-1 text-sm text-red-600">
									{errors.code}
								</p>
							)}
						</div>
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Credits *
							</label>
							<input
								type="number"
								name="credits"
								value={formData.credits}
								onChange={handleChange}
								placeholder="3"
								min="1"
								max="10"
								className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
									errors.credits
										? "border-red-500"
										: "border-gray-300"
								}`}
							/>
							{errors.credits && (
								<p className="mt-1 text-sm text-red-600">
									{errors.credits}
								</p>
							)}
						</div>
					</div>

					{/* Subject Name */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Subject Name *
						</label>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							placeholder="e.g., Advanced Mathematics"
							className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
								errors.name
									? "border-red-500"
									: "border-gray-300"
							}`}
						/>
						{errors.name && (
							<p className="mt-1 text-sm text-red-600">
								{errors.name}
							</p>
						)}
					</div>

					{/* Department */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Department *
						</label>
						<select
							name="department"
							value={formData.department}
							onChange={handleChange}
							className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
								errors.department
									? "border-red-500"
									: "border-gray-300"
							}`}
						>
							<option value="">Select Department</option>
							<option value="Computer Science">
								Computer Science
							</option>
							<option value="Mathematics">Mathematics</option>
							<option value="Physics">Physics</option>
							<option value="Chemistry">Chemistry</option>
							<option value="Biology">Biology</option>
							<option value="English">English</option>
							<option value="History">History</option>
							<option value="Business">Business</option>
							<option value="Engineering">Engineering</option>
						</select>
						{errors.department && (
							<p className="mt-1 text-sm text-red-600">
								{errors.department}
							</p>
						)}
					</div>

					{/* Description */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Description (Optional)
						</label>
						<textarea
							name="description"
							value={formData.description}
							onChange={handleChange}
							placeholder="Brief description of the subject..."
							rows={4}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
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
								: subjectData
								? "Update Subject"
								: "Add Subject"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SubjectFormModal;
