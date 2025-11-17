import React, { useState, useEffect } from "react";
import { FiClock, FiCalendar, FiBook } from "react-icons/fi";
import TeacherSidebar from "../../components/TeacherSidebar";
import SectionCard from "../../components/SectionCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { teacherAPI } from "../../services/api";

const Timetable = () => {
	const [timetable, setTimetable] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchTimetable();
	}, []);

	const fetchTimetable = async () => {
		try {
			setLoading(true);
			// const data = await teacherAPI.getTimetable();
			// setTimetable(data);

			// Mock data for testing
			setTimetable([
				{
					day: "Monday",
					periods: [
						{
							time: "9:00 - 10:00",
							subject: "Data Structures",
							class: "CSE-A",
							room: "Room 301",
						},
						{
							time: "10:00 - 11:00",
							subject: "Algorithms",
							class: "CSE-B",
							room: "Room 302",
						},
						{
							time: "11:00 - 12:00",
							subject: "Free Period",
							class: "-",
							room: "-",
						},
						{
							time: "12:00 - 1:00",
							subject: "Database Systems",
							class: "CSE-A",
							room: "Room 301",
						},
						{
							time: "2:00 - 3:00",
							subject: "Free Period",
							class: "-",
							room: "-",
						},
						{
							time: "3:00 - 4:00",
							subject: "Computer Networks",
							class: "CSE-B",
							room: "Room 303",
						},
					],
				},
				{
					day: "Tuesday",
					periods: [
						{
							time: "9:00 - 10:00",
							subject: "Operating Systems",
							class: "CSE-A",
							room: "Room 301",
						},
						{
							time: "10:00 - 11:00",
							subject: "Data Structures",
							class: "CSE-C",
							room: "Room 304",
						},
						{
							time: "11:00 - 12:00",
							subject: "Algorithms",
							class: "CSE-A",
							room: "Room 301",
						},
						{
							time: "12:00 - 1:00",
							subject: "Free Period",
							class: "-",
							room: "-",
						},
						{
							time: "2:00 - 3:00",
							subject: "Database Systems",
							class: "CSE-B",
							room: "Room 302",
						},
						{
							time: "3:00 - 4:00",
							subject: "Computer Networks",
							class: "CSE-A",
							room: "Room 301",
						},
					],
				},
				{
					day: "Wednesday",
					periods: [
						{
							time: "9:00 - 10:00",
							subject: "Data Structures",
							class: "CSE-A",
							room: "Room 301",
						},
						{
							time: "10:00 - 11:00",
							subject: "Free Period",
							class: "-",
							room: "-",
						},
						{
							time: "11:00 - 12:00",
							subject: "Operating Systems",
							class: "CSE-B",
							room: "Room 302",
						},
						{
							time: "12:00 - 1:00",
							subject: "Algorithms",
							class: "CSE-C",
							room: "Room 304",
						},
						{
							time: "2:00 - 3:00",
							subject: "Database Systems",
							class: "CSE-A",
							room: "Room 301",
						},
						{
							time: "3:00 - 4:00",
							subject: "Computer Networks",
							class: "CSE-B",
							room: "Room 303",
						},
					],
				},
				{
					day: "Thursday",
					periods: [
						{
							time: "9:00 - 10:00",
							subject: "Algorithms",
							class: "CSE-A",
							room: "Room 301",
						},
						{
							time: "10:00 - 11:00",
							subject: "Data Structures",
							class: "CSE-B",
							room: "Room 302",
						},
						{
							time: "11:00 - 12:00",
							subject: "Operating Systems",
							class: "CSE-C",
							room: "Room 304",
						},
						{
							time: "12:00 - 1:00",
							subject: "Free Period",
							class: "-",
							room: "-",
						},
						{
							time: "2:00 - 3:00",
							subject: "Computer Networks",
							class: "CSE-A",
							room: "Room 301",
						},
						{
							time: "3:00 - 4:00",
							subject: "Database Systems",
							class: "CSE-B",
							room: "Room 302",
						},
					],
				},
				{
					day: "Friday",
					periods: [
						{
							time: "9:00 - 10:00",
							subject: "Database Systems",
							class: "CSE-C",
							room: "Room 304",
						},
						{
							time: "10:00 - 11:00",
							subject: "Computer Networks",
							class: "CSE-A",
							room: "Room 301",
						},
						{
							time: "11:00 - 12:00",
							subject: "Data Structures",
							class: "CSE-B",
							room: "Room 302",
						},
						{
							time: "12:00 - 1:00",
							subject: "Algorithms",
							class: "CSE-A",
							room: "Room 301",
						},
						{
							time: "2:00 - 3:00",
							subject: "Operating Systems",
							class: "CSE-B",
							room: "Room 302",
						},
						{
							time: "3:00 - 4:00",
							subject: "Free Period",
							class: "-",
							room: "-",
						},
					],
				},
			]);
		} catch (error) {
			console.error("Error fetching timetable:", error);
		} finally {
			setLoading(false);
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

	const isCurrentDay = (day) => day === getCurrentDay();

	if (loading) {
		return (
			<div className="flex h-screen bg-gradient-to-br from-[#99B69B] via-[#E4E3D3] to-[#7976B6]">
				<TeacherSidebar />
				<div className="flex-1 md:ml-20 flex items-center justify-center">
					<LoadingSpinner />
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen bg-gradient-to-br from-[#99B69B] via-[#E4E3D3] to-[#7976B6]">
			<TeacherSidebar />

			{/* Main Content */}
			<div className="flex-1 md:ml-20 overflow-y-auto pb-24 md:pb-0">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
					{/* Header */}
					<div className="mb-8 bg-white/30 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20">
						<div className="flex items-center space-x-4 mb-2">
							<div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
								<FiCalendar className="w-7 h-7 text-white" />
							</div>
							<div>
								<h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
									My Timetable
								</h1>
								<p className="text-gray-600 mt-1">
									View your weekly teaching schedule
								</p>
							</div>
						</div>
					</div>

					{/* Stats Cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						{/* Total Periods Card */}
						<div className="group relative bg-white/30 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
							<div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							<div className="relative z-10 flex items-center justify-between">
								<div>
									<p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-2">
										Total Periods
									</p>
									<p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
										{timetable.reduce(
											(sum, day) =>
												sum + day.periods.length,
											0
										)}
									</p>
									<p className="text-xs text-gray-500 mt-2">
										This week
									</p>
								</div>
								<div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
									<FiClock className="w-8 h-8 text-white" />
								</div>
							</div>
						</div>

						{/* Teaching Days Card */}
						<div className="group relative bg-white/30 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
							<div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							<div className="relative z-10 flex items-center justify-between">
								<div>
									<p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-2">
										Teaching Days
									</p>
									<p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
										{timetable.length}
									</p>
									<p className="text-xs text-gray-500 mt-2">
										Active days
									</p>
								</div>
								<div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
									<FiCalendar className="w-8 h-8 text-white" />
								</div>
							</div>
						</div>

						{/* Classes Today Card */}
						<div className="group relative bg-white/30 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
							<div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							<div className="relative z-10 flex items-center justify-between">
								<div>
									<p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-2">
										Classes Today
									</p>
									<p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
										{timetable
											.find((d) => isCurrentDay(d.day))
											?.periods.filter(
												(p) =>
													p.subject !== "Free Period"
											).length || 0}
									</p>
									<p className="text-xs text-gray-500 mt-2">
										{getCurrentDay()}
									</p>
								</div>
								<div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
									<FiBook className="w-8 h-8 text-white" />
								</div>
							</div>
						</div>
					</div>

					{/* Timetable Grid */}
					<div className="bg-white/30 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8">
						<div className="flex items-center space-x-3 mb-6">
							<div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
								<FiCalendar className="w-5 h-5 text-white" />
							</div>
							<h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
								Weekly Schedule
							</h2>
						</div>

						<div className="overflow-x-auto rounded-xl border border-gray-200">
							<table className="w-full">
								<thead>
									<tr className="bg-gradient-to-r from-purple-600 to-indigo-600">
										<th className="text-left px-6 py-5 text-sm font-bold text-white uppercase tracking-wide">
											<div className="flex items-center space-x-2">
												<FiClock className="w-4 h-4" />
												<span>Time</span>
											</div>
										</th>
										{timetable.map((day) => (
											<th
												key={day.day}
												className={`text-center px-6 py-5 text-sm font-bold uppercase tracking-wide transition-all ${
													isCurrentDay(day.day)
														? "text-white bg-gradient-to-b from-purple-700 to-indigo-700 shadow-lg"
														: "text-white"
												}`}
											>
												<div className="flex flex-col items-center">
													<span>{day.day}</span>
													{isCurrentDay(day.day) && (
														<span className="inline-flex items-center px-2 py-0.5 mt-2 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
															<span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
															Today
														</span>
													)}
												</div>
											</th>
										))}
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-100">
									{timetable[0]?.periods.map(
										(_, periodIndex) => (
											<tr
												key={periodIndex}
												className="hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-indigo-50/50 transition-all duration-200"
											>
												<td className="px-6 py-5">
													<div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-100 to-indigo-100 px-4 py-2 rounded-lg">
														<FiClock className="w-5 h-5 text-purple-600" />
														<span className="text-sm font-bold text-purple-900">
															{
																timetable[0]
																	.periods[
																	periodIndex
																].time
															}
														</span>
													</div>
												</td>
												{timetable.map((day) => {
													const period =
														day.periods[
															periodIndex
														];
													const isFree =
														period.subject ===
														"Free Period";
													const isToday =
														isCurrentDay(day.day);

													return (
														<td
															key={day.day}
															className={`px-6 py-5 ${
																isToday
																	? "bg-gradient-to-b from-purple-50/30 to-indigo-50/30"
																	: ""
															}`}
														>
															{isFree ? (
																<div className="text-center p-4 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300">
																	<span className="text-gray-400 text-sm font-medium italic">
																		Free
																		Period
																	</span>
																</div>
															) : (
																<div
																	className={`group relative text-center p-4 rounded-xl transition-all duration-300 cursor-pointer ${
																		isToday
																			? "bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 transform"
																			: "bg-gradient-to-br from-white to-purple-50 text-purple-900 border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg hover:scale-105 transform"
																	}`}
																>
																	<div
																		className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
																			isToday
																				? "bg-white/10"
																				: "bg-gradient-to-br from-purple-100/50 to-indigo-100/50"
																		}`}
																	></div>

																	<div className="relative z-10">
																		<div className="font-bold text-base flex items-center justify-center space-x-2 mb-2">
																			<FiBook
																				className={`w-4 h-4 ${
																					isToday
																						? "text-white"
																						: "text-purple-600"
																				}`}
																			/>
																			<span>
																				{
																					period.subject
																				}
																			</span>
																		</div>
																		<div
																			className={`text-xs font-semibold mt-2 px-2 py-1 rounded-lg inline-block ${
																				isToday
																					? "bg-white/20 text-white backdrop-blur-sm"
																					: "bg-purple-100 text-purple-700"
																			}`}
																		>
																			{
																				period.class
																			}
																		</div>
																		<div
																			className={`text-xs font-medium mt-1.5 flex items-center justify-center space-x-1 ${
																				isToday
																					? "text-purple-100"
																					: "text-purple-600"
																			}`}
																		>
																			<FiCalendar className="w-3 h-3" />
																			<span>
																				{
																					period.room
																				}
																			</span>
																		</div>
																	</div>
																</div>
															)}
														</td>
													);
												})}
											</tr>
										)
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Timetable;
