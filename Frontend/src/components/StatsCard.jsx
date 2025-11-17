import React from "react";

/**
 * StatsCard Component
 *
 * Beautiful glassmorphism card for displaying statistics
 * Features: Icon, value, label, trend indicator, gradient background
 *
 * @param {ReactNode} icon - Icon component (from react-icons)
 * @param {string|number} value - Main statistic value
 * @param {string} label - Description label
 * @param {string} trend - Trend percentage (e.g., "+12%" or "-5%")
 * @param {string} gradientFrom - Tailwind gradient start color (e.g., "blue-400")
 * @param {string} gradientTo - Tailwind gradient end color (e.g., "purple-500")
 * @param {string} delay - Animation delay class (e.g., "animation-delay-100")
 */
const StatsCard = ({
	icon: Icon,
	value,
	label,
	trend,
	gradientFrom = "blue-400",
	gradientTo = "purple-500",
	delay = "",
}) => {
	// Determine trend color
	const trendColor = trend?.startsWith("+")
		? "text-green-500"
		: trend?.startsWith("-")
		? "text-red-500"
		: "text-gray-500";

	return (
		<div
			className={`bg-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl hover:bg-white/30 transition-all duration-300 hover:-translate-y-1 ${delay} animate-slideUp`}
		>
			<div className="flex items-center justify-between mb-4">
				<div
					className={`p-3 rounded-xl bg-gradient-to-br from-[#a3b18a] to-[#588157] shadow-lg`}
				>
					{Icon && <Icon className="w-6 h-6 text-black" />}
				</div>
				{trend && (
					<span className={`${trendColor} text-sm font-bold`}>
						{trend}
					</span>
				)}
			</div>
			<h3 className="text-3xl font-bold text-black mb-1">
				{value || "0"}
			</h3>
			<p className="text-black text-sm">{label}</p>
		</div>
	);
};

export default StatsCard;
