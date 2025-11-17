import React from "react";
import { FiInbox } from "react-icons/fi";

/**
 * EmptyState Component
 *
 * Beautiful empty state display for lists/tables
 * Features: Icon, message, optional action button
 *
 * @param {ReactNode} icon - Icon component (default: FiInbox)
 * @param {string} title - Main message
 * @param {string} description - Optional description
 * @param {ReactNode} action - Optional action button
 */
const EmptyState = ({
	icon: Icon = FiInbox,
	title = "No data available",
	description = "",
	action,
}) => {
	return (
		<div className="flex flex-col items-center justify-center py-12 px-4 text-center">
			{/* Icon */}
			<div className="mb-4 p-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
				<Icon className="w-12 h-12 text-gray-400" />
			</div>

			{/* Title */}
			<h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>

			{/* Description */}
			{description && (
				<p className="text-gray-600 mb-6 max-w-md">{description}</p>
			)}

			{/* Action */}
			{action && <div>{action}</div>}
		</div>
	);
};

export default EmptyState;
