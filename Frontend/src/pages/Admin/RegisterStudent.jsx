import React, { useState, useRef, useEffect } from "react";
import {
	FiCamera,
	FiCheckCircle,
	FiXCircle,
	FiRefreshCw,
	FiUser,
	FiMail,
	FiBook,
	FiCalendar,
	FiSave,
	FiArrowLeft,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/Layout/AdminLayout";
import Button from "../../components/Button";

const RegisterStudent = () => {
	const navigate = useNavigate();

	// Form state
	const [formData, setFormData] = useState({
		usn: "",
		name: "",
		email: "",
		semester: "1",
		phone: "",
		dateOfBirth: "",
		address: "",
	});

	// Camera and capture state
	const [showCamera, setShowCamera] = useState(false);
	const [capturedImages, setCapturedImages] = useState([]);
	const [currentAngle, setCurrentAngle] = useState(0);
	const [cameraError, setCameraError] = useState("");
	const [isCameraReady, setIsCameraReady] = useState(false);

	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const streamRef = useRef(null);

	// 9 different face angles for AI training
	const faceAngles = [
		{
			name: "Front",
			instruction: "Look straight at the camera",
			icon: "📷",
		},
		{
			name: "Left Profile",
			instruction: "Turn your face 90° to the left",
			icon: "👈",
		},
		{
			name: "Right Profile",
			instruction: "Turn your face 90° to the right",
			icon: "👉",
		},
		{
			name: "Up",
			instruction: "Tilt your head upward",
			icon: "⬆️",
		},
		{
			name: "Down",
			instruction: "Tilt your head downward",
			icon: "⬇️",
		},
		{
			name: "Left Diagonal",
			instruction: "Look at the top-left corner",
			icon: "↖️",
		},
		{
			name: "Right Diagonal",
			instruction: "Look at the top-right corner",
			icon: "↗️",
		},
		{
			name: "Slight Left",
			instruction: "Turn your face slightly left (45°)",
			icon: "◀️",
		},
		{
			name: "Slight Right",
			instruction: "Turn your face slightly right (45°)",
			icon: "▶️",
		},
	];

	// Start camera
	const startCamera = async () => {
		try {
			setCameraError("");
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
				setIsCameraReady(true);
			}
		} catch (error) {
			console.error("Camera error:", error);
			setCameraError(
				"Unable to access camera. Please check permissions and try again."
			);
		}
	};

	// Stop camera
	const stopCamera = () => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
			streamRef.current = null;
		}
		setIsCameraReady(false);
	};

	// Capture image from video stream
	const captureImage = () => {
		if (!videoRef.current || !canvasRef.current) return;

		const video = videoRef.current;
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");

		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		context.drawImage(video, 0, 0);

		const imageData = canvas.toDataURL("image/jpeg", 0.9);
		const newImages = [...capturedImages, imageData];
		setCapturedImages(newImages);

		// Move to next angle or finish
		if (currentAngle < faceAngles.length - 1) {
			setCurrentAngle(currentAngle + 1);
		} else {
			// All angles captured
			stopCamera();
			setShowCamera(false);
		}
	};

	// Start capture process
	const handleStartCapture = () => {
		setCapturedImages([]);
		setCurrentAngle(0);
		setShowCamera(true);
	};

	// Reset capture
	const handleResetCapture = () => {
		setCapturedImages([]);
		setCurrentAngle(0);
		stopCamera();
		setShowCamera(false);
	};

	// Handle form input changes
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Submit form
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (capturedImages.length !== 9) {
			alert("Please complete the 9-angle face capture first!");
			return;
		}

		// Here you would send data to backend
		const studentData = {
			...formData,
			faceImages: capturedImages,
			registeredAt: new Date().toISOString(),
		};

		console.log("Registering student:", studentData);

		// Show success and redirect
		alert("Student registered successfully!");
		navigate("/admin/students");
	};

	// Start camera when camera view opens
	useEffect(() => {
		if (showCamera) {
			startCamera();
		}
		return () => {
			stopCamera();
		};
	}, [showCamera]);

	return (
		<AdminLayout>
			{/* Page Header */}
			<div className="mb-8 bg-gradient-to-r from-[#a3b18a] to-[#588157] backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 animate-fadeIn">
				<div className="flex items-center gap-4">
					<button
						onClick={() => navigate("/admin/students")}
						className="p-2 hover:bg-white/20 rounded-lg transition-colors"
					>
						<FiArrowLeft className="w-6 h-6 text-black" />
					</button>
					<div>
						<h1 className="text-4xl font-bold text-black mb-2">
							👨‍🎓 Register New Student
						</h1>
						<p className="text-black">
							Complete 9-angle face capture and student details
						</p>
					</div>
				</div>
			</div>

			{/* Main Content - Two Column Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Left Column - Face Capture */}
				<div className="bg-white/20 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/30 animate-slideUp">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<FiCamera className="text-[#588157]" />
						9-Angle Face Capture
					</h2>

					{/* Capture Status */}
					<div className="mb-6 p-4 bg-white/30 backdrop-blur-sm rounded-xl border border-white/40">
						<div className="flex items-center justify-between mb-2">
							<span className="font-semibold text-gray-800">
								Progress
							</span>
							<span className="text-[#588157] font-bold">
								{capturedImages.length} / 9 angles
							</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-3">
							<div
								className="bg-gradient-to-r from-[#a3b18a] to-[#588157] h-3 rounded-full transition-all duration-500"
								style={{
									width: `${
										(capturedImages.length / 9) * 100
									}%`,
								}}
							/>
						</div>
					</div>

					{/* Camera View or Instructions */}
					{!showCamera && capturedImages.length === 0 && (
						<div className="mb-6">
							<div className="bg-blue-50/50 backdrop-blur-sm border border-blue-200 rounded-xl p-6 mb-4">
								<h3 className="font-semibold text-blue-900 mb-3">
									📸 Capture Instructions
								</h3>
								<ul className="space-y-2 text-blue-800 text-sm">
									<li>• Ensure good lighting on your face</li>
									<li>• Position your face in the center</li>
									<li>
										• Follow each angle instruction
										carefully
									</li>
									<li>• Keep a neutral expression</li>
									<li>
										• Complete all 9 angles for best AI
										training
									</li>
								</ul>
							</div>

							<Button
								onClick={handleStartCapture}
								variant="primary"
								className="w-full py-4 text-lg"
							>
								<FiCamera className="mr-2" />
								Start 9-Angle Capture
							</Button>
						</div>
					)}

					{/* Active Camera View */}
					{showCamera && (
						<div className="mb-6">
							{/* Current Angle Info */}
							<div className="bg-gradient-to-r from-[#a3b18a] to-[#588157] text-white rounded-t-xl p-4 text-center">
								<div className="text-4xl mb-2">
									{faceAngles[currentAngle].icon}
								</div>
								<h3 className="text-xl font-bold mb-1 text-black">
									Angle {currentAngle + 1} of 9:{" "}
									{faceAngles[currentAngle].name}
								</h3>
								<p className="text-gray-800">
									{faceAngles[currentAngle].instruction}
								</p>
							</div>

							{/* Video Feed */}
							<div className="relative bg-black rounded-b-xl overflow-hidden">
								<video
									ref={videoRef}
									autoPlay
									playsInline
									muted
									className="w-full h-auto"
									onLoadedMetadata={() =>
										setIsCameraReady(true)
									}
								/>
								<canvas ref={canvasRef} className="hidden" />

								{/* Camera Error */}
								{cameraError && (
									<div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-90">
										<div className="text-center text-white p-6">
											<FiXCircle className="w-16 h-16 mx-auto mb-4" />
											<p className="text-lg">
												{cameraError}
											</p>
										</div>
									</div>
								)}

								{/* Overlay Guide */}
								{isCameraReady && !cameraError && (
									<div className="absolute inset-0 pointer-events-none">
										<div className="absolute inset-0 border-4 border-[#a3b18a] rounded-full opacity-30 m-auto w-64 h-80" />
									</div>
								)}
							</div>

							{/* Capture Controls */}
							<div className="flex gap-3 mt-4">
								<Button
									onClick={captureImage}
									variant="primary"
									className="flex-1 py-3"
									disabled={!isCameraReady}
								>
									<FiCheckCircle className="mr-2" />
									Capture This Angle
								</Button>
								<Button
									onClick={handleResetCapture}
									variant="secondary"
									className="px-6 py-3"
								>
									<FiXCircle />
								</Button>
							</div>
						</div>
					)}

					{/* Captured Images Grid */}
					{capturedImages.length > 0 && (
						<div>
							<div className="flex items-center justify-between mb-4">
								<h3 className="font-semibold text-gray-700">
									Captured Angles
								</h3>
								{capturedImages.length === 9 && (
									<span className="flex items-center gap-2 text-green-600 font-semibold">
										<FiCheckCircle /> Complete!
									</span>
								)}
							</div>
							<div className="grid grid-cols-3 gap-3">
								{capturedImages.map((img, index) => (
									<div key={index} className="relative group">
										<img
											src={img}
											alt={`Angle ${index + 1}`}
											className="w-full h-32 object-cover rounded-lg border-2 border-sage-300"
										/>
										<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 rounded-lg transition-all flex items-center justify-center">
											<span className="text-white opacity-0 group-hover:opacity-100 text-sm font-semibold">
												{faceAngles[index].name}
											</span>
										</div>
									</div>
								))}
								{/* Empty slots */}
								{[...Array(9 - capturedImages.length)].map(
									(_, index) => (
										<div
											key={`empty-${index}`}
											className="w-full h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
										>
											<FiCamera className="w-8 h-8 text-gray-400" />
										</div>
									)
								)}
							</div>
							{capturedImages.length < 9 && (
								<Button
									onClick={handleStartCapture}
									variant="secondary"
									className="w-full mt-4"
								>
									<FiRefreshCw className="mr-2" />
									Continue Capture ({capturedImages.length}/9)
								</Button>
							)}
							{capturedImages.length === 9 && (
								<Button
									onClick={handleResetCapture}
									variant="secondary"
									className="w-full mt-4"
								>
									<FiRefreshCw className="mr-2" />
									Retake All Photos
								</Button>
							)}
						</div>
					)}
				</div>

				{/* Right Column - Student Details Form */}
				<div className="bg-white/20 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/30 animate-slideUp animation-delay-100">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<FiUser className="text-[#588157]" />
						Student Details
					</h2>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* USN */}
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								USN (University Seat Number) *
							</label>
							<input
								type="text"
								name="usn"
								value={formData.usn}
								onChange={handleInputChange}
								placeholder="e.g., 1MS21CS001"
								required
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a3b18a] focus:border-transparent"
							/>
						</div>

						{/* Name */}
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Full Name *
							</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								placeholder="Enter full name"
								required
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a3b18a] focus:border-transparent"
							/>
						</div>

						{/* Email */}
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Email Address *
							</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleInputChange}
								placeholder="student@example.edu"
								required
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a3b18a] focus:border-transparent"
							/>
						</div>

						{/* Phone */}
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Phone Number
							</label>
							<input
								type="tel"
								name="phone"
								value={formData.phone}
								onChange={handleInputChange}
								placeholder="+91 XXXXX XXXXX"
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a3b18a] focus:border-transparent"
							/>
						</div>

						{/* Semester */}
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Semester *
							</label>
							<select
								name="semester"
								value={formData.semester}
								onChange={handleInputChange}
								required
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a3b18a] focus:border-transparent"
							>
								<option value="1">Semester 1</option>
								<option value="2">Semester 2</option>
								<option value="3">Semester 3</option>
								<option value="4">Semester 4</option>
								<option value="5">Semester 5</option>
								<option value="6">Semester 6</option>
								<option value="7">Semester 7</option>
								<option value="8">Semester 8</option>
							</select>
						</div>

						{/* Date of Birth */}
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Date of Birth
							</label>
							<input
								type="date"
								name="dateOfBirth"
								value={formData.dateOfBirth}
								onChange={handleInputChange}
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a3b18a] focus:border-transparent"
							/>
						</div>

						{/* Address */}
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Address
							</label>
							<textarea
								name="address"
								value={formData.address}
								onChange={handleInputChange}
								placeholder="Enter address"
								rows="3"
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a3b18a] focus:border-transparent resize-none"
							/>
						</div>

						{/* Submit Button */}
						<div className="pt-4">
							<Button
								type="submit"
								variant="primary"
								className="w-full py-4 text-lg"
								disabled={capturedImages.length !== 9}
							>
								<FiSave className="mr-2" />
								Register Student
							</Button>
							{capturedImages.length !== 9 && (
								<p className="text-sm text-red-500 mt-2 text-center">
									Complete 9-angle face capture first
								</p>
							)}
						</div>
					</form>
				</div>
			</div>
		</AdminLayout>
	);
};

export default RegisterStudent;
