import React, { useEffect, useState } from "react";
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import {
	FiDownload,
	FiCalendar,
	FiTrendingUp,
	FiBarChart,
	FiCheckCircle,
	FiXCircle,
	FiEdit2,
} from "react-icons/fi";
import TeacherSidebar from "../../components/TeacherSidebar";
import SectionCard from "../../components/SectionCard";
import Button from "../../components/Button";
import LoadingSpinner from "../../components/LoadingSpinner";
import { teacherAPI } from "../../services/api";

const TeacherAnalytics = () => {
	const [analyticsData, setAnalyticsData] = useState({
		comparisonChart: [],
		dailyAttendance: [],
		attendanceReport: [],
	});
	const [dateRange, setDateRange] = useState("weekly");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchAnalytics();
	}, [dateRange]);

	const fetchAnalytics = async () => {
		try {
			const response = await teacherAPI.getAnalytics({
				range: dateRange,
			});
			setAnalyticsData(response.data);
		} catch (error) {
			console.error("Failed to fetch analytics:", error);
		} finally {
			setLoading(false);
		}
	};

	const exportReport = () => {
		// Implement export functionality
		console.log("Exporting overall report...");
		// This would typically generate a CSV/Excel file with all reports
	};

	const exportSubjectReport = () => {
		console.log("Exporting subject-wise attendance report...");
		// Generate CSV/Excel with subject-wise attendance data
		const report = getSubjectWiseReport();
		console.log("Report data:", report);
		// Implementation: Convert to CSV and download
	};

	const downloadClassSubjectReport = (item) => {
		console.log("Downloading report for:", item);
		// Download individual class-subject report
	};

	const [subjectWiseReport, setSubjectWiseReport] = useState([]);

	useEffect(() => {
		fetchSubjectWiseReport();
	}, []);

	const fetchSubjectWiseReport = async () => {
		try {
			const response = await fetch("/api/analytics/subject-wise/");
			const data = await response.json();
			setSubjectWiseReport(data);
		} catch (error) {
			console.error("Failed to fetch report:", error);
			setSubjectWiseReport([]);
		}
	};

	const getSubjectWiseReport = () => {
		return (
			subjectWiseReport || [
				{
					class: "Loading...",
					section: "-",
					subject: "Loading data...",
					totalStudents: 0,
					totalClasses: 0,
					totalPresent: 0,
					totalAbsent: 0,
					avgAttendance: 0,
				},
				{
					class: "Loading...",
					section: "-",
					subject: "Loading data...",
					totalStudents: 0,
					totalClasses: 0,
					totalPresent: 0,
					totalAbsent: 0,
					avgAttendance: 0,
				},
				{
					class: "Loading...",
					section: "-",
					subject: "Loading data...",
					totalStudents: 0,
					totalClasses: 22,
					totalPresent: 840,
					totalAbsent: 84,
					avgAttendance: 91,
				},
				{
					class: "II B.Sc (CS)",
					section: "A",
					subject: "Web Development",
					totalStudents: 42,
					totalClasses: 18,
					totalPresent: 680,
					totalAbsent: 76,
					avgAttendance: 90,
				},
				{
					class: "II B.Sc (CS)",
					section: "A",
					subject: "Operating Systems",
					totalStudents: 42,
					totalClasses: 20,
					totalPresent: 630,
					totalAbsent: 210,
					avgAttendance: 75,
				},
				{
					class: "I B.Sc (CS)",
					section: "A",
					subject: "Computer Networks",
					totalStudents: 38,
					totalClasses: 15,
					totalPresent: 456,
					totalAbsent: 114,
					avgAttendance: 80,
				},
				{
					class: "I B.Sc (CS)",
					section: "B",
					subject: "Software Engineering",
					totalStudents: 40,
					totalClasses: 15,
					totalPresent: 420,
					totalAbsent: 180,
					avgAttendance: 70,
				},
			]
		);
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
						{/* Header */}
						<div className="mb-8 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg">
							<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
								<div>
									<h1 className="text-3xl font-bold text-gray-800">
										Analytics Dashboard
									</h1>
									<p className="text-gray-600 mt-2 flex items-center space-x-2">
										<FiTrendingUp className="w-4 h-4" />
										<span>
											Track and analyze attendance
											performance
										</span>
									</p>
								</div>
								<button
									onClick={exportReport}
									className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
								>
									<FiDownload className="w-5 h-5" />
									<span className="font-medium">
										Export Reports
									</span>
								</button>
							</div>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
							{/* Attendance Comparison Chart */}
							<SectionCard
								title="Attendance Trends"
								icon={FiTrendingUp}
								action={
									<div className="flex space-x-2">
										{["Daily", "Weekly", "Monthly"].map(
											(option) => (
												<button
													key={option}
													onClick={() =>
														setDateRange(
															option.toLowerCase()
														)
													}
													className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
														dateRange ===
														option.toLowerCase()
															? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg"
															: "bg-teal-50 text-teal-700 hover:bg-teal-100"
													}`}
												>
													{option}
												</button>
											)
										)}
									</div>
								}
							>
								<ResponsiveContainer width="100%" height={300}>
									<LineChart
										data={analyticsData.comparisonChart}
									>
										<CartesianGrid
											strokeDasharray="3 3"
											stroke="#ccfbf1"
										/>
										<XAxis
											dataKey="date"
											stroke="#0d9488"
										/>
										<YAxis stroke="#0d9488" />
										<Tooltip
											contentStyle={{
												backgroundColor: "#f0fdfa",
												border: "1px solid #5eead4",
												borderRadius: "0.5rem",
											}}
										/>
										<Line
											type="monotone"
											dataKey="attendance"
											stroke="#14b8a6"
											strokeWidth={3}
											dot={{ fill: "#14b8a6", r: 5 }}
										/>
									</LineChart>
								</ResponsiveContainer>
							</SectionCard>

							{/* Daily Attendance */}
							<SectionCard
								title="Daily Attendance by Class"
								icon={FiBarChart}
								action={
									<button className="p-2 hover:bg-teal-100 rounded-lg transition-colors group">
										<FiCalendar className="w-5 h-5 text-gray-600 group-hover:text-teal-600" />
									</button>
								}
							>
								<ResponsiveContainer width="100%" height={300}>
									<BarChart
										data={analyticsData.dailyAttendance}
									>
										<CartesianGrid
											strokeDasharray="3 3"
											stroke="#ccfbf1"
										/>
										<XAxis dataKey="day" stroke="#0d9488" />
										<YAxis stroke="#0d9488" />
										<Tooltip
											contentStyle={{
												backgroundColor: "#f0fdfa",
												border: "1px solid #5eead4",
												borderRadius: "0.5rem",
											}}
										/>
										<Bar
											dataKey="percentage"
											fill="url(#tealGradient)"
											radius={[8, 8, 0, 0]}
										/>
										<defs>
											<linearGradient
												id="tealGradient"
												x1="0"
												y1="0"
												x2="0"
												y2="1"
											>
												<stop
													offset="0%"
													stopColor="#14b8a6"
												/>
												<stop
													offset="100%"
													stopColor="#0891b2"
												/>
											</linearGradient>
										</defs>
									</BarChart>
								</ResponsiveContainer>
							</SectionCard>
						</div>

						{/* Attendance Report */}
						<SectionCard
							title="Detailed Attendance Report"
							icon={FiCalendar}
							action={
								<div className="flex items-center space-x-3">
									<input
										type="date"
										className="px-4 py-2 bg-teal-50 border-2 border-teal-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
									/>
									<Button
										onClick={exportReport}
										variant="secondary"
										icon={FiDownload}
										size="sm"
									>
										Export
									</Button>
								</div>
							}
						>
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 border-b-2 border-teal-200">
											<th className="px-6 py-4 text-left text-sm font-semibold text-teal-800">
												Class
											</th>
											<th className="px-6 py-4 text-left text-sm font-semibold text-teal-800">
												Subject Name
											</th>
											<th className="px-6 py-4 text-center text-sm font-semibold text-teal-800">
												Present
											</th>
											<th className="px-6 py-4 text-center text-sm font-semibold text-teal-800">
												Absent
											</th>
											<th className="px-6 py-4 text-center text-sm font-semibold text-teal-800">
												Status
											</th>
											<th className="px-6 py-4 text-center text-sm font-semibold text-teal-800">
												Actions
											</th>
										</tr>
									</thead>
									<tbody>
										{analyticsData.attendanceReport.map(
											(report, index) => (
												<tr
													key={index}
													className="border-b border-teal-100 hover:bg-teal-50/50 transition-colors"
												>
													<td className="px-6 py-4 text-sm text-gray-800 font-medium">
														{report.class}
													</td>
													<td className="px-6 py-4 text-sm text-gray-700">
														{report.subject}
													</td>
													<td className="px-6 py-4 text-center">
														<span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
															<FiCheckCircle className="w-3 h-3" />
															<span>
																{report.present}
															</span>
														</span>
													</td>
													<td className="px-6 py-4 text-center">
														<span className="inline-flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
															<FiXCircle className="w-3 h-3" />
															<span>
																{report.absent}
															</span>
														</span>
													</td>
													<td className="px-6 py-4 text-center">
														<div
															className={`w-3 h-3 mx-auto rounded-full ${
																report.status ===
																"completed"
																	? "bg-green-500"
																	: "bg-red-500"
															}`}
															title={
																report.status ===
																"completed"
																	? "Completed"
																	: "Pending"
															}
														/>
													</td>
													<td className="px-6 py-4">
														<div className="flex items-center justify-center space-x-2">
															<button
																className="p-2 hover:bg-teal-100 rounded-lg transition-colors group"
																title="Edit"
															>
																<FiEdit2 className="w-4 h-4 text-gray-600 group-hover:text-teal-600" />
															</button>
															<button
																className="p-2 hover:bg-cyan-100 rounded-lg transition-colors group"
																title="Download"
															>
																<FiDownload className="w-4 h-4 text-gray-600 group-hover:text-cyan-600" />
															</button>
														</div>
													</td>
												</tr>
											)
										)}
									</tbody>
								</table>
							</div>
						</SectionCard>

						{/* Subject-wise Class Attendance Report */}
						<div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 hover:bg-white/30 transition-all duration-300 animate-slideUp">
							<div className="flex items-center justify-between mb-4 pb-4 border-b border-white/20">
								<h2 className="text-xl font-bold bg-gradient-to-r from-[#a3b18a] to-[#588157] bg-clip-text text-transparent">
									Subject-wise Class Attendance Report
								</h2>
								<button
									onClick={exportSubjectReport}
									className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-105"
								>
									<FiDownload className="w-4 h-4" />
									<span className="text-sm font-medium">
										Download Report
									</span>
								</button>
							</div>
							<div>
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead>
											<tr className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
												<th className="px-6 py-4 text-left rounded-tl-lg">
													Class
												</th>
												<th className="px-6 py-4 text-left">
													Subject
												</th>
												<th className="px-6 py-4 text-center">
													Total Students
												</th>
												<th className="px-6 py-4 text-center">
													Total Classes
												</th>
												<th className="px-6 py-4 text-center">
													Avg. Attendance
												</th>
												<th className="px-6 py-4 text-center">
													Present
												</th>
												<th className="px-6 py-4 text-center">
													Absent
												</th>
												<th className="px-6 py-4 text-center rounded-tr-lg">
													Actions
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-gray-200">
											{getSubjectWiseReport().map(
												(item, idx) => (
													<tr
														key={idx}
														className="bg-white hover:bg-blue-50 transition-colors"
													>
														<td className="px-6 py-4">
															<div className="font-semibold text-gray-800">
																{item.class}
															</div>
															<div className="text-sm text-gray-500">
																Section{" "}
																{item.section}
															</div>
														</td>
														<td className="px-6 py-4">
															<div className="font-medium text-gray-700">
																{item.subject}
															</div>
														</td>
														<td className="px-6 py-4 text-center">
															<span className="font-semibold text-gray-800">
																{
																	item.totalStudents
																}
															</span>
														</td>
														<td className="px-6 py-4 text-center">
															<span className="font-semibold text-gray-800">
																{
																	item.totalClasses
																}
															</span>
														</td>
														<td className="px-6 py-4 text-center">
															<div className="flex flex-col items-center">
																<span
																	className={`text-lg font-bold ${
																		item.avgAttendance >=
																		90
																			? "text-green-600"
																			: item.avgAttendance >=
																			  75
																			? "text-blue-600"
																			: item.avgAttendance >=
																			  60
																			? "text-orange-600"
																			: "text-red-600"
																	}`}
																>
																	{
																		item.avgAttendance
																	}
																	%
																</span>
																<div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
																	<div
																		className={`h-2 rounded-full ${
																			item.avgAttendance >=
																			90
																				? "bg-green-500"
																				: item.avgAttendance >=
																				  75
																				? "bg-blue-500"
																				: item.avgAttendance >=
																				  60
																				? "bg-orange-500"
																				: "bg-red-500"
																		}`}
																		style={{
																			width: `${item.avgAttendance}%`,
																		}}
																	></div>
																</div>
															</div>
														</td>
														<td className="px-6 py-4 text-center">
															<span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
																<FiCheckCircle className="w-3 h-3" />
																<span>
																	{
																		item.totalPresent
																	}
																</span>
															</span>
														</td>
														<td className="px-6 py-4 text-center">
															<span className="inline-flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
																<FiXCircle className="w-3 h-3" />
																<span>
																	{
																		item.totalAbsent
																	}
																</span>
															</span>
														</td>
														<td className="px-6 py-4">
															<div className="flex items-center justify-center space-x-2">
																<button
																	onClick={() =>
																		downloadClassSubjectReport(
																			item
																		)
																	}
																	className="p-2 hover:bg-blue-100 rounded-lg transition-colors group"
																	title="Download Class Report"
																>
																	<FiDownload className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
																</button>
															</div>
														</td>
													</tr>
												)
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default TeacherAnalytics;
