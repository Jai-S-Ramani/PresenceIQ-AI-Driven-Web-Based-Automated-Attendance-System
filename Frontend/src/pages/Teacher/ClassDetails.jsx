import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	FiArrowLeft,
	FiUsers,
	FiClock,
	FiBook,
	FiTrendingUp,
	FiDownload,
	FiCheckCircle,
	FiXCircle,
	FiAlertCircle,
} from "react-icons/fi";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import SectionCard from "../../components/SectionCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import Button from "../../components/Button";
import { teacherAPI } from "../../services/api";

const ClassDetails = () => {
	const { classId } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [classInfo, setClassInfo] = useState(null);
	const [students, setStudents] = useState([]);
	const [attendanceHistory, setAttendanceHistory] = useState([]);

	useEffect(() => {
		fetchClassDetails();
	}, [classId]);

	const fetchClassDetails = async () => {
		try {
			setLoading(true);
			const response = await teacherAPI.getClassDetails(classId);
			setClassInfo(response.data.class);
			setStudents(response.data.students);
			setAttendanceHistory(response.data.history);
		} catch (error) {
			console.error("Failed to fetch class details:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleMarkAttendance = () => {
		navigate(`/teacher/attendance/${classId}`);
	};

	const exportStudentList = () => {
		// TODO: Implement export functionality
		console.log("Exporting student list...");
		alert("Export feature coming soon!");
	};

	if (loading) {
		return (
			<DashboardLayout>
				<LoadingSpinner />
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout>
			{/* Header */}
			<div className="mb-8 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg">
				<button
					onClick={() => navigate("/teacher/classes")}
					className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 mb-4 transition-colors"
				>
					<FiArrowLeft className="w-5 h-5" />
					<span className="font-medium">Back to Classes</span>
				</button>
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
					<div>
						<h1 className="text-3xl font-bold text-gray-800">
							{classInfo?.name}
						</h1>
						<p className="text-gray-600 mt-2 flex items-center space-x-2">
							<FiBook className="w-4 h-4" />
							<span>{classInfo?.code}</span>
							<span>•</span>
							<span>{classInfo?.semester}</span>
						</p>
					</div>
					<Button
						onClick={handleMarkAttendance}
						variant="secondary"
						icon={FiCheckCircle}
						size="lg"
					>
						Mark Attendance
					</Button>
				</div>
			</div>

			{/* Class Info Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-lg p-6 border border-emerald-100">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-600 text-sm font-medium">
								Total Students
							</p>
							<p className="text-3xl font-bold text-emerald-600 mt-2">
								{classInfo?.students}
							</p>
						</div>
						<div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
							<FiUsers className="w-7 h-7 text-white" />
						</div>
					</div>
				</div>

				<div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border border-green-100">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-600 text-sm font-medium">
								Avg Attendance
							</p>
							<p className="text-3xl font-bold text-green-600 mt-2">
								{classInfo?.avgAttendance}%
							</p>
						</div>
						<div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
							<FiTrendingUp className="w-7 h-7 text-white" />
						</div>
					</div>
				</div>

				<div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl shadow-lg p-6 border border-teal-100">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-600 text-sm font-medium">
								Schedule
							</p>
							<p className="text-sm font-semibold text-teal-600 mt-2">
								{classInfo?.schedule}
							</p>
						</div>
						<div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
							<FiClock className="w-7 h-7 text-white" />
						</div>
					</div>
				</div>

				<div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl shadow-lg p-6 border border-cyan-100">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-600 text-sm font-medium">
								Room
							</p>
							<p className="text-xl font-bold text-cyan-600 mt-2">
								{classInfo?.room}
							</p>
						</div>
						<div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
							<FiBook className="w-7 h-7 text-white" />
						</div>
					</div>
				</div>
			</div>

			{/* Recent Attendance History */}
			<SectionCard
				title="Recent Attendance History"
				icon={FiClock}
				className="mb-8"
			>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b-2 border-emerald-200">
								<th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">
									Date
								</th>
								<th className="px-6 py-4 text-center text-sm font-semibold text-emerald-800">
									Present
								</th>
								<th className="px-6 py-4 text-center text-sm font-semibold text-emerald-800">
									Absent
								</th>
								<th className="px-6 py-4 text-center text-sm font-semibold text-emerald-800">
									Late
								</th>
								<th className="px-6 py-4 text-center text-sm font-semibold text-emerald-800">
									Percentage
								</th>
							</tr>
						</thead>
						<tbody>
							{attendanceHistory.map((record) => {
								const total =
									record.present +
									record.absent +
									record.late;
								const percentage = (
									(record.present / total) *
									100
								).toFixed(1);
								return (
									<tr
										key={record.id}
										className="border-b border-gray-200 hover:bg-emerald-50/50 transition-colors"
									>
										<td className="px-6 py-4 text-sm text-gray-800 font-medium">
											{new Date(
												record.date
											).toLocaleDateString("en-US", {
												year: "numeric",
												month: "short",
												day: "numeric",
											})}
										</td>
										<td className="px-6 py-4 text-center">
											<span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
												<FiCheckCircle className="w-3 h-3" />
												<span>{record.present}</span>
											</span>
										</td>
										<td className="px-6 py-4 text-center">
											<span className="inline-flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
												<FiXCircle className="w-3 h-3" />
												<span>{record.absent}</span>
											</span>
										</td>
										<td className="px-6 py-4 text-center">
											<span className="inline-flex items-center space-x-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
												<FiAlertCircle className="w-3 h-3" />
												<span>{record.late}</span>
											</span>
										</td>
										<td className="px-6 py-4 text-center">
											<span className="text-sm font-bold text-gray-800">
												{percentage}%
											</span>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</SectionCard>

			{/* Students List */}
			<SectionCard
				title="Students Enrolled"
				icon={FiUsers}
				action={
					<Button
						onClick={exportStudentList}
						variant="outline"
						icon={FiDownload}
						size="sm"
					>
						Export List
					</Button>
				}
			>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b-2 border-emerald-200">
								<th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">
									Roll No.
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">
									Name
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">
									Email
								</th>
								<th className="px-6 py-4 text-center text-sm font-semibold text-emerald-800">
									Attendance %
								</th>
							</tr>
						</thead>
						<tbody>
							{students.map((student) => (
								<tr
									key={student.id}
									className="border-b border-gray-200 hover:bg-emerald-50/50 transition-colors"
								>
									<td className="px-6 py-4 text-sm text-gray-800 font-medium">
										{student.rollNumber}
									</td>
									<td className="px-6 py-4 text-sm text-gray-800 font-medium">
										{student.name}
									</td>
									<td className="px-6 py-4 text-sm text-gray-600">
										{student.email}
									</td>
									<td className="px-6 py-4 text-center">
										<span
											className={`px-3 py-1 rounded-full text-sm font-semibold ${
												student.attendance >= 85
													? "bg-green-100 text-green-700"
													: student.attendance >= 75
													? "bg-orange-100 text-orange-700"
													: "bg-red-100 text-red-700"
											}`}
										>
											{student.attendance}%
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</SectionCard>
		</DashboardLayout>
	);
};

export default ClassDetails;
