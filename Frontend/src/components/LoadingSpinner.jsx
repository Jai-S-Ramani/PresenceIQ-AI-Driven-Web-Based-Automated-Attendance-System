import React from "react";

/**
 * LoadingSpinner Component
 *
 * Beautiful animated loading spinner
 * Features: Multiple sizes, gradient colors, optional text
 *
 * @param {string} size - Size variant: "sm", "md", "lg", "xl"
 * @param {string} text - Optional loading text
 * @param {boolean} fullScreen - Show as fullscreen overlay
 */
const LoadingSpinner = ({ size = "md", text = "", fullScreen = false }) => {
	const sizeClasses = {
		sm: "h-6 w-6 border-2",
		md: "h-12 w-12 border-3",
		lg: "h-16 w-16 border-4",
		xl: "h-24 w-24 border-4",
	};

	const spinner = (
		<>
			<div
				className={`animate-spin rounded-full border-t-blue-500 border-r-purple-500 border-b-transparent border-l-transparent ${sizeClasses[size]}`}
			/>
			{text && <p className="text-gray-600 mt-4 animate-pulse">{text}</p>}
		</>
	);

	if (fullScreen) {
		return (
			<div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
				<div className="text-center">{spinner}</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center p-8">
			{spinner}
		</div>
	);
};

export default LoadingSpinner;
