import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Users,
	Search,
	Filter,
	Download,
	Eye,
	Mail,
	Phone,
	TrendingUp,
	TrendingDown,
	AlertCircle,
} from "lucide-react";
import TeacherSidebar from "../../components/TeacherSidebar";
import LoadingSpinner from "../../components/LoadingSpinner";

const StudentList = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedClass, setSelectedClass] = useState("All Classes");
	const [selectedStatus, setSelectedStatus] = useState("All");
	const [students, setStudents] = useState([]);

	const classes = [
		"All Classes",
		"I B.Sc (CS)",
		"II B.Sc (CS)",
		"III B.Sc (CS)",
	];
	const statusOptions = [
		"All",
		"Good (≥90%)",
		"Average (75-89%)",
		"Low (<75%)",
		"Face Not Registered",
	];

	useEffect(() => {
		fetchStudents();
	}, []);

	const fetchStudents = async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/students/");
			const data = await response.json();
			setStudents(data);
		} catch (error) {
			console.error("Failed to fetch students:", error);
		} finally {
			setLoading(false);
		}
	};

	const filteredStudents = students.filter((student) => {
		const matchesSearch =
			student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
			student.email.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesClass =
			selectedClass === "All Classes" || student.class === selectedClass;

		const matchesStatus =
			selectedStatus === "All" ||
			(selectedStatus === "Good (≥90%)" &&
				student.attendancePercentage >= 90) ||
			(selectedStatus === "Average (75-89%)" &&
				student.attendancePercentage >= 75 &&
				student.attendancePercentage < 90) ||
			(selectedStatus === "Low (<75%)" &&
				student.attendancePercentage < 75) ||
			(selectedStatus === "Face Not Registered" &&
				!student.faceRegistered);

		return matchesSearch && matchesClass && matchesStatus;
	});

	const exportStudentList = () => {
		console.log("Exporting student list...");
		// Implement CSV/Excel export functionality
	};

	const getAttendanceColor = (percentage) => {
		if (percentage >= 90) return "text-green-600 bg-green-100";
		if (percentage >= 75) return "text-blue-600 bg-blue-100";
		if (percentage >= 60) return "text-orange-600 bg-orange-100";
		return "text-red-600 bg-red-100";
	};

	const getAttendanceTrend = (percentage) => {
		if (percentage >= 90)
			return <TrendingUp className="w-4 h-4 text-green-600" />;
		if (percentage >= 75)
			return <TrendingUp className="w-4 h-4 text-blue-600" />;
		return <TrendingDown className="w-4 h-4 text-red-600" />;
	};

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

			<div className="flex-1 md:ml-20 p-4 md:p-8 pb-24 md:pb-8 overflow-auto">
				<div className="max-w-7xl mx-auto">
					{/* Header */}
					<div className="bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-6 md:p-8 mb-8">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
							<div className="flex items-center gap-4">
								<div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
									<Users className="w-7 h-7 text-white" />
								</div>
								<div>
									<h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
										Student Directory
									</h1>
									<p className="text-gray-600 mt-1">
										Total Students:{" "}
										{filteredStudents.length}
									</p>
								</div>
							</div>
							<button
								onClick={exportStudentList}
								className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
							>
								<Download className="w-5 h-5" />
								<span className="font-medium">Export List</span>
							</button>
						</div>
					</div>

					{/* Filters */}
					<div className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-6 mb-8">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{/* Search */}
							<div className="relative">
								<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
								<input
									type="text"
									placeholder="Search by name, roll no, or email..."
									value={searchTerm}
									onChange={(e) =>
										setSearchTerm(e.target.value)
									}
									className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
								/>
							</div>

							{/* Class Filter */}
							<div className="relative">
								<Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
								<select
									value={selectedClass}
									onChange={(e) =>
										setSelectedClass(e.target.value)
									}
									className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
								>
									{classes.map((cls) => (
										<option key={cls} value={cls}>
											{cls}
										</option>
									))}
								</select>
							</div>

							{/* Status Filter */}
							<div className="relative">
								<Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
								<select
									value={selectedStatus}
									onChange={(e) =>
										setSelectedStatus(e.target.value)
									}
									className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
								>
									{statusOptions.map((status) => (
										<option key={status} value={status}>
											{status}
										</option>
									))}
								</select>
							</div>
						</div>
					</div>

					{/* Student Cards Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredStudents.map((student) => (
							<div
								key={student.id}
								className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-6 hover:shadow-2xl transition-all hover:scale-105 cursor-pointer"
								onClick={() =>
									navigate(`/teacher/student/${student.id}`)
								}
							>
								{/* Student Photo & Info */}
								<div className="flex items-start gap-4 mb-4">
									<div className="relative flex-shrink-0">
										<img
											src={student.photo}
											alt={student.name}
											className="w-20 h-20 rounded-xl object-cover shadow-lg border-2 border-white/50"
										/>
										{student.faceRegistered ? (
											<div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full shadow-lg">
												<svg
													className="w-4 h-4"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path
														fillRule="evenodd"
														d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
														clipRule="evenodd"
													/>
												</svg>
											</div>
										) : (
											<div className="absolute -bottom-1 -right-1 bg-red-500 text-white p-1 rounded-full shadow-lg">
												<AlertCircle className="w-4 h-4" />
											</div>
										)}
									</div>
									<div className="flex-1 min-w-0">
										<h3 className="text-lg font-bold text-gray-800 mb-1 truncate">
											{student.name}
										</h3>
										<p className="text-sm text-gray-600 mb-1">
											{student.rollNo}
										</p>
										<p className="text-xs text-gray-500">
											{student.class} - Section{" "}
											{student.section}
										</p>
									</div>
								</div>

								{/* Attendance Stats */}
								<div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 mb-4">
									<div className="flex items-center justify-between mb-2">
										<span className="text-sm font-medium text-gray-700">
											Attendance
										</span>
										<div className="flex items-center gap-1">
											{getAttendanceTrend(
												student.attendancePercentage
											)}
											<span
												className={`text-sm font-bold px-2 py-1 rounded-lg ${getAttendanceColor(
													student.attendancePercentage
												)}`}
											>
												{student.attendancePercentage}%
											</span>
										</div>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
										<div
											className={`h-2 rounded-full transition-all duration-500 ${
												student.attendancePercentage >=
												90
													? "bg-gradient-to-r from-green-500 to-emerald-600"
													: student.attendancePercentage >=
													  75
													? "bg-gradient-to-r from-blue-500 to-cyan-600"
													: student.attendancePercentage >=
													  60
													? "bg-gradient-to-r from-orange-500 to-amber-600"
													: "bg-gradient-to-r from-red-500 to-rose-600"
											}`}
											style={{
												width: `${student.attendancePercentage}%`,
											}}
										></div>
									</div>
								</div>

								{/* Quick Stats */}
								<div className="grid grid-cols-3 gap-2 mb-4">
									<div className="text-center p-2 bg-white/40 rounded-lg">
										<p className="text-xs text-gray-600">
											Present
										</p>
										<p className="text-sm font-bold text-green-600">
											{student.present}
										</p>
									</div>
									<div className="text-center p-2 bg-white/40 rounded-lg">
										<p className="text-xs text-gray-600">
											Absent
										</p>
										<p className="text-sm font-bold text-red-600">
											{student.absent}
										</p>
									</div>
									<div className="text-center p-2 bg-white/40 rounded-lg">
										<p className="text-xs text-gray-600">
											Late
										</p>
										<p className="text-sm font-bold text-orange-600">
											{student.late}
										</p>
									</div>
								</div>

								{/* Contact Info */}
								<div className="space-y-2 border-t border-white/30 pt-4">
									<div className="flex items-center gap-2 text-sm text-gray-700">
										<Mail className="w-4 h-4 text-purple-600" />
										<span className="truncate">
											{student.email}
										</span>
									</div>
									<div className="flex items-center gap-2 text-sm text-gray-700">
										<Phone className="w-4 h-4 text-purple-600" />
										<span>{student.phone}</span>
									</div>
								</div>

								{/* View Details Button */}
								<button
									onClick={(e) => {
										e.stopPropagation();
										navigate(
											`/teacher/student/${student.id}`
										);
									}}
									className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all"
								>
									<Eye className="w-4 h-4" />
									<span className="font-medium">
										View Details
									</span>
								</button>
							</div>
						))}
					</div>

					{/* No Results */}
					{filteredStudents.length === 0 && (
						<div className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-12 text-center">
							<Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
							<h3 className="text-xl font-bold text-gray-800 mb-2">
								No Students Found
							</h3>
							<p className="text-gray-600">
								Try adjusting your search or filter criteria
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default StudentList;
