import React, { useEffect, useState } from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import {
	FiDownload,
	FiTrendingUp,
	FiBarChart2,
	FiCheckCircle,
	FiXCircle,
} from "react-icons/fi";
import StudentSidebar from "../../components/StudentSidebar";
import SectionCard from "../../components/SectionCard";
import Button from "../../components/Button";
import LoadingSpinner from "../../components/LoadingSpinner";
import { studentAPI } from "../../services/api";

const StudentAnalytics = () => {
	const [analyticsData, setAnalyticsData] = useState({
		attendanceChart: [],
		subjectWise: [],
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchAnalytics();
	}, []);

	const fetchAnalytics = async () => {
		try {
			setLoading(true);
			const response = await studentAPI.getAnalytics();
			if (response.data) {
				setAnalyticsData(response.data);
			}
		} catch (error) {
			console.error("Failed to fetch analytics:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex min-h-screen bg-gradient-to-br from-[#99B69B] via-[#E4E3D3] to-[#7976B6]">
				<StudentSidebar />
				<div className="flex-1 md:ml-20 p-4 md:p-8 pb-24 md:pb-8 flex items-center justify-center">
					<LoadingSpinner />
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen bg-gradient-to-br from-[#99B69B] via-[#E4E3D3] to-[#7976B6]">
			<StudentSidebar />
			<div className="flex-1 md:ml-20 p-4 md:p-8 pb-24 md:pb-8">
				{/* Header */}
				<div className="mb-8 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg">
					<h1 className="text-3xl font-bold text-gray-800">
						My Attendance Analytics
					</h1>
					<p className="text-gray-600 mt-2 flex items-center space-x-2">
						<FiBarChart2 className="w-4 h-4" />
						<span>
							Track your attendance performance across all
							subjects
						</span>
					</p>
				</div>

				{/* Overall Attendance Chart */}
				<SectionCard
					title="Overall Attendance Trend"
					icon={FiTrendingUp}
					action={
						<div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
							<FiTrendingUp className="w-4 h-4 text-green-600" />
							<span className="text-sm font-semibold text-green-700">
								Improving
							</span>
						</div>
					}
					className="mb-6"
				>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={analyticsData.attendanceChart}>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#ddd6fe"
							/>
							<XAxis dataKey="month" stroke="#4f46e5" />
							<YAxis stroke="#4f46e5" />
							<Tooltip
								contentStyle={{
									backgroundColor: "#eef2ff",
									border: "1px solid #c7d2fe",
									borderRadius: "0.5rem",
								}}
							/>
							<Line
								type="monotone"
								dataKey="percentage"
								stroke="#6366f1"
								strokeWidth={3}
								dot={{ fill: "#6366f1", r: 5 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</SectionCard>

				{/* Subject-wise Attendance */}
				<SectionCard
					title="Subject-wise Performance"
					icon={FiBarChart2}
					action={
						<Button variant="secondary" icon={FiDownload} size="sm">
							Download Report
						</Button>
					}
				>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b-2 border-blue-200">
									<th className="px-6 py-4 text-left text-sm font-semibold text-blue-800">
										Subject
									</th>
									<th className="px-6 py-4 text-center text-sm font-semibold text-blue-800">
										Total Classes
									</th>
									<th className="px-6 py-4 text-center text-sm font-semibold text-blue-800">
										Present
									</th>
									<th className="px-6 py-4 text-center text-sm font-semibold text-blue-800">
										Absent
									</th>
									<th className="px-6 py-4 text-center text-sm font-semibold text-blue-800">
										Attendance %
									</th>
								</tr>
							</thead>
							<tbody>
								{analyticsData.subjectWise.map(
									(subject, index) => (
										<tr
											key={index}
											className="border-b border-blue-100 hover:bg-blue-50/50 transition-colors"
										>
											<td className="px-6 py-4 text-sm text-gray-800 font-medium">
												{subject.name}
											</td>
											<td className="px-6 py-4 text-center">
												<span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
													{subject.total}
												</span>
											</td>
											<td className="px-6 py-4 text-center">
												<span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
													<FiCheckCircle className="w-3 h-3" />
													<span>
														{subject.present}
													</span>
												</span>
											</td>
											<td className="px-6 py-4 text-center">
												<span className="inline-flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
													<FiXCircle className="w-3 h-3" />
													<span>
														{subject.absent}
													</span>
												</span>
											</td>
											<td className="px-6 py-4">
												<div className="flex items-center justify-center space-x-3">
													<div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
														<div
															className={`h-full transition-all ${
																subject.percentage >=
																85
																	? "bg-gradient-to-r from-green-500 to-emerald-500"
																	: subject.percentage >=
																	  75
																	? "bg-gradient-to-r from-orange-400 to-amber-400"
																	: "bg-gradient-to-r from-red-500 to-pink-500"
															}`}
															style={{
																width: `${subject.percentage}%`,
															}}
														/>
													</div>
													<span
														className={`text-sm font-bold ${
															subject.percentage >=
															85
																? "text-green-600"
																: subject.percentage >=
																  75
																? "text-orange-600"
																: "text-red-600"
														}`}
													>
														{subject.percentage}%
													</span>
												</div>
											</td>
										</tr>
									)
								)}
							</tbody>
						</table>
					</div>
				</SectionCard>
			</div>
		</div>
	);
};

export default StudentAnalytics;
