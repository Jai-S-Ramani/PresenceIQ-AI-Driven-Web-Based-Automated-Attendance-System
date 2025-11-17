import React, { useState, useEffect } from "react";
import {
	FiPlus,
	FiEdit,
	FiTrash2,
	FiUsers,
	FiBook,
	FiCheckSquare,
} from "react-icons/fi";
import AdminLayout from "../../components/Layout/AdminLayout";
import SectionCard from "../../components/SectionCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { adminAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

const ClassManagement = () => {
	const navigate = useNavigate();
	const [classes, setClasses] = useState([
		{ id: 1, name: "I B.Sc (CS)", students: 45, subjects: 8 },
		{ id: 2, name: "II B.Sc (CS)", students: 42, subjects: 7 },
		{ id: 3, name: "III B.Sc (CS)", students: 38, subjects: 6 },
		{ id: 4, name: "I B.Sc (CSDA)", students: 40, subjects: 8 },
		{ id: 5, name: "II B.Sc (CSDA)", students: 35, subjects: 7 },
		{ id: 6, name: "III B.Sc (CSDA)", students: 32, subjects: 6 },
	]);
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [editingClass, setEditingClass] = useState(null);
	const [formData, setFormData] = useState({ name: "" });

	useEffect(() => {
		fetchClasses();
	}, []);

	const fetchClasses = async () => {
		try {
			setLoading(true);
			const response = await adminAPI.getClasses();
			if (response.data) setClasses(response.data);
		} catch (error) {
			console.error("Failed to fetch classes:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleAddClass = () => {
		setEditingClass(null);
		setFormData({ name: "" });
		setShowModal(true);
	};

	const handleEditClass = (classItem) => {
		setEditingClass(classItem);
		setFormData({ name: classItem.name });
		setShowModal(true);
	};

	const handleSaveClass = () => {
		if (!formData.name.trim()) {
			alert("Please enter a class name!");
			return;
		}

		if (editingClass) {
			setClasses(
				classes.map((c) =>
					c.id === editingClass.id ? { ...c, name: formData.name } : c
				)
			);
		} else {
			const newId = classes.length + 1;
			setClasses([
				...classes,
				{ id: newId, name: formData.name, students: 0, subjects: 0 },
			]);
		}
		setShowModal(false);
	};

	const handleMarkAttendance = (classItem) => {
		// Navigate to mark attendance page with class info
		navigate("/teacher/mark-attendance", {
			state: { className: classItem.name, classId: classItem.id },
		});
	};

	const handleDeleteClass = (id) => {
		if (window.confirm("Are you sure you want to delete this class?")) {
			setClasses(classes.filter((c) => c.id !== id));
		}
	};

	if (loading) {
		return <LoadingSpinner fullScreen text="Loading classes..." />;
	}

	return (
		<AdminLayout>
			{/* Page Header */}
			<div className="mb-8 bg-gradient-to-r from-[#a3b18a] to-[#588157] backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 animate-fadeIn">
				<h1 className="text-4xl font-bold text-black mb-2">
					📚 Class Management
				</h1>
				<p className="text-black">Manage classes and sections</p>
			</div>

			{/* Add Class Button */}
			<div className="flex justify-end mb-6 animate-slideUp">
				<Button
					variant="secondary"
					icon={FiPlus}
					onClick={handleAddClass}
				>
					Add Class
				</Button>
			</div>

			{/* Class Cards Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{classes.map((classItem, index) => (
					<div
						key={classItem.id}
						className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slideUp"
						style={{ animationDelay: `${index * 50}ms` }}
					>
						{/* Class Number Badge */}
						<div className="flex items-center justify-between mb-4">
							<div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
								{index + 1}
							</div>
							<div className="flex gap-2">
								<button
									onClick={() => handleEditClass(classItem)}
									className="p-2 hover:bg-green-100 rounded-lg transition-all duration-300"
									title="Edit"
								>
									<FiEdit className="w-4 h-4 text-gray-600 group-hover:text-green-600" />
								</button>
								<button
									onClick={() =>
										handleDeleteClass(classItem.id)
									}
									className="p-2 hover:bg-red-100 rounded-lg transition-all duration-300"
									title="Delete"
								>
									<FiTrash2 className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
								</button>
							</div>
						</div>

						{/* Class Name */}
						<h3 className="text-xl font-bold text-gray-800 mb-4">
							{classItem.name}
						</h3>

						{/* Stats */}
						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<span className="flex items-center gap-2 text-gray-600">
									<FiUsers className="w-4 h-4" />
									Students
								</span>
								<span className="font-semibold text-gray-800">
									{classItem.students}
								</span>
							</div>
							<div className="flex items-center justify-between text-sm">
								<span className="flex items-center gap-2 text-gray-600">
									<FiBook className="w-4 h-4" />
									Subjects
								</span>
								<span className="font-semibold text-gray-800">
									{classItem.subjects}
								</span>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="space-y-2 mt-4">
							{/* Mark Attendance Button */}
							<button
								onClick={() => handleMarkAttendance(classItem)}
								className="w-full py-2 bg-gradient-to-r from-[#a3b18a] to-[#588157] text-black rounded-xl hover:shadow-lg transition-all duration-300 font-semibold flex items-center justify-center gap-2"
							>
								<FiCheckSquare className="w-4 h-4" />
								Mark Attendance
							</button>

							{/* View Details Button */}
							<button className="w-full py-2 bg-gradient-to-r from-[#a3b18a] to-[#588157] text-black rounded-xl hover:shadow-lg transition-all duration-300 font-semibold flex items-center justify-center gap-2">
								View Details
							</button>
						</div>
					</div>
				))}
			</div>

			{/* Add/Edit Modal */}
			<Modal
				isOpen={showModal}
				onClose={() => setShowModal(false)}
				title={editingClass ? "Edit Class" : "Add New Class"}
				size="sm"
			>
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Class Name
						</label>
						<input
							type="text"
							value={formData.name}
							onChange={(e) =>
								setFormData({ name: e.target.value })
							}
							className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
							placeholder="e.g., I B.Sc (CS)"
						/>
					</div>

					<div className="flex gap-3 pt-4">
						<Button
							variant="outline"
							onClick={() => setShowModal(false)}
							className="flex-1"
						>
							Cancel
						</Button>
						<Button
							variant="secondary"
							onClick={handleSaveClass}
							className="flex-1"
						>
							{editingClass ? "Update" : "Add"}
						</Button>
					</div>
				</div>
			</Modal>
		</AdminLayout>
	);
};

export default ClassManagement;
