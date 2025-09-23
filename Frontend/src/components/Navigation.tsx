import { useState } from "react";
import { cn } from "@/lib/utils";
// import Login from "./Login";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

interface NavigationProps {
	activeTab: string;
	onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
	const { isAuthenticated, user, logout } = useAuth();
	const navigate = useNavigate();
	const navItems = [
		{ id: "dashboard", label: "Dashboard" },
		// HOD only
		...(user?.role === "hod" ? [{ id: "class-config", label: "Class Configuration" }] : []),
		// Coordinator only
		...(user?.role === "timetable_coordinator" ? [{ id: "teacher-config", label: "Teacher Configuration" }] : []),
		{ id: "schedule", label: "Schedule" },
		{ id: "leave-data", label: "Leave List and Data" },
		// { id: "login/", label: "Login" },
	];

	return (
		<nav className="bg-secondary shadow-fm border-b border-border">
			<div className="px-6">
				<div className="flex items-center justify-between h-[60px]">
					{/* Logo/Title */}
					<div className="flex items-center space-x-4">
						<h1 className="text-xl font-bold text-secondary-foreground">
							Smart Classroom Scheduler
						</h1>
					</div>

					{/* Navigation Items */}
					<div className="flex space-x-1">
						{navItems.map((item) => (
							<button
								key={item.id}
								onClick={() => onTabChange(item.id)}
								className={cn(
									"px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
									"hover:bg-secondary-foreground/10",
									activeTab === item.id
										? "bg-primary text-primary-foreground shadow-fm"
										: "text-secondary-foreground hover:text-secondary-foreground"
								)}
							>
								{item.label}
							</button>
						))}
						{!isAuthenticated ? (
							<Link to="/login" className="px-3 py-2 text-sm">Login</Link>
						) : (
							<div className="flex items-center space-x-2">
								<span className="text-sm text-secondary-foreground/80 capitalize">{user?.role.replace("_", " ")}</span>
								<button
									className="px-3 py-2 text-sm rounded-md hover:bg-secondary-foreground/10"
									onClick={() => {
										logout();
										navigate("/login", { replace: true });
									}}
								>
									Logout
								</button>
							</div>
						)}
					</div>

					{/* Right side - could add user menu later */}
					<div className="w-8" />
				</div>
			</div>
		</nav>
	);
};

export default Navigation;