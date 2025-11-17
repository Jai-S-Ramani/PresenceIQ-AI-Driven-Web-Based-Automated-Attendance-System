import React from "react";
import {
	FiSettings,
	FiUser,
	FiBell,
	FiLock,
	FiShield,
	FiGlobe,
	FiClock,
} from "react-icons/fi";
import AdminLayout from "../../components/Layout/AdminLayout";
import SectionCard from "../../components/SectionCard";
import Button from "../../components/Button";

const Settings = () => {
	return (
		<AdminLayout>
			{/* Header */}
			<div className="mb-8 bg-gradient-to-r from-[#a3b18a] to-[#588157] backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
				<h1 className="text-3xl font-bold text-black flex items-center space-x-3">
					<FiSettings className="w-8 h-8 text-black" />
					<span>HOD Settings</span>
				</h1>
				<p className="text-black mt-2">
					Configure your profile and department preferences
				</p>
			</div>

			{/* Settings Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Profile Settings */}
				<SectionCard title="Profile Settings" icon={FiUser}>
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Full Name
							</label>
							<input
								type="text"
								className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
								placeholder="Enter your name"
							/>
						</div>
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Email Address
							</label>
							<input
								type="email"
								className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
								placeholder="Enter your email"
							/>
						</div>
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Phone Number
							</label>
							<input
								type="tel"
								className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
								placeholder="Enter your phone"
							/>
						</div>
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Department
							</label>
							<input
								type="text"
								className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
								placeholder="Computer Science"
								disabled
							/>
						</div>
					</div>
				</SectionCard>

				{/* Notification Settings */}
				<SectionCard title="Notification Preferences" icon={FiBell}>
					<div className="space-y-3">
						<label className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg cursor-pointer hover:from-gray-100 hover:to-slate-100 transition-all border-2 border-transparent hover:border-purple-200">
							<div className="flex items-center space-x-3">
								<FiBell className="w-5 h-5 text-purple-600" />
								<span className="text-gray-800 font-medium">
									Email Notifications
								</span>
							</div>
							<input
								type="checkbox"
								className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
							/>
						</label>
						<label className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg cursor-pointer hover:from-gray-100 hover:to-slate-100 transition-all border-2 border-transparent hover:border-purple-200">
							<div className="flex items-center space-x-3">
								<FiBell className="w-5 h-5 text-purple-600" />
								<span className="text-gray-800 font-medium">
									Push Notifications
								</span>
							</div>
							<input
								type="checkbox"
								className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
							/>
						</label>
						<label className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg cursor-pointer hover:from-gray-100 hover:to-slate-100 transition-all border-2 border-transparent hover:border-purple-200">
							<div className="flex items-center space-x-3">
								<FiBell className="w-5 h-5 text-purple-600" />
								<span className="text-gray-800 font-medium">
									SMS Notifications
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
				<SectionCard title="Security" icon={FiLock}>
					<div className="space-y-4">
						<div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
							<p className="text-sm text-gray-700 mb-3">
								Keep your account secure by updating your
								password regularly
							</p>
							<Button
								variant="secondary"
								icon={FiLock}
								className="w-full"
							>
								Change Password
							</Button>
						</div>
						<div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200">
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
					</div>
				</SectionCard>

				{/* System Settings */}
				<SectionCard title="Department Preferences" icon={FiShield}>
					<div className="space-y-4">
						<div>
							<label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
								<FiGlobe className="w-4 h-4 text-purple-600" />
								<span>Language</span>
							</label>
							<select className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
								<option>English</option>
								<option>Hindi</option>
							</select>
						</div>
						<div>
							<label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
								<FiClock className="w-4 h-4 text-purple-600" />
								<span>Timezone</span>
							</label>
							<select className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
								<option>Asia/Kolkata (IST)</option>
								<option>UTC</option>
							</select>
						</div>
						<div>
							<label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
								<FiSettings className="w-4 h-4 text-purple-600" />
								<span>Date Format</span>
							</label>
							<select className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
								<option>DD/MM/YYYY</option>
								<option>MM/DD/YYYY</option>
								<option>YYYY-MM-DD</option>
							</select>
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
		</AdminLayout>
	);
};

export default Settings;
