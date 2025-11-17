import React from "react";
import {
	Home,
	Users,
	BookOpen,
	Calendar,
	BarChart3,
	Settings,
	LogOut,
	GraduationCap,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminSidebar = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { logout } = useAuth();

	const isActive = (path) => location.pathname === path;

	const menuItems = [
		{ path: "/admin/dashboard", icon: Home, label: "Dashboard" },
		{ path: "/admin/users", icon: Users, label: "Faculty" },
		{ path: "/admin/students", icon: GraduationCap, label: "Students" },
		{ path: "/admin/subjects", icon: BookOpen, label: "Subjects" },
		{ path: "/admin/timetable", icon: Calendar, label: "Timetable" },
		{ path: "/admin/analytics", icon: BarChart3, label: "Reports" },
	];

	return (
		<div
			className="fixed left-0 top-0 z-30 w-20 h-screen backdrop-blur-xl border-r border-white/20 flex flex-col items-center py-6 space-y-8 shadow-2xl"
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
	);
};

export default AdminSidebar;
