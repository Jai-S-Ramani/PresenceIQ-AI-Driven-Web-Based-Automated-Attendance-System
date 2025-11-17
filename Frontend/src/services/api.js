import axios from "axios";

// ===========================================
// API CONFIGURATION FOR FULL-STACK INTEGRATION
// ===========================================

const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Create axios instance with default configuration
const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true, // Important for session-based auth
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Unauthorized - clear token and redirect to login
			localStorage.removeItem("token");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	}
);

// ===========================================
// AUTHENTICATION API
// ===========================================

export const authAPI = {
	login: (credentials) => apiClient.post("/api/auth/login/", credentials),
	logout: () => apiClient.post("/api/auth/logout/"),
	getCurrentUser: () => apiClient.get("/api/auth/user/"),
	register: (userData) => apiClient.post("/api/auth/register/", userData),
};

// ===========================================
// ADMIN API
// ===========================================

export const adminAPI = {
	// Dashboard
	getDashboard: () => apiClient.get("/api/admin/dashboard/"),

	// User Management
	getUsers: (params) => apiClient.get("/api/users/", { params }),
	getUser: (id) => apiClient.get(`/api/users/${id}/`),
	createUser: (data) => apiClient.post("/api/users/", data),
	updateUser: (id, data) => apiClient.put(`/api/users/${id}/`, data),
	deleteUser: (id) => apiClient.delete(`/api/users/${id}/`),

	// Class Management
	getClasses: () => apiClient.get("/api/classes/"),
	getClass: (id) => apiClient.get(`/api/classes/${id}/`),
	addClass: (data) => apiClient.post("/api/classes/", data),
	updateClass: (id, data) => apiClient.put(`/api/classes/${id}/`, data),
	deleteClass: (id) => apiClient.delete(`/api/classes/${id}/`),

	// Subject Management
	getSubjects: () => apiClient.get("/api/subjects/"),
	getSubject: (id) => apiClient.get(`/api/subjects/${id}/`),
	addSubject: (data) => apiClient.post("/api/subjects/", data),
	updateSubject: (id, data) => apiClient.put(`/api/subjects/${id}/`, data),
	deleteSubject: (id) => apiClient.delete(`/api/subjects/${id}/`),

	// Analytics
	getAnalytics: (params) =>
		apiClient.get("/api/admin/analytics/", { params }),
	getAttendanceReport: (params) =>
		apiClient.get("/api/admin/attendance-report/", { params }),
};

// ===========================================
// TEACHER API
// ===========================================

export const teacherAPI = {
	// Dashboard
	getDashboard: () => apiClient.get("/api/teacher/dashboard/"),

	// Timetable
	getTimetable: (params) =>
		apiClient.get("/api/teacher/timetable/", { params }),
	updateTimetable: (id, data) =>
		apiClient.put(`/api/teacher/timetable/${id}/`, data),

	// Attendance
	markAttendance: (data) => apiClient.post("/api/attendance/", data),
	getAttendanceByClass: (classId, params) =>
		apiClient.get(`/api/attendance/class/${classId}/`, { params }),
	updateAttendance: (id, data) =>
		apiClient.put(`/api/attendance/${id}/`, data),

	// Classes
	getMyClasses: () => apiClient.get("/api/teacher/classes/"),
	getClassDetails: (id) => apiClient.get(`/api/teacher/classes/${id}/`),

	// Analytics
	getAnalytics: (params) =>
		apiClient.get("/api/teacher/analytics/", { params }),
	getClassAnalytics: (classId, params) =>
		apiClient.get(`/api/teacher/analytics/class/${classId}/`, { params }),
};

// ===========================================
// STUDENT API
// ===========================================

export const studentAPI = {
	// Dashboard
	getDashboard: () => apiClient.get("/api/student/dashboard/"),

	// Attendance
	getMyAttendance: (params) =>
		apiClient.get("/api/student/attendance/", { params }),
	getAttendanceBySubject: (subjectId) =>
		apiClient.get(`/api/student/attendance/subject/${subjectId}/`),

	// Timetable
	getTimetable: (params) =>
		apiClient.get("/api/student/timetable/", { params }),

	// Analytics
	getAnalytics: () => apiClient.get("/api/student/analytics/"),
	getSubjectWiseAnalytics: () =>
		apiClient.get("/api/student/analytics/subjects/"),
};

// ===========================================
// COMMON APIs (Shared across roles)
// ===========================================

export const commonAPI = {
	// Students
	getStudents: (params) => apiClient.get("/api/students/", { params }),
	getStudent: (id) => apiClient.get(`/api/students/${id}/`),

	// Courses
	getCourses: (params) => apiClient.get("/api/courses/", { params }),
	getCourse: (id) => apiClient.get(`/api/courses/${id}/`),

	// Attendance Records
	getAttendanceRecords: (params) =>
		apiClient.get("/api/attendance/", { params }),
	getAttendanceRecord: (id) => apiClient.get(`/api/attendance/${id}/`),
	getAttendanceSummary: () => apiClient.get("/api/attendance/summary/"),
};

// ===========================================
// FACE RECOGNITION API (AI Features)
// ===========================================

export const faceRecognitionAPI = {
	// Upload and register face
	registerFace: (formData) =>
		apiClient.post("/api/face-recognition/register/", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		}),

	// Mark attendance via face recognition
	markAttendanceByFace: (formData) =>
		apiClient.post("/api/face-recognition/mark-attendance/", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		}),

	// Verify face
	verifyFace: (formData) =>
		apiClient.post("/api/face-recognition/verify/", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		}),
};

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

// Test backend connection
export const testConnection = async () => {
	try {
		const response = await apiClient.get("/");
		return { success: true, data: response.data };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

// Health check
export const healthCheck = async () => {
	try {
		const response = await apiClient.get("/api/health/");
		return response.data;
	} catch (error) {
		throw error;
	}
};

// Export axios instance for custom requests
export { apiClient };

// Default export
export default {
	authAPI,
	adminAPI,
	teacherAPI,
	studentAPI,
	commonAPI,
	faceRecognitionAPI,
	testConnection,
	healthCheck,
};
