import React, { useState, useEffect } from "react";
import {
	FiPlus,
	FiEdit,
	FiTrash2,
	FiSearch,
	FiFilter,
	FiUsers,
	FiMail,
	FiUser,
	FiLock,
	FiKey,
	FiCopy,
	FiCheck,
	FiEye,
	FiEyeOff,
	FiSend,
} from "react-icons/fi";
import AdminLayout from "../../components/Layout/AdminLayout";
import SectionCard from "../../components/SectionCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { adminAPI } from "../../services/api";

const UserManagement = () => {
	const [faculties, setFaculties] = useState([
		{
			id: 423,
			facultyId: "423",
			name: "Arlene McCoy",
			email: "debbie.baker@example.com",
			department: "Computer Science",
		},
		{
			id: 946,
			facultyId: "946",
			name: "Marvin McKinney",
			email: "deanna.curtis@example.com",
			department: "Computer Science",
		},
		{
			id: 394,
			facultyId: "394",
			name: "Savannah Nguyen",
			email: "tim.jennings@example.com",
			department: "Computer Science",
		},
		{
			id: 426,
			facultyId: "426",
			name: "Robert Fox",
			email: "bill.sanders@example.com",
			department: "Computer Science",
		},
		{
			id: 647,
			facultyId: "647",
			name: "Dianne Russell",
			email: "jackson.graham@example.com",
			department: "Computer Science",
		},
		{
			id: 274,
			facultyId: "274",
			name: "Albert Flores",
			email: "dolores.chambers@example.com",
			department: "Computer Science",
		},
		{
			id: 135,
			facultyId: "135",
			name: "Jane Cooper",
			email: "tanya.hill@example.com",
			department: "Computer Science",
		},
		{
			id: 453,
			facultyId: "453",
			name: "Ralph Edwards",
			email: "alma.lawson@example.com",
			department: "Computer Science",
		},
		{
			id: 556,
			facultyId: "556",
			name: "Annette Black",
			email: "jessica.hanson@example.com",
			department: "Computer Science",
		},
		{
			id: 429,
			facultyId: "429",
			name: "Courtney Henry",
			email: "nathan.roberts@example.com",
			department: "Computer Science",
		},
		{
			id: 561,
			facultyId: "561",
			name: "Ronald Richards",
			email: "kenzi.lawson@example.com",
			department: "Computer Science",
		},
		{
			id: 492,
			facultyId: "492",
			name: "Wade Warren",
			email: "michelle.rivera@example.com",
			department: "Computer Science",
		},
		{
			id: 825,
			facultyId: "825",
			name: "Darrell Steward",
			email: "curtis.weaver@example.com",
			department: "Computer Science",
		},
		{
			id: 600,
			facultyId: "600",
			name: "Darlene Robertson",
			email: "sara.cruz@example.com",
			department: "Computer Science",
		},
	]);

	const [loading, setLoading] = useState(false);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showCredentialsModal, setShowCredentialsModal] = useState(false);
	const [editingUser, setEditingUser] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterRole, setFilterRole] = useState("all");
	const [generatedCredentials, setGeneratedCredentials] = useState(null);
	const [copiedField, setCopiedField] = useState(null);
	const [showPassword, setShowPassword] = useState(false);
	const [emailSending, setEmailSending] = useState(false);
	const [emailSent, setEmailSent] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		department: "Computer Science",
		phone: "",
		qualification: "",
		subjects: "",
	});

	useEffect(() => {
		fetchFaculties();
	}, []);

	const fetchFaculties = async () => {
		try {
			setLoading(true);
			const response = await adminAPI.getUsers();
			if (response.data) setFaculties(response.data);
		} catch (error) {
			console.error("Failed to fetch faculties:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleAddUser = () => {
		setEditingUser(null);
		setFormData({
			name: "",
			email: "",
			department: "Computer Science",
			phone: "",
			qualification: "",
			subjects: "",
		});
		setShowAddModal(true);
	};

	const handleEditUser = (faculty) => {
		setEditingUser(faculty);
		setFormData({
			name: faculty.name,
			email: faculty.email,
			department: faculty.department,
			phone: faculty.phone || "",
			qualification: faculty.qualification || "",
			subjects: faculty.subjects || "",
		});
		setShowAddModal(true);
	};

	const generatePassword = () => {
		const chars =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";
		let password = "";
		for (let i = 0; i < 10; i++) {
			password += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return password;
	};

	const generateUsername = (name, email) => {
		// Generate username from name or email
		const namePart = name
			.toLowerCase()
			.split(" ")
			.join(".")
			.replace(/[^a-z.]/g, "");
		const randomNum = Math.floor(Math.random() * 999);
		return `${namePart}${randomNum}`;
	};

	const handleSaveUser = () => {
		if (
			!formData.name ||
			!formData.email ||
			!formData.department ||
			!formData.phone
		) {
			alert("Please fill all required fields!");
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			alert("Please enter a valid email address!");
			return;
		}

		if (editingUser) {
			// Update existing user
			setFaculties(
				faculties.map((f) =>
					f.id === editingUser.id ? { ...f, ...formData } : f
				)
			);
			setShowAddModal(false);
			alert("Faculty member updated successfully!");
		} else {
			// Add new user and generate credentials
			const newId = Math.floor(Math.random() * 1000);
			const username = generateUsername(formData.name, formData.email);
			const password = generatePassword();
			const facultyId = `FAC${newId}`;

			const newFaculty = {
				...formData,
				id: newId,
				facultyId: facultyId,
				username: username,
				password: password,
				status: "Active",
			};

			setFaculties([...faculties, newFaculty]);

			// Prepare credentials
			const credentials = {
				name: formData.name,
				email: formData.email,
				facultyId: facultyId,
				username: username,
				password: password,
			};

			// Store credentials for modal
			setGeneratedCredentials(credentials);

			setShowAddModal(false);
			setShowCredentialsModal(true);

			// Automatically send email with credentials
			sendCredentialsEmail(credentials);
		}
		setEditingUser(null);
	};

	const copyToClipboard = (text, field) => {
		navigator.clipboard.writeText(text);
		setCopiedField(field);
		setTimeout(() => setCopiedField(null), 2000);
	};

	const sendCredentialsEmail = async (credentials) => {
		setEmailSending(true);
		setEmailSent(false);

		try {
			// Simulate email sending - In production, this would call your backend API
			// Example: await adminAPI.sendCredentialsEmail(credentials);

			// For demonstration, we'll simulate a delay
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Create email content
			const emailContent = `
Dear ${credentials.name},

Welcome to the Department of Computer Science!

Your account has been successfully created. Below are your login credentials for the PresenceIQ Attendance System:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LOGIN CREDENTIALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Faculty ID: ${credentials.facultyId}
Username:   ${credentials.username}
Password:   ${credentials.password}

Portal URL: http://localhost:5175/login

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT SECURITY NOTICE:
⚠️ Please change your password immediately after your first login.
⚠️ Do not share your credentials with anyone.
⚠️ Keep your password secure and confidential.

If you have any questions or face any issues, please contact the HOD.

Best regards,
Head of Department
Computer Science Department

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an auto-generated email. Please do not reply to this message.
			`;

			console.log("Email sent to:", credentials.email);
			console.log("Email Content:\n", emailContent);

			// In production, you would actually send the email here
			// const response = await fetch('/api/send-email', {
			//   method: 'POST',
			//   headers: { 'Content-Type': 'application/json' },
			//   body: JSON.stringify({
			//     to: credentials.email,
			//     subject: 'Your PresenceIQ Login Credentials',
			//     text: emailContent
			//   })
			// });

			setEmailSent(true);
			setEmailSending(false);
		} catch (error) {
			console.error("Failed to send email:", error);
			setEmailSending(false);
			alert("Failed to send email. Please share credentials manually.");
		}
	};

	const handleDeleteUser = (id) => {
		if (window.confirm("Are you sure you want to delete this user?")) {
			setFaculties(faculties.filter((faculty) => faculty.id !== id));
		}
	};

	// Filter users based on search and role
	const filteredUsers = faculties.filter((faculty) => {
		const matchesSearch =
			faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			faculty.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			faculty.facultyId.includes(searchTerm);
		const matchesRole = filterRole === "all" || faculty.role === filterRole;
		return matchesSearch && matchesRole;
	});

	if (loading) {
		return <LoadingSpinner fullScreen text="Loading users..." />;
	}

	return (
		<AdminLayout>
			{/* Page Header */}
			<div className="mb-8 bg-gradient-to-r from-[#a3b18a] to-[#588157] backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 animate-fadeIn">
				<h1 className="text-4xl font-bold text-black mb-2">
					�‍🏫 Faculty Management
				</h1>
				<p className="text-black">Manage department faculty members</p>
			</div>

			{/* Search and Filter Bar */}
			<SectionCard className="mb-6 animate-slideUp">
				<div className="flex flex-col md:flex-row gap-4">
					{/* Search */}
					<div className="flex-1 relative">
						<FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
						<input
							type="text"
							placeholder="Search by name, email, or ID..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
						/>
					</div>

					{/* Filter */}
					<div className="flex items-center gap-3">
						<FiFilter className="text-gray-500 w-5 h-5" />
						<select
							value={filterRole}
							onChange={(e) => setFilterRole(e.target.value)}
							className="px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
						>
							<option value="all">All Roles</option>
							<option value="teacher">Teachers</option>
							<option value="admin">Admins</option>
							<option value="staff">Staff</option>
						</select>
					</div>

					{/* Add Button */}
					<Button
						variant="primary"
						icon={FiPlus}
						onClick={handleAddUser}
					>
						Add Faculty
					</Button>
				</div>
			</SectionCard>

			{/* Users Table */}
			<SectionCard
				title={`Faculty Members (${filteredUsers.length})`}
				className="animate-slideUp animation-delay-100"
			>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b-2 border-gray-200">
								<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 bg-gradient-to-r from-blue-50 to-purple-50">
									ID
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 bg-gradient-to-r from-blue-50 to-purple-50">
									Name
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 bg-gradient-to-r from-blue-50 to-purple-50">
									Email
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 bg-gradient-to-r from-blue-50 to-purple-50">
									Department
								</th>
								<th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 bg-gradient-to-r from-blue-50 to-purple-50">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{filteredUsers.map((faculty, index) => (
								<tr
									key={faculty.id}
									className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 ${
										index % 2 === 0
											? "bg-white"
											: "bg-gray-50/50"
									}`}
								>
									<td className="px-6 py-4 text-sm font-medium text-gray-900">
										#{faculty.facultyId}
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
												{faculty.name.charAt(0)}
											</div>
											<span className="text-sm font-medium text-gray-900">
												{faculty.name}
											</span>
										</div>
									</td>
									<td className="px-6 py-4 text-sm text-gray-600">
										{faculty.email}
									</td>
									<td className="px-6 py-4">
										<span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-xs font-semibold">
											{faculty.department}
										</span>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center justify-center gap-2">
											<button
												onClick={() =>
													handleEditUser(faculty)
												}
												className="p-2 hover:bg-blue-100 rounded-lg transition-all duration-300 group"
												title="Edit"
											>
												<FiEdit className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
											</button>
											<button
												onClick={() =>
													handleDeleteUser(faculty.id)
												}
												className="p-2 hover:bg-red-100 rounded-lg transition-all duration-300 group"
												title="Delete"
											>
												<FiTrash2 className="w-4 h-4 text-gray-600 group-hover:text-red-600 transition-colors" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					{filteredUsers.length === 0 && (
						<div className="text-center py-12">
							<FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
							<p className="text-gray-500 text-lg">
								No users found
							</p>
							<p className="text-gray-400 text-sm">
								Try adjusting your search or filters
							</p>
						</div>
					)}
				</div>
			</SectionCard>

			{/* Add/Edit User Modal */}
			<Modal
				isOpen={showAddModal}
				onClose={() => setShowAddModal(false)}
				title={
					editingUser
						? "Edit Faculty Member"
						: "Add New Faculty Member"
				}
				size="md"
			>
				<div className="space-y-4">
					<div>
						<label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
							<FiUser className="w-4 h-4" />
							Full Name *
						</label>
						<input
							type="text"
							value={formData.name}
							onChange={(e) =>
								setFormData({
									...formData,
									name: e.target.value,
								})
							}
							className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
							placeholder="Enter full name"
							required
						/>
					</div>

					<div>
						<label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
							<FiMail className="w-4 h-4" />
							Email Address *
						</label>
						<input
							type="email"
							value={formData.email}
							onChange={(e) =>
								setFormData({
									...formData,
									email: e.target.value,
								})
							}
							className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
							placeholder="faculty@college.edu"
							required
						/>
					</div>

					<div>
						<label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
							<FiUser className="w-4 h-4" />
							Phone Number *
						</label>
						<input
							type="tel"
							value={formData.phone}
							onChange={(e) =>
								setFormData({
									...formData,
									phone: e.target.value,
								})
							}
							className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
							placeholder="+91 9876543210"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Department *
						</label>
						<input
							type="text"
							value={formData.department}
							onChange={(e) =>
								setFormData({
									...formData,
									department: e.target.value,
								})
							}
							className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
							placeholder="Computer Science"
							disabled
						/>
					</div>

					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Qualification
						</label>
						<input
							type="text"
							value={formData.qualification}
							onChange={(e) =>
								setFormData({
									...formData,
									qualification: e.target.value,
								})
							}
							className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
							placeholder="M.Sc, Ph.D, B.Tech"
						/>
					</div>

					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Subjects/Specialization
						</label>
						<input
							type="text"
							value={formData.subjects}
							onChange={(e) =>
								setFormData({
									...formData,
									subjects: e.target.value,
								})
							}
							className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
							placeholder="Data Structures, Algorithms"
						/>
					</div>

					{!editingUser && (
						<div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
							<div className="flex items-start gap-3">
								<FiKey className="w-5 h-5 text-blue-600 mt-1" />
								<div>
									<p className="text-sm font-semibold text-blue-900 mb-1">
										Login Credentials
									</p>
									<p className="text-xs text-blue-700">
										Username and password will be
										automatically generated and displayed
										after adding the faculty member.
									</p>
								</div>
							</div>
						</div>
					)}

					<div className="flex gap-3 pt-4">
						<Button
							variant="outline"
							onClick={() => setShowAddModal(false)}
							className="flex-1"
						>
							Cancel
						</Button>
						<Button
							variant="primary"
							onClick={handleSaveUser}
							className="flex-1"
						>
							{editingUser ? "Update Faculty" : "Add Faculty"}
						</Button>
					</div>
				</div>
			</Modal>

			{/* Credentials Display Modal */}
			<Modal
				isOpen={showCredentialsModal}
				onClose={() => {
					setShowCredentialsModal(false);
					setEmailSent(false);
					setEmailSending(false);
				}}
				title="✅ Faculty Added Successfully!"
				size="md"
			>
				{generatedCredentials && (
					<div className="space-y-6">
						<div className="bg-green-50 border border-green-200 rounded-xl p-4">
							<div className="flex items-center gap-3 mb-3">
								<div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
									<FiCheck className="w-6 h-6 text-white" />
								</div>
								<div>
									<h3 className="font-bold text-green-900">
										{generatedCredentials.name}
									</h3>
									<p className="text-sm text-green-700">
										{generatedCredentials.email}
									</p>
								</div>
							</div>
							<p className="text-sm text-green-800">
								Faculty member has been added successfully.
								Login credentials have been generated.
							</p>
						</div>

						{/* Email Status */}
						{emailSending && (
							<div className="bg-blue-50 border border-blue-200 rounded-xl p-4 animate-pulse">
								<div className="flex items-center gap-3">
									<FiSend className="w-5 h-5 text-blue-600 animate-bounce" />
									<div>
										<p className="text-sm font-semibold text-blue-900">
											Sending credentials via email...
										</p>
										<p className="text-xs text-blue-700">
											Please wait while we send the login
											credentials to{" "}
											{generatedCredentials.email}
										</p>
									</div>
								</div>
							</div>
						)}

						{emailSent && (
							<div className="bg-green-50 border border-green-200 rounded-xl p-4">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
										<FiCheck className="w-5 h-5 text-white" />
									</div>
									<div>
										<p className="text-sm font-semibold text-green-900">
											✉️ Email Sent Successfully!
										</p>
										<p className="text-xs text-green-700">
											Login credentials have been sent to{" "}
											<strong>
												{generatedCredentials.email}
											</strong>
										</p>
									</div>
								</div>
							</div>
						)}

						{!emailSending && !emailSent && (
							<div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
								<div className="flex items-center gap-3">
									<FiMail className="w-5 h-5 text-yellow-600" />
									<div>
										<p className="text-sm font-semibold text-yellow-900">
											Email will be sent automatically
										</p>
										<p className="text-xs text-yellow-700">
											Credentials are being sent to{" "}
											{generatedCredentials.email}
										</p>
									</div>
								</div>
							</div>
						)}

						{/* Faculty ID */}
						<div className="bg-white border-2 border-gray-200 rounded-xl p-4">
							<label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
								Faculty ID
							</label>
							<div className="flex items-center justify-between gap-3">
								<span className="text-lg font-bold text-gray-900">
									{generatedCredentials.facultyId}
								</span>
								<button
									onClick={() =>
										copyToClipboard(
											generatedCredentials.facultyId,
											"facultyId"
										)
									}
									className="p-2 hover:bg-gray-100 rounded-lg transition-all"
									title="Copy Faculty ID"
								>
									{copiedField === "facultyId" ? (
										<FiCheck className="w-5 h-5 text-green-600" />
									) : (
										<FiCopy className="w-5 h-5 text-gray-600" />
									)}
								</button>
							</div>
						</div>

						{/* Username */}
						<div className="bg-white border-2 border-gray-200 rounded-xl p-4">
							<label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
								Username
							</label>
							<div className="flex items-center justify-between gap-3">
								<span className="text-lg font-bold text-gray-900">
									{generatedCredentials.username}
								</span>
								<button
									onClick={() =>
										copyToClipboard(
											generatedCredentials.username,
											"username"
										)
									}
									className="p-2 hover:bg-gray-100 rounded-lg transition-all"
									title="Copy Username"
								>
									{copiedField === "username" ? (
										<FiCheck className="w-5 h-5 text-green-600" />
									) : (
										<FiCopy className="w-5 h-5 text-gray-600" />
									)}
								</button>
							</div>
						</div>

						{/* Password */}
						<div className="bg-white border-2 border-gray-200 rounded-xl p-4">
							<label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
								Password
							</label>
							<div className="flex items-center justify-between gap-3">
								<span className="text-lg font-bold text-gray-900 font-mono">
									{showPassword
										? generatedCredentials.password
										: "••••••••••"}
								</span>
								<div className="flex gap-2">
									<button
										onClick={() =>
											setShowPassword(!showPassword)
										}
										className="p-2 hover:bg-gray-100 rounded-lg transition-all"
										title={
											showPassword
												? "Hide Password"
												: "Show Password"
										}
									>
										{showPassword ? (
											<FiEyeOff className="w-5 h-5 text-gray-600" />
										) : (
											<FiEye className="w-5 h-5 text-gray-600" />
										)}
									</button>
									<button
										onClick={() =>
											copyToClipboard(
												generatedCredentials.password,
												"password"
											)
										}
										className="p-2 hover:bg-gray-100 rounded-lg transition-all"
										title="Copy Password"
									>
										{copiedField === "password" ? (
											<FiCheck className="w-5 h-5 text-green-600" />
										) : (
											<FiCopy className="w-5 h-5 text-gray-600" />
										)}
									</button>
								</div>
							</div>
						</div>

						<div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
							<div className="flex items-start gap-3">
								<FiLock className="w-5 h-5 text-amber-600 mt-1" />
								<div>
									<p className="text-sm font-semibold text-amber-900 mb-1">
										Important Security Note
									</p>
									<p className="text-xs text-amber-700">
										The credentials have been automatically
										sent via email. Faculty member should
										change their password after first login.
									</p>
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-3">
							{emailSent && (
								<Button
									variant="outline"
									icon={FiSend}
									onClick={() =>
										sendCredentialsEmail(
											generatedCredentials
										)
									}
									className="flex-1"
									disabled={emailSending}
								>
									Resend Email
								</Button>
							)}
							<Button
								variant="primary"
								onClick={() => {
									setShowCredentialsModal(false);
									setEmailSent(false);
									setEmailSending(false);
								}}
								className="flex-1"
							>
								Done
							</Button>
						</div>
					</div>
				)}
			</Modal>
		</AdminLayout>
	);
};

export default UserManagement;
