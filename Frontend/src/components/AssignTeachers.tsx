import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, BookOpen, GraduationCap } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Teacher {
  id: number;
  name: string;
  designation: string;
  subjects: string[];
  classes: string[];
}

interface ClassWithTeachers {
  className: string;
  teachers: Teacher[];
}

const mockTeachers: Teacher[] = [
  { id: 1, name: "Dr. Smith", designation: "Professor", subjects: ["Data Structures", "Algorithms"], classes: ["CS1", "CS3"] },
  { id: 2, name: "Prof. Johnson", designation: "Associate Professor", subjects: ["DBMS", "Database Lab"], classes: ["CS2", "IT1"] },
  { id: 3, name: "Dr. Brown", designation: "Assistant Professor", subjects: ["Operating Systems", "System Programming"], classes: ["CS3", "IT2"] },
  { id: 4, name: "Prof. Davis", designation: "Assistant Professor", subjects: ["Web Development", "Software Engineering"], classes: ["IT1", "CS2"] },
];

const AssignTeachers = () => {
  const [isAssigned, setIsAssigned] = useState(false);
  const [selectedTeachers, setSelectedTeachers] = useState<Teacher[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"classes" | "years" | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const handleAssignTeachers = () => {
    // Simulate assignment process
    toast({
      title: "Teachers Assigned Successfully",
      description: "All teachers have been assigned to their respective classes and subjects.",
    });
    setIsAssigned(true);
    setSelectedTeachers(mockTeachers);
  };

  const openTeachersDialog = (type: "classes" | "years", year?: number) => {
    setDialogType(type);
    setSelectedYear(year || null);
    setDialogOpen(true);
  };

  const getTeachersByYear = (year: number) => {
    return selectedTeachers.filter(teacher =>
      teacher.classes.some(cls => cls.includes(year.toString()))
    );
  };

  const getClassesWithTeachers = (): ClassWithTeachers[] => {
    const classNames = ["CS1", "CS2", "CS3", "CS4", "IT1", "IT2", "IT3", "IT4"];
    return classNames.map(className => ({
      className,
      teachers: selectedTeachers.filter(teacher => teacher.classes.includes(className))
    }));
  };

  const getDialogTitle = () => {
    if (dialogType === "classes") return "Classes and Assigned Teachers";
    if (dialogType === "years" && selectedYear) return `Year ${selectedYear} Teachers`;
    return "Teachers";
  };

  const getDialogContent = () => {
    if (dialogType === "classes") return getClassesWithTeachers();
    if (dialogType === "years" && selectedYear) return getTeachersByYear(selectedYear);
    return [];
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-fm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Teacher Assignment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Button
              onClick={handleAssignTeachers}
              size="lg"
              disabled={isAssigned}
              className="h-12 px-8"
            >
              {isAssigned ? "Teachers Already Assigned" : "Assign All Teachers"}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              This will automatically assign teachers to their respective classes and subjects
            </p>
          </div>

          {isAssigned && (
            <div className="pt-4 border-t">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Teachers by Classes */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Teachers by Classes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground mb-3">
                        {selectedTeachers.length} teachers assigned
                      </div>
                        <Button
                          variant="outline"
                          onClick={() => openTeachersDialog("classes")}
                          className="w-full justify-start"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          View Classes & Teachers
                        </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Teachers by Years */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Teachers by Years
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((year) => (
                        <Button
                          key={year}
                          variant="outline"
                          onClick={() => openTeachersDialog("years", year)}
                          className="w-full justify-between"
                        >
                          <span className="flex items-center">
                            <GraduationCap className="h-4 w-4 mr-2" />
                            Year {year}
                          </span>
                          <Badge variant="secondary">
                            {getTeachersByYear(year).length} teachers
                          </Badge>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {getDialogTitle()}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {dialogType === "classes" ? (
              (getDialogContent() as ClassWithTeachers[]).map((classItem) => (
                <Card key={classItem.className}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold text-lg">{classItem.className}</h3>
                        <Badge variant="secondary">{classItem.teachers.length} teachers</Badge>
                      </div>
                      
                      {classItem.teachers.length > 0 ? (
                        <div className="space-y-2 ml-6">
                          {classItem.teachers.map((teacher) => (
                            <div key={teacher.id} className="flex items-center justify-between p-2 rounded-md bg-muted/30">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{teacher.name}</span>
                                <Badge variant="outline" className="text-xs">{teacher.designation}</Badge>
                              </div>
                              <div className="flex gap-1">
                                {teacher.subjects.map((subject, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {subject}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="ml-6 text-sm text-muted-foreground">
                          No teachers assigned to this class
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              (getDialogContent() as Teacher[]).map((teacher) => (
                <Card key={teacher.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{teacher.name}</h3>
                          <Badge variant="outline">{teacher.designation}</Badge>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <BookOpen className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">Subjects:</span>
                            <div className="flex gap-1">
                              {teacher.subjects.map((subject, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {subject}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">Classes:</span>
                            <div className="flex gap-1">
                              {teacher.classes.map((cls, idx) => (
                                <Badge key={idx} variant="default" className="text-xs">
                                  {cls}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            
            {!getDialogContent().length && (
              <div className="text-center py-8 text-muted-foreground">
                {dialogType === "classes" ? "No classes found" : "No teachers assigned for this selection"}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssignTeachers;