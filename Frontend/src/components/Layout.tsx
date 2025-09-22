import { useState } from "react";
import Navigation from "./Navigation";
import Dashboard from "./Dashboard";
import ClassConfiguration from "./ClassConfiguration";
import TeacherConfiguration from "./TeacherConfiguration";
import Schedule from "./Schedule";
import PlaceholderPage from "./PlaceholderPage";

const Layout = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "class-config":
        return <ClassConfiguration />;
      case "teacher-config":
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