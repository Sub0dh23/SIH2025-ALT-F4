import { useState } from "react";
import Navigation from "./Navigation";
import Dashboard from "./Dashboard";
import ClassConfiguration from "./ClassConfiguration";
import TeacherConfiguration from "./TeacherConfiguration";
import Schedule from "./Schedule";
import PlaceholderPage from "./PlaceholderPage";
import { useAuth } from "@/auth/AuthContext";
import { useConfig } from "@/context/ConfigContext";

const Layout = () => {
	const [activeTab, setActiveTab] = useState("dashboard");
	const { user } = useAuth();
	const { isClassConfigured, markClassConfigured, resetClassConfigured } =
		useConfig();

	const renderContent = () => {
		switch (activeTab) {
			case "dashboard":
				return <Dashboard />;
			case "class-config":
				if (user?.role !== "hod") {
					return (
						<PlaceholderPage
							title="Access Restricted"
							description="Only HOD can access Class Configuration."
						/>
					);
				}
				return (
					<div className="space-y-4">
						<ClassConfiguration />
						<div className="flex items-center gap-3">
							<span className="text-sm text-muted-foreground">
								Status: {isClassConfigured ? "Completed" : "Not Completed"}
							</span>
							<button
								onClick={markClassConfigured}
								disabled={isClassConfigured}
								className={`px-4 py-2 rounded-md ${
									isClassConfigured
										? "bg-secondary text-secondary-foreground opacity-60 cursor-not-allowed"
										: "bg-primary text-primary-foreground"
								}`}
							>
								Mark Completed
							</button>
							<button
								onClick={resetClassConfigured}
								disabled={!isClassConfigured}
								className={`px-4 py-2 rounded-md ${
									!isClassConfigured
										? "bg-secondary text-secondary-foreground opacity-60 cursor-not-allowed"
										: "bg-destructive text-destructive-foreground"
								}`}
							>
								Deactivate
							</button>
						</div>
					</div>
				);
			case "teacher-config":
				if (user?.role !== "timetable_coordinator") {
					return (
						<PlaceholderPage
							title="Access Restricted"
							description="Only Timetable Coordinator can access Teacher Configuration."
						/>
					);
				}
				if (!isClassConfigured) {
					return (
						<PlaceholderPage
							title="Waiting for HOD"
							description="Teacher Configuration will be available after HOD completes Class Configuration."
						/>
					);
				}
				return <TeacherConfiguration />;
			case "schedule":
				return <Schedule />;
			case "leave-data":
				return (
					<PlaceholderPage
						title="Leave List and Data"
						description="Track and manage leave requests, staff availability, and generate reports for administrative purposes."
					/>
				);
			default:
				return <Dashboard />;
		}
	};

	return (
		<div className="min-h-screen bg-background">
			<Navigation activeTab={activeTab} onTabChange={setActiveTab} />
			<main className="p-6 max-w-7xl mx-auto animate-fade-in">
				{renderContent()}
			</main>
		</div>
	);
};

export default Layout;