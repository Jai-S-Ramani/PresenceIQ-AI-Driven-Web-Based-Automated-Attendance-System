import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import StudentSidebar from "../../components/StudentSidebar";
import {
	User,
	Mail,
	Phone,
	MapPin,
	Calendar,
	BookOpen,
	Award,
	Camera,
	Edit,
	Save,
} from "lucide-react";

const Profile = () => {
	const { user } = useAuth();
	const [isEditing, setIsEditing] = useState(false);
	const [profileData, setProfileData] = useState({
		name: "John Doe",
		email: "john.doe@university.edu",
		phone: "+1 234-567-8900",
		rollNumber: "2021CS001",
		class: "CS-A",
		section: "A",
		semester: "6th Semester",
		batch: "2021-2025",
		address: "123 University Street, City, State - 12345",
		dateOfBirth: "2003-05-15",
		guardianName: "Jane Doe",
		guardianPhone: "+1 234-567-8901",
		bloodGroup: "O+",
		profilePhoto: null,
	});

	const handleEdit = () => {
		setIsEditing(!isEditing);
	};

	const handleSave = () => {
		// Save profile data logic here
		setIsEditing(false);
		console.log("Profile updated:", profileData);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setProfileData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handlePhotoUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setProfileData((prev) => ({
					...prev,
					profilePhoto: reader.result,
				}));
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className="flex min-h-screen bg-gradient-to-br from-[#99B69B] via-[#E4E3D3] to-[#7976B6]">
			<StudentSidebar />
			<div className="flex-1 md:ml-20 p-4 md:p-8 pb-24 md:pb-8">
				{/* Header */}
				<div className="mb-8 flex justify-between items-center">
					<div>
						<h1 className="text-4xl font-bold text-gray-800 mb-2">
							My Profile
						</h1>
						<p className="text-gray-600">
							Manage your personal information and academic
							details
						</p>
					</div>
					<button
						onClick={isEditing ? handleSave : handleEdit}
						className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
							isEditing
								? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
								: "bg-gradient-to-r from-[#7976B6] to-[#5a57a3] text-white hover:from-[#6865a5] hover:to-[#494692]"
						}`}
					>
						{isEditing ? (
							<>
								<Save className="w-5 h-5" />
								<span>Save Changes</span>
							</>
						) : (
							<>
								<Edit className="w-5 h-5" />
								<span>Edit Profile</span>
							</>
						)}
					</button>
				</div>

				{/* Profile Photo Section */}
				<div className="bg-white/30 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/30 mb-6">
					<div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
						<div className="relative group">
							<div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-[#7976B6] to-[#5a57a3] flex items-center justify-center">
								{profileData.profilePhoto ? (
									<img
										src={profileData.profilePhoto}
										alt="Profile"
										className="w-full h-full object-cover"
									/>
								) : (
									<User className="w-16 h-16 text-white" />
								)}
							</div>
							{isEditing && (
								<label
									htmlFor="photoUpload"
									className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
								>
									<Camera className="w-8 h-8 text-white" />
									<input
										id="photoUpload"
										type="file"
										accept="image/*"
										onChange={handlePhotoUpload}
										className="hidden"
									/>
								</label>
							)}
						</div>
						<div className="flex-1 text-center md:text-left">
							<h2 className="text-3xl font-bold text-gray-800 mb-2">
								{profileData.name}
							</h2>
							<p className="text-lg text-gray-600 mb-1">
								Roll No: {profileData.rollNumber}
							</p>
							<p className="text-lg text-gray-600">
								{profileData.class} • {profileData.semester}
							</p>
						</div>
					</div>
				</div>

				{/* Personal Information */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
					<div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
						<h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
							<User className="w-6 h-6 mr-2 text-[#7976B6]" />
							Personal Information
						</h3>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Full Name
								</label>
								<input
									type="text"
									name="name"
									value={profileData.name}
									onChange={handleChange}
									disabled={!isEditing}
									className="w-full px-4 py-3 rounded-xl border border-white/50 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#7976B6] disabled:opacity-60"
								/>
							</div>
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									<Mail className="w-4 h-4 inline mr-2" />
									Email Address
								</label>
								<input
									type="email"
									name="email"
									value={profileData.email}
									onChange={handleChange}
									disabled={!isEditing}
									className="w-full px-4 py-3 rounded-xl border border-white/50 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#7976B6] disabled:opacity-60"
								/>
							</div>
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									<Phone className="w-4 h-4 inline mr-2" />
									Phone Number
								</label>
								<input
									type="tel"
									name="phone"
									value={profileData.phone}
									onChange={handleChange}
									disabled={!isEditing}
									className="w-full px-4 py-3 rounded-xl border border-white/50 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#7976B6] disabled:opacity-60"
								/>
							</div>
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									<Calendar className="w-4 h-4 inline mr-2" />
									Date of Birth
								</label>
								<input
									type="date"
									name="dateOfBirth"
									value={profileData.dateOfBirth}
									onChange={handleChange}
									disabled={!isEditing}
									className="w-full px-4 py-3 rounded-xl border border-white/50 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#7976B6] disabled:opacity-60"
								/>
							</div>
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Blood Group
								</label>
								<input
									type="text"
									name="bloodGroup"
									value={profileData.bloodGroup}
									onChange={handleChange}
									disabled={!isEditing}
									className="w-full px-4 py-3 rounded-xl border border-white/50 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#7976B6] disabled:opacity-60"
								/>
							</div>
						</div>
					</div>

					<div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
						<h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
							<BookOpen className="w-6 h-6 mr-2 text-[#7976B6]" />
							Academic Information
						</h3>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Roll Number
								</label>
								<input
									type="text"
									name="rollNumber"
									value={profileData.rollNumber}
									disabled
									className="w-full px-4 py-3 rounded-xl border border-white/50 bg-white/50 opacity-60 cursor-not-allowed"
								/>
							</div>
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Class
								</label>
								<input
									type="text"
									name="class"
									value={profileData.class}
									disabled
									className="w-full px-4 py-3 rounded-xl border border-white/50 bg-white/50 opacity-60 cursor-not-allowed"
								/>
							</div>
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Section
								</label>
								<input
									type="text"
									name="section"
									value={profileData.section}
									disabled
									className="w-full px-4 py-3 rounded-xl border border-white/50 bg-white/50 opacity-60 cursor-not-allowed"
								/>
							</div>
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Semester
								</label>
								<input
									type="text"
									name="semester"
									value={profileData.semester}
									disabled
									className="w-full px-4 py-3 rounded-xl border border-white/50 bg-white/50 opacity-60 cursor-not-allowed"
								/>
							</div>
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Batch
								</label>
								<input
									type="text"
									name="batch"
									value={profileData.batch}
									disabled
									className="w-full px-4 py-3 rounded-xl border border-white/50 bg-white/50 opacity-60 cursor-not-allowed"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Guardian & Address Information */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
						<h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
							<User className="w-6 h-6 mr-2 text-[#7976B6]" />
							Guardian Information
						</h3>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Guardian Name
								</label>
								<input
									type="text"
									name="guardianName"
									value={profileData.guardianName}
									onChange={handleChange}
									disabled={!isEditing}
									className="w-full px-4 py-3 rounded-xl border border-white/50 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#7976B6] disabled:opacity-60"
								/>
							</div>
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									<Phone className="w-4 h-4 inline mr-2" />
									Guardian Phone
								</label>
								<input
									type="tel"
									name="guardianPhone"
									value={profileData.guardianPhone}
									onChange={handleChange}
									disabled={!isEditing}
									className="w-full px-4 py-3 rounded-xl border border-white/50 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#7976B6] disabled:opacity-60"
								/>
							</div>
						</div>
					</div>

					<div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
						<h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
							<MapPin className="w-6 h-6 mr-2 text-[#7976B6]" />
							Address Information
						</h3>
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Full Address
							</label>
							<textarea
								name="address"
								value={profileData.address}
								onChange={handleChange}
								disabled={!isEditing}
								rows="5"
								className="w-full px-4 py-3 rounded-xl border border-white/50 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#7976B6] disabled:opacity-60 resize-none"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
