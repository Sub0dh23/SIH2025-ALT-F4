import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - in real app, this would come from database
const initialBranches = [
  { branch_id: 1, branch_name: "Computer Science" },
  { branch_id: 2, branch_name: "Information Technology" },
  { branch_id: 3, branch_name: "Electronics & Communication" },
  { branch_id: 4, branch_name: "Mechanical Engineering" }
];

const initialClasses = [
  { class_id: 1, branch_id: 1, class_name: "CS1" },
  { class_id: 2, branch_id: 1, class_name: "CS2" },
  { class_id: 3, branch_id: 2, class_name: "IT1" },
  { class_id: 4, branch_id: 2, class_name: "IT2" }
];

const initialSubjects = [
  { subject_id: 1, branch_id: 1, subject_name: "Data Structures", type: "Lecture" },
  { subject_id: 2, branch_id: 1, subject_name: "Data Structures Lab", type: "Practical" },
  { subject_id: 3, branch_id: 1, subject_name: "Operating Systems", type: "Lecture" },
  { subject_id: 4, branch_id: 2, subject_name: "Database Management", type: "Lecture" }
];

const initialTimeSlots = [
  { slot_id: 1, slot_name: "9:00-10:00" },
  { slot_id: 2, slot_name: "10:00-11:00" },
  { slot_id: 3, slot_name: "11:00-12:00" },
  { slot_id: 4, slot_name: "12:00-1:00" },
  { slot_id: 5, slot_name: "2:00-3:00" },
  { slot_id: 6, slot_name: "3:00-4:00" }
];

const initialDays = [
  { day_id: 1, day_name: "Monday" },
  { day_id: 2, day_name: "Tuesday" },
  { day_id: 3, day_name: "Wednesday" },
  { day_id: 4, day_name: "Thursday" },
  { day_id: 5, day_name: "Friday" }
];

const ClassConfiguration = () => {
  const { toast } = useToast();
  const [branches, setBranches] = useState(initialBranches);
  const [classes, setClasses] = useState(initialClasses);
  const [subjects, setSubjects] = useState(initialSubjects);
  const [timeSlots, setTimeSlots] = useState(initialTimeSlots);
  const [days] = useState(initialDays);
  
  // Form states
  const [branchForm, setBranchForm] = useState({ branch_name: "" });
  const [classForm, setClassForm] = useState({ branch_id: "", class_name: "" });
  const [subjectForm, setSubjectForm] = useState({ branch_id: "", subject_name: "", type: "", year: "" });
  const [timeSlotForm, setTimeSlotForm] = useState({ slot_name: "" });

  // Add handlers
  const addBranch = () => {
    if (!branchForm.branch_name.trim()) return;
    const newBranch = {
      branch_id: branches.length + 1,
      branch_name: branchForm.branch_name
    };
    setBranches([...branches, newBranch]);
    setBranchForm({ branch_name: "" });
    toast({ title: "Branch added successfully!" });
  };

  const addClass = () => {
    if (!classForm.branch_id || !classForm.class_name.trim()) return;
    const newClass = {
      class_id: classes.length + 1,
      branch_id: parseInt(classForm.branch_id),
      class_name: classForm.class_name
    };
    setClasses([...classes, newClass]);
    setClassForm({ branch_id: "", class_name: "" });
    toast({ title: "Class added successfully!" });
  };

  const addSubject = () => {
    if (!subjectForm.branch_id || !subjectForm.subject_name.trim() || !subjectForm.type || !subjectForm.year) return;
    const newSubject = {
      subject_id: subjects.length + 1,
      branch_id: parseInt(subjectForm.branch_id),
      subject_name: subjectForm.subject_name,
      type: subjectForm.type as "Lecture" | "Practical",
      year: subjectForm.year
    };
    setSubjects([...subjects, newSubject]);
    setSubjectForm({ branch_id: "", subject_name: "", type: "", year: "" });
    toast({ title: "Subject added successfully!" });
  };

  const addTimeSlot = () => {
    if (!timeSlotForm.slot_name.trim()) return;
    const newTimeSlot = {
      slot_id: timeSlots.length + 1,
      slot_name: timeSlotForm.slot_name
    };
    setTimeSlots([...timeSlots, newTimeSlot]);
    setTimeSlotForm({ slot_name: "" });
    toast({ title: "Time slot added successfully!" });
  };

  const getBranchName = (branchId: number) => {
    return branches.find(b => b.branch_id === branchId)?.branch_name || "Unknown";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Class Configuration</h2>
        <Badge variant="secondary" className="px-3 py-1">
          Database Management
        </Badge>
      </div>

      <Tabs defaultValue="branches" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="batches">Class Batches</TabsTrigger>
          <TabsTrigger value="quota">Subject Quota</TabsTrigger>
          <TabsTrigger value="timeslots">Time Slots</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        {/* Branches Tab */}
        <TabsContent value="branches" className="space-y-6">
          <Card className="shadow-fm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Branch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="branch-name">Branch Name</Label>
                  <Input
                    id="branch-name"
                    placeholder="e.g., Computer Science"
                    value={branchForm.branch_name}
                    onChange={(e) => setBranchForm({ branch_name: e.target.value })}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addBranch} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Branch
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-fm">
            <CardHeader>
              <CardTitle>Existing Branches</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Branch Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {branches.map((branch) => (
                    <TableRow key={branch.branch_id}>
                      <TableCell>{branch.branch_id}</TableCell>
                      <TableCell className="font-medium">{branch.branch_name}</TableCell>
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

        {/* Classes Tab */}
        <TabsContent value="classes" className="space-y-6">
          <Card className="shadow-fm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Class
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="class-branch">Branch</Label>
                  <Select value={classForm.branch_id} onValueChange={(value) => setClassForm({ ...classForm, branch_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.branch_id} value={branch.branch_id.toString()}>
                          {branch.branch_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="class-name">Class Name</Label>
                  <Input
                    id="class-name"
                    placeholder="e.g., CS1, IT2"
                    value={classForm.class_name}
                    onChange={(e) => setClassForm({ ...classForm, class_name: e.target.value })}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addClass} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Class
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-fm">
            <CardHeader>
              <CardTitle>Existing Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Class Name</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((cls) => (
                    <TableRow key={cls.class_id}>
                      <TableCell>{cls.class_id}</TableCell>
                      <TableCell className="font-medium">{cls.class_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getBranchName(cls.branch_id)}</Badge>
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

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-6">
          <Card className="shadow-fm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Subject
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div>
                  <Label htmlFor="subject-branch">Branch</Label>
                  <Select value={subjectForm.branch_id} onValueChange={(value) => setSubjectForm({ ...subjectForm, branch_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.branch_id} value={branch.branch_id.toString()}>
                          {branch.branch_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subject-name">Subject Name</Label>
                  <Input
                    id="subject-name"
                    placeholder="e.g., Data Structures"
                    value={subjectForm.subject_name}
                    onChange={(e) => setSubjectForm({ ...subjectForm, subject_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="subject-year">Year</Label>
                  <Select value={subjectForm.year} onValueChange={(value) => setSubjectForm({ ...subjectForm, year: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st">1st Year</SelectItem>
                      <SelectItem value="2nd">2nd Year</SelectItem>
                      <SelectItem value="3rd">3rd Year</SelectItem>
                      <SelectItem value="4th">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subject-type">Type</Label>
                  <Select value={subjectForm.type} onValueChange={(value) => setSubjectForm({ ...subjectForm, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lecture">Lecture</SelectItem>
                      <SelectItem value="Practical">Practical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={addSubject} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Subject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-fm">
            <CardHeader>
              <CardTitle>Existing Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Subject Name</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjects.map((subject) => (
                    <TableRow key={subject.subject_id}>
                      <TableCell>{subject.subject_id}</TableCell>
                      <TableCell className="font-medium">{subject.subject_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getBranchName(subject.branch_id)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{(subject as any).year || "N/A"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={subject.type === "Lecture" ? "default" : "secondary"}>
                          {subject.type}
                        </Badge>
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

        {/* Class Batches Tab */}
        <TabsContent value="batches" className="space-y-6">
          <Card className="shadow-fm">
            <CardHeader>
              <CardTitle>Class Batch Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Manage class batches (A, B, C, D) for practical sessions. Each class can be divided into multiple batches.
              </p>
              <div className="space-y-4">
                {classes.map((cls) => (
                  <Card key={cls.class_id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{cls.class_name}</h4>
                      <Badge variant="outline">{getBranchName(cls.branch_id)}</Badge>
                    </div>
                    <div className="flex gap-2">
                      {['A', 'B', 'C', 'D'].map((batch) => (
                        <Badge key={batch} variant="secondary" className="px-3 py-1">
                          Batch {batch}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subject Quota Tab */}
        <TabsContent value="quota" className="space-y-6">
          <Card className="shadow-fm">
            <CardHeader>
              <CardTitle>Subject Quota Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Configure weekly lecture and practical quotas for each subject in different classes.
              </p>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Quota management interface will be implemented here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Time Slots Tab */}
        <TabsContent value="timeslots" className="space-y-6">
          <Card className="shadow-fm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Time Slot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="slot-name">Time Slot</Label>
                  <Input
                    id="slot-name"
                    placeholder="e.g., 9:00-10:00"
                    value={timeSlotForm.slot_name}
                    onChange={(e) => setTimeSlotForm({ slot_name: e.target.value })}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addTimeSlot} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Time Slot
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-fm">
            <CardHeader>
              <CardTitle>Existing Time Slots</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Time Slot</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeSlots.map((slot) => (
                    <TableRow key={slot.slot_id}>
                      <TableCell>{slot.slot_id}</TableCell>
                      <TableCell className="font-medium">{slot.slot_name}</TableCell>
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

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card className="shadow-fm">
            <CardHeader>
              <CardTitle>Schedule Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Create and manage class schedules by assigning subjects to specific time slots and days.
              </p>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Schedule management interface will be implemented here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassConfiguration;