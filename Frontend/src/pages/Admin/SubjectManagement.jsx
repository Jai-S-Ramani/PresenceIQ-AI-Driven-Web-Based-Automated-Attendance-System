import React, { useState, useEffect } from "react";
import {
	FiPlus,
	FiEdit,
	FiTrash2,
	FiBook,
	FiUser,
	FiUsers,
} from "react-icons/fi";
import AdminLayout from "../../components/Layout/AdminLayout";
import SectionCard from "../../components/SectionCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { adminAPI } from "../../services/api";

const SubjectManagement = () => {
	const [subjects, setSubjects] = useState([
		{
			id: 423,
			subjectId: "CS101",
			subjectName: "Data Structures",
			facultyName: "Arlene McCoy",
			className: "I B. Sc (CS)",
		},
		{
			id: 946,
			subjectId: "CS102",
			subjectName: "Algorithms",
			facultyName: "Marvin McKinney",
			className: "I B. Sc (CS)",
		},
		{
			id: 394,
			subjectId: "CS103",
			subjectName: "Database Systems",
			facultyName: "Savannah Nguyen",
			className: "I B. Sc (CS)",
		},
		{
			id: 426,
			subjectId: "CS201",
			subjectName: "Web Development",
			facultyName: "Robert Fox",
			className: "II B. Sc (CS)",
		},
		{
			id: 647,
			subjectId: "CS202",
			subjectName: "Machine Learning",
			facultyName: "Dianne Russell",
			className: "II B. Sc (CS)",
		},
		{
			id: 274,
			subjectId: "CS301",
			subjectName: "Cloud Computing",
			facultyName: "Albert Flores",
			className: "III B. Sc (CS)",
		},
	]);

	const [loading, setLoading] = useState(false);
	const [showAddModal, setShowAddModal] = useState(false);
	const [editingSubject, setEditingSubject] = useState(null);
	const [formData, setFormData] = useState({
		subjectName: "",
		subjectId: "",
		className: "",
		facultyName: "",
	});

	useEffect(() => {
		fetchSubjects();
	}, []);

	const fetchSubjects = async () => {
		try {
			setLoading(true);
			const response = await adminAPI.getSubjects();
			if (response.data) setSubjects(response.data);
		} catch (error) {
			console.error("Failed to fetch subjects:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleAddSubject = () => {
		setEditingSubject(null);
		setFormData({
			subjectName: "",
			subjectId: "",
			className: "",
			facultyName: "",
		});
		setShowAddModal(true);
	};

	const handleEditSubject = (subject) => {
		setEditingSubject(subject);
		setFormData({
			subjectName: subject.subjectName,
			subjectId: subject.subjectId,
			className: subject.className,
			facultyName: subject.facultyName,
		});
		setShowAddModal(true);
	};

	const handleSaveSubject = () => {
		if (
			!formData.subjectName ||
			!formData.subjectId ||
			!formData.className ||
			!formData.facultyName
		) {
			alert("Please fill all fields!");
			return;
		}

		if (editingSubject) {
			setSubjects(
				subjects.map((s) =>
					s.id === editingSubject.id ? { ...s, ...formData } : s
				)
			);
		} else {
			const newId = Math.floor(Math.random() * 1000);
			setSubjects([...subjects, { ...formData, id: newId }]);
		}
		setShowAddModal(false);
	};

	const handleDeleteSubject = (id) => {
		if (window.confirm("Are you sure you want to delete this subject?")) {
			setSubjects(subjects.filter((s) => s.id !== id));
		}
	};

	if (loading) {
		return <LoadingSpinner fullScreen text="Loading subjects..." />;
	}

	return (
		<AdminLayout>
			{/* Page Header */}
			<div className="mb-8 bg-gradient-to-r from-[#a3b18a] to-[#588157] backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 animate-fadeIn">
				<h1 className="text-4xl font-bold text-black mb-2">
					📖 Subject Management
				</h1>
				<p className="text-black">
					Manage subjects and faculty assignments
				</p>
			</div>

			{/* Add Subject Button */}
			<div className="flex justify-end mb-6 animate-slideUp">
				<Button
					variant="danger"
					icon={FiPlus}
					onClick={handleAddSubject}
				>
					Add Subject
				</Button>
			</div>

			{/* Subjects Table */}
			<SectionCard
				title={`Subjects (${subjects.length})`}
				className="animate-slideUp animation-delay-100"
			>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b-2 border-gray-200">
								<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 bg-gradient-to-r from-orange-50 to-pink-50">
									Subject ID
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 bg-gradient-to-r from-orange-50 to-pink-50">
									Subject Name
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 bg-gradient-to-r from-orange-50 to-pink-50">
									Faculty
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 bg-gradient-to-r from-orange-50 to-pink-50">
									Class
								</th>
								<th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 bg-gradient-to-r from-orange-50 to-pink-50">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{subjects.map((subject, index) => (
								<tr
									key={subject.id}
									className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-pink-50/50 transition-all duration-300 ${
										index % 2 === 0
											? "bg-white"
											: "bg-gray-50/50"
									}`}
								>
									<td className="px-6 py-4 text-sm font-medium text-gray-900">
										{subject.subjectId}
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
												<FiBook className="w-5 h-5" />
											</div>
											<span className="text-sm font-medium text-gray-900">
												{subject.subjectName}
											</span>
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-2">
											<FiUser className="w-4 h-4 text-gray-400" />
											<span className="text-sm text-gray-600">
												{subject.facultyName}
											</span>
										</div>
									</td>
									<td className="px-6 py-4">
										<span className="px-3 py-1 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 rounded-full text-xs font-semibold">
											{subject.className}
										</span>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center justify-center gap-2">
											<button
												onClick={() =>
													handleEditSubject(subject)
												}
												className="p-2 hover:bg-orange-100 rounded-lg transition-all duration-300 group"
												title="Edit"
											>
												<FiEdit className="w-4 h-4 text-gray-600 group-hover:text-orange-600 transition-colors" />
											</button>
											<button
												onClick={() =>
													handleDeleteSubject(
														subject.id
													)
												}
												className="p-2 hover:bg-red-100 rounded-lg transition-all duration-300 group"
												title="Delete"
											>
												<FiTrash2 className="w-4 h-4 text-gray-600 group-hover:text-red-600 transition-colors" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					{subjects.length === 0 && (
						<div className="text-center py-12">
							<FiBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
							<p className="text-gray-500 text-lg">
								No subjects found
							</p>
						</div>
					)}
				</div>
			</SectionCard>

			{/* Add/Edit Subject Modal */}
			<Modal
				isOpen={showAddModal}
				onClose={() => setShowAddModal(false)}
				title={editingSubject ? "Edit Subject" : "Add New Subject"}
				size="md"
			>
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Subject ID
						</label>
						<input
							type="text"
							value={formData.subjectId}
							onChange={(e) =>
								setFormData({
									...formData,
									subjectId: e.target.value,
								})
							}
							className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
							placeholder="e.g., CS101"
						/>
					</div>

					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Subject Name
						</label>
						<input
							type="text"
							value={formData.subjectName}
							onChange={(e) =>
								setFormData({
									...formData,
									subjectName: e.target.value,
								})
							}
							className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
							placeholder="e.g., Data Structures"
						/>
					</div>

					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Faculty Name
						</label>
						<input
							type="text"
							value={formData.facultyName}
							onChange={(e) =>
								setFormData({
									...formData,
									facultyName: e.target.value,
								})
							}
							className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
							placeholder="Select or enter faculty name"
						/>
					</div>

					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Class
						</label>
						<input
							type="text"
							value={formData.className}
							onChange={(e) =>
								setFormData({
									...formData,
									className: e.target.value,
								})
							}
							className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
							placeholder="e.g., I B.Sc (CS)"
						/>
					</div>

					<div className="flex gap-3 pt-4">
						<Button
							variant="outline"
							onClick={() => setShowAddModal(false)}
							className="flex-1"
						>
							Cancel
						</Button>
						<Button
							variant="danger"
							onClick={handleSaveSubject}
							className="flex-1"
						>
							{editingSubject ? "Update" : "Add"}
						</Button>
					</div>
				</div>
			</Modal>
		</AdminLayout>
	);
};

export default SubjectManagement;
