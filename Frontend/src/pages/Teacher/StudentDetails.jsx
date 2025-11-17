import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	User,
	Mail,
	Phone,
	Calendar,
	MapPin,
	BookOpen,
	TrendingUp,
	Clock,
	CheckCircle,
	XCircle,
	ArrowLeft,
	Download,
	Eye,
	AlertCircle,
} from "lucide-react";
import TeacherSidebar from "../../components/TeacherSidebar";
import LoadingSpinner from "../../components/LoadingSpinner";
import { format } from "date-fns";

const StudentDetails = () => {
	const { studentId } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [selectedPeriod, setSelectedPeriod] = useState("Last 7 Days");
	const [activeTab, setActiveTab] = useState("overview");

	// Mock student data - Replace with API call
	const [student, setStudent] = useState({
		id: studentId,
		name: "Alexander Kherr",
		rollNo: "CS2023001",
		email: "alexander.kherr@university.edu",
		phone: "+1 234 567 8900",
		class: "III B.Sc (CS)",
		section: "A",
		semester: "5th Semester",
		dateOfBirth: "2003-05-15",
		address: "123 University Street, Campus Town",
		photo: "https://ui-avatars.com/api/?name=Alexander+Kherr&size=200&background=6366f1&color=fff",
		guardianName: "John Kherr",
		guardianPhone: "+1 234 567 8901",
		bloodGroup: "O+",
		enrollmentDate: "2021-08-01",
		faceRegistered: true,

		// Attendance Stats
		totalClasses: 120,
		present: 108,
		absent: 8,
		late: 4,
		attendancePercentage: 90,

		// Recent Attendance (Last 10 records)
		recentAttendance: [
			{
				date: "2024-11-17",
				subject: "Data Structures",
				status: "Present",
				time: "09:15 AM",
				confidence: 95,
			},
			{
				date: "2024-11-16",
				subject: "Algorithms",
				status: "Present",
				time: "10:30 AM",
				confidence: 92,
			},
			{
				date: "2024-11-16",
				subject: "Database Systems",
				status: "Late",
				time: "02:45 PM",
				confidence: 88,
			},
			{
				date: "2024-11-15",
				subject: "Web Development",
				status: "Present",
				time: "11:00 AM",
				confidence: 94,
			},
			{
				date: "2024-11-15",
				subject: "Data Structures",
				status: "Absent",
				time: "-",
				confidence: 0,
			},
			{
				date: "2024-11-14",
				subject: "Operating Systems",
				status: "Present",
				time: "09:00 AM",
				confidence: 96,
			},
			{
				date: "2024-11-13",
				subject: "Computer Networks",
				status: "Present",
				time: "03:15 PM",
				confidence: 93,
			},
			{
				date: "2024-11-12",
				subject: "Software Engineering",
				status: "Present",
				time: "10:15 AM",
				confidence: 91,
			},
		],

		// Subject-wise performance
		subjects: [
			{
				name: "Data Structures",
				total: 25,
				present: 23,
				percentage: 92,
				teacher: "Dr. Smith",
			},
			{
				name: "Algorithms",
				total: 20,
				present: 18,
				percentage: 90,
				teacher: "Prof. Johnson",
			},
			{
				name: "Database Systems",
				total: 22,
				present: 20,
				percentage: 91,
				teacher: "Dr. Williams",
			},
			{
				name: "Web Development",
				total: 18,
				present: 17,
				percentage: 94,
				teacher: "Prof. Brown",
			},
			{
				name: "Operating Systems",
				total: 20,
				present: 18,
				percentage: 90,
				teacher: "Dr. Davis",
			},
			{
				name: "Computer Networks",
				total: 15,
				present: 12,
				percentage: 80,
				teacher: "Prof. Miller",
			},
		],
	});

	useEffect(() => {
		// Simulate API call
		setTimeout(() => {
			setLoading(false);
		}, 800);
	}, [studentId]);

	const getStatusColor = (status) => {
		switch (status.toLowerCase()) {
			case "present":
				return "text-green-600 bg-green-100";
			case "absent":
				return "text-red-600 bg-red-100";
			case "late":
				return "text-orange-600 bg-orange-100";
			default:
				return "text-gray-600 bg-gray-100";
		}
	};

	const getStatusIcon = (status) => {
		switch (status.toLowerCase()) {
			case "present":
				return <CheckCircle className="w-4 h-4" />;
			case "absent":
				return <XCircle className="w-4 h-4" />;
			case "late":
				return <Clock className="w-4 h-4" />;
			default:
				return <AlertCircle className="w-4 h-4" />;
		}
	};

	const exportReport = () => {
		console.log("Exporting student report...");
		// Implement export functionality
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
					{/* Back Button */}
					<button
						onClick={() => navigate(-1)}
						className="mb-6 flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors bg-white/40 backdrop-blur-xl px-4 py-2 rounded-xl hover:bg-white/60"
					>
						<ArrowLeft className="w-5 h-5" />
						<span className="font-medium">Back to Classes</span>
					</button>

					{/* Student Profile Card */}
					<div className="bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-6 md:p-8 mb-8 animate-fadeIn">
						<div className="flex flex-col md:flex-row gap-6">
							{/* Profile Photo */}
							<div className="flex-shrink-0">
								<div className="relative">
									<img
										src={student.photo}
										alt={student.name}
										className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover shadow-xl border-4 border-white/50"
									/>
									{student.faceRegistered && (
										<div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg">
											<CheckCircle className="w-6 h-6" />
										</div>
									)}
								</div>
							</div>

							{/* Student Info */}
							<div className="flex-1">
								<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
									<div>
										<h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
											{student.name}
										</h1>
										<div className="flex flex-wrap gap-3">
											<span className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full text-sm font-semibold shadow-lg">
												{student.rollNo}
											</span>
											<span className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-full text-sm font-semibold shadow-lg">
												{student.class} - Section{" "}
												{student.section}
											</span>
											{student.faceRegistered && (
												<span className="px-4 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-semibold shadow-lg">
													Face Registered
												</span>
											)}
										</div>
									</div>
									<button
										onClick={exportReport}
										className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
									>
										<Download className="w-5 h-5" />
										<span className="font-medium">
											Export Report
										</span>
									</button>
								</div>

								{/* Quick Stats */}
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									<div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/60">
										<div className="flex items-center gap-2 mb-2">
											<CheckCircle className="w-5 h-5 text-green-600" />
											<span className="text-sm text-gray-600">
												Present
											</span>
										</div>
										<p className="text-2xl font-bold text-gray-800">
											{student.present}
										</p>
									</div>
									<div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/60">
										<div className="flex items-center gap-2 mb-2">
											<XCircle className="w-5 h-5 text-red-600" />
											<span className="text-sm text-gray-600">
												Absent
											</span>
										</div>
										<p className="text-2xl font-bold text-gray-800">
											{student.absent}
										</p>
									</div>
									<div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/60">
										<div className="flex items-center gap-2 mb-2">
											<Clock className="w-5 h-5 text-orange-600" />
											<span className="text-sm text-gray-600">
												Late
											</span>
										</div>
										<p className="text-2xl font-bold text-gray-800">
											{student.late}
										</p>
									</div>
									<div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/60">
										<div className="flex items-center gap-2 mb-2">
											<TrendingUp className="w-5 h-5 text-blue-600" />
											<span className="text-sm text-gray-600">
												Attendance
											</span>
										</div>
										<p className="text-2xl font-bold text-gray-800">
											{student.attendancePercentage}%
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Tabs Navigation */}
					<div className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-2 mb-8 flex gap-2 overflow-x-auto">
						{["overview", "attendance", "subjects", "contact"].map(
							(tab) => (
								<button
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
										activeTab === tab
											? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg"
											: "text-gray-700 hover:bg-white/40"
									}`}
								>
									{tab.charAt(0).toUpperCase() + tab.slice(1)}
								</button>
							)
						)}
					</div>

					{/* Tab Content */}
					{activeTab === "overview" && (
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							{/* Personal Information */}
							<div className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-6">
								<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
									<User className="w-6 h-6 text-purple-600" />
									Personal Information
								</h2>
								<div className="space-y-4">
									<InfoRow
										icon={<User />}
										label="Full Name"
										value={student.name}
									/>
									<InfoRow
										icon={<BookOpen />}
										label="Roll Number"
										value={student.rollNo}
									/>
									<InfoRow
										icon={<Calendar />}
										label="Date of Birth"
										value={format(
											new Date(student.dateOfBirth),
											"MMMM dd, yyyy"
										)}
									/>
									<InfoRow
										icon={<BookOpen />}
										label="Semester"
										value={student.semester}
									/>
									<InfoRow
										icon={<Calendar />}
										label="Enrollment Date"
										value={format(
											new Date(student.enrollmentDate),
											"MMMM dd, yyyy"
										)}
									/>
									<InfoRow
										icon={<AlertCircle />}
										label="Blood Group"
										value={student.bloodGroup}
									/>
								</div>
							</div>

							{/* Attendance Progress */}
							<div className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-6">
								<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
									<TrendingUp className="w-6 h-6 text-green-600" />
									Attendance Progress
								</h2>
								<div className="space-y-6">
									<div>
										<div className="flex justify-between mb-2">
											<span className="text-sm font-medium text-gray-700">
												Overall Attendance
											</span>
											<span className="text-sm font-bold text-gray-800">
												{student.attendancePercentage}%
											</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
											<div
												className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-500 shadow-lg"
												style={{
													width: `${student.attendancePercentage}%`,
												}}
											></div>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-4 pt-4">
										<div className="text-center p-4 bg-white/50 rounded-xl">
											<p className="text-3xl font-bold text-green-600">
												{student.present}
											</p>
											<p className="text-sm text-gray-600 mt-1">
												Total Present
											</p>
										</div>
										<div className="text-center p-4 bg-white/50 rounded-xl">
											<p className="text-3xl font-bold text-gray-800">
												{student.totalClasses}
											</p>
											<p className="text-sm text-gray-600 mt-1">
												Total Classes
											</p>
										</div>
									</div>

									{student.attendancePercentage < 75 && (
										<div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
											<div className="flex items-start gap-3">
												<AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
												<div>
													<p className="font-semibold text-red-800">
														Low Attendance Warning
													</p>
													<p className="text-sm text-red-600 mt-1">
														Attendance below 75%.
														Student needs to improve
														attendance to meet
														minimum requirements.
													</p>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					)}

					{activeTab === "attendance" && (
						<div className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-6">
							<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
								<h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
									<Calendar className="w-6 h-6 text-blue-600" />
									Recent Attendance Records
								</h2>
								<select
									value={selectedPeriod}
									onChange={(e) =>
										setSelectedPeriod(e.target.value)
									}
									className="px-4 py-2 bg-white/50 backdrop-blur-sm border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
								>
									<option>Last 7 Days</option>
									<option>Last 30 Days</option>
									<option>This Month</option>
									<option>Last Month</option>
								</select>
							</div>

							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
											<th className="px-6 py-4 text-left rounded-tl-xl">
												Date
											</th>
											<th className="px-6 py-4 text-left">
												Subject
											</th>
											<th className="px-6 py-4 text-center">
												Status
											</th>
											<th className="px-6 py-4 text-center">
												Time
											</th>
											<th className="px-6 py-4 text-center rounded-tr-xl">
												Confidence
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-white/20">
										{student.recentAttendance.map(
											(record, index) => (
												<tr
													key={index}
													className="bg-white/20 hover:bg-white/30 transition-colors"
												>
													<td className="px-6 py-4 font-medium text-gray-800">
														{format(
															new Date(
																record.date
															),
															"MMM dd, yyyy"
														)}
													</td>
													<td className="px-6 py-4 text-gray-700">
														{record.subject}
													</td>
													<td className="px-6 py-4">
														<div className="flex items-center justify-center gap-2">
															<span
																className={`px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 ${getStatusColor(
																	record.status
																)}`}
															>
																{getStatusIcon(
																	record.status
																)}
																{record.status}
															</span>
														</div>
													</td>
													<td className="px-6 py-4 text-center text-gray-700 font-medium">
														{record.time}
													</td>
													<td className="px-6 py-4 text-center">
														{record.confidence >
														0 ? (
															<span
																className={`font-bold ${
																	record.confidence >=
																	90
																		? "text-green-600"
																		: record.confidence >=
																		  80
																		? "text-orange-600"
																		: "text-red-600"
																}`}
															>
																{
																	record.confidence
																}
																%
															</span>
														) : (
															<span className="text-gray-400">
																-
															</span>
														)}
													</td>
												</tr>
											)
										)}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{activeTab === "subjects" && (
						<div className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-6">
							<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
								<BookOpen className="w-6 h-6 text-indigo-600" />
								Subject-wise Attendance
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{student.subjects.map((subject, index) => (
									<div
										key={index}
										className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-white/60 hover:shadow-xl transition-all hover:scale-105"
									>
										<h3 className="text-lg font-bold text-gray-800 mb-2">
											{subject.name}
										</h3>
										<p className="text-sm text-gray-600 mb-4">
											Teacher: {subject.teacher}
										</p>

										<div className="mb-4">
											<div className="flex justify-between text-sm mb-2">
												<span className="text-gray-700">
													Attendance
												</span>
												<span className="font-bold text-gray-800">
													{subject.percentage}%
												</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
												<div
													className={`h-full rounded-full transition-all duration-500 ${
														subject.percentage >= 90
															? "bg-gradient-to-r from-green-500 to-emerald-600"
															: subject.percentage >=
															  75
															? "bg-gradient-to-r from-blue-500 to-cyan-600"
															: subject.percentage >=
															  60
															? "bg-gradient-to-r from-orange-500 to-amber-600"
															: "bg-gradient-to-r from-red-500 to-rose-600"
													}`}
													style={{
														width: `${subject.percentage}%`,
													}}
												></div>
											</div>
										</div>

										<div className="flex justify-between text-sm">
											<span className="text-gray-600">
												Present:{" "}
												<span className="font-semibold text-green-600">
													{subject.present}
												</span>
											</span>
											<span className="text-gray-600">
												Total:{" "}
												<span className="font-semibold text-gray-800">
													{subject.total}
												</span>
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === "contact" && (
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							{/* Student Contact */}
							<div className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-6">
								<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
									<Phone className="w-6 h-6 text-green-600" />
									Student Contact
								</h2>
								<div className="space-y-4">
									<InfoRow
										icon={<Mail />}
										label="Email"
										value={student.email}
									/>
									<InfoRow
										icon={<Phone />}
										label="Phone"
										value={student.phone}
									/>
									<InfoRow
										icon={<MapPin />}
										label="Address"
										value={student.address}
									/>
								</div>
							</div>

							{/* Guardian Contact */}
							<div className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-6">
								<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
									<User className="w-6 h-6 text-purple-600" />
									Guardian Information
								</h2>
								<div className="space-y-4">
									<InfoRow
										icon={<User />}
										label="Guardian Name"
										value={student.guardianName}
									/>
									<InfoRow
										icon={<Phone />}
										label="Guardian Phone"
										value={student.guardianPhone}
									/>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

// Helper Component for Info Rows
const InfoRow = ({ icon, label, value }) => (
	<div className="flex items-start gap-3 p-3 bg-white/30 rounded-xl">
		<div className="text-purple-600 mt-0.5">{icon}</div>
		<div className="flex-1">
			<p className="text-sm text-gray-600 mb-1">{label}</p>
			<p className="font-semibold text-gray-800">{value}</p>
		</div>
	</div>
);

export default StudentDetails;
