import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScheduleDashboard from "./ScheduleDashboard";
import AssignTeachers from "./AssignTeachers";
import GenerateTimetable from "./GenerateTimetable";

const Schedule = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Schedule Management</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-secondary/20">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Schedule Dashboard
          </TabsTrigger>
          <TabsTrigger value="assign" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Assign Teachers
          </TabsTrigger>
          <TabsTrigger value="generate" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Generate Timetable
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <ScheduleDashboard />
        </TabsContent>

        <TabsContent value="assign" className="mt-6">
          <AssignTeachers />
        </TabsContent>

        <TabsContent value="generate" className="mt-6">
          <GenerateTimetable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Schedule;