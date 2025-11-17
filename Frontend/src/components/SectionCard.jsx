import React from "react";

/**
 * SectionCard Component
 *
 * Beautiful glassmorphism card for sections/content areas
 * Features: Title, children content, optional actions, animations
 *
 * @param {string} title - Section title
 * @param {ReactNode} children - Card content
 * @param {ReactNode} actions - Optional action buttons (top-right)
 * @param {string} className - Additional CSS classes
 * @param {string} delay - Animation delay class
 */
const SectionCard = ({
	title,
	children,
	actions,
	className = "",
	delay = "",
}) => {
	return (
		<div
			className={`bg-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 hover:bg-white/30 transition-all duration-300 ${delay} animate-slideUp ${className}`}
		>
			{/* Header */}
			{(title || actions) && (
				<div className="flex items-center justify-between mb-4 pb-4 border-b border-white/20">
					{title && (
						<h2 className="text-xl font-bold bg-gradient-to-r from-[#a3b18a] to-[#588157] bg-clip-text text-transparent">
							{title}
						</h2>
					)}
					{actions && (
						<div className="flex items-center gap-2">{actions}</div>
					)}
				</div>
			)}

			{/* Content */}
			<div>{children}</div>
		</div>
	);
};

export default SectionCard;
