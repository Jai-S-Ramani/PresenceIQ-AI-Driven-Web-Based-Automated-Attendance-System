import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const ClassFormModal = ({ isOpen, onClose, onSave, classData = null }) => {
	const [formData, setFormData] = useState({
		name: "",
		code: "",
		schedule: "",
		room: "",
		description: "",
	});
	const [errors, setErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (classData) {
			setFormData({
				name: classData.name || "",
				code: classData.code || "",
				schedule: classData.schedule || "",
				room: classData.room || "",
				description: classData.description || "",
			});
		} else {
			setFormData({
				name: "",
				code: "",
				schedule: "",
				room: "",
				description: "",
			});
		}
		setErrors({});
	}, [classData, isOpen]);

	const validateForm = () => {
		const newErrors = {};

		if (!formData.name.trim()) {
			newErrors.name = "Class name is required";
		}

		if (!formData.code.trim()) {
			newErrors.code = "Class code is required";
		}

		if (!formData.schedule.trim()) {
			newErrors.schedule = "Schedule is required";
		}

		if (!formData.room.trim()) {
			newErrors.room = "Room is required";
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
			console.error("Failed to save class:", error);
			alert("Failed to save class. Please try again.");
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
						{classData ? "Edit Class" : "Add New Class"}
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
					{/* Class Name */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Class Name *
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

					{/* Class Code */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Class Code *
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

					{/* Schedule */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Schedule *
						</label>
						<input
							type="text"
							name="schedule"
							value={formData.schedule}
							onChange={handleChange}
							placeholder="e.g., Mon, Wed, Fri - 10:00 AM"
							className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
								errors.schedule
									? "border-red-500"
									: "border-gray-300"
							}`}
						/>
						{errors.schedule && (
							<p className="mt-1 text-sm text-red-600">
								{errors.schedule}
							</p>
						)}
					</div>

					{/* Room */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Room *
						</label>
						<input
							type="text"
							name="room"
							value={formData.room}
							onChange={handleChange}
							placeholder="e.g., Room 101 or Lab 3"
							className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
								errors.room
									? "border-red-500"
									: "border-gray-300"
							}`}
						/>
						{errors.room && (
							<p className="mt-1 text-sm text-red-600">
								{errors.room}
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
							placeholder="Brief description of the class..."
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
								: classData
								? "Update Class"
								: "Add Class"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ClassFormModal;
