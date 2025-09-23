import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
	Calendar,
	AlertTriangle,
	Clock,
	User,
	BookOpen,
	ChevronLeft,
	ChevronRight,
	X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

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
			{
				time: "9:00-10:00",
				subject: "Data Structures",
				teacher: "Dr. Smith",
				class: "CS1",
				type: "Lecture",
				room: "101",
			},
			{
				time: "10:00-11:00",
				subject: "DBMS Lab",
				teacher: "Prof. Johnson",
				class: "CS2",
				type: "Practical",
				room: "Lab A",
			},
			{
				time: "11:00-12:00",
				subject: "Algorithms",
				teacher: "Dr. Brown",
				class: "CS3",
				type: "Lecture",
				room: "102",
			},
		],
	},
	{
		date: new Date(2024, 0, 16),
		hasLeave: false,
		classes: [
			{
				time: "9:00-10:00",
				subject: "Operating Systems",
				teacher: "Dr. Wilson",
				class: "CS2",
				type: "Lecture",
				room: "103",
			},
			{
				time: "10:00-11:00",
				subject: "Web Development",
				teacher: "Prof. Davis",
				class: "IT1",
				type: "Practical",
				room: "Lab B",
			},
		],
	},
];

const ExpandableCalendar = () => {
	const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
	const [expandedDay, setExpandedDay] = useState<Date | null>(null);

	const getScheduleForDate = (date: Date) => {
		return mockScheduleData.find(
			(schedule) => schedule.date.toDateString() === date.toDateString()
		);
	};

	const handleDateSelect = (date: Date | undefined) => {
		if (date) {
			setExpandedDay(date);
		}
	};

	const today = new Date();
	const year = currentMonthDate.getFullYear();
	const month = currentMonthDate.getMonth();

	const firstDayOfMonth = new Date(year, month, 1);
	const lastDayOfMonth = new Date(year, month + 1, 0);
	const startDate = new Date(firstDayOfMonth);
	startDate.setDate(
		startDate.getDate() -
			(firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1)
	);

	const endDate = new Date(lastDayOfMonth);
	if (lastDayOfMonth.getDay() !== 0) {
		endDate.setDate(endDate.getDate() + (7 - lastDayOfMonth.getDay()));
	}

	const days = [];
	const current = new Date(startDate);

	while (current <= endDate) {
		days.push(new Date(current));
		current.setDate(current.getDate() + 1);
	}

	const navigateMonth = (direction: "prev" | "next") => {
		const newDate = new Date(currentMonthDate);
		newDate.setMonth(newDate.getMonth() + (direction === "prev" ? -1 : 1));
		setCurrentMonthDate(newDate);
	};

	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

	const selectedSchedule = expandedDay ? getScheduleForDate(expandedDay) : null;

	return (
		<div className="w-full">
			{/* Calendar Header */}
			<div className="flex items-center justify-between mb-6 px-4">
				<div className="flex items-center gap-4">
					<h3 className="text-xl font-semibold">
						{monthNames[month]} {year}
					</h3>
					<div className="text-sm text-muted-foreground">
						{format(firstDayOfMonth, "MMM d")} —{" "}
						{format(lastDayOfMonth, "MMM d, yyyy")}
					</div>
				</div>
				<div className="flex items-center gap-2">
					<button
						onClick={() => navigateMonth("prev")}
						className="p-2 hover:bg-accent rounded-md transition-colors"
					>
						<ChevronLeft className="h-4 w-4" />
					</button>
					<button
						onClick={() => setCurrentMonthDate(today)}
						className="px-3 py-1 text-sm hover:bg-accent rounded-md transition-colors"
					>
						Today
					</button>
					<button
						onClick={() => navigateMonth("next")}
						className="p-2 hover:bg-accent rounded-md transition-colors"
					>
						<ChevronRight className="h-4 w-4" />
					</button>
				</div>
			</div>

			{/* Calendar Grid & Expanded Panel Wrapper */}
			<div className="relative">
				<div className="border border-border rounded-lg overflow-hidden bg-background">
					{/* Day Headers */}
					<div className="grid grid-cols-7 border-b border-border">
						{dayNames.map((day) => (
							<div
								key={day}
								className="p-3 text-sm font-medium text-muted-foreground bg-muted text-center"
							>
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
										!isCurrentMonth
											? "bg-muted/30 text-muted-foreground"
											: "bg-background"
									} ${isToday ? "bg-primary/10" : ""}`}
									onClick={() => handleDateSelect(day)}
								>
									<div className="flex items-start justify-between mb-2">
										<span
											className={`text-sm font-medium ${
												isToday
													? "text-primary"
													: isCurrentMonth
													? "text-foreground"
													: "text-muted-foreground"
											}`}
										>
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
													{classItem.time.split("-")[0]} {classItem.subject}
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

				<AnimatePresence>
					{expandedDay && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center"
							onClick={() => setExpandedDay(null)}
						>
							<motion.div
								initial={{ scale: 0.95, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.95, opacity: 0 }}
								transition={{ duration: 0.2, delay: 0.05 }}
								className="relative h-[95%] w-[95%] bg-background/95 rounded-lg p-2 shadow-lg"
								onClick={(e) => e.stopPropagation()}
							>
								<button
									onClick={() => setExpandedDay(null)}
									className="absolute top-2 right-2 p-1 bg-card rounded-full hover:bg-accent transition-colors z-20"
								>
									<X className="h-4 w-4" />
								</button>
								<div className="space-y-4 h-full overflow-y-auto pt-8 pr-2">
									<h3 className="text-lg font-bold text-foreground px-4">
										Schedule for {format(expandedDay, "EEEE, MMMM do")}
									</h3>
									{selectedSchedule && selectedSchedule.classes.length > 0 ? (
										selectedSchedule.classes.map((classItem, index) => (
											<Card key={index} className="bg-background/70 mx-4">
												<CardContent className="p-3">
													<div className="flex items-start justify-between">
														<div className="space-y-1.5">
															<div className="flex items-center gap-2">
																<Clock className="h-4 w-4 text-muted-foreground" />
																<span className="font-medium text-sm">
																	{classItem.time}
																</span>
																<Badge
																	variant={
																		classItem.type === "Lecture"
																			? "default"
																			: "secondary"
																	}
																>
																	{classItem.type}
																</Badge>
															</div>

															<div className="flex items-center gap-2">
																<BookOpen className="h-4 w-4 text-muted-foreground" />
																<span className="text-md font-semibold">
																	{classItem.subject}
																</span>
															</div>

															<div className="flex items-center gap-3 text-xs text-muted-foreground">
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
										))
									) : (
										<div className="flex items-center justify-center h-full">
											<div className="text-center text-muted-foreground">
												<p>No classes scheduled for this date.</p>
											</div>
										</div>
									)}
								</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default ExpandableCalendar;
