import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
	FiHome,
	FiUser,
	FiCalendar,
	FiBarChart2,
	FiSettings,
	FiLogOut,
	FiMenu,
	FiX,
	FiBook,
	FiClipboard,
	FiUsers,
	FiGrid,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		// Handle scroll effect
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	const handleLogout = async () => {
		await logout();
		navigate("/login");
	};

	const isActive = (path) => {
		return location.pathname === path;
	};

	// Don't show navbar on login/signup pages
	if (
		location.pathname === "/login" ||
		location.pathname === "/signup" ||
		location.pathname === "/"
	) {
		return null;
	}

	// Role-based navigation links
	const getNavigationLinks = () => {
		if (!user) return [];

		const baseLinks = {
			admin: [
				{ path: "/admin/dashboard", label: "Dashboard", icon: FiHome },
				{ path: "/admin/users", label: "Users", icon: FiUsers },
				{ path: "/admin/classes", label: "Classes", icon: FiBook },
				{ path: "/admin/subjects", label: "Subjects", icon: FiGrid },
				{
					path: "/admin/timetable",
					label: "Timetable",
					icon: FiCalendar,
				},
				{
					path: "/admin/analytics",
					label: "Analytics",
					icon: FiBarChart2,
				},
			],
			teacher: [
				{
					path: "/teacher/dashboard",
					label: "Dashboard",
					icon: FiHome,
				},
				{ path: "/teacher/classes", label: "My Classes", icon: FiBook },
				{
					path: "/teacher/timetable",
					label: "Timetable",
					icon: FiCalendar,
				},
				{
					path: "/teacher/mark-attendance",
					label: "Mark Attendance",
					icon: FiClipboard,
				},
				{
					path: "/teacher/analytics",
					label: "Analytics",
					icon: FiBarChart2,
				},
			],
			student: [
				{
					path: "/student/dashboard",
					label: "Dashboard",
					icon: FiHome,
				},
				{
					path: "/student/timetable",
					label: "Timetable",
					icon: FiCalendar,
				},
				{
					path: "/student/analytics",
					label: "My Attendance",
					icon: FiBarChart2,
				},
			],
		};

		return baseLinks[user.role] || [];
	};

	const navigationLinks = getNavigationLinks();

	// Get dashboard link based on role
	const getDashboardLink = () => {
		if (!user) return "/login";
		return `/${user.role}/dashboard`;
	};

	return (
		<nav
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				isScrolled
					? "bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-500 shadow-xl"
					: "bg-gradient-to-r from-blue-400/95 via-purple-400/95 to-indigo-500/95 backdrop-blur-md shadow-lg"
			}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Brand Logo */}
					<Link
						to={getDashboardLink()}
						className="flex items-center gap-2 group"
					>
						<img
							src="https://cdn-icons-gif.flaticon.com/18173/18173958.gif"
							alt="PresenceIQ Logo"
							className="w-10 h-10 transform group-hover:scale-110 transition-transform duration-200"
						/>
						<span className="text-xl font-bold text-white drop-shadow-lg">
							PresenceIQ
						</span>
					</Link>

					{/* Mobile Menu Button */}
					<button
						onClick={toggleMenu}
						className="md:hidden p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white"
						aria-label="Toggle menu"
					>
						{isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
					</button>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center gap-8">
						<ul className="flex items-center gap-1">
							{navigationLinks.map((link) => {
								const Icon = link.icon;
								return (
									<li key={link.path}>
										<Link
											to={link.path}
											className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
												isActive(link.path)
													? "bg-white/30 text-white font-bold shadow-lg"
													: "text-white/90 hover:bg-white/20 hover:text-white"
											}`}
											onClick={() => setIsOpen(false)}
										>
											<Icon size={18} />
											<span>{link.label}</span>
										</Link>
									</li>
								);
							})}
						</ul>

						{/* User Menu */}
						<div className="flex items-center gap-4">
							{user ? (
								<div className="relative group">
									<button className="flex items-center gap-3 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
										<div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-blue-600 font-bold shadow-lg">
											{user.name
												? user.name
														.charAt(0)
														.toUpperCase()
												: user.email
												? user.email
														.charAt(0)
														.toUpperCase()
												: "U"}
										</div>
										<div className="text-left hidden lg:block">
											<p className="text-sm font-bold text-white drop-shadow">
												{user.name ||
													user.email ||
													"User"}
											</p>
											<p className="text-xs text-white/80 capitalize">
												{user.role || "Student"}
											</p>
										</div>
									</button>
									{/* Dropdown */}
									<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
										<Link
											to={`/${user.role}/settings`}
											className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-blue-600 transition-colors first:rounded-t-lg"
										>
											<FiUser size={18} />
											<span>Profile</span>
										</Link>
										<Link
											to={`/${user.role}/settings`}
											className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-blue-600 transition-colors"
										>
											<FiSettings size={18} />
											<span>Settings</span>
										</Link>
										<button
											onClick={handleLogout}
											className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors last:rounded-b-lg border-t border-gray-100"
										>
											<FiLogOut size={18} />
											<span>Logout</span>
										</button>
									</div>
								</div>
							) : (
								<Link
									to="/login"
									className="px-4 py-2 bg-white/90 text-blue-600 rounded-lg font-bold hover:bg-white transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg"
								>
									Login
								</Link>
							)}
						</div>
					</div>

					{/* Mobile Navigation */}
					<div
						className={`absolute top-16 left-0 right-0 bg-gradient-to-b from-blue-400 to-purple-500 border-t border-white/20 shadow-xl md:hidden transition-all duration-300 ${
							isOpen
								? "max-h-screen opacity-100"
								: "max-h-0 opacity-0 overflow-hidden"
						}`}
					>
						<ul className="py-4 px-4 space-y-2">
							{navigationLinks.map((link) => {
								const Icon = link.icon;
								return (
									<li key={link.path}>
										<Link
											to={link.path}
											className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
												isActive(link.path)
													? "bg-white/30 text-white font-bold"
													: "text-white/90 hover:bg-white/20"
											}`}
											onClick={() => setIsOpen(false)}
										>
											<Icon size={20} />
											<span>{link.label}</span>
										</Link>
									</li>
								);
							})}
							{user && (
								<>
									<li className="border-t border-white/20 pt-2 mt-2">
										<Link
											to={`/${user.role}/settings`}
											className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/90 hover:bg-white/20 transition-all duration-200"
											onClick={() => setIsOpen(false)}
										>
											<FiUser size={20} />
											<span>Profile</span>
										</Link>
									</li>
									<li>
										<Link
											to={`/${user.role}/settings`}
											className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/90 hover:bg-white/20 transition-all duration-200"
											onClick={() => setIsOpen(false)}
										>
											<FiSettings size={20} />
											<span>Settings</span>
										</Link>
									</li>
									<li>
										<button
											onClick={() => {
												handleLogout();
												setIsOpen(false);
											}}
											className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white bg-red-500/80 hover:bg-red-500 transition-all duration-200 font-bold"
										>
											<FiLogOut size={20} />
											<span>Logout</span>
										</button>
									</li>
								</>
							)}
						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
