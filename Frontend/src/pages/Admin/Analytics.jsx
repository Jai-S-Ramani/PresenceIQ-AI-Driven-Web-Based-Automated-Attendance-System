import React, { useState } from "react";
import {
	FiDownload,
	FiEye,
	FiEdit2,
	FiBarChart2,
	FiTrendingUp,
	FiCalendar,
} from "react-icons/fi";
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import AdminLayout from "../../components/Layout/AdminLayout";
import SectionCard from "../../components/SectionCard";
import Button from "../../components/Button";
import { adminAPI } from "../../services/api";

const Analytics = () => {
	const [selectedDate, setSelectedDate] = useState("");

	const comparisonData = [
		{ date: "10 Aug", daily: 75, weekly: 70, monthly: 80 },
		{ date: "11 Aug", daily: 70, weekly: 75, monthly: 78 },
		{ date: "12 Aug", daily: 85, weekly: 80, monthly: 82 },
		{ date: "13 Aug", daily: 78, weekly: 72, monthly: 79 },
		{ date: "14 Aug", daily: 68, weekly: 65, monthly: 75 },
		{ date: "15 Aug", daily: 72, weekly: 78, monthly: 77 },
	];

	const dailyData = [
		{ class: "1", attendance: 70 },
		{ class: "2", attendance: 65 },
		{ class: "3", attendance: 88 },
		{ class: "4", attendance: 75 },
		{ class: "5", attendance: 82 },
		{ class: "6", attendance: 90 },
	];

	const reportData = [
		{
			class: "I B. Sc (CS)",
			subject: "Computer Science",
			present: 45,
			absent: 5,
		},
		{
			class: "I B. Sc (CS)",
			subject: "Computer Science",
			present: 48,
			absent: 2,
		},
		{
			class: "I B. Sc (CS)",
			subject: "Computer Science",
			present: 50,
			absent: 0,
		},
		{
			class: "I B. Sc (CSDA)",
			subject: "Computer Science with Data Analytics",
			present: 46,
			absent: 6,
		},
		{
			class: "I B. Sc (CSDA)",
			subject: "Computer Science with Data Analytics",
			present: 40,
			absent: 10,
		},
		{
			class: "I B. Sc (CSDA)",
			subject: "Computer Science with Data Analytics",
			present: 44,
			absent: 8,
		},
		{ class: "I B. CSM", subject: "Commerce", present: 34, absent: 16 },
		{ class: "I B. CSM", subject: "Commerce", present: 48, absent: 3 },
	];

	const handleExport = () => {
		console.log("Exporting data...");
		// TODO: Implement export functionality
	};

	return (
		<AdminLayout>
			{/* Header */}
			<div className="mb-8 bg-gradient-to-r from-[#a3b18a] to-[#588157] backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
				<h1 className="text-3xl font-bold text-black">
					Department Reports & Analytics
				</h1>
				<p className="text-black mt-2 flex items-center space-x-2">
					<FiBarChart2 className="w-4 h-4" />
					<span>
						View attendance statistics and generate department
						reports
					</span>
				</p>
			</div>

			{/* Charts Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
				{/* Attendance Comparison Chart */}
				<SectionCard title="Attendance Trends" icon={FiTrendingUp}>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={comparisonData}>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#cffafe"
							/>
							<XAxis dataKey="date" stroke="#0891b2" />
							<YAxis stroke="#0891b2" />
							<Tooltip
								contentStyle={{
									backgroundColor: "#f0f9ff",
									border: "1px solid #67e8f9",
									borderRadius: "0.5rem",
								}}
							/>
							<Legend />
							<Line
								type="monotone"
								dataKey="daily"
								stroke="#06b6d4"
								strokeWidth={3}
								name="Daily"
								dot={{ fill: "#06b6d4", r: 4 }}
							/>
							<Line
								type="monotone"
								dataKey="weekly"
								stroke="#0284c7"
								strokeWidth={3}
								name="Weekly"
								dot={{ fill: "#0284c7", r: 4 }}
							/>
							<Line
								type="monotone"
								dataKey="monthly"
								stroke="#2563eb"
								strokeWidth={3}
								name="Monthly"
								dot={{ fill: "#2563eb", r: 4 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</SectionCard>

				{/* Daily Attendance Chart */}
				<SectionCard
					title="Class-wise Daily Attendance"
					icon={FiBarChart2}
				>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={dailyData}>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#cffafe"
							/>
							<XAxis
								dataKey="class"
								stroke="#0891b2"
								label={{
									value: "Class",
									position: "insideBottom",
									offset: -5,
									style: {
										fill: "#0891b2",
										fontWeight: "600",
									},
								}}
							/>
							<YAxis
								stroke="#0891b2"
								label={{
									value: "Attendance %",
									angle: -90,
									position: "insideLeft",
									style: {
										fill: "#0891b2",
										fontWeight: "600",
									},
								}}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: "#f0f9ff",
									border: "1px solid #67e8f9",
									borderRadius: "0.5rem",
								}}
							/>
							<Bar
								dataKey="attendance"
								fill="url(#colorGradient)"
								name="Attendance %"
								radius={[8, 8, 0, 0]}
							/>
							<defs>
								<linearGradient
									id="colorGradient"
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop offset="0%" stopColor="#06b6d4" />
									<stop offset="100%" stopColor="#2563eb" />
								</linearGradient>
							</defs>
						</BarChart>
					</ResponsiveContainer>
				</SectionCard>
			</div>

			{/* Attendance Report Table */}
			<SectionCard
				title="Detailed Attendance Report"
				icon={FiCalendar}
				action={
					<div className="flex items-center space-x-3">
						<input
							type="date"
							value={selectedDate}
							onChange={(e) => setSelectedDate(e.target.value)}
							className="px-4 py-2 bg-cyan-50 border-2 border-cyan-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
						/>
						<Button
							onClick={handleExport}
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
							<tr className="bg-gradient-to-r from-cyan-50 via-sky-50 to-blue-50 border-b-2 border-cyan-200">
								<th className="px-6 py-4 text-left text-sm font-semibold text-cyan-800">
									Class
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold text-cyan-800">
									Subject Name
								</th>
								<th className="px-6 py-4 text-center text-sm font-semibold text-cyan-800">
									Present
								</th>
								<th className="px-6 py-4 text-center text-sm font-semibold text-cyan-800">
									Absent
								</th>
								<th className="px-6 py-4 text-center text-sm font-semibold text-cyan-800">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{reportData.map((row, index) => (
								<tr
									key={index}
									className="border-b border-cyan-100 hover:bg-cyan-50/50 transition-colors"
								>
									<td className="px-6 py-4 text-sm text-gray-800 font-medium">
										{row.class}
									</td>
									<td className="px-6 py-4 text-sm text-gray-700">
										{row.subject}
									</td>
									<td className="px-6 py-4 text-center">
										<span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
											{row.present}
										</span>
									</td>
									<td className="px-6 py-4 text-center">
										<span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
											{row.absent}
										</span>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center justify-center space-x-2">
											<button
												className="p-2 hover:bg-cyan-100 rounded-lg transition-colors group"
												title="View Details"
											>
												<FiEye className="w-4 h-4 text-gray-600 group-hover:text-cyan-600" />
											</button>
											<button
												className="p-2 hover:bg-sky-100 rounded-lg transition-colors group"
												title="Edit"
											>
												<FiEdit2 className="w-4 h-4 text-gray-600 group-hover:text-sky-600" />
											</button>
											<button
												className="p-2 hover:bg-blue-100 rounded-lg transition-colors group"
												title="Download"
											>
												<FiDownload className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</SectionCard>
		</AdminLayout>
	);
};

export default Analytics;
