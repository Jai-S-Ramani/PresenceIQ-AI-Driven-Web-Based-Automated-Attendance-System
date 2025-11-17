import React from "react";

const Button = ({
	children,
	onClick,
	type = "button",
	variant = "primary",
	size = "md",
	icon: Icon,
	disabled = false,
	className = "",
}) => {
	const baseClasses =
		"font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed";

	const variants = {
		primary:
			"bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105",
		secondary:
			"bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-105",
		danger: "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:scale-105",
		outline:
			"bg-white/80 backdrop-blur-sm text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400",
	};

	const sizes = {
		sm: "px-4 py-2 text-sm",
		md: "px-6 py-3 text-base",
		lg: "px-8 py-4 text-lg",
	};

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
		>
			{Icon && <Icon className="w-5 h-5" />}
			{children}
		</button>
	);
};

export default Button;
