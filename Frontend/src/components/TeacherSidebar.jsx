import React from "react";
import {
	Home,
	Calendar,
	BarChart3,
	Users,
	Settings,
	LogOut,
	BookOpen,
	UserCheck,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TeacherSidebar = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { logout } = useAuth();

	const isActive = (path) => location.pathname === path;

	const menuItems = [
		{ path: "/teacher/dashboard", icon: Home, label: "Dashboard" },
		{ path: "/teacher/classes", icon: BookOpen, label: "Classes" },
		{ path: "/teacher/students", icon: UserCheck, label: "Students" },
		{ path: "/teacher/timetable", icon: Calendar, label: "Timetable" },
		{ path: "/teacher/analytics", icon: BarChart3, label: "Analytics" },
		{
			path: "/teacher/markattendance",
			icon: Users,
			label: "Mark Attendance",
		},
	];

	return (
		<>
			{/* Desktop Sidebar - Hidden on mobile */}
			<div
				className="hidden md:fixed md:flex left-0 top-0 z-30 w-20 h-screen backdrop-blur-xl border-r border-white/20 flex-col items-center py-6 space-y-8 shadow-2xl"
				style={{ backgroundColor: "#a3b18a" }}
			>
				{/* Logo */}
				<div className="w-12 h-12 bg-gradient-to-br from-[#a3b18a] to-[#588157] rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer">
					<span className="text-black text-xl font-bold">🎓</span>
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
										? "bg-gradient-to-br from-[#a3b18a] to-[#588157] text-black hover:scale-110 transition-transform shadow-lg"
										: "hover:bg-white/10 text-black hover:text-black hover:scale-110"
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
						className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/10 text-black hover:text-black hover:scale-110 transition-all duration-300"
						title="Settings"
					>
						<Settings className="w-6 h-6" />
					</button>
					<button
						onClick={logout}
						className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-gradient-to-br hover:from-[#a3b18a] hover:to-[#588157] text-black hover:text-black hover:scale-110 transition-all duration-300"
						title="Logout"
					>
						<LogOut className="w-6 h-6" />
					</button>
				</div>
			</div>

			{/* Mobile Bottom Navbar - Visible only on mobile */}
			<div
				className="md:hidden fixed bottom-0 left-0 right-0 z-30 backdrop-blur-xl border-t border-white/20 shadow-2xl"
				style={{ backgroundColor: "#a3b18a" }}
			>
				<div className="flex items-center justify-around px-2 py-3">
					{menuItems.map((item) => {
						const Icon = item.icon;
						return (
							<button
								key={item.path}
								onClick={() => navigate(item.path)}
								className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-300 ${
									isActive(item.path)
										? "bg-gradient-to-br from-[#a3b18a] to-[#588157] text-black shadow-lg scale-105"
										: "text-black hover:bg-white/10"
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
						className="flex flex-col items-center justify-center px-3 py-2 rounded-xl text-black hover:bg-white/10 transition-all duration-300"
					>
						<LogOut className="w-5 h-5 mb-1" />
						<span className="text-[10px] font-medium">Logout</span>
					</button>
				</div>
			</div>
		</>
	);
};

export default TeacherSidebar;
