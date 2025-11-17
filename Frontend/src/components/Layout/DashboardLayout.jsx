import React from "react";
import Navbar from "../Navbar";

/**
 * DashboardLayout Component
 *
 * Wraps all dashboard pages with the beautiful Navbar
 * Provides consistent layout across all protected pages
 * Includes proper spacing to account for fixed navbar
 */
const DashboardLayout = ({ children }) => {
	return (
		<div
			className="min-h-screen relative overflow-hidden"
			style={{
				background:
					"linear-gradient(to bottom right, #99B69B, #E4E3D3, #7976B6)",
			}}
		>
			{/* Animated Background Elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{/* Floating Orbs with custom colors */}
				<div
					className="absolute top-20 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"
					style={{ backgroundColor: "#99B69B" }}
				></div>
				<div
					className="absolute top-40 right-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"
					style={{ backgroundColor: "#7976B6" }}
				></div>
				<div
					className="absolute -bottom-8 left-40 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"
					style={{ backgroundColor: "#E4E3D3" }}
				></div>

				{/* Grid Pattern */}
				<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-20"></div>
			</div>

			{/* Navbar - positioned above the background */}
			<div className="relative z-20">
				<Navbar />
			</div>

			{/* Main Content - Add padding-top to account for fixed navbar */}
			<main className="relative z-10 pt-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">{children}</div>
			</main>
		</div>
	);
};

export default DashboardLayout;
