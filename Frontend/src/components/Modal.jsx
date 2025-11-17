import React from "react";
import { FiX } from "react-icons/fi";

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
	if (!isOpen) return null;

	const sizeClasses = {
		sm: "max-w-md",
		md: "max-w-2xl",
		lg: "max-w-4xl",
		xl: "max-w-6xl",
	};

	return (
		<div className="fixed inset-0 z-50 overflow-y-auto">
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fadeIn"
				onClick={onClose}
			/>

			{/* Modal */}
			<div className="flex min-h-full items-center justify-center p-4">
				<div
					className={`relative w-full ${sizeClasses[size]} bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 animate-slideUp`}
					onClick={(e) => e.stopPropagation()}
				>
					{/* Header */}
					<div className="flex items-center justify-between p-6 border-b border-gray-200/50">
						<h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							{title}
						</h3>
						<button
							onClick={onClose}
							className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:rotate-90"
						>
							<FiX className="w-6 h-6 text-gray-500" />
						</button>
					</div>

					{/* Content */}
					<div className="p-6">{children}</div>
				</div>
			</div>
		</div>
	);
};

export default Modal;
