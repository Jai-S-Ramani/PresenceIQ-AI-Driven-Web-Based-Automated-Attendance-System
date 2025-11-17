import React, { useEffect, useState } from "react";
import {
	FiPercent,
	FiCalendar,
	FiClock,
	FiTrendingUp,
	FiTrendingDown,
	FiCheckCircle,
	FiXCircle,
	FiChevronLeft,
	FiChevronRight,
	FiBook,
} from "react-icons/fi";
import StudentSidebar from "../../components/StudentSidebar";
import StatsCard from "../../components/StatsCard";
import SectionCard from "../../components/SectionCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import { studentAPI } from "../../services/api";
import { format } from "date-fns";
import { useAuth } from "../../context/AuthContext";

const StudentDashboard = () => {
	const { user } = useAuth();
	const [dashboardData, setDashboardData] = useState({
		percentage: 87,
		daysPresent: 78,
		daysAbsent: 12,
		totalClasses: 90,
		todayClasses: [
			{
				id: 1,
				hour: "1st",
				subject: "Data Structures",
				teacher: "Dr. Sarah Johnson",
				time: "9:00 AM",
				room: "Lab-101",
				status: "present",
			},
			{
				id: 2,
				hour: "2nd",
				subject: "Algorithms",
				teacher: "Prof. Mike Chen",
				time: "10:00 AM",
				room: "Room-205",
				status: "present",
			},
			{
				id: 3,
				hour: "3rd",
				subject: "Database Systems",
				teacher: "Dr. Emily Brown",
				time: "11:00 AM",
				room: "Lab-102",
				status: "upcoming",
			},
		],
		subjectWiseAttendance: [
			{ subject: "Data Structures", percentage: 92 },
			{ subject: "Algorithms", percentage: 85 },
			{ subject: "Database Systems", percentage: 88 },
			{ subject: "Web Development", percentage: 83 },
		],
	});
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
			const response = await studentAPI.getDashboard();
			setDashboardData(response.data);
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
		const today = new Date();
		const isCurrentMonth =
			today.getMonth() === currentMonth.getMonth() &&
			today.getFullYear() === currentMonth.getFullYear();

		for (let i = 0; i < startingDayOfWeek; i++) {
			days.push(
				<div key={`empty-${i}`} className="text-center p-2"></div>
			);
		}

		for (let day = 1; day <= daysInMonth; day++) {
			const isToday = isCurrentMonth && day === today.getDate();
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
		<div className="flex min-h-screen bg-gradient-to-br from-[#99B69B] via-[#E4E3D3] to-[#7976B6]">
			<StudentSidebar />
			<div className="flex-1 md:ml-20 p-4 md:p-8 pb-24 md:pb-8">
				{/* Page Header */}
				<div className="mb-8 animate-fadeIn">
					<h1 className="text-4xl font-bold text-gray-800 mb-2">
						Student Dashboard
					</h1>
					<p className="text-gray-600">
						Welcome back, {user?.name || "Student"}! Track your
						attendance and progress
					</p>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<StatsCard
						icon={FiPercent}
						value={`${dashboardData.percentage}%`}
						label="Overall Attendance"
						trend="+3%"
						gradientFrom="green-400"
						gradientTo="emerald-500"
						delay="animation-delay-100"
					/>
					<StatsCard
						icon={FiCheckCircle}
						value={dashboardData.daysPresent}
						label="Days Present"
						gradientFrom="blue-400"
						gradientTo="indigo-500"
						delay="animation-delay-200"
					/>
					<StatsCard
						icon={FiXCircle}
						value={dashboardData.daysAbsent}
						label="Days Absent"
						trend="-2"
						gradientFrom="red-400"
						gradientTo="pink-500"
						delay="animation-delay-300"
					/>
					<StatsCard
						icon={FiBook}
						value={dashboardData.totalClasses}
						label="Total Classes"
						gradientFrom="purple-400"
						gradientTo="pink-500"
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
									{format(currentTime, "EEEE, do MMMM yyyy")}
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

				{/* Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
					{/* Today's Classes */}
					<SectionCard
						title="Today's Classes"
						delay="animation-delay-100"
					>
						{dashboardData.todayClasses.length > 0 ? (
							<div className="space-y-3">
								{dashboardData.todayClasses.map((classItem) => (
									<div
										key={classItem.id}
										className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border border-blue-100 transition-all"
									>
										<div className="flex items-start justify-between mb-2">
											<div className="flex items-center gap-3">
												<div
													className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ${
														classItem.status ===
														"present"
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
													<p className="font-bold text-gray-800">
														{classItem.subject}
													</p>
													<p className="text-sm text-gray-600">
														{classItem.teacher}
													</p>
												</div>
											</div>
											{classItem.status === "present" && (
												<FiCheckCircle className="w-5 h-5 text-green-500" />
											)}
										</div>
										<div className="flex items-center justify-between text-xs text-gray-600 mt-2">
											<span>🕐 {classItem.time}</span>
											<span>📍 {classItem.room}</span>
										</div>
									</div>
								))}
							</div>
						) : (
							<EmptyState
								icon={FiCalendar}
								title="No classes today"
								description="Enjoy your day off!"
							/>
						)}
					</SectionCard>

					{/* Subject-wise Attendance */}
					<SectionCard
						title="Subject-wise Attendance"
						delay="animation-delay-200"
					>
						<div className="space-y-4">
							{dashboardData.subjectWiseAttendance.map(
								(item, index) => (
									<div key={index}>
										<div className="flex items-center justify-between mb-2">
											<span className="text-sm font-semibold text-gray-700">
												{item.subject}
											</span>
											<span
												className={`text-sm font-bold ${
													item.percentage >= 85
														? "text-green-600"
														: item.percentage >= 75
														? "text-orange-600"
														: "text-red-600"
												}`}
											>
												{item.percentage}%
											</span>
										</div>
										<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
											<div
												className={`h-full rounded-full transition-all duration-500 ${
													item.percentage >= 85
														? "bg-gradient-to-r from-green-400 to-emerald-500"
														: item.percentage >= 75
														? "bg-gradient-to-r from-orange-400 to-yellow-500"
														: "bg-gradient-to-r from-red-400 to-pink-500"
												}`}
												style={{
													width: `${item.percentage}%`,
												}}
											/>
										</div>
									</div>
								)
							)}
						</div>
					</SectionCard>
				</div>

				{/* Attendance Status Message */}
				<SectionCard delay="animation-delay-300">
					<div className="text-center py-8">
						{dashboardData.percentage >= 85 ? (
							<div>
								<div className="inline-block p-4 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 mb-4">
									<FiTrendingUp className="w-12 h-12 text-green-500" />
								</div>
								<h3 className="text-2xl font-bold text-gray-800 mb-2">
									Excellent Attendance! 🎉
								</h3>
								<p className="text-gray-600">
									You're doing great! Keep up the good work.
								</p>
							</div>
						) : dashboardData.percentage >= 75 ? (
							<div>
								<div className="inline-block p-4 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 mb-4">
									<FiTrendingUp className="w-12 h-12 text-orange-500" />
								</div>
								<h3 className="text-2xl font-bold text-gray-800 mb-2">
									Good Progress! 📈
								</h3>
								<p className="text-gray-600">
									You're on track. Try to maintain or improve
									your attendance.
								</p>
							</div>
						) : (
							<div>
								<div className="inline-block p-4 rounded-full bg-gradient-to-br from-red-100 to-pink-100 mb-4">
									<FiTrendingDown className="w-12 h-12 text-red-500" />
								</div>
								<h3 className="text-2xl font-bold text-gray-800 mb-2">
									Needs Improvement ⚠️
								</h3>
								<p className="text-gray-600">
									Your attendance is below 75%. Please attend
									classes regularly.
								</p>
							</div>
						)}
					</div>
				</SectionCard>
			</div>
		</div>
	);
};

export default StudentDashboard;
