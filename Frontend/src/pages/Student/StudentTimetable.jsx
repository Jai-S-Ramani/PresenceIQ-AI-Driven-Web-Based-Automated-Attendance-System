import React, { useEffect, useState } from "react";
import {
	FiCalendar,
	FiClock,
	FiBook,
	FiCheckCircle,
	FiXCircle,
	FiChevronLeft,
	FiChevronRight,
} from "react-icons/fi";
import StudentSidebar from "../../components/StudentSidebar";
import SectionCard from "../../components/SectionCard";
import { studentAPI } from "../../services/api";

const StudentTimetable = () => {
	const [currentWeek, setCurrentWeek] = useState(0);
	const [timetable, setTimetable] = useState({
		Monday: [
			{
				subject: "Mathematics",
				time: "9:00 AM - 10:00 AM",
				teacher: "Dr. Smith",
				room: "101",
			},
			{
				subject: "Physics",
				time: "10:00 AM - 11:00 AM",
				teacher: "Dr. Johnson",
				room: "202",
			},
			{
				subject: "Chemistry",
				time: "11:00 AM - 12:00 PM",
				teacher: "Dr. Williams",
				room: "303",
			},
			{
				subject: "Break",
				time: "12:00 PM - 1:00 PM",
				teacher: "-",
				room: "-",
			},
			{
				subject: "English",
				time: "1:00 PM - 2:00 PM",
				teacher: "Dr. Brown",
				room: "104",
			},
			{
				subject: "Computer Science",
				time: "2:00 PM - 3:00 PM",
				teacher: "Dr. Davis",
				room: "305",
			},
		],
		Tuesday: [
			{
				subject: "Computer Science",
				time: "9:00 AM - 10:00 AM",
				teacher: "Dr. Davis",
				room: "305",
			},
			{
				subject: "Mathematics",
				time: "10:00 AM - 11:00 AM",
				teacher: "Dr. Smith",
				room: "101",
			},
			{
				subject: "Physics",
				time: "11:00 AM - 12:00 PM",
				teacher: "Dr. Johnson",
				room: "202",
			},
			{
				subject: "Break",
				time: "12:00 PM - 1:00 PM",
				teacher: "-",
				room: "-",
			},
			{
				subject: "Chemistry",
				time: "1:00 PM - 2:00 PM",
				teacher: "Dr. Williams",
				room: "303",
			},
			{
				subject: "English",
				time: "2:00 PM - 3:00 PM",
				teacher: "Dr. Brown",
				room: "104",
			},
		],
		Wednesday: [
			{
				subject: "English",
				time: "9:00 AM - 10:00 AM",
				teacher: "Dr. Brown",
				room: "104",
			},
			{
				subject: "Chemistry",
				time: "10:00 AM - 11:00 AM",
				teacher: "Dr. Williams",
				room: "303",
			},
			{
				subject: "Mathematics",
				time: "11:00 AM - 12:00 PM",
				teacher: "Dr. Smith",
				room: "101",
			},
			{
				subject: "Break",
				time: "12:00 PM - 1:00 PM",
				teacher: "-",
				room: "-",
			},
			{
				subject: "Physics",
				time: "1:00 PM - 2:00 PM",
				teacher: "Dr. Johnson",
				room: "202",
			},
			{
				subject: "Computer Science",
				time: "2:00 PM - 3:00 PM",
				teacher: "Dr. Davis",
				room: "305",
			},
		],
		Thursday: [
			{
				subject: "Physics",
				time: "9:00 AM - 10:00 AM",
				teacher: "Dr. Johnson",
				room: "202",
			},
			{
				subject: "English",
				time: "10:00 AM - 11:00 AM",
				teacher: "Dr. Brown",
				room: "104",
			},
			{
				subject: "Computer Science",
				time: "11:00 AM - 12:00 PM",
				teacher: "Dr. Davis",
				room: "305",
			},
			{
				subject: "Break",
				time: "12:00 PM - 1:00 PM",
				teacher: "-",
				room: "-",
			},
			{
				subject: "Mathematics",
				time: "1:00 PM - 2:00 PM",
				teacher: "Dr. Smith",
				room: "101",
			},
			{
				subject: "Chemistry",
				time: "2:00 PM - 3:00 PM",
				teacher: "Dr. Williams",
				room: "303",
			},
		],
		Friday: [
			{
				subject: "Chemistry",
				time: "9:00 AM - 10:00 AM",
				teacher: "Dr. Williams",
				room: "303",
			},
			{
				subject: "Computer Science",
				time: "10:00 AM - 11:00 AM",
				teacher: "Dr. Davis",
				room: "305",
			},
			{
				subject: "English",
				time: "11:00 AM - 12:00 PM",
				teacher: "Dr. Brown",
				room: "104",
			},
			{
				subject: "Break",
				time: "12:00 PM - 1:00 PM",
				teacher: "-",
				room: "-",
			},
			{
				subject: "Physics",
				time: "1:00 PM - 2:00 PM",
				teacher: "Dr. Johnson",
				room: "202",
			},
			{
				subject: "Mathematics",
				time: "2:00 PM - 3:00 PM",
				teacher: "Dr. Smith",
				room: "101",
			},
		],
		Saturday: [
			{
				subject: "Lab - Physics",
				time: "9:00 AM - 10:00 AM",
				teacher: "Dr. Johnson",
				room: "Lab 1",
			},
			{
				subject: "Lab - Physics",
				time: "10:00 AM - 11:00 AM",
				teacher: "Dr. Johnson",
				room: "Lab 1",
			},
			{
				subject: "Lab - Chemistry",
				time: "11:00 AM - 12:00 PM",
				teacher: "Dr. Williams",
				room: "Lab 2",
			},
			{
				subject: "Break",
				time: "12:00 PM - 1:00 PM",
				teacher: "-",
				room: "-",
			},
			{
				subject: "Lab - Computer",
				time: "1:00 PM - 2:00 PM",
				teacher: "Dr. Davis",
				room: "Lab 3",
			},
			{
				subject: "Lab - Computer",
				time: "2:00 PM - 3:00 PM",
				teacher: "Dr. Davis",
				room: "Lab 3",
			},
		],
	});

	const [oldTimetable] = useState([
		{
			date: "02/08/2024",
			subjects: [
				"MTH 317",
				"MTH 317",
				"MTH 317",
				"MTH 317",
				"MTH 317",
				"MTH 317",
			],
			status: ["P", "P", "P", "P", "P", "P"],
		},
		{
			date: "02/08/2024",
			subjects: [
				"MTH 317",
				"MTH 317",
				"MTH 317",
				"MTH 317",
				"MTH 317",
				"MTH 317",
			],
			status: ["P", "P", "P", "P", "P", "P"],
		},
		{
			date: "02/08/2024",
			subjects: [
				"MTH 317",
				"MTH 317",
				"MTH 317",
				"MTH 317",
				"MTH 317",
				"MTH 317",
			],
			status: ["P", "P", "P", "P", "P", "P"],
		},
		{
			date: "02/08/2024",
			subjects: [
				"MTH 317",
				"MTH 317",
				"MTH 317",
				"MTH 317",
				"MTH 317",
				"MTH 317",
			],
			status: ["P", "P", "P", "P", "P", "P"],
		},
		{
			date: "02/08/2024",
			subjects: [
				"MTH 317",
				"MTH 317",
				"MTH 317",
				"MTH 317",
				"MTH 317",
				"MTH 317",
			],
			status: ["A", "A", "A", "A", "A", "A"],
		},
		{
			date: "02/08/2024",
			subjects: [
				"MTH 317",
				"MTH 317",
				"MTH 317",
				"MTH 317",
				"MTH 317",
				"MTH 317",
			],
			status: ["P", "P", "P", "P", "P", "P"],
		},
	]);

	const periods = [
		"9:00 AM - 10:00 AM",
		"10:00 AM - 11:00 AM",
		"11:00 AM - 12:00 PM",
		"12:00 PM - 1:00 PM",
		"1:00 PM - 2:00 PM",
		"2:00 PM - 3:00 PM",
	];

	useEffect(() => {
		fetchTimetable();
	}, []);

	const fetchTimetable = async () => {
		try {
			const response = await studentAPI.getTimetable();
			// setTimetable(response.data);
		} catch (error) {
			console.error("Failed to fetch timetable:", error);
		}
	};

	const getCurrentDay = () => {
		const days = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		];
		return days[new Date().getDay()];
	};

	return (
		<div className="flex min-h-screen bg-gradient-to-br from-[#99B69B] via-[#E4E3D3] to-[#7976B6]">
			<StudentSidebar />
			<div className="flex-1 md:ml-20 p-4 md:p-8 pb-24 md:pb-8">
				{/* Header */}
				<div className="mb-8 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg">
					<h1 className="text-3xl font-bold text-gray-800">
						My Timetable
					</h1>
					<p className="text-gray-600 mt-2 flex items-center space-x-2">
						<FiCalendar className="w-4 h-4" />
						<span>Weekly Schedule • Current Week</span>
					</p>
				</div>

				{/* Week Navigation */}
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center space-x-3">
						<button
							onClick={() => setCurrentWeek(currentWeek - 1)}
							className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl transition-all border border-purple-200 shadow-sm"
						>
							<FiChevronLeft className="w-5 h-5 text-purple-600" />
						</button>
						<span className="px-6 py-2 bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 rounded-xl font-semibold">
							Week {currentWeek + 1}
						</span>
						<button
							onClick={() => setCurrentWeek(currentWeek + 1)}
							className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl transition-all border border-purple-200 shadow-sm"
						>
							<FiChevronRight className="w-5 h-5 text-purple-600" />
						</button>
					</div>
					<div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
						<FiClock className="w-4 h-4 text-purple-600" />
						<span className="text-sm font-semibold text-purple-700">
							Today: {getCurrentDay()}
						</span>
					</div>
				</div>

				{/* Timetable */}
				<SectionCard title="Weekly Schedule" icon={FiBook}>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-200">
									<th className="px-4 py-4 text-left text-sm font-semibold text-purple-800 min-w-[120px]">
										Time
									</th>
									{Object.keys(timetable).map((day) => (
										<th
											key={day}
											className={`px-4 py-4 text-center text-sm font-semibold min-w-[180px] ${
												day === getCurrentDay()
													? "text-pink-600 bg-pink-100"
													: "text-purple-800"
											}`}
										>
											{day}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{periods.map((period, periodIndex) => (
									<tr
										key={periodIndex}
										className="border-b border-gray-200"
									>
										<td className="px-4 py-3 text-sm font-semibold text-gray-700 bg-purple-50/50">
											<div className="flex items-center space-x-2">
												<FiClock className="w-4 h-4 text-purple-600" />
												<span>{period}</span>
											</div>
										</td>
										{Object.keys(timetable).map((day) => {
											const classInfo =
												timetable[day][periodIndex];
											const isBreak =
												classInfo.subject === "Break";
											const isToday =
												day === getCurrentDay();
											return (
												<td
													key={day}
													className={`px-4 py-3 text-center ${
														isToday
															? "bg-pink-50/50"
															: ""
													}`}
												>
													{isBreak ? (
														<div className="py-2 px-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg text-gray-600 font-medium text-sm">
															☕ Break
														</div>
													) : (
														<div className="group relative">
															<div
																className={`py-3 px-3 rounded-lg transition-all cursor-pointer ${
																	isToday
																		? "bg-gradient-to-br from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 border border-pink-300"
																		: "bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-200"
																}`}
															>
																<div className="flex items-center justify-center space-x-2 mb-1">
																	<FiBook
																		className={`w-3 h-3 ${
																			isToday
																				? "text-pink-600"
																				: "text-purple-600"
																		}`}
																	/>
																	<p
																		className={`text-sm font-bold ${
																			isToday
																				? "text-pink-700"
																				: "text-purple-700"
																		}`}
																	>
																		{
																			classInfo.subject
																		}
																	</p>
																</div>
																<p className="text-xs text-gray-600 font-medium">
																	{
																		classInfo.teacher
																	}
																</p>
																<p className="text-xs text-gray-500 mt-1">
																	{
																		classInfo.room
																	}
																</p>
															</div>
														</div>
													)}
												</td>
											);
										})}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</SectionCard>

				{/* Legend */}
				<div className="mt-6 flex items-center justify-center space-x-6">
					<div className="flex items-center space-x-2">
						<div className="w-4 h-4 bg-gradient-to-br from-pink-100 to-purple-100 border-2 border-pink-300 rounded"></div>
						<span className="text-sm text-gray-600 font-medium">
							Today's Classes
						</span>
					</div>
					<div className="flex items-center space-x-2">
						<div className="w-4 h-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded"></div>
						<span className="text-sm text-gray-600 font-medium">
							Other Days
						</span>
					</div>
					<div className="flex items-center space-x-2">
						<div className="w-4 h-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded"></div>
						<span className="text-sm text-gray-600 font-medium">
							Break Time
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StudentTimetable;
