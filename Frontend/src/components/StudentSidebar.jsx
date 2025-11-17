import React from "react";
import {
	Home,
	Calendar,
	BarChart3,
	Settings,
	LogOut,
	BookOpen,
	User,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const StudentSidebar = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { logout } = useAuth();

	const isActive = (path) => location.pathname === path;

	const menuItems = [
		{ path: "/student/dashboard", icon: Home, label: "Dashboard" },
		{ path: "/student/timetable", icon: Calendar, label: "Timetable" },
		{ path: "/student/analytics", icon: BarChart3, label: "Analytics" },
		{ path: "/student/profile", icon: User, label: "Profile" },
	];

	return (
		<>
			{/* Desktop Sidebar - Hidden on mobile */}
			<div className="hidden md:fixed md:flex left-0 top-0 z-30 w-20 h-screen bg-gradient-to-br from-[#99B69B] via-[#E4E3D3] to-[#7976B6] backdrop-blur-xl border-r border-white/20 flex-col items-center py-6 space-y-8 shadow-2xl">
				{/* Logo */}
				<div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer border border-white/40">
					<span className="text-white text-xl font-bold">🎓</span>
				</div>

				{/* Main Navigation */}
				<div className="flex-1 flex flex-col space-y-6">
					{menuItems.map((item) => {
						const Icon = item.icon;
						return (
							<button
								key={item.path}
								onClick={() => navigate(item.path)}
								className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 ${
									isActive(item.path)
										? "bg-white/40 backdrop-blur-md text-gray-800 hover:scale-110 transition-transform shadow-lg border border-white/50"
										: "hover:bg-white/20 text-gray-700 hover:text-gray-900 hover:scale-110 backdrop-blur-sm"
								}`}
								title={item.label}
							>
								<Icon className="w-6 h-6" />
							</button>
						);
					})}
				</div>

				{/* Bottom Actions */}
				<div className="flex flex-col space-y-4">
					<button
						onClick={() => navigate("/student/settings")}
						className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/20 text-gray-700 hover:text-gray-900 hover:scale-110 transition-all duration-300 backdrop-blur-sm"
						title="Settings"
					>
						<Settings className="w-6 h-6" />
					</button>
					<button
						onClick={logout}
						className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/30 text-gray-700 hover:text-red-600 hover:scale-110 transition-all duration-300 backdrop-blur-sm"
						title="Logout"
					>
						<LogOut className="w-6 h-6" />
					</button>
				</div>
			</div>

			{/* Mobile Bottom Navbar - Visible only on mobile */}
			<div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-r from-[#99B69B] via-[#E4E3D3] to-[#7976B6] backdrop-blur-xl border-t border-white/20 shadow-2xl">
				<div className="flex items-center justify-around px-2 py-3">
					{menuItems.map((item) => {
						const Icon = item.icon;
						return (
							<button
								key={item.path}
								onClick={() => navigate(item.path)}
								className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-300 ${
									isActive(item.path)
										? "bg-white/40 backdrop-blur-md text-gray-800 shadow-lg scale-105 border border-white/50"
										: "text-gray-700 hover:bg-white/20 hover:text-gray-900"
								}`}
							>
								<Icon className="w-5 h-5 mb-1" />
								<span className="text-[10px] font-medium truncate max-w-[60px]">
									{item.label}
								</span>
							</button>
						);
					})}
					<button
						onClick={logout}
						className="flex flex-col items-center justify-center px-3 py-2 rounded-xl text-gray-700 hover:bg-white/20 hover:text-red-600 transition-all duration-300"
					>
						<LogOut className="w-5 h-5 mb-1" />
						<span className="text-[10px] font-medium">Logout</span>
					</button>
				</div>
			</div>
		</>
	);
};

export default StudentSidebar;
