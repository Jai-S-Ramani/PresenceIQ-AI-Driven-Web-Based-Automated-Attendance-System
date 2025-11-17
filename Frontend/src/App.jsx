import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Import pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Admin pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserManagement from "./pages/Admin/UserManagement";
import StudentManagement from "./pages/Admin/StudentManagement";
import RegisterStudent from "./pages/Admin/RegisterStudent";
import ClassManagement from "./pages/Admin/ClassManagement";
import SubjectManagement from "./pages/Admin/SubjectManagement";
import TimetableManagement from "./pages/Admin/TimetableManagement";
import AdminAnalytics from "./pages/Admin/Analytics";
import AdminSettings from "./pages/Admin/Settings";

// Teacher pages
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import TeacherTimetable from "./pages/Teacher/Timetable";
import TeacherAnalytics from "./pages/Teacher/TeacherAnalytics";
import TeacherClasses from "./pages/Teacher/Classes";
import TeacherSettings from "./pages/Teacher/Settings";
import MarkAttendance from "./pages/Teacher/MarkAttendance";
import ClassDetails from "./pages/Teacher/ClassDetails";
import StudentDetails from "./pages/Teacher/StudentDetails";
import StudentList from "./pages/Teacher/StudentList";

// Student pages
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentTimetable from "./pages/Student/StudentTimetable";
import StudentAnalytics from "./pages/Student/StudentAnalytics";
import StudentSettings from "./pages/Student/Settings";
import StudentProfile from "./pages/Student/Profile";

function App() {
	return (
		<AuthProvider>
			<Router
				future={{
					v7_startTransition: true,
					v7_relativeSplatPath: true,
				}}
			>
				<Routes>
					{/* Public Routes */}
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route
						path="/admin/students"
						element={<StudentManagement />}
					/>
					<Route
						path="/admin/students/register"
						element={<RegisterStudent />}
					/>
					<Route
						path="/"
						element={<Navigate to="/login" replace />}
					/>
					{/* Admin Routes - Protected */}
					<Route
						path="/admin/dashboard"
						element={
							<ProtectedRoute allowedRoles={["admin"]}>
								<AdminDashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/users"
						element={
							<ProtectedRoute allowedRoles={["admin"]}>
								<UserManagement />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/subjects"
						element={
							<ProtectedRoute allowedRoles={["admin"]}>
								<SubjectManagement />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/timetable"
						element={
							<ProtectedRoute allowedRoles={["admin"]}>
								<TimetableManagement />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/analytics"
						element={
							<ProtectedRoute allowedRoles={["admin"]}>
								<AdminAnalytics />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/settings"
						element={
							<ProtectedRoute allowedRoles={["admin"]}>
								<AdminSettings />
							</ProtectedRoute>
						}
					/>
					{/* Teacher Routes - Protected */}
					<Route
						path="/teacher/dashboard"
						element={
							<ProtectedRoute allowedRoles={["teacher"]}>
								<TeacherDashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/teacher/classes"
						element={
							<ProtectedRoute allowedRoles={["teacher"]}>
								<TeacherClasses />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/teacher/timetable"
						element={
							<ProtectedRoute allowedRoles={["teacher"]}>
								<TeacherTimetable />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/teacher/class/:classId"
						element={
							<ProtectedRoute allowedRoles={["teacher"]}>
								<ClassDetails />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/teacher/attendance/:classId"
						element={
							<ProtectedRoute allowedRoles={["teacher"]}>
								<MarkAttendance />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/teacher/analytics"
						element={
							<ProtectedRoute allowedRoles={["teacher"]}>
								<TeacherAnalytics />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/teacher/settings"
						element={
							<ProtectedRoute allowedRoles={["teacher"]}>
								<TeacherSettings />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/teacher/student/:studentId"
						element={
							<ProtectedRoute allowedRoles={["teacher"]}>
								<StudentDetails />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/teacher/students"
						element={
							<ProtectedRoute allowedRoles={["teacher"]}>
								<StudentList />
							</ProtectedRoute>
						}
					/>{" "}
					{/* Student Routes - Protected */}
					<Route
						path="/student/dashboard"
						element={
							<ProtectedRoute allowedRoles={["student"]}>
								<StudentDashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/student/timetable"
						element={
							<ProtectedRoute allowedRoles={["student"]}>
								<StudentTimetable />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/student/analytics"
						element={
							<ProtectedRoute allowedRoles={["student"]}>
								<StudentAnalytics />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/student/settings"
						element={
							<ProtectedRoute allowedRoles={["student"]}>
								<StudentSettings />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/student/profile"
						element={
							<ProtectedRoute allowedRoles={["student"]}>
								<StudentProfile />
							</ProtectedRoute>
						}
					/>
					{/* Fallback Route */}
					<Route
						path="*"
						element={<Navigate to="/login" replace />}
					/>
				</Routes>
			</Router>
		</AuthProvider>
	);
}

export default App;
