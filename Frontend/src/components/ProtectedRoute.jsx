import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute Component
 *
 * Protects routes from unauthorized access and enforces role-based access control.
 *
 * @param {React.ReactNode} children - The component to render if authorized
 * @param {string[]} allowedRoles - Array of roles allowed to access this route (e.g., ['admin', 'teacher'])
 *
 * Usage:
 * <ProtectedRoute allowedRoles={['admin']}>
 *   <AdminDashboard />
 * </ProtectedRoute>
 */
export const ProtectedRoute = ({ children, allowedRoles }) => {
	const { user, loading } = useAuth();

	// Show loading state while checking authentication
	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	// Redirect to login if not authenticated
	if (!user) {
		return <Navigate to="/login" replace />;
	}

	// Check if user has required role
	if (allowedRoles && !allowedRoles.includes(user.role)) {
		// Redirect to their appropriate dashboard
		const roleRedirects = {
			admin: "/admin/dashboard",
			teacher: "/teacher/dashboard",
			student: "/student/dashboard",
		};
		return <Navigate to={roleRedirects[user.role] || "/login"} replace />;
	}

	// User is authenticated and has correct role
	return children;
};

export default ProtectedRoute;
