import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	FiUsers,
	FiUserCheck,
	FiUserX,
	FiClock,
	FiBook,
	FiCalendar,
	FiTrendingUp,
	FiGrid,
	FiChevronLeft,
	FiChevronRight,
	FiPlus,
	FiArrowRight,
	FiUserPlus,
	FiBriefcase,
	FiAward,
	FiActivity,
	FiBarChart2,
} from "react-icons/fi";
import AdminLayout from "../../components/Layout/AdminLayout";
import StatsCard from "../../components/StatsCard";
import SectionCard from "../../components/SectionCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { adminAPI } from "../../services/api";
import { format } from "date-fns";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [dashboardData, setDashboardData] = useState({
		totalStudents: 452,
		totalTeachers: 24,
		totalClasses: 12,
		totalSubjects: 18,
		present: 375,
		absent: 77,
		lateArrivals: 59,
		todayAttendance: 83,
		facultyPresent: 22,
		facultyOnLeave: 2,
		todaysClasses: [
			{
				id: 1,
				subject: "Data Structures",
				faculty: "Dr. Rahul Sharma",
				time: "9:00 AM - 10:00 AM",
				class: "II B.Sc (CS)",
				status: "Completed",
			},
			{
				id: 2,
				subject: "Database Management",
				faculty: "Prof. Priya Patel",
				time: "10:15 AM - 11:15 AM",
				class: "III B.Sc (CS)",
				status: "Ongoing",
			},
			{
				id: 3,
				subject: "Web Development",
				faculty: "Dr. Arjun Kumar",
				time: "11:30 AM - 12:30 PM",
				class: "II B.Sc (CS)",
				status: "Upcoming",
			},
			{
				id: 4,
				subject: "Machine Learning",
				faculty: "Dr. Sneha Reddy",
				time: "2:00 PM - 3:00 PM",
				class: "IV B.Sc (CS)",
				status: "Upcoming",
			},
		],
		recentStudents: [
			{
				usn: "1MS21CS045",
				name: "Rajesh Kumar",
				semester: "1",
				date: "Today",
			},
			{
				usn: "1MS21CS046",
				name: "Ananya Iyer",
				semester: "1",
				date: "Today",
			},
			{
				usn: "1MS21CS047",
				name: "Vikram Singh",
				semester: "1",
				date: "Yesterday",
			},
		],
		attendanceTrend: [
			{ day: "Mon", rate: 85 },
			{ day: "Tue", rate: 88 },
			{ day: "Wed", rate: 82 },
			{ day: "Thu", rate: 90 },
			{ day: "Fri", rate: 83 },
		],
		notifications: [
			{
				id: 1,
				title: "Department Meeting",
				message:
					"Faculty meeting scheduled for tomorrow at 10 AM in Conference Room.",
				time: "2 hours ago",
			},
			{
				id: 2,
				title: "New Faculty Joined",
				message:
					"Dr. Sarah Johnson joined the Computer Science department.",
				time: "5 hours ago",
			},
			{
				id: 3,
				title: "Exam Schedule Released",
				message:
					"Mid-term examination schedule has been released for all classes.",
				time: "1 day ago",
			},
		],
		recentActivities: [
			{
				action: "Attendance marked for I B.Sc (CS)",
				time: "10 minutes ago",
			},
			{
				action: "New student registered in department",
				time: "1 hour ago",
			},
			{ action: "Subject allocation updated", time: "2 hours ago" },
			{ action: "Faculty profile updated", time: "3 hours ago" },
		],
	});
	const [loading, setLoading] = useState(false);
	const [currentTime, setCurrentTime] = useState(new Date());
	const [currentMonth, setCurrentMonth] = useState(new Date());

	useEffect(() => {
		fetchDashboard();
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	const fetchDashboard = async () => {
		try {
			const response = await adminAPI.getDashboard();
			setDashboardData((prev) => ({ ...prev, ...response.data }));
		} catch (error) {
			console.error("Failed to fetch dashboard:", error);
		}
	};

	const getDaysInMonth = (date) => {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const daysInMonth = lastDay.getDate();
		const startingDayOfWeek = firstDay.getDay();
		return { daysInMonth, startingDayOfWeek };
	};

	const renderCalendar = () => {
		const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
		const days = [];
		const today = new Date().getDate();
		const isCurrentMonth =
			currentMonth.getMonth() === new Date().getMonth() &&
			currentMonth.getFullYear() === new Date().getFullYear();
		for (let i = 0; i < startingDayOfWeek; i++) {
			days.push(
				<div key={`empty-${i}`} className="text-center p-2"></div>
			);
		}
		for (let day = 1; day <= daysInMonth; day++) {
			const isToday = isCurrentMonth && day === today;
			days.push(
				<div
					key={day}
					className={`text-center p-2 text-sm font-medium cursor-pointer rounded-xl transition-all duration-300 ${
						isToday
							? "bg-gradient-to-br from-pink-400 to-red-400 text-white shadow-lg scale-110"
							: "text-gray-700 hover:bg-white/50 hover:scale-105"
					}`}
				>
					{day}
				</div>
			);
		}
		return days;
	};

	const changeMonth = (direction) => {
		const newDate = new Date(currentMonth);
		newDate.setMonth(newDate.getMonth() + direction);
		setCurrentMonth(newDate);
	};

	if (loading) {
		return <LoadingSpinner fullScreen text="Loading dashboard..." />;
	}

	return (
		<AdminLayout>
			{/* Page Header */}
			<div className="mb-8 bg-gradient-to-r from-[#a3b18a] to-[#588157] backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 animate-fadeIn">
				<h1 className="text-4xl font-bold text-black mb-2">
					HOD Dashboard
				</h1>
				<p className="text-black">
					Welcome back, {user?.name || "HOD"}! Here's your department
					overview
				</p>
			</div>

			{/* Stats Grid */}

			{/* Calendar */}
			<SectionCard
				title="Calendar"
				className="lg:col-span-2"
				delay="animation-delay-200"
				actions={
					<div className="flex items-center gap-2">
						<button
							onClick={() => changeMonth(-1)}
							className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
						>
							<FiChevronLeft className="w-5 h-5 text-gray-700" />
						</button>
						<span className="text-sm font-semibold text-gray-700 min-w-[120px] text-center">
							{format(currentMonth, "MMMM yyyy")}
						</span>
						<button
							onClick={() => changeMonth(1)}
							className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
						>
							<FiChevronRight className="w-5 h-5 text-gray-700" />
						</button>
					</div>
				}
			>
				<div className="grid grid-cols-7 gap-1">
					{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
						(day) => (
							<div
								key={day}
								className="text-center text-xs font-semibold text-gray-700 p-2"
							>
								{day}
							</div>
						)
					)}
					{renderCalendar()}
				</div>
			</SectionCard>

			{/* Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
				{/* Today's Schedule */}
				<SectionCard
					title="Today's Schedule"
					delay="animation-delay-100"
					actions={
						<button
							onClick={() => navigate("/admin/timetable")}
							className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
						>
							View Full
							<FiArrowRight className="w-4 h-4" />
						</button>
					}
				>
					<div className="space-y-3">
						{dashboardData.todaysClasses.map((classItem) => (
							<div
								key={classItem.id}
								className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all border border-blue-100"
							>
								<div
									className={`flex-shrink-0 w-3 h-3 rounded-full ${
										classItem.status === "Completed"
											? "bg-green-500"
											: classItem.status === "Ongoing"
											? "bg-yellow-500 animate-pulse"
											: "bg-gray-400"
									}`}
								/>
								<div className="flex-1 min-w-0">
									<div className="flex items-center justify-between mb-1">
										<h4 className="font-bold text-gray-800 text-sm truncate">
											{classItem.subject}
										</h4>
										<span
											className={`text-xs px-2 py-1 rounded-full font-semibold ${
												classItem.status === "Completed"
													? "bg-green-100 text-green-700"
													: classItem.status ===
													  "Ongoing"
													? "bg-yellow-100 text-yellow-700"
													: "bg-gray-100 text-gray-700"
											}`}
										>
											{classItem.status}
										</span>
									</div>
									<p className="text-xs text-gray-600">
										{classItem.faculty} • {classItem.class}
									</p>
									<p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
										<FiClock className="w-3 h-3" />
										{classItem.time}
									</p>
								</div>
							</div>
						))}
					</div>
				</SectionCard>

				{/* Recent Student Registrations */}
				<SectionCard
					title="Recent Registrations"
					delay="animation-delay-200"
					actions={
						<button
							onClick={() => navigate("/admin/students")}
							className="text-sm text-green-600 hover:text-green-700 font-semibold flex items-center gap-1"
						>
							View All
							<FiArrowRight className="w-4 h-4" />
						</button>
					}
				>
					<div className="space-y-3">
						{dashboardData.recentStudents.map((student, index) => (
							<div
								key={index}
								className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all border border-green-100"
							>
								<div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
									{student.name
										.split(" ")
										.map((n) => n[0])
										.join("")}
								</div>
								<div className="flex-1 min-w-0">
									<h4 className="font-bold text-gray-800 text-sm truncate">
										{student.name}
									</h4>
									<p className="text-xs text-gray-600">
										{student.usn} • Semester{" "}
										{student.semester}
									</p>
								</div>
								<span className="text-xs text-gray-500 whitespace-nowrap">
									{student.date}
								</span>
							</div>
						))}
						<button
							onClick={() => navigate("/admin/students/register")}
							className="w-full mt-2 p-3 rounded-xl border-2 border-dashed border-green-300 hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center gap-2 text-green-600 font-semibold"
						>
							<FiUserPlus className="w-5 h-5" />
							Register New Student
						</button>
					</div>
				</SectionCard>
			</div>

			{/* Attendance Trend & Quick Actions */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
				{/* Attendance Trend */}
				<SectionCard
					title="Weekly Attendance Trend"
					delay="animation-delay-100"
				>
					<div className="space-y-4 pt-4">
						{dashboardData.attendanceTrend.map((day, index) => (
							<div key={index} className="space-y-2">
								<div className="flex items-center justify-between text-sm">
									<span className="font-semibold text-gray-700">
										{day.day}
									</span>
									<span className="font-bold text-gray-800">
										{day.rate}%
									</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
									<div
										className={`h-3 rounded-full transition-all duration-500 ${
											day.rate >= 85
												? "bg-gradient-to-r from-green-400 to-emerald-500"
												: day.rate >= 75
												? "bg-gradient-to-r from-yellow-400 to-orange-500"
												: "bg-gradient-to-r from-red-400 to-pink-500"
										}`}
										style={{ width: `${day.rate}%` }}
									/>
								</div>
							</div>
						))}
						<div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
							<div className="flex items-center justify-between">
								<span className="text-sm font-semibold text-gray-700">
									Weekly Average
								</span>
								<span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
									{Math.round(
										dashboardData.attendanceTrend.reduce(
											(acc, day) => acc + day.rate,
											0
										) / dashboardData.attendanceTrend.length
									)}
									%
								</span>
							</div>
						</div>
					</div>
				</SectionCard>

				{/* Quick Actions */}
				<SectionCard title="Quick Actions" delay="animation-delay-200">
					<div className="grid grid-cols-2 gap-4">
						<button
							onClick={() => navigate("/admin/users")}
							className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border border-blue-100 transition-all hover:scale-105 hover:shadow-lg"
						>
							<FiUsers className="w-8 h-8 text-blue-600 mb-2" />
							<p className="text-sm font-semibold text-gray-800">
								Manage Faculty
							</p>
						</button>
						<button
							onClick={() => navigate("/admin/students")}
							className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-100 transition-all hover:scale-105 hover:shadow-lg"
						>
							<FiBook className="w-8 h-8 text-green-600 mb-2" />
							<p className="text-sm font-semibold text-gray-800">
								Manage Students
							</p>
						</button>
						<button
							onClick={() => navigate("/admin/subjects")}
							className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100 border border-orange-100 transition-all hover:scale-105 hover:shadow-lg"
						>
							<FiGrid className="w-8 h-8 text-orange-600 mb-2" />
							<p className="text-sm font-semibold text-gray-800">
								Subject Allocation
							</p>
						</button>
						<button
							onClick={() => navigate("/admin/timetable")}
							className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-100 transition-all hover:scale-105 hover:shadow-lg"
						>
							<FiCalendar className="w-8 h-8 text-purple-600 mb-2" />
							<p className="text-sm font-semibold text-gray-800">
								View Timetable
							</p>
						</button>
						<button
							onClick={() => navigate("/admin/analytics")}
							className="p-4 rounded-xl bg-gradient-to-br from-rose-50 to-red-50 hover:from-rose-100 hover:to-red-100 border border-rose-100 transition-all hover:scale-105 hover:shadow-lg"
						>
							<FiBarChart2 className="w-8 h-8 text-rose-600 mb-2" />
							<p className="text-sm font-semibold text-gray-800">
								View Analytics
							</p>
						</button>
						<button
							onClick={() => navigate("/admin/students/register")}
							className="p-4 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 border border-teal-100 transition-all hover:scale-105 hover:shadow-lg"
						>
							<FiUserPlus className="w-8 h-8 text-teal-600 mb-2" />
							<p className="text-sm font-semibold text-gray-800">
								Add Student
							</p>
						</button>
					</div>
				</SectionCard>
			</div>

			{/* Recent Activity Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
				{/* Recent Activity */}
				<SectionCard
					title="Recent Activity"
					delay="animation-delay-100"
					actions={
						<button className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
							View All
							<FiArrowRight className="w-4 h-4" />
						</button>
					}
				>
					<div className="space-y-3">
						{dashboardData.recentActivities.map(
							(activity, index) => (
								<div
									key={index}
									className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
								>
									<div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500" />
									<div className="flex-1">
										<p className="text-sm font-medium text-gray-800">
											{activity.action}
										</p>
										<p className="text-xs text-gray-500">
											{activity.time}
										</p>
									</div>
								</div>
							)
						)}
					</div>
				</SectionCard>

				{/* Department Performance */}
				<SectionCard
					title="Department Performance"
					delay="animation-delay-200"
				>
					<div className="space-y-4">
						<div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
							<div className="flex items-center justify-between mb-2">
								<div className="flex items-center gap-2">
									<FiAward className="w-5 h-5 text-green-600" />
									<span className="text-sm font-semibold text-gray-700">
										Overall Performance
									</span>
								</div>
								<span className="text-2xl font-bold text-green-600">
									A+
								</span>
							</div>
							<p className="text-xs text-gray-600">
								Top performing department this semester
							</p>
						</div>

						<div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100">
							<div className="flex items-center justify-between mb-2">
								<div className="flex items-center gap-2">
									<FiActivity className="w-5 h-5 text-blue-600" />
									<span className="text-sm font-semibold text-gray-700">
										Student Engagement
									</span>
								</div>
								<span className="text-2xl font-bold text-blue-600">
									92%
								</span>
							</div>
							<p className="text-xs text-gray-600">
								Active participation in classes
							</p>
						</div>

						<div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
							<div className="flex items-center justify-between mb-2">
								<div className="flex items-center gap-2">
									<FiTrendingUp className="w-5 h-5 text-purple-600" />
									<span className="text-sm font-semibold text-gray-700">
										Pass Percentage
									</span>
								</div>
								<span className="text-2xl font-bold text-purple-600">
									95%
								</span>
							</div>
							<p className="text-xs text-gray-600">
								Last semester results
							</p>
						</div>
					</div>
				</SectionCard>
			</div>

			{/* Notifications */}
			<SectionCard
				title="Department Announcements"
				delay="animation-delay-300"
				actions={
					<button className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all hover:scale-105 shadow-lg">
						<FiPlus className="w-5 h-5" />
					</button>
				}
			>
				<div className="space-y-4">
					{dashboardData.notifications.map((notification, index) => (
						<div
							key={notification.id}
							className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all border border-blue-100"
						>
							<div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
								{index + 1}
							</div>
							<div className="flex-1">
								<div className="flex items-start justify-between mb-1">
									<h4 className="font-bold text-gray-800">
										{notification.title}
									</h4>
									<span className="text-xs text-gray-500">
										{notification.time}
									</span>
								</div>
								<p className="text-sm text-gray-700 leading-relaxed">
									{notification.message}
								</p>
							</div>
						</div>
					))}
				</div>
			</SectionCard>
		</AdminLayout>
	);
};

export default AdminDashboard;
