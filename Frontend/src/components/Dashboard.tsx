import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, User, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DaySchedule {
  date: Date;
  classes: {
    time: string;
    subject: string;
    teacher: string;
    class: string;
    type: "Lecture" | "Practical";
    room: string;
  }[];
  hasLeave: boolean;
}

const mockScheduleData: DaySchedule[] = [
  {
    date: new Date(2024, 0, 15),
    hasLeave: true,
    classes: [
      { time: "9:00-10:00", subject: "Data Structures", teacher: "Dr. Smith", class: "CS1", type: "Lecture", room: "101" },
      { time: "10:00-11:00", subject: "DBMS Lab", teacher: "Prof. Johnson", class: "CS2", type: "Practical", room: "Lab A" },
      { time: "11:00-12:00", subject: "Algorithms", teacher: "Dr. Brown", class: "CS3", type: "Lecture", room: "102" },
    ]
  },
  {
    date: new Date(2024, 0, 16),
    hasLeave: false,
    classes: [
      { time: "9:00-10:00", subject: "Operating Systems", teacher: "Dr. Wilson", class: "CS2", type: "Lecture", room: "103" },
      { time: "10:00-11:00", subject: "Web Development", teacher: "Prof. Davis", class: "IT1", type: "Practical", room: "Lab B" },
    ]
  }
];

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getScheduleForDate = (date: Date) => {
    return mockScheduleData.find(schedule => 
      schedule.date.toDateString() === date.toDateString()
    );
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const schedule = getScheduleForDate(date);
      if (schedule) {
        setSelectedDate(date);
        setIsDialogOpen(true);
      }
    }
  };

  const selectedSchedule = selectedDate ? getScheduleForDate(selectedDate) : null;

  const renderCustomCalendar = () => {
    const today = new Date();
    const currentDate = selectedDate || today;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());
    
    const endDate = new Date(lastDayOfMonth);
    endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()));

    const days = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    const navigateMonth = (direction: 'prev' | 'next') => {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + (direction === 'prev' ? -1 : 1));
      setSelectedDate(newDate);
    };

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (
      <div className="w-full">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6 px-4">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-semibold">
              {monthNames[month]} {year}
            </h3>
            <div className="text-sm text-muted-foreground">
              {format(firstDayOfMonth, "MMM d")} — {format(lastDayOfMonth, "MMM d, yyyy")}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-accent rounded-md transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setSelectedDate(today)}
              className="px-3 py-1 text-sm hover:bg-accent rounded-md transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-accent rounded-md transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="border border-border rounded-lg overflow-hidden bg-background">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {dayNames.map((day) => (
              <div key={day} className="p-3 text-sm font-medium text-muted-foreground bg-muted text-center">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {days.map((day, index) => {
              const isCurrentMonth = day.getMonth() === month;
              const isToday = day.toDateString() === today.toDateString();
              const schedule = getScheduleForDate(day);
              const hasSchedule = schedule && schedule.classes.length > 0;

              return (
                <div
                  key={index}
                  className={`min-h-[120px] border-r border-b border-border p-2 cursor-pointer hover:bg-accent/50 transition-colors ${
                    !isCurrentMonth ? 'bg-muted/30 text-muted-foreground' : 'bg-background'
                  } ${isToday ? 'bg-primary/10' : ''}`}
                  onClick={() => handleDateSelect(day)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`text-sm font-medium ${isToday ? 'text-primary' : isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {day.getDate()}
                    </span>
                    {schedule?.hasLeave && (
                      <AlertTriangle className="h-3 w-3 text-destructive" />
                    )}
                  </div>
                  
                  {hasSchedule && (
                    <div className="space-y-1">
                      {schedule.classes.slice(0, 3).map((classItem, idx) => (
                        <div
                          key={idx}
                          className="text-xs p-1 rounded bg-primary/10 text-primary truncate"
                        >
                          {classItem.time.split('-')[0]} {classItem.subject}
                        </div>
                      ))}
                      {schedule.classes.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{schedule.classes.length - 3} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-fm hover:shadow-fm-hover transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Branches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">CS, IT, EC, ME</p>
          </CardContent>
        </Card>

        <Card className="shadow-fm hover:shadow-fm-hover transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Across all branches</p>
          </CardContent>
        </Card>

        <Card className="shadow-fm hover:shadow-fm-hover transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Subjects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">Lectures & Practicals</p>
          </CardContent>
        </Card>

        <Card className="shadow-fm hover:shadow-fm-hover transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Schedule Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Classes scheduled</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-fm cursor-pointer hover:shadow-fm-hover transition-shadow" onClick={() => window.location.href = '#schedule'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {renderCustomCalendar()}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">24</div>
                    <div className="text-sm text-muted-foreground">Active Classes</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-destructive">2</div>
                    <div className="text-sm text-muted-foreground">On Leave</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-foreground">156</div>
                    <div className="text-sm text-muted-foreground">Total Hours</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-primary/10 border border-primary rounded"></div>
                  <span>Classes Scheduled</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-3 w-3 text-destructive" />
                  <span>Teacher on Leave</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule for {selectedDate && format(selectedDate, "EEEE, MMMM do, yyyy")}
              {selectedSchedule?.hasLeave && (
                <Badge variant="destructive" className="ml-2">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Teacher on Leave
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {selectedSchedule?.classes.map((classItem, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{classItem.time}</span>
                        <Badge variant={classItem.type === "Lecture" ? "default" : "secondary"}>
                          {classItem.type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-lg font-semibold">{classItem.subject}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{classItem.teacher}</span>
                        </div>
                        <span>•</span>
                        <span>Class: {classItem.class}</span>
                        <span>•</span>
                        <span>Room: {classItem.room}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {!selectedSchedule?.classes.length && (
              <div className="text-center py-8 text-muted-foreground">
                No classes scheduled for this date
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;