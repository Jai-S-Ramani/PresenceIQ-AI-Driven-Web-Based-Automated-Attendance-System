import React, { createContext, useState, useContext, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return context;
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		checkAuth();
	}, []);

	const checkAuth = async () => {
		try {
			const token = localStorage.getItem("token");
			if (token) {
				const response = await authAPI.getCurrentUser();
				setUser(response.data);
			}
		} catch (error) {
			localStorage.removeItem("token");
		} finally {
			setLoading(false);
		}
	};

	const login = async (credentials) => {
		const response = await authAPI.login(credentials);
		const { tokens, user } = response.data; // Fixed: backend returns 'tokens' not 'token'
		localStorage.setItem("token", tokens.access); // Store access token
		setUser(user);
		return user;
	};

	const logout = async () => {
		try {
			await authAPI.logout();
		} finally {
			localStorage.removeItem("token");
			setUser(null);
		}
	};

	return (
		<AuthContext.Provider value={{ user, loading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
