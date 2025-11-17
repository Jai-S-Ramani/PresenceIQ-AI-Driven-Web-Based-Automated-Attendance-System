import React from "react";
import {
	FiSettings,
	FiUser,
	FiBell,
	FiLock,
	FiMail,
	FiPhone,
	FiBookOpen,
} from "react-icons/fi";
import StudentSidebar from "../../components/StudentSidebar";
import SectionCard from "../../components/SectionCard";
import Button from "../../components/Button";

const Settings = () => {
	return (
		<div className="flex min-h-screen bg-gradient-to-br from-[#99B69B] via-[#E4E3D3] to-[#7976B6]">
			<StudentSidebar />
			<div className="flex-1 md:ml-20 p-4 md:p-8 pb-24 md:pb-8">
				{/* Header */}
				<div className="mb-8 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg">
					<h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
						<FiSettings className="w-8 h-8 text-teal-600" />
						<span>My Settings</span>
					</h1>
					<p className="text-gray-600 mt-2">
						Manage your profile and preferences
					</p>
				</div>

				{/* Settings Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Profile Settings */}
					<SectionCard title="Profile Information" icon={FiUser}>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Full Name
								</label>
								<input
									type="text"
									className="w-full px-4 py-3 bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
									placeholder="Enter your name"
								/>
							</div>
							<div>
								<label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
									<FiMail className="w-4 h-4 text-teal-600" />
									<span>Email Address</span>
								</label>
								<input
									type="email"
									className="w-full px-4 py-3 bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
									placeholder="Enter your email"
								/>
							</div>
							<div>
								<label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
									<FiPhone className="w-4 h-4 text-teal-600" />
									<span>Phone Number</span>
								</label>
								<input
									type="tel"
									className="w-full px-4 py-3 bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
									placeholder="Enter your phone"
								/>
							</div>
							<div>
								<label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
									<FiBookOpen className="w-4 h-4 text-teal-600" />
									<span>Roll Number</span>
								</label>
								<input
									type="text"
									className="w-full px-4 py-3 bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
									placeholder="Your roll number"
									disabled
								/>
							</div>
						</div>
					</SectionCard>

					{/* Attendance Preferences */}
					<SectionCard
						title="Attendance Preferences"
						icon={FiBookOpen}
					>
						<div className="space-y-4">
							<div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200">
								<label className="flex items-center space-x-3 cursor-pointer">
									<input
										type="checkbox"
										className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
										defaultChecked
									/>
									<span className="text-gray-800 font-medium">
										Show attendance percentage on dashboard
									</span>
								</label>
							</div>
							<div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200">
								<label className="flex items-center space-x-3 cursor-pointer">
									<input
										type="checkbox"
										className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
										defaultChecked
									/>
									<span className="text-gray-800 font-medium">
										Alert when attendance falls below 75%
									</span>
								</label>
							</div>
							<div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200">
								<label className="flex items-center space-x-3 cursor-pointer">
									<input
										type="checkbox"
										className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
									/>
									<span className="text-gray-800 font-medium">
										Show subject-wise analytics
									</span>
								</label>
							</div>
						</div>
					</SectionCard>

					{/* Notification Settings */}
					<SectionCard title="Notifications" icon={FiBell}>
						<div className="space-y-3">
							<label className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg cursor-pointer hover:from-green-100 hover:to-teal-100 transition-all border-2 border-transparent hover:border-teal-200">
								<div className="flex items-center space-x-3">
									<FiBell className="w-5 h-5 text-teal-600" />
									<span className="text-gray-800 font-medium">
										Class Schedule Reminders
									</span>
								</div>
								<input
									type="checkbox"
									className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
									defaultChecked
								/>
							</label>
							<label className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg cursor-pointer hover:from-green-100 hover:to-teal-100 transition-all border-2 border-transparent hover:border-teal-200">
								<div className="flex items-center space-x-3">
									<FiBell className="w-5 h-5 text-teal-600" />
									<span className="text-gray-800 font-medium">
										Low Attendance Warnings
									</span>
								</div>
								<input
									type="checkbox"
									className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
									defaultChecked
								/>
							</label>
							<label className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg cursor-pointer hover:from-green-100 hover:to-teal-100 transition-all border-2 border-transparent hover:border-teal-200">
								<div className="flex items-center space-x-3">
									<FiBell className="w-5 h-5 text-teal-600" />
									<span className="text-gray-800 font-medium">
										Assignment Deadlines
									</span>
								</div>
								<input
									type="checkbox"
									className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
								/>
							</label>
						</div>
					</SectionCard>

					{/* Security Settings */}
					<SectionCard title="Security & Privacy" icon={FiLock}>
						<div className="space-y-4">
							<div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
								<p className="text-sm text-gray-700 mb-3">
									Update your password to keep your account
									secure
								</p>
								<Button
									variant="secondary"
									icon={FiLock}
									className="w-full"
								>
									Change Password
								</Button>
							</div>
							<div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200">
								<label className="flex items-center space-x-3 cursor-pointer">
									<input
										type="checkbox"
										className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
									/>
									<span className="text-gray-800 font-medium">
										Enable Two-Factor Authentication
									</span>
								</label>
							</div>
							<div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200">
								<label className="flex items-center space-x-3 cursor-pointer">
									<input
										type="checkbox"
										className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
										defaultChecked
									/>
									<span className="text-gray-800 font-medium">
										Allow face recognition for attendance
									</span>
								</label>
							</div>
						</div>
					</SectionCard>
				</div>

				{/* Save Button */}
				<div className="flex justify-end mt-8">
					<div className="flex space-x-4">
						<Button variant="outline">Cancel</Button>
						<Button variant="primary" icon={FiSettings}>
							Save Changes
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Settings;
