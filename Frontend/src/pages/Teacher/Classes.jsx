import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	FiUsers,
	FiBook,
	FiCheckSquare,
	FiCalendar,
	FiClock,
	FiTrendingUp,
	FiEye,
} from "react-icons/fi";
import TeacherSidebar from "../../components/TeacherSidebar";
import SectionCard from "../../components/SectionCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { adminAPI } from "../../services/api";

const Classes = () => {
	const navigate = useNavigate();
	const [classes, setClasses] = useState([
		{
			id: 1,
			name: "I B.Sc (CS)",
			code: "BSC-CS-I",
			students: 45,
			subjects: 8,
			schedule: "Mon, Wed, Fri - 10:00 AM",
			room: "Room 101",
			attendanceRate: 92,
			lastAttendance: "2 hours ago",
		},
		{
			id: 2,
			name: "II B.Sc (CS)",
			code: "BSC-CS-II",
			students: 42,
			subjects: 7,
			schedule: "Tue, Thu - 2:00 PM",
			room: "Lab 3",
			attendanceRate: 88,
			lastAttendance: "1 day ago",
		},
		{
			id: 3,
			name: "III B.Sc (CS)",
			code: "BSC-CS-III",
			students: 38,
			subjects: 6,
			schedule: "Wed - 3:00 PM",
			room: "Lab 1",
			attendanceRate: 95,
			lastAttendance: "3 hours ago",
		},
		{
			id: 4,
			name: "I B.Sc (CSDA)",
			code: "BSC-CSDA-I",
			students: 40,
			subjects: 8,
			schedule: "Mon, Thu - 11:00 AM",
			room: "Room 205",
			attendanceRate: 90,
			lastAttendance: "5 hours ago",
		},
		{
			id: 5,
			name: "II B.Sc (CSDA)",
			code: "BSC-CSDA-II",
			students: 35,
			subjects: 7,
			schedule: "Tue, Fri - 1:00 PM",
			room: "Room 302",
			attendanceRate: 87,
			lastAttendance: "2 days ago",
		},
		{
			id: 6,
			name: "III B.Sc (CSDA)",
			code: "BSC-CSDA-III",
			students: 32,
			subjects: 6,
			schedule: "Wed, Thu - 4:00 PM",
			room: "Lab 2",
			attendanceRate: 93,
			lastAttendance: "6 hours ago",
		},
	]);
	const [loading, setLoading] = useState(false);

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

	const handleMarkAttendance = (classItem) => {
		navigate("/teacher/mark-attendance", {
			state: { className: classItem.name, classId: classItem.id },
		});
	};

	const handleViewDetails = (classItem) => {
		navigate(`/teacher/class/${classItem.id}`);
	};

	// Calculate statistics
	const totalStudents = classes.reduce((sum, c) => sum + c.students, 0);
	const avgAttendanceRate =
		classes.reduce((sum, c) => sum + (c.attendanceRate || 0), 0) /
		classes.length;

	if (loading) {
		return (
			<div className="flex min-h-screen bg-gradient-to-br from-[#99B69B] via-[#E4E3D3] to-[#7976B6]">
				<TeacherSidebar />
				<div className="flex-1 md:ml-20 flex items-center justify-center">
					<LoadingSpinner />
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen bg-gradient-to-br from-[#99B69B] via-[#E4E3D3] to-[#7976B6]">
			<TeacherSidebar />
			<div className="flex-1 md:ml-20 flex flex-col overflow-hidden">
				<main className="flex-1 overflow-auto p-4 md:p-8 pb-24 md:pb-8">
					<div className="max-w-7xl mx-auto">
						{/* Page Header */}
						<div className="mb-8 bg-gradient-to-r from-[#a3b18a] to-[#588157] backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 animate-fadeIn">
							<h1 className="text-4xl font-bold text-black mb-2">
								📚 My Classes
							</h1>
							<p className="text-black">
								Manage your classes and track attendance
							</p>
						</div>

						{/* Statistics Overview */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slideUp">
							<SectionCard className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200">
								<div className="flex items-center gap-4">
									<div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
										<FiBook className="w-7 h-7 text-white" />
									</div>
									<div>
										<p className="text-sm text-gray-600 font-medium">
											Total Classes
										</p>
										<p className="text-3xl font-bold text-gray-800">
											{classes.length}
										</p>
									</div>
								</div>
							</SectionCard>

							<SectionCard className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
								<div className="flex items-center gap-4">
									<div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
										<FiUsers className="w-7 h-7 text-white" />
									</div>
									<div>
										<p className="text-sm text-gray-600 font-medium">
											Total Students
										</p>
										<p className="text-3xl font-bold text-gray-800">
											{totalStudents}
										</p>
									</div>
								</div>
							</SectionCard>

							<SectionCard className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
								<div className="flex items-center gap-4">
									<div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
										<FiTrendingUp className="w-7 h-7 text-white" />
									</div>
									<div>
										<p className="text-sm text-gray-600 font-medium">
											Avg Attendance
										</p>
										<p className="text-3xl font-bold text-gray-800">
											{avgAttendanceRate.toFixed(0)}%
										</p>
									</div>
								</div>
							</SectionCard>

							<SectionCard className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200">
								<div className="flex items-center gap-4">
									<div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
										<FiCheckSquare className="w-7 h-7 text-white" />
									</div>
									<div>
										<p className="text-sm text-gray-600 font-medium">
											Active Today
										</p>
										<p className="text-3xl font-bold text-gray-800">
											{
												classes.filter((c) =>
													c.lastAttendance.includes(
														"hour"
													)
												).length
											}
										</p>
									</div>
								</div>
							</SectionCard>
						</div>

						{/* Class Cards Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{classes.map((classItem, index) => (
								<div
									key={classItem.id}
									className="group bg-white/30 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 animate-slideUp"
									style={{
										animationDelay: `${index * 50}ms`,
									}}
								>
									{/* Header with Badge */}
									<div className="flex items-center justify-between mb-4">
										<div className="w-12 h-12 bg-gradient-to-br from-[#a3b18a] to-[#588157] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
											{index + 1}
										</div>
									</div>

									{/* Class Info */}
									<div className="mb-4">
										<h3 className="text-xl font-bold text-gray-800 mb-1">
											{classItem.name}
										</h3>
										<p className="text-sm text-gray-500 font-medium">
											{classItem.code}
										</p>
									</div>

									{/* Attendance Rate Badge */}
									<div className="mb-4">
										<div className="flex items-center justify-between mb-2">
											<span className="text-xs text-gray-600 font-medium">
												Attendance Rate
											</span>
											<span
												className={`text-xs font-bold ${
													classItem.attendanceRate >=
													90
														? "text-green-600"
														: classItem.attendanceRate >=
														  75
														? "text-orange-600"
														: "text-red-600"
												}`}
											>
												{classItem.attendanceRate}%
											</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div
												className={`h-2 rounded-full transition-all duration-500 ${
													classItem.attendanceRate >=
													90
														? "bg-gradient-to-r from-green-400 to-emerald-500"
														: classItem.attendanceRate >=
														  75
														? "bg-gradient-to-r from-orange-400 to-yellow-500"
														: "bg-gradient-to-r from-red-400 to-pink-500"
												}`}
												style={{
													width: `${classItem.attendanceRate}%`,
												}}
											></div>
										</div>
									</div>

									{/* Stats Grid */}
									<div className="space-y-2 mb-4">
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
										<div className="flex items-center justify-between text-sm">
											<span className="flex items-center gap-2 text-gray-600">
												<FiCalendar className="w-4 h-4" />
												Schedule
											</span>
											<span className="font-semibold text-gray-800 text-xs">
												{classItem.schedule}
											</span>
										</div>
										<div className="flex items-center justify-between text-sm">
											<span className="flex items-center gap-2 text-gray-600">
												<FiClock className="w-4 h-4" />
												Room
											</span>
											<span className="font-semibold text-gray-800">
												{classItem.room}
											</span>
										</div>
									</div>

									{/* Last Attendance */}
									<div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
										<p className="text-xs text-gray-600 mb-1">
											Last Attendance
										</p>
										<p className="text-sm font-semibold text-blue-600">
											{classItem.lastAttendance}
										</p>
									</div>

									{/* Action Buttons */}
									<div className="space-y-2">
										<button
											onClick={() =>
												handleMarkAttendance(classItem)
											}
											className="w-full py-2.5 bg-gradient-to-r from-[#a3b18a] to-[#588157] text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold flex items-center justify-center gap-2"
										>
											<FiCheckSquare className="w-4 h-4" />
											Mark Attendance
										</button>
										<button
											onClick={() =>
												handleViewDetails(classItem)
											}
											className="w-full py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
										>
											<FiEye className="w-4 h-4" />
											View Details
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default Classes;
