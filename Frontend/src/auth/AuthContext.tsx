import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type UserRole = "hod" | "timetable_coordinator";

interface AuthUser {
	role: UserRole;
	email: string;
}

interface AuthContextValue {
	user: AuthUser | null;
	isAuthenticated: boolean;
	login: (params: { role: UserRole; email: string; password: string }) => Promise<boolean>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const LOCAL_STORAGE_KEY = "acad_planner_auth_user";

const HARD_CODED_CREDENTIALS: Record<UserRole, { email: string; password: string }[]> = {
	hod: [
		{ email: "hod@example.com", password: "hod12345" },
	],
	timetable_coordinator: [
		{ email: "coordinator@example.com", password: "coord12345" },
	],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<AuthUser | null>(null);

	useEffect(() => {
		try {
			const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw) as AuthUser;
				setUser(parsed);
			}
		} catch {}
	}, []);

	useEffect(() => {
		if (user) {
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
		} else {
			localStorage.removeItem(LOCAL_STORAGE_KEY);
		}
	}, [user]);

	const login = useCallback(async ({ role, email, password }: { role: UserRole; email: string; password: string }) => {
		const validList = HARD_CODED_CREDENTIALS[role] || [];
		const isValid = validList.some((c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password);
		if (isValid) {
			setUser({ role, email });
			return true;
		}
		return false;
	}, []);

	const logout = useCallback(() => {
		setUser(null);
	}, []);

	const value = useMemo<AuthContextValue>(() => ({
		user,
		isAuthenticated: Boolean(user),
		login,
		logout,
	}), [user, login, logout]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return ctx;
}

export function requireRole(user: AuthUser | null, allowed: UserRole[]): boolean {
	if (!user) return false;
	return allowed.includes(user.role);
}


