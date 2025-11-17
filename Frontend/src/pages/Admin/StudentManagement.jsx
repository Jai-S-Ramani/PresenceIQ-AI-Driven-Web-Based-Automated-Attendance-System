import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
	FiPlus,
	FiEdit,
	FiTrash2,
	FiSearch,
	FiFilter,
	FiUsers,
	FiMail,
	FiUser,
	FiBook,
	FiCalendar,
	FiCamera,
	FiCheckCircle,
	FiXCircle,
	FiRefreshCw,
	FiImage,
} from "react-icons/fi";
import AdminLayout from "../../components/Layout/AdminLayout";
import SectionCard from "../../components/SectionCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { adminAPI } from "../../services/api";

const StudentManagement = () => {
	console.log("StudentManagement component rendering..."); // Debug log
	const navigate = useNavigate();

	const [students, setStudents] = useState([
		{
			id: 1,
			usn: "1MS21CS001",
			name: "Rahul Sharma",
			email: "rahul.sharma@student.edu",
			semester: "1",
			attendance: "92%",
		},
		{
			id: 2,
			usn: "1MS21CS002",
			name: "Priya Patel",
			email: "priya.patel@student.edu",
			semester: "1",
			attendance: "88%",
		},
		{
			id: 3,
			usn: "1MS20CS003",
			name: "Arjun Kumar",
			email: "arjun.kumar@student.edu",
			semester: "3",
			attendance: "95%",
		},
		{
			id: 4,
			usn: "1MS20CS004",
			name: "Sneha Reddy",
			email: "sneha.reddy@student.edu",
			semester: "3",
			attendance: "90%",
		},
		{
			id: 5,
			usn: "1MS19CS005",
			name: "Vikram Singh",
			email: "vikram.singh@student.edu",
			semester: "5",
			attendance: "85%",
		},
		{
			id: 6,
			usn: "1MS21CS006",
			name: "Ananya Iyer",
			email: "ananya.iyer@student.edu",
			semester: "1",
			attendance: "93%",
		},
		{
			id: 7,
			usn: "1MS20CS007",
			name: "Rohan Gupta",
			email: "rohan.gupta@student.edu",
			semester: "3",
			attendance: "87%",
		},
		{
			id: 8,
			usn: "1MS19CS008",
			name: "Kavya Menon",
			email: "kavya.menon@student.edu",
			semester: "5",
			attendance: "91%",
		},
	]);

	const [loading, setLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterSemester, setFilterSemester] = useState("all");
	const [showModal, setShowModal] = useState(false);
	const [editingStudent, setEditingStudent] = useState(null);
	const [cameraActive, setCameraActive] = useState(false);
	const [capturedImages, setCapturedImages] = useState([]); // Array for 9 angles
	const [currentAngle, setCurrentAngle] = useState(0);
	const [imageCapturing, setImageCapturing] = useState(false);
	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const streamRef = useRef(null);

	// 9 angles for facial recognition training
	const faceAngles = [
		{ name: "Front", instruction: "Look straight at the camera" },
		{ name: "Left Profile", instruction: "Turn your face 90° to the left" },
		{
			name: "Right Profile",
			instruction: "Turn your face 90° to the right",
		},
		{ name: "Up", instruction: "Tilt your head upward" },
		{ name: "Down", instruction: "Tilt your head downward" },
		{ name: "Left Diagonal", instruction: "Look at top-left corner" },
		{ name: "Right Diagonal", instruction: "Look at top-right corner" },
		{ name: "Slight Left", instruction: "Turn face slightly left (45°)" },
		{ name: "Slight Right", instruction: "Turn face slightly right (45°)" },
	];

	const [formData, setFormData] = useState({
		usn: "",
		name: "",
		email: "",
		phone: "",
		semester: "",
		section: "A",
		bloodGroup: "",
		address: "",
	});

	// Get semesters for filter
	const semesters = ["all", "1", "2", "3", "4", "5", "6"];

	// Filter students
	const filteredStudents = students.filter((student) => {
		const searchLower = (searchTerm || "").toLowerCase();
		const matchesSearch =
			(student.name?.toLowerCase() || "").includes(searchLower) ||
			(student.usn?.toLowerCase() || "").includes(searchLower) ||
			(student.email?.toLowerCase() || "").includes(searchLower);
		const matchesSemester =
			filterSemester === "all" || student.semester === filterSemester;
		return matchesSearch && matchesSemester;
	});

	useEffect(() => {
		// Fetch students from API
		// fetchStudents();
	}, []);

	const fetchStudents = async () => {
		try {
			setLoading(true);
			const response = await adminAPI.getStudents();
			setStudents(response.data);
		} catch (error) {
			console.error("Failed to fetch students:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleAddStudent = () => {
		navigate("/admin/students/register");
	};

	const handleEditStudent = (student) => {
		setEditingStudent(student);
		setCapturedImages(student.faceImages || []);
		setCurrentAngle(0);
		setCameraActive(false);
		setFormData({
			usn: student.usn,
			name: student.name,
			email: student.email,
			phone: student.phone || "",
			semester: student.semester,
			section: student.section || "A",
			bloodGroup: student.bloodGroup || "",
			address: student.address || "",
		});
		setShowModal(true);
	};

	// Camera Functions
	const startCamera = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: { ideal: 1280 },
					height: { ideal: 720 },
					facingMode: "user",
				},
			});
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				streamRef.current = stream;
				setCameraActive(true);
			}
		} catch (error) {
			console.error("Error accessing camera:", error);
			alert("Unable to access camera. Please check camera permissions.");
		}
	};

	const stopCamera = () => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
			streamRef.current = null;
		}
		setCameraActive(false);
	};

	const captureImage = () => {
		if (videoRef.current && canvasRef.current) {
			const video = videoRef.current;
			const canvas = canvasRef.current;
			const context = canvas.getContext("2d");

			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			context.drawImage(video, 0, 0, canvas.width, canvas.height);

			const imageData = canvas.toDataURL("image/jpeg", 0.9);

			// Add image to array
			const newImages = [...capturedImages];
			newImages[currentAngle] = imageData;
			setCapturedImages(newImages);

			// Move to next angle or stop camera if all angles captured
			if (currentAngle < faceAngles.length - 1) {
				setCurrentAngle(currentAngle + 1);
			} else {
				stopCamera();
			}
			setImageCapturing(false);
		}
	};

	const retakeImage = (angleIndex) => {
		// Retake specific angle
		const newImages = [...capturedImages];
		newImages[angleIndex] = null;
		setCapturedImages(newImages);
		setCurrentAngle(angleIndex);
		startCamera();
	};

	const retakeAllImages = () => {
		setCapturedImages([]);
		setCurrentAngle(0);
		startCamera();
	};

	const handleDeleteStudent = async (id) => {
		if (window.confirm("Are you sure you want to delete this student?")) {
			try {
				// await adminAPI.deleteStudent(id);
				setStudents(students.filter((s) => s.id !== id));
			} catch (error) {
				console.error("Failed to delete student:", error);
			}
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (
			!formData.usn.trim() ||
			!formData.name.trim() ||
			!formData.email.trim() ||
			!formData.phone.trim() ||
			!formData.semester.trim()
		) {
			alert("Please fill in all required fields!");
			return;
		}

		if (!editingStudent && capturedImages.length < 9) {
			alert(
				`Please capture all 9 face angles for AI model training! (${capturedImages.length}/9 captured)`
			);
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			alert("Please enter a valid email address!");
			return;
		}

		if (editingStudent) {
			setStudents(
				students.map((s) =>
					s.id === editingStudent.id
						? {
								...s,
								usn: formData.usn,
								name: formData.name,
								email: formData.email,
								phone: formData.phone,
								semester: formData.semester,
								section: formData.section,
								bloodGroup: formData.bloodGroup,
								address: formData.address,
								faceImages:
									capturedImages.length === 9
										? capturedImages
										: s.faceImages,
						  }
						: s
				)
			);
			alert("Student updated successfully!");
		} else {
			const newStudent = {
				id: students.length + 1,
				usn: formData.usn,
				name: formData.name,
				email: formData.email,
				phone: formData.phone,
				semester: formData.semester,
				section: formData.section,
				bloodGroup: formData.bloodGroup,
				address: formData.address,
				attendance: "0%",
				faceImages: capturedImages,
			};
			setStudents([...students, newStudent]);
			alert(
				"Student registered successfully with 9-angle facial recognition data!"
			);
		}

		setShowModal(false);
		stopCamera();
		setCapturedImages([]);
		setCurrentAngle(0);
	};

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	if (loading) {
		return <LoadingSpinner fullScreen text="Loading students..." />;
	}

	try {
		return (
			<AdminLayout>
				{/* Page Header */}
				<div className="mb-8 bg-gradient-to-r from-[#a3b18a] to-[#588157] backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 animate-fadeIn">
					<h1 className="text-4xl font-bold text-black mb-2">
						👨‍🎓 Student Management
					</h1>
					<p className="text-black">
						Manage student records and information
					</p>
				</div>

				{/* Search and Filter Bar */}
				<SectionCard className="mb-6 animate-slideUp">
					<div className="flex flex-col md:flex-row gap-4">
						{/* Search */}
						<div className="flex-1 relative">
							<FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
							<input
								type="text"
								placeholder="Search by name, roll number, or email..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#a3b18a] focus:border-transparent transition-all"
							/>
						</div>

						{/* Semester Filter */}
						<div className="relative">
							<FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
							<select
								value={filterSemester}
								onChange={(e) =>
									setFilterSemester(e.target.value)
								}
								className="pl-10 pr-8 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#a3b18a] focus:border-transparent transition-all appearance-none bg-white"
							>
								{semesters.map((sem) => (
									<option key={sem} value={sem}>
										{sem === "all"
											? "All Semesters"
											: `Semester ${sem}`}
									</option>
								))}
							</select>
						</div>

						{/* Add Button */}
						<Button
							variant="primary"
							icon={FiPlus}
							onClick={handleAddStudent}
						>
							Register Student
						</Button>
					</div>
				</SectionCard>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slideUp animation-delay-100">
					<div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-black text-sm mb-1">
									Total Students
								</p>
								<h3 className="text-3xl font-bold text-black">
									{students.length}
								</h3>
							</div>
							<div className="p-3 rounded-xl bg-gradient-to-br from-[#a3b18a] to-[#588157]">
								<FiUsers className="w-6 h-6 text-black" />
							</div>
						</div>
					</div>
					<div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-black text-sm mb-1">
									Semester 1-2
								</p>
								<h3 className="text-3xl font-bold text-black">
									{
										students.filter(
											(s) =>
												s.semester === "1" ||
												s.semester === "2"
										).length
									}
								</h3>
							</div>
							<div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600">
								<FiBook className="w-6 h-6 text-white" />
							</div>
						</div>
					</div>
					<div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-black text-sm mb-1">
									Semester 3-4
								</p>
								<h3 className="text-3xl font-bold text-black">
									{
										students.filter(
											(s) =>
												s.semester === "3" ||
												s.semester === "4"
										).length
									}
								</h3>
							</div>
							<div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600">
								<FiBook className="w-6 h-6 text-white" />
							</div>
						</div>
					</div>
					<div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-black text-sm mb-1">
									Avg Attendance
								</p>
								<h3 className="text-3xl font-bold text-black">
									{students.length > 0
										? Math.round(
												students.reduce(
													(acc, s) =>
														acc +
														parseInt(
															s.attendance || "0"
														),
													0
												) / students.length
										  )
										: 0}
									%
								</h3>
							</div>
							<div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-green-600">
								<FiCalendar className="w-6 h-6 text-white" />
							</div>
						</div>
					</div>
				</div>

				{/* Students Table */}
				<SectionCard
					title="Student List"
					className="animate-slideUp animation-delay-200"
				>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-gray-200">
									<th className="text-left py-3 px-4 font-semibold text-black">
										USN
									</th>
									<th className="text-left py-3 px-4 font-semibold text-black">
										Name
									</th>
									<th className="text-left py-3 px-4 font-semibold text-black">
										Email
									</th>
									<th className="text-left py-3 px-4 font-semibold text-black">
										Semester
									</th>
									<th className="text-left py-3 px-4 font-semibold text-black">
										Attendance
									</th>
									<th className="text-left py-3 px-4 font-semibold text-black">
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{filteredStudents.map((student, index) => (
									<tr
										key={student.id}
										className="border-b border-gray-100 hover:bg-white/30 transition-all"
										style={{
											animationDelay: `${index * 50}ms`,
										}}
									>
										<td className="py-4 px-4">
											<span className="font-semibold text-black">
												{student.usn || "N/A"}
											</span>
										</td>
										<td className="py-4 px-4">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
													{(student.name || "")
														.split(" ")
														.map((n) => n[0])
														.join("")
														.toUpperCase() || "?"}
												</div>
												<span className="font-medium text-black">
													{student.name || "Unknown"}
												</span>
											</div>
										</td>
										<td className="py-4 px-4">
											<span className="text-black flex items-center gap-2">
												<FiMail className="w-4 h-4" />
												{student.email || "N/A"}
											</span>
										</td>
										<td className="py-4 px-4">
											<span className="text-black font-medium">
												Sem {student.semester || "N/A"}
											</span>
										</td>
										<td className="py-4 px-4">
											<span
												className={`px-3 py-1 rounded-full text-sm font-semibold ${
													parseInt(
														student.attendance ||
															"0"
													) >= 90
														? "bg-green-100 text-green-800"
														: parseInt(
																student.attendance ||
																	"0"
														  ) >= 75
														? "bg-yellow-100 text-yellow-800"
														: "bg-red-100 text-red-800"
												}`}
											>
												{student.attendance || "0%"}
											</span>
										</td>
										<td className="py-4 px-4">
											<div className="flex items-center gap-2">
												<button
													onClick={() =>
														handleEditStudent(
															student
														)
													}
													className="p-2 hover:bg-blue-100 rounded-lg transition-all"
													title="Edit"
												>
													<FiEdit className="w-4 h-4 text-blue-600" />
												</button>
												<button
													onClick={() =>
														handleDeleteStudent(
															student.id
														)
													}
													className="p-2 hover:bg-red-100 rounded-lg transition-all"
													title="Delete"
												>
													<FiTrash2 className="w-4 h-4 text-red-600" />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>

						{filteredStudents.length === 0 && (
							<div className="text-center py-12">
								<FiUsers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
								<p className="text-gray-500 text-lg">
									No students found
								</p>
							</div>
						)}
					</div>
				</SectionCard>

				{/* Add/Edit Modal */}
				<Modal
					isOpen={showModal}
					onClose={() => {
						setShowModal(false);
						stopCamera();
						setCapturedImage(null);
					}}
					title={
						editingStudent
							? "Edit Student Details"
							: "Register New Student"
					}
					size="lg"
				>
					<form onSubmit={handleSubmit} className="space-y-4">
						{/* 9-Angle Face Recognition Section */}
						<div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
							<div className="flex items-center gap-3 mb-4">
								<FiCamera className="w-6 h-6 text-blue-600" />
								<div className="flex-1">
									<h3 className="font-bold text-gray-900">
										9-Angle Facial Recognition Training
									</h3>
									<p className="text-sm text-gray-600">
										Capture 9 different angles for accurate
										AI model training
									</p>
								</div>
								<div className="text-right">
									<div className="text-2xl font-bold text-blue-600">
										{
											capturedImages.filter((img) => img)
												.length
										}
										/9
									</div>
									<div className="text-xs text-gray-500">
										Captured
									</div>
								</div>
							</div>

							{/* Progress Indicator */}
							<div className="mb-4">
								<div className="flex gap-1 mb-2">
									{faceAngles.map((angle, index) => (
										<div
											key={index}
											className={`flex-1 h-2 rounded-full transition-all ${
												capturedImages[index]
													? "bg-green-500"
													: index === currentAngle &&
													  cameraActive
													? "bg-blue-500 animate-pulse"
													: "bg-gray-200"
											}`}
										/>
									))}
								</div>
								<div className="text-sm text-center text-gray-600 font-medium">
									{cameraActive &&
										faceAngles[currentAngle]?.instruction}
								</div>
							</div>

							{/* Start Camera Button */}
							{!cameraActive &&
								capturedImages.filter((img) => img).length ===
									0 && (
									<Button
										type="button"
										variant="primary"
										icon={FiCamera}
										onClick={startCamera}
										className="w-full"
									>
										Start 9-Angle Capture
									</Button>
								)}

							{/* Camera View */}
							{cameraActive && (
								<div className="space-y-3">
									<div className="relative bg-black rounded-xl overflow-hidden">
										<video
											ref={videoRef}
											autoPlay
											playsInline
											className="w-full h-80 object-cover"
										/>
										{/* Angle Indicator Overlay */}
										<div className="absolute top-4 left-4 right-4">
											<div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
												<div className="text-white font-bold text-lg mb-1">
													{
														faceAngles[currentAngle]
															?.name
													}
												</div>
												<div className="text-yellow-300 text-sm">
													{
														faceAngles[currentAngle]
															?.instruction
													}
												</div>
											</div>
										</div>
										{/* Guide Frame */}
										<div className="absolute inset-0 border-4 border-dashed border-white/30 m-8 rounded-xl pointer-events-none" />
									</div>
									<div className="flex gap-3">
										<Button
											type="button"
											variant="secondary"
											onClick={stopCamera}
											className="flex-1"
										>
											Cancel
										</Button>
										<Button
											type="button"
											variant="primary"
											icon={FiCamera}
											onClick={captureImage}
											className="flex-1"
										>
											Capture Angle {currentAngle + 1}
										</Button>
									</div>
								</div>
							)}

							{/* Captured Images Grid */}
							{capturedImages.filter((img) => img).length > 0 &&
								!cameraActive && (
									<div className="space-y-3">
										<div className="grid grid-cols-3 gap-3">
											{faceAngles.map((angle, index) => (
												<div
													key={index}
													className="relative"
												>
													{capturedImages[index] ? (
														<>
															<img
																src={
																	capturedImages[
																		index
																	]
																}
																alt={angle.name}
																className="w-full h-32 object-cover rounded-lg border-2 border-green-500"
															/>
															<div className="absolute top-1 left-1 bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold">
																{index + 1}
															</div>
															<button
																type="button"
																onClick={() =>
																	retakeImage(
																		index
																	)
																}
																className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-all"
															>
																<FiRefreshCw className="w-3 h-3" />
															</button>
															<div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 text-center">
																{angle.name}
															</div>
														</>
													) : (
														<div className="w-full h-32 bg-gray-200 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
															<FiCamera className="w-6 h-6 mb-1" />
															<div className="text-xs font-medium">
																{angle.name}
															</div>
														</div>
													)}
												</div>
											))}
										</div>

										{/* Action Buttons */}
										<div className="flex gap-3">
											{capturedImages.filter((img) => img)
												.length < 9 && (
												<Button
													type="button"
													variant="primary"
													icon={FiCamera}
													onClick={startCamera}
													className="flex-1"
												>
													Continue Capture (
													{
														capturedImages.filter(
															(img) => img
														).length
													}
													/9)
												</Button>
											)}
											{capturedImages.filter((img) => img)
												.length === 9 && (
												<div className="flex-1 bg-green-100 border-2 border-green-500 rounded-xl p-3 flex items-center gap-2">
													<FiCheckCircle className="w-5 h-5 text-green-600" />
													<span className="text-green-800 font-semibold">
														All 9 angles captured!
													</span>
												</div>
											)}
											<Button
												type="button"
												variant="outline"
												icon={FiRefreshCw}
												onClick={retakeAllImages}
											>
												Retake All
											</Button>
										</div>
									</div>
								)}

							<canvas
								ref={canvasRef}
								style={{ display: "none" }}
							/>
						</div>

						{/* Personal Information */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									USN (University Seat Number) *
								</label>
								<input
									type="text"
									name="usn"
									value={formData.usn}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#a3b18a] focus:border-transparent"
									placeholder="e.g., 1MS21CS001"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Full Name *
								</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#a3b18a] focus:border-transparent"
									placeholder="e.g., John Doe"
									required
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Email *
								</label>
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#a3b18a] focus:border-transparent"
									placeholder="student@example.com"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Phone Number *
								</label>
								<input
									type="tel"
									name="phone"
									value={formData.phone}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#a3b18a] focus:border-transparent"
									placeholder="+91 9876543210"
									required
								/>
							</div>
						</div>

						{/* Academic Information */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Semester *
								</label>
								<select
									name="semester"
									value={formData.semester}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#a3b18a] focus:border-transparent"
									required
								>
									<option value="">Select Semester</option>
									<option value="1">Semester 1</option>
									<option value="2">Semester 2</option>
									<option value="3">Semester 3</option>
									<option value="4">Semester 4</option>
									<option value="5">Semester 5</option>
									<option value="6">Semester 6</option>
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Section
								</label>
								<select
									name="section"
									value={formData.section}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#a3b18a] focus:border-transparent"
								>
									<option value="A">Section A</option>
									<option value="B">Section B</option>
									<option value="C">Section C</option>
								</select>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Blood Group
								</label>
								<select
									name="bloodGroup"
									value={formData.bloodGroup}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#a3b18a] focus:border-transparent"
								>
									<option value="">Select Blood Group</option>
									<option value="A+">A+</option>
									<option value="A-">A-</option>
									<option value="B+">B+</option>
									<option value="B-">B-</option>
									<option value="AB+">AB+</option>
									<option value="AB-">AB-</option>
									<option value="O+">O+</option>
									<option value="O-">O-</option>
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Address
								</label>
								<input
									type="text"
									name="address"
									value={formData.address}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#a3b18a] focus:border-transparent"
									placeholder="City, State"
								/>
							</div>
						</div>

						<div className="flex gap-3 pt-4">
							<Button
								type="button"
								variant="secondary"
								onClick={() => {
									setShowModal(false);
									stopCamera();
									setCapturedImage(null);
								}}
								className="flex-1"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								variant="primary"
								className="flex-1"
							>
								{editingStudent ? "Update" : "Add"} Student
							</Button>
						</div>
					</form>
				</Modal>
			</AdminLayout>
		);
	} catch (error) {
		console.error("StudentManagement render error:", error);
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center p-8 bg-red-100 rounded-xl">
					<h2 className="text-2xl font-bold text-red-800 mb-4">
						Error Loading Student Management
					</h2>
					<p className="text-red-600">{error.message}</p>
					<button
						onClick={() => window.location.reload()}
						className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
					>
						Reload Page
					</button>
				</div>
			</div>
		);
	}
};

export default StudentManagement;
