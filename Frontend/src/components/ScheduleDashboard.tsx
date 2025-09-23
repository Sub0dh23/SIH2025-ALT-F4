import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, AlertTriangle } from "lucide-react";
import ExpandableCalendar from "@/components/ExpandableCalendar";

const ScheduleDashboard = () => {
	return (
		<div className="space-y-6">
			<Card className="shadow-fm">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						Academic Schedule Calendar
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						<ExpandableCalendar />

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<Card>
								<CardContent className="p-4">
									<div className="text-center">
										<div className="text-2xl font-bold text-primary">24</div>
										<div className="text-sm text-muted-foreground">
											Active Classes
										</div>
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="p-4">
									<div className="text-center">
										<div className="text-2xl font-bold text-destructive">2</div>
										<div className="text-sm text-muted-foreground">
											On Leave
										</div>
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="p-4">
									<div className="text-center">
										<div className="text-2xl font-bold text-accent-foreground">
											156
										</div>
										<div className="text-sm text-muted-foreground">
											Total Hours
										</div>
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
		</div>
	);
};

export default ScheduleDashboard;
