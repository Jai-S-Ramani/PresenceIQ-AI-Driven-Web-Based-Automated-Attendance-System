import React from "react";
import {
	FiSettings,
	FiUser,
	FiBell,
	FiLock,
	FiBook,
	FiClock,
} from "react-icons/fi";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import SectionCard from "../../components/SectionCard";
import Button from "../../components/Button";

const Settings = () => {
	return (
		<DashboardLayout>
			{/* Header */}
			<div className="mb-8 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg">
				<h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
					<FiSettings className="w-8 h-8 text-purple-600" />
					<span>Teacher Settings</span>
				</h1>
				<p className="text-gray-600 mt-2">
					Customize your teaching preferences and account
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
								className="w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
								placeholder="Enter your name"
							/>
						</div>
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Email Address
							</label>
							<input
								type="email"
								className="w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
								placeholder="Enter your email"
							/>
						</div>
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Department
							</label>
							<input
								type="text"
								className="w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
								placeholder="Enter your department"
							/>
						</div>
					</div>
				</SectionCard>

				{/* Teaching Preferences */}
				<SectionCard title="Teaching Preferences" icon={FiBook}>
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Default Class Duration
							</label>
							<select className="w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
								<option>45 minutes</option>
								<option>60 minutes</option>
								<option>90 minutes</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Attendance Method
							</label>
							<select className="w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
								<option>Face Recognition</option>
								<option>Manual</option>
								<option>QR Code</option>
							</select>
						</div>
						<div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
							<label className="flex items-center space-x-3 cursor-pointer">
								<input
									type="checkbox"
									className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
								/>
								<span className="text-gray-800 font-medium">
									Auto-mark absent students after class ends
								</span>
							</label>
						</div>
					</div>
				</SectionCard>

				{/* Notification Settings */}
				<SectionCard title="Notifications" icon={FiBell}>
					<div className="space-y-3">
						<label className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg cursor-pointer hover:from-indigo-100 hover:to-purple-100 transition-all border-2 border-transparent hover:border-purple-200">
							<div className="flex items-center space-x-3">
								<FiBell className="w-5 h-5 text-purple-600" />
								<span className="text-gray-800 font-medium">
									Class Reminder Notifications
								</span>
							</div>
							<input
								type="checkbox"
								className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
								defaultChecked
							/>
						</label>
						<label className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg cursor-pointer hover:from-indigo-100 hover:to-purple-100 transition-all border-2 border-transparent hover:border-purple-200">
							<div className="flex items-center space-x-3">
								<FiBell className="w-5 h-5 text-purple-600" />
								<span className="text-gray-800 font-medium">
									Student Absence Alerts
								</span>
							</div>
							<input
								type="checkbox"
								className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
								defaultChecked
							/>
						</label>
						<label className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg cursor-pointer hover:from-indigo-100 hover:to-purple-100 transition-all border-2 border-transparent hover:border-purple-200">
							<div className="flex items-center space-x-3">
								<FiBell className="w-5 h-5 text-purple-600" />
								<span className="text-gray-800 font-medium">
									Weekly Report Summary
								</span>
							</div>
							<input
								type="checkbox"
								className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
							/>
						</label>
					</div>
				</SectionCard>

				{/* Security Settings */}
				<SectionCard title="Security & Privacy" icon={FiLock}>
					<div className="space-y-4">
						<div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
							<p className="text-sm text-gray-700 mb-3">
								Keep your account secure with a strong password
							</p>
							<Button
								variant="secondary"
								icon={FiLock}
								className="w-full"
							>
								Change Password
							</Button>
						</div>
						<div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
							<label className="flex items-center space-x-3 cursor-pointer">
								<input
									type="checkbox"
									className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
								/>
								<span className="text-gray-800 font-medium">
									Enable Two-Factor Authentication
								</span>
							</label>
						</div>
						<div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
							<label className="flex items-center space-x-3 cursor-pointer">
								<input
									type="checkbox"
									className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
								/>
								<span className="text-gray-800 font-medium">
									Show profile to students
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
		</DashboardLayout>
	);
};

export default Settings;
