import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - in real app, this would come from database
const initialDesignations = [
  { designation_id: 1, designation_name: "Professor", max_hours_per_week: 18 },
  { designation_id: 2, designation_name: "Associate Professor", max_hours_per_week: 20 },
  { designation_id: 3, designation_name: "Assistant Professor", max_hours_per_week: 22 },
  { designation_id: 4, designation_name: "Lecturer", max_hours_per_week: 24 }
];

const initialTeachers = [
  { teacher_id: 1, teacher_name: "Dr. John Smith", designation_id: 1, on_leave: false },
  { teacher_id: 2, teacher_name: "Prof. Sarah Johnson", designation_id: 2, on_leave: false },
  { teacher_id: 3, teacher_name: "Dr. Michael Brown", designation_id: 3, on_leave: true },
  { teacher_id: 4, teacher_name: "Ms. Emily Davis", designation_id: 4, on_leave: false }
];

const initialSubjects = [
  { subject_id: 1, subject_name: "Data Structures", branch_name: "Computer Science" },
  { subject_id: 2, subject_name: "Database Management", branch_name: "Information Technology" },
  { subject_id: 3, subject_name: "Operating Systems", branch_name: "Computer Science" },
  { subject_id: 4, subject_name: "Web Development", branch_name: "Information Technology" }
];

const initialSuggestedSubjects = [
  { id: 1, teacher_id: 1, subject_id: 1 },
  { id: 2, teacher_id: 1, subject_id: 3 },
  { id: 3, teacher_id: 2, subject_id: 2 },
  { id: 4, teacher_id: 4, subject_id: 4 }
];

const TeacherConfiguration = () => {
  const { toast } = useToast();
  const [designations, setDesignations] = useState(initialDesignations);
  const [teachers, setTeachers] = useState(initialTeachers);
  const [subjects] = useState(initialSubjects);
  const [suggestedSubjects, setSuggestedSubjects] = useState(initialSuggestedSubjects);
  
  // Form states
  const [designationForm, setDesignationForm] = useState({ designation_name: "", max_hours_per_week: "" });
  const [teacherForm, setTeacherForm] = useState({ teacher_name: "", designation_id: "", on_leave: false });
  const [subjectAssignForm, setSubjectAssignForm] = useState({ teacher_id: "", subject_id: "" });

  // Add handlers
  const addDesignation = () => {
    if (!designationForm.designation_name.trim() || !designationForm.max_hours_per_week) return;
    const newDesignation = {
      designation_id: designations.length + 1,
      designation_name: designationForm.designation_name,
      max_hours_per_week: parseInt(designationForm.max_hours_per_week)
    };
    setDesignations([...designations, newDesignation]);
    setDesignationForm({ designation_name: "", max_hours_per_week: "" });
    toast({ title: "Designation added successfully!" });
  };

  const addTeacher = () => {
    if (!teacherForm.teacher_name.trim() || !teacherForm.designation_id) return;
    const newTeacher = {
      teacher_id: teachers.length + 1,
      teacher_name: teacherForm.teacher_name,
      designation_id: parseInt(teacherForm.designation_id),
      on_leave: teacherForm.on_leave
    };
    setTeachers([...teachers, newTeacher]);
    setTeacherForm({ teacher_name: "", designation_id: "", on_leave: false });
    toast({ title: "Teacher added successfully!" });
  };

  const addSubjectAssignment = () => {
    if (!subjectAssignForm.teacher_id || !subjectAssignForm.subject_id) return;
    
    // Check if assignment already exists
    const exists = suggestedSubjects.some(
      s => s.teacher_id === parseInt(subjectAssignForm.teacher_id) && 
           s.subject_id === parseInt(subjectAssignForm.subject_id)
    );
    
    if (exists) {
      toast({ title: "Subject already assigned to this teacher!", variant: "destructive" });
      return;
    }

    const newAssignment = {
      id: suggestedSubjects.length + 1,
      teacher_id: parseInt(subjectAssignForm.teacher_id),
      subject_id: parseInt(subjectAssignForm.subject_id)
    };
    setSuggestedSubjects([...suggestedSubjects, newAssignment]);
    setSubjectAssignForm({ teacher_id: "", subject_id: "" });
    toast({ title: "Subject assigned successfully!" });
  };

  const toggleTeacherLeave = (teacherId: number) => {
    setTeachers(teachers.map(teacher => 
      teacher.teacher_id === teacherId 
        ? { ...teacher, on_leave: !teacher.on_leave }
        : teacher
    ));
    toast({ title: "Teacher status updated!" });
  };

  const getDesignationName = (designationId: number) => {
    return designations.find(d => d.designation_id === designationId)?.designation_name || "Unknown";
  };

  const getTeacherName = (teacherId: number) => {
    return teachers.find(t => t.teacher_id === teacherId)?.teacher_name || "Unknown";
  };

  const getSubjectName = (subjectId: number) => {
    return subjects.find(s => s.subject_id === subjectId)?.subject_name || "Unknown";
  };

  const removeSubjectAssignment = (assignmentId: number) => {
    setSuggestedSubjects(suggestedSubjects.filter(s => s.id !== assignmentId));
    toast({ title: "Subject assignment removed!" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Teacher Configuration</h2>
        <Badge variant="secondary" className="px-3 py-1">
          Faculty Management
        </Badge>
      </div>

      <Tabs defaultValue="designations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="designations">Designations</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="subjects">Subject Assignment</TabsTrigger>
          <TabsTrigger value="allocation">Allocated Subjects</TabsTrigger>
        </TabsList>

        {/* Designations Tab */}
        <TabsContent value="designations" className="space-y-6">
          <Card className="shadow-fm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Designation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="designation-name">Designation Name</Label>
                  <Input
                    id="designation-name"
                    placeholder="e.g., Professor"
                    value={designationForm.designation_name}
                    onChange={(e) => setDesignationForm({ ...designationForm, designation_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="max-hours">Max Hours/Week</Label>
                  <Input
                    id="max-hours"
                    type="number"
                    placeholder="e.g., 18"
                    value={designationForm.max_hours_per_week}
                    onChange={(e) => setDesignationForm({ ...designationForm, max_hours_per_week: e.target.value })}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addDesignation} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Designation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-fm">
            <CardHeader>
              <CardTitle>Existing Designations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Max Hours/Week</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {designations.map((designation) => (
                    <TableRow key={designation.designation_id}>
                      <TableCell>{designation.designation_id}</TableCell>
                      <TableCell className="font-medium">{designation.designation_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{designation.max_hours_per_week} hrs</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teachers Tab */}
        <TabsContent value="teachers" className="space-y-6">
          <Card className="shadow-fm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Add New Teacher
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="teacher-name">Teacher Name</Label>
                  <Input
                    id="teacher-name"
                    placeholder="e.g., Dr. John Smith"
                    value={teacherForm.teacher_name}
                    onChange={(e) => setTeacherForm({ ...teacherForm, teacher_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="teacher-designation">Designation</Label>
                  <Select value={teacherForm.designation_id} onValueChange={(value) => setTeacherForm({ ...teacherForm, designation_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                    <SelectContent>
                      {designations.map((designation) => (
                        <SelectItem key={designation.designation_id} value={designation.designation_id.toString()}>
                          {designation.designation_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="on-leave"
                    checked={teacherForm.on_leave}
                    onCheckedChange={(checked) => setTeacherForm({ ...teacherForm, on_leave: checked })}
                  />
                  <Label htmlFor="on-leave">On Leave</Label>
                </div>
                <div className="flex items-end">
                  <Button onClick={addTeacher} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Teacher
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-fm">
            <CardHeader>
              <CardTitle>Existing Teachers</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Teacher Name</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher.teacher_id}>
                      <TableCell>{teacher.teacher_id}</TableCell>
                      <TableCell className="font-medium">{teacher.teacher_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getDesignationName(teacher.designation_id)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={teacher.on_leave}
                            onCheckedChange={() => toggleTeacherLeave(teacher.teacher_id)}
                          />
                          <Badge variant={teacher.on_leave ? "destructive" : "default"}>
                            {teacher.on_leave ? "On Leave" : "Available"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subject Assignment Tab */}
        <TabsContent value="subjects" className="space-y-6">
          <Card className="shadow-fm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Assign Subject to Teacher
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="assign-teacher">Teacher</Label>
                  <Select value={subjectAssignForm.teacher_id} onValueChange={(value) => setSubjectAssignForm({ ...subjectAssignForm, teacher_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.filter(t => !t.on_leave).map((teacher) => (
                        <SelectItem key={teacher.teacher_id} value={teacher.teacher_id.toString()}>
                          {teacher.teacher_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="assign-subject">Subject</Label>
                  <Select value={subjectAssignForm.subject_id} onValueChange={(value) => setSubjectAssignForm({ ...subjectAssignForm, subject_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.subject_id} value={subject.subject_id.toString()}>
                          {subject.subject_name} ({subject.branch_name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={addSubjectAssignment} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Assign Subject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-fm">
            <CardHeader>
              <CardTitle>Teacher Subject Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suggestedSubjects.map((assignment) => {
                    const teacher = teachers.find(t => t.teacher_id === assignment.teacher_id);
                    return (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{getTeacherName(assignment.teacher_id)}</TableCell>
                        <TableCell>{getSubjectName(assignment.subject_id)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {teacher ? getDesignationName(teacher.designation_id) : "Unknown"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeSubjectAssignment(assignment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Allocated Subjects Tab */}
        <TabsContent value="allocation" className="space-y-6">
          <Card className="shadow-fm">
            <CardHeader>
              <CardTitle>Allocated Subjects (System Generated)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This section will show the final subject allocations generated by the OR-Tools algorithm after timetable optimization.
              </p>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Subject allocation results will appear here after running the scheduling algorithm.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherConfiguration;