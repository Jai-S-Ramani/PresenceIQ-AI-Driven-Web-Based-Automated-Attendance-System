import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TeacherSidebar from "../../components/TeacherSidebar";
import { teacherAPI } from "../../services/api";

const TeacherTimetable = () => {
	const [loading, setLoading] = useState(false);
	const [timetable, setTimetable] = useState([
		{
			day: "Monday",
			classes: [
				{ subject: "MTH 317", class: "I B.Sc (CS)" },
				{ subject: "MTH 317", class: "I B.Sc (CS)" },
				{ subject: "PHY 101", class: "I B.Sc (CS)" },
				{ subject: "CSE 201", class: "II B.Sc (CS)" },
				null,
				{ subject: "MTH 317", class: "I B.Sc (CS)" },
			],
		},
		{
			day: "Tuesday",
			classes: [
				{ subject: "CSE 201", class: "II B.Sc (CS)" },
				{ subject: "MTH 317", class: "I B.Sc (CS)" },
				null,
				{ subject: "PHY 101", class: "I B.Sc (CS)" },
				{ subject: "MTH 317", class: "I B.Sc (CS)" },
				{ subject: "CSE 201", class: "II B.Sc (CS)" },
			],
		},
		{
			day: "Wednesday",
			classes: [
				{ subject: "PHY 101", class: "I B.Sc (CS)" },
				{ subject: "CSE 201", class: "II B.Sc (CS)" },
				{ subject: "MTH 317", class: "I B.Sc (CS)" },
				null,
				{ subject: "MTH 317", class: "I B.Sc (CS)" },
				{ subject: "PHY 101", class: "I B.Sc (CS)" },
			],
		},
		{
			day: "Thursday",
			classes: [
				{ subject: "MTH 317", class: "I B.Sc (CS)" },
				null,
				{ subject: "CSE 201", class: "II B.Sc (CS)" },
				{ subject: "PHY 101", class: "I B.Sc (CS)" },
				{ subject: "MTH 317", class: "I B.Sc (CS)" },
				{ subject: "CSE 201", class: "II B.Sc (CS)" },
			],
		},
		{
			day: "Friday",
			classes: [
				{ subject: "CSE 201", class: "II B.Sc (CS)" },
				{ subject: "PHY 101", class: "I B.Sc (CS)" },
				{ subject: "MTH 317", class: "I B.Sc (CS)" },
				{ subject: "MTH 317", class: "I B.Sc (CS)" },
				null,
				{ subject: "PHY 101", class: "I B.Sc (CS)" },
			],
		},
		{
			day: "Saturday",
			classes: [
				null,
				{ subject: "MTH 317", class: "I B.Sc (CS)" },
				{ subject: "CSE 201", class: "II B.Sc (CS)" },
				{ subject: "PHY 101", class: "I B.Sc (CS)" },
				{ subject: "MTH 317", class: "I B.Sc (CS)" },
				null,
			],
		},
	]);

	const hours = [
		"1st Hour",
		"2nd Hour",
		"3rd Hour",
		"4th Hour",
		"5th Hour",
		"6th Hour",
	];

	useEffect(() => {
		fetchTimetable();
	}, []);

	const fetchTimetable = async () => {
		setLoading(true);
		try {
			const response = await teacherAPI.getTimetable();
			// setTimetable(response.data);
		} catch (error) {
			console.error("Failed to fetch timetable:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				Loading...
			</div>
		);
	}

	return (
		<div className="flex h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50">
			<TeacherSidebar />
			<div className="flex-1 flex flex-col overflow-hidden">
				<Header />
				<main className="flex-1 overflow-auto p-8">
					<div className="max-w-7xl mx-auto">
						{/* Page Header */}
						<div className="mb-8">
							<h1 className="text-3xl font-bold text-gray-800">
								Timetable
							</h1>
							<p className="text-gray-600 mt-2">
								View your weekly class schedule
							</p>
						</div>

						{/* Timetable Card */}
						<div className="bg-white rounded-2xl shadow-lg p-6">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-xl font-semibold text-gray-800">
									Weekly Schedule
								</h2>
								<div className="flex items-center space-x-4">
									<button className="p-2 hover:bg-pink-100 rounded-lg transition-colors">
										<ChevronLeft className="w-5 h-5 text-gray-600" />
									</button>
									<span className="font-semibold text-gray-800">
										Current Week
									</span>
									<button className="p-2 hover:bg-pink-100 rounded-lg transition-colors">
										<ChevronRight className="w-5 h-5 text-gray-600" />
									</button>
								</div>
							</div>

							<div className="overflow-x-auto">
								<table className="w-full border-collapse">
									<thead>
										<tr>
											<th className="px-4 py-3 text-center bg-red-500 text-white font-semibold rounded-tl-lg">
												Day
											</th>
											{hours.map((hour, index) => (
												<th
													key={index}
													className={`px-4 py-3 text-center bg-red-500 text-white font-semibold ${
														index ===
														hours.length - 1
															? "rounded-tr-lg"
															: ""
													}`}
												>
													{hour}
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										{timetable.map((day, dayIndex) => (
											<tr
												key={dayIndex}
												className="border-b border-pink-100"
											>
												<td className="px-4 py-4 font-semibold text-gray-800 bg-pink-100">
													{day.day}
												</td>
												{day.classes.map(
													(classItem, classIndex) => (
														<td
															key={classIndex}
															className="px-4 py-4 text-center hover:bg-pink-50 transition-colors border-r border-pink-100"
														>
															{classItem ? (
																<div className="space-y-1">
																	<p className="font-semibold text-gray-800">
																		{
																			classItem.subject
																		}
																	</p>
																	<p className="text-sm text-gray-600">
																		{
																			classItem.class
																		}
																	</p>
																</div>
															) : (
																<span className="text-gray-400">
																	-
																</span>
															)}
														</td>
													)
												)}
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>

						{/* Legend */}
						<div className="mt-6 bg-white rounded-2xl shadow-lg p-4">
							<h3 className="text-sm font-semibold text-gray-700 mb-3">
								Legend
							</h3>
							<div className="flex flex-wrap gap-4">
								<div className="flex items-center space-x-2">
									<div className="w-4 h-4 bg-red-500 rounded"></div>
									<span className="text-sm text-gray-600">
										Class Time
									</span>
								</div>
								<div className="flex items-center space-x-2">
									<div className="w-4 h-4 bg-pink-100 rounded"></div>
									<span className="text-sm text-gray-600">
										Day Column
									</span>
								</div>
								<div className="flex items-center space-x-2">
									<div className="w-4 h-4 bg-gray-200 rounded"></div>
									<span className="text-sm text-gray-600">
										Free Period (-)
									</span>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default TeacherTimetable;
