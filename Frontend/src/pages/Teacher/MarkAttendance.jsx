import React, { useState, useRef, useEffect } from "react";
import {
	Camera,
	X,
	Check,
	AlertCircle,
	Users,
	CheckCircle,
	UserCheck,
	Clock,
} from "lucide-react";
import TeacherSidebar from "../../components/TeacherSidebar";
import { format } from "date-fns";

const MarkAttendance = () => {
	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const [stream, setStream] = useState(null);
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [alertType, setAlertType] = useState("success");
	const [cameraActive, setCameraActive] = useState(false);
	const [currentTime, setCurrentTime] = useState(new Date());
	const [processing, setProcessing] = useState(false);

	// List of students whose attendance has been marked
	const [markedStudents, setMarkedStudents] = useState([]);

	// Selected class and subject for attendance
	const [selectedClass, setSelectedClass] = useState("");
	const [selectedSubject, setSelectedSubject] = useState("");

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => {
			clearInterval(timer);
			if (stream) {
				stream.getTracks().forEach((track) => track.stop());
			}
		};
	}, [stream]);

	const startCamera = async () => {
		try {
			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: { width: 640, height: 480 },
			});
			setStream(mediaStream);
			if (videoRef.current) {
				videoRef.current.srcObject = mediaStream;
			}
			setCameraActive(true);
		} catch (error) {
			showAlertMessage(
				"Camera access denied. Please allow camera permissions.",
				"error"
			);
			console.error("Camera error:", error);
		}
	};

	const stopCamera = () => {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			setStream(null);
			setCameraActive(false);
		}
	};

	const capturePhoto = async () => {
		if (videoRef.current && canvasRef.current) {
			const canvas = canvasRef.current;
			const video = videoRef.current;
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			const ctx = canvas.getContext("2d");
			ctx.drawImage(video, 0, 0);
			const imageData = canvas.toDataURL("image/png");

			// Send to backend for face recognition
			await sendForRecognition(imageData);
		}
	};

	const sendForRecognition = async (imageData) => {
		if (!selectedClass || !selectedSubject) {
			showAlertMessage("Please select class and subject first!", "error");
			return;
		}

		setProcessing(true);

		try {
			// TODO: Replace with actual backend API endpoint
			const response = await fetch("/api/recognize-face", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					image: imageData,
					class: selectedClass,
					subject: selectedSubject,
					timestamp: new Date().toISOString(),
				}),
			});

			const result = await response.json();

			if (result.success && result.student) {
				// Add student to marked attendance list
				const newStudent = {
					id: result.student.id,
					name: result.student.name,
					rollNo: result.student.rollNo,
					class: selectedClass,
					subject: selectedSubject,
					photo: imageData,
					timestamp: new Date(),
					confidence: result.confidence || 95,
				};

				setMarkedStudents((prev) => [newStudent, ...prev]);
				showAlertMessage(
					`✅ Attendance marked for ${result.student.name}!`,
					"success"
				);
			} else {
				showAlertMessage(
					"❌ Face not recognized. Please try again.",
					"error"
				);
			}
		} catch (error) {
			console.error("Recognition error:", error);
			showAlertMessage(
				"❌ Failed to mark attendance. Please try again.",
				"error"
			);
		} finally {
			setProcessing(false);
		}
	};

	const showAlertMessage = (message, type = "success") => {
		setAlertMessage(message);
		setAlertType(type);
		setShowAlert(true);
		setTimeout(() => {
			setShowAlert(false);
		}, 3000);
	};

	return (
		<div className="flex min-h-screen bg-gradient-to-br from-[#99B69B] via-[#E4E3D3] to-[#7976B6]">
			<TeacherSidebar />

			{/* Main Content */}
			<div className="flex-1 md:ml-20 p-4 md:p-8 pb-24 md:pb-8 overflow-auto">
				{/* Header */}
				<div className="bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-6 mb-8">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
								<Camera className="w-7 h-7 text-white" />
							</div>
							<div>
								<h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
									Facial Recognition Attendance
								</h1>
								<p className="text-sm text-gray-600 mt-1">
									{format(
										currentTime,
										"EEEE, do MMMM yyyy • h:mm:ss a"
									)}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-xl border-2 border-green-300">
							<UserCheck className="w-5 h-5 text-green-600" />
							<div>
								<p className="text-xs text-gray-600">
									Marked Today
								</p>
								<p className="text-xl font-bold text-green-600">
									{markedStudents.length}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Class and Subject Selection */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
					<div className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-6">
						<label className="block text-sm font-bold text-purple-700 mb-3">
							Select Class
						</label>
						<select
							value={selectedClass}
							onChange={(e) => setSelectedClass(e.target.value)}
							className="w-full px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 font-semibold"
						>
							<option value="">Choose a class...</option>
							<option value="I B.Sc (CS)">I B.Sc (CS)</option>
							<option value="II B.Sc (CS)">II B.Sc (CS)</option>
							<option value="III B.Sc (CS)">III B.Sc (CS)</option>
							<option value="I B.Sc (CSDA)">I B.Sc (CSDA)</option>
							<option value="II B.Sc (CSDA)">
								II B.Sc (CSDA)
							</option>
							<option value="III B.Sc (CSDA)">
								III B.Sc (CSDA)
							</option>
						</select>
					</div>

					<div className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-6">
						<label className="block text-sm font-bold text-purple-700 mb-3">
							Select Subject
						</label>
						<select
							value={selectedSubject}
							onChange={(e) => setSelectedSubject(e.target.value)}
							className="w-full px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 font-semibold"
						>
							<option value="">Choose a subject...</option>
							<option value="Data Structures">
								Data Structures
							</option>
							<option value="Algorithms">Algorithms</option>
							<option value="Database Systems">
								Database Systems
							</option>
							<option value="Operating Systems">
								Operating Systems
							</option>
							<option value="Computer Networks">
								Computer Networks
							</option>
							<option value="Web Development">
								Web Development
							</option>
						</select>
					</div>
				</div>

				{/* Success/Error Alert */}
				{showAlert && (
					<div
						className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 ${
							alertType === "success"
								? "bg-gradient-to-br from-green-400 to-green-600"
								: "bg-gradient-to-br from-red-400 to-red-600"
						} text-white px-8 py-6 rounded-3xl shadow-2xl backdrop-blur-xl border-2 border-white/40 animate-bounce`}
					>
						<div className="flex items-center gap-4">
							{alertType === "success" ? (
								<Check className="w-8 h-8" />
							) : (
								<AlertCircle className="w-8 h-8" />
							)}
							<p className="text-xl font-bold">{alertMessage}</p>
						</div>
					</div>
				)}

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Camera Card */}
					<div className="bg-white/30 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent flex items-center gap-2">
								<Camera className="w-6 h-6 text-purple-600" />
								Live Camera Feed
							</h3>
							{processing && (
								<div className="flex items-center gap-2 text-sm text-orange-600 font-semibold">
									<div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-600 border-t-transparent"></div>
									Processing...
								</div>
							)}
						</div>

						<div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video mb-4 shadow-lg">
							{!cameraActive && (
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="text-center">
										<Camera className="w-16 h-16 text-gray-500 mx-auto mb-4" />
										<p className="text-gray-400">
											Camera not started
										</p>
									</div>
								</div>
							)}

							<video
								ref={videoRef}
								autoPlay
								playsInline
								className="w-full h-full object-cover"
							/>

							<canvas ref={canvasRef} className="hidden" />
						</div>

						<div className="flex gap-3">
							{!cameraActive ? (
								<button
									type="button"
									onClick={startCamera}
									className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:scale-105 transition-all duration-300 shadow-lg font-bold"
								>
									<Camera className="w-5 h-5" />
									Start Camera
								</button>
							) : (
								<>
									<button
										type="button"
										onClick={capturePhoto}
										disabled={
											processing ||
											!selectedClass ||
											!selectedSubject
										}
										className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:scale-105 transition-all duration-300 shadow-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<Camera className="w-5 h-5" />
										{processing
											? "Processing..."
											: "Capture & Recognize"}
									</button>
									<button
										type="button"
										onClick={stopCamera}
										className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
									>
										<X className="w-5 h-5" />
									</button>
								</>
							)}
						</div>
					</div>

					{/* Marked Students List */}
					<div className="bg-white/30 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent flex items-center gap-2">
								<CheckCircle className="w-6 h-6 text-green-600" />
								Attendance Marked
							</h3>
							<span className="bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-1 rounded-full text-sm font-bold text-green-700">
								{markedStudents.length} Students
							</span>
						</div>

						<div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
							{markedStudents.length === 0 ? (
								<div className="text-center py-12">
									<Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
									<p className="text-gray-500 font-medium">
										No attendance marked yet
									</p>
									<p className="text-gray-400 text-sm mt-2">
										Start camera and capture student faces
									</p>
								</div>
							) : (
								markedStudents.map((student) => (
									<div
										key={student.id}
										className="group bg-gradient-to-r from-white to-green-50 border-2 border-green-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300"
									>
										<div className="flex items-center gap-4">
											{/* Student Photo */}
											<div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0 border-2 border-green-400 shadow-md">
												<img
													src={student.photo}
													alt={student.name}
													className="w-full h-full object-cover"
												/>
											</div>

											{/* Student Info */}
											<div className="flex-1">
												<h4 className="text-lg font-bold text-purple-900">
													{student.name}
												</h4>
												<p className="text-sm text-gray-600">
													<span className="font-semibold">
														Roll:
													</span>{" "}
													{student.rollNo}
												</p>
												<div className="flex items-center gap-2 mt-1">
													<Clock className="w-3 h-3 text-gray-500" />
													<p className="text-xs text-gray-500">
														{format(
															student.timestamp,
															"h:mm:ss a"
														)}
													</p>
												</div>
											</div>

											{/* Confidence Badge */}
											<div className="text-right">
												<div className="bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1 rounded-lg">
													<p className="text-xs text-white font-bold">
														{student.confidence}%
													</p>
													<p className="text-[10px] text-white/80">
														Match
													</p>
												</div>
												<div className="mt-1">
													<CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
												</div>
											</div>
										</div>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MarkAttendance;
