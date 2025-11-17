import React, { useState } from "react";
import { FiEdit, FiClock, FiCalendar, FiBook } from "react-icons/fi";
import AdminLayout from "../../components/Layout/AdminLayout";
import SectionCard from "../../components/SectionCard";
import { adminAPI } from "../../services/api";

const TimetableManagement = () => {
	const [classes, setClasses] = useState([
		{ id: 1, name: "I B.Sc (CS)", periods: 6 },
		{ id: 2, name: "II B.Sc (CS)", periods: 6 },
		{ id: 3, name: "III B.Sc (CS)", periods: 5 },
		{ id: 4, name: "I B.Sc (CSDA)", periods: 6 },
		{ id: 5, name: "II B.Sc (CSDA)", periods: 6 },
		{ id: 6, name: "III B.Sc (CSDA)", periods: 5 },
		{ id: 7, name: "I B.Sc (AI/ML)", periods: 6 },
	]);

	const handleEdit = (classId) => {
		console.log("Edit timetable for class:", classId);
	};

	return (
		<AdminLayout>
			{/* Page Header */}
			<div className="mb-8 bg-gradient-to-r from-[#a3b18a] to-[#588157] backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 animate-fadeIn">
				<h1 className="text-4xl font-bold text-black mb-2">
					📅 Timetable Management
				</h1>
				<p className="text-black">
					Manage class schedules and timetables
				</p>
			</div>

			{/* Weekly Overview */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slideUp">
				<SectionCard className="bg-gradient-to-br from-blue-50 to-indigo-50">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
							<FiCalendar className="w-6 h-6 text-white" />
						</div>
						<div>
							<p className="text-sm text-gray-600">
								Total Classes
							</p>
							<p className="text-2xl font-bold text-gray-800">
								{classes.length}
							</p>
						</div>
					</div>
				</SectionCard>

				<SectionCard className="bg-gradient-to-br from-purple-50 to-pink-50">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
							<FiClock className="w-6 h-6 text-white" />
						</div>
						<div>
							<p className="text-sm text-gray-600">
								Working Days
							</p>
							<p className="text-2xl font-bold text-gray-800">
								5
							</p>
						</div>
					</div>
				</SectionCard>

				<SectionCard className="bg-gradient-to-br from-indigo-50 to-purple-50">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
							<FiBook className="w-6 h-6 text-white" />
						</div>
						<div>
							<p className="text-sm text-gray-600">Periods/Day</p>
							<p className="text-2xl font-bold text-gray-800">
								6
							</p>
						</div>
					</div>
				</SectionCard>
			</div>

			{/* Classes List */}
			<SectionCard
				title="Classes"
				className="animate-slideUp animation-delay-100"
			>
				<div className="space-y-3">
					{classes.map((classItem, index) => (
						<div
							key={classItem.id}
							className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-2xl hover:from-indigo-100/50 hover:to-purple-100/50 transition-all duration-300"
						>
							<div className="flex items-center gap-4">
								<span className="text-lg font-semibold text-gray-700 w-8">
									{index + 1}
								</span>
								<div>
									<p className="text-lg font-medium text-gray-800">
										{classItem.name}
									</p>
									<p className="text-sm text-gray-500">
										{classItem.periods} periods per day
									</p>
								</div>
							</div>
							<button
								onClick={() => handleEdit(classItem.id)}
								className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
							>
								<FiEdit className="w-4 h-4" />
								<span>Edit Timetable</span>
							</button>
						</div>
					))}
				</div>
			</SectionCard>
		</AdminLayout>
	);
};

export default TimetableManagement;
