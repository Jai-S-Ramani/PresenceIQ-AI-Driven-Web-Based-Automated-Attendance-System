import React, { useEffect, useState } from "react";
import {
	FiBook,
	FiCalendar,
	FiClock,
	FiCheckCircle,
	FiUsers,
	FiTrendingUp,
	FiChevronLeft,
	FiChevronRight,
	FiEye,
	FiEdit,
	FiPlus,
} from "react-icons/fi";
import TeacherSidebar from "../../components/TeacherSidebar";
import StatsCard from "../../components/StatsCard";
import SectionCard from "../../components/SectionCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { teacherAPI } from "../../services/api";
import { format } from "date-fns";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [dashboardData, setDashboardData] = useState({
		totalClasses: 6,
		todayClasses: 4,
		totalStudents: 180,
		attendanceMarked: 3,
		avgAttendance: 87,
	});
	const [todayClasses, setTodayClasses] = useState([
		{
			id: 1,
			hour: "1st",
			subject: "Data Structures",
			class: "II B.Sc (CS)",
			time: "9:00 AM",
			students: 45,
			attended: true,
		},
		{
			id: 2,
			hour: "2nd",
			subject: "Algorithms",
			class: "III B.Sc (CS)",
			time: "10:00 AM",
			students: 38,
			attended: true,
		},
		{
			id: 3,
			hour: "3rd",
			subject: "Database Systems",
			class: "II B.Sc (CS)",
			time: "11:00 AM",
			students: 42,
			attended: true,
		},
		{
			id: 4,
			hour: "4th",
			subject: "Web Development",
			class: "I B.Sc (CS)",
			time: "2:00 PM",
			students: 55,
			attended: false,
		},
	]);
	const [notifications, setNotifications] = useState([
		{
			id: 1,
			title: "Tomorrow Holiday",
			message:
				"Campus will remain closed tomorrow due to national holiday.",
			time: "2 hours ago",
		},
		{
			id: 2,
			title: "Exam Schedule",
			message: "Mid-term examination schedule has been released.",
			time: "5 hours ago",
		},
	]);
	const [currentTime, setCurrentTime] = useState(new Date());
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchDashboard();
		const timer = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	const fetchDashboard = async () => {
		try {
			const response = await teacherAPI.getDashboard();
			if (response.data.todayClasses)
				setTodayClasses(response.data.todayClasses);
			if (response.data.notifications)
				setNotifications(response.data.notifications);
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

	const handleMarkAttendance = (classId) => {
		navigate(`/teacher/attendance/${classId}`);
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
			<div className="flex-1 md:ml-20 flex flex-col overflow-hidden">
				<main className="flex-1 overflow-auto p-4 md:p-8 pb-24 md:pb-8">
					<div className="max-w-7xl mx-auto">
						{/* Page Header */}
						<div className="mb-8 animate-fadeIn">
							<h1 className="text-4xl font-bold text-gray-800 mb-2">
								Teacher Dashboard
							</h1>
							<p className="text-gray-600">
								Welcome back, {user?.name || "Teacher"}! Ready
								to inspire minds today?
							</p>
						</div>

						{/* Stats Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
							<StatsCard
								icon={FiBook}
								value={dashboardData.totalClasses}
								label="Total Classes"
								gradientFrom="blue-400"
								gradientTo="indigo-500"
								delay="animation-delay-100"
							/>
							<StatsCard
								icon={FiCalendar}
								value={dashboardData.todayClasses}
								label="Classes Today"
								trend="+1"
								gradientFrom="purple-400"
								gradientTo="pink-500"
								delay="animation-delay-200"
							/>
							<StatsCard
								icon={FiUsers}
								value={dashboardData.totalStudents}
								label="Total Students"
								gradientFrom="green-400"
								gradientTo="emerald-500"
								delay="animation-delay-300"
							/>
							<StatsCard
								icon={FiTrendingUp}
								value={`${dashboardData.avgAttendance}%`}
								label="Avg Attendance"
								trend="+5%"
								gradientFrom="orange-400"
								gradientTo="yellow-500"
								delay="animation-delay-400"
							/>
						</div>

						{/* Time and Calendar Section */}
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
							{/* Real-time Clock */}
							<SectionCard
								title="Current Time"
								className="lg:col-span-1"
								delay="animation-delay-100"
							>
								<div className="text-center py-6">
									<div className="mb-6">
										<div className="inline-block p-4 rounded-full bg-gradient-to-br from-orange-100 to-yellow-100 mb-4">
											<FiClock className="w-12 h-12 text-orange-500" />
										</div>
										<p className="text-5xl font-bold text-gray-800 mb-2">
											{format(currentTime, "h:mm:ss")}
										</p>
										<p className="text-xl text-gray-600 font-medium">
											{format(currentTime, "a")}
										</p>
									</div>
									<div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
										<p className="text-sm font-semibold text-gray-700 mb-1">
											Today
										</p>
										<p className="text-xl font-bold text-gray-800">
											{format(
												currentTime,
												"EEEE, do MMMM yyyy"
											)}
										</p>
									</div>
								</div>
							</SectionCard>

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
									{[
										"Sun",
										"Mon",
										"Tue",
										"Wed",
										"Thu",
										"Fri",
										"Sat",
									].map((day) => (
										<div
											key={day}
											className="text-center text-xs font-semibold text-gray-700 p-2"
										>
											{day}
										</div>
									))}
									{renderCalendar()}
								</div>
							</SectionCard>
						</div>

						{/* Today's Classes */}
						<SectionCard
							title="Today's Classes"
							delay="animation-delay-300"
							className="mb-8"
						>
							<div className="space-y-3">
								{todayClasses.map((classItem, index) => (
									<div
										key={classItem.id}
										className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border border-blue-100 transition-all"
									>
										<div className="flex items-center gap-4">
											<div
												className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ${
													classItem.attended
														? "bg-gradient-to-br from-green-400 to-emerald-500"
														: "bg-gradient-to-br from-blue-400 to-purple-500"
												}`}
											>
												{classItem.hour.replace(
													/[^0-9]/g,
													""
												)}
											</div>
											<div>
												<div className="flex items-center gap-2">
													<p className="font-bold text-gray-800">
														{classItem.subject}
													</p>
													{classItem.attended && (
														<FiCheckCircle className="w-4 h-4 text-green-500" />
													)}
												</div>
												<p className="text-sm text-gray-600">
													{classItem.class} •{" "}
													{classItem.students}{" "}
													students
												</p>
												<p className="text-xs text-gray-500 mt-1">
													{classItem.time}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<button
												className="p-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-colors"
												title="View Details"
											>
												<FiEye className="w-5 h-5 text-gray-600" />
											</button>
											{!classItem.attended && (
												<button
													onClick={() =>
														handleMarkAttendance(
															classItem.id
														)
													}
													className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold transition-all hover:scale-105 shadow-lg flex items-center gap-2"
												>
													<FiEdit className="w-4 h-4" />
													Mark Attendance
												</button>
											)}
										</div>
									</div>
								))}
							</div>
						</SectionCard>

						{/* Notifications */}
						<SectionCard
							title="Notifications & Reminders"
							delay="animation-delay-400"
							actions={
								<button className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all hover:scale-105 shadow-lg">
									<FiPlus className="w-5 h-5" />
								</button>
							}
						>
							<div className="space-y-4">
								{notifications.map((notification, index) => (
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
					</div>
				</main>
			</div>
		</div>
	);
};

export default TeacherDashboard;
