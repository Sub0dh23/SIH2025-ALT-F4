import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, AlertTriangle, RotateCcw, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ScheduleDashboard from "./ScheduleDashboard";

const GenerateTimetable = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [teachersAssigned] = useState(true); // This should come from AssignTeachers component

  const handleGenerateTimetable = () => {
    if (!teachersAssigned) {
      toast({
        title: "Cannot Generate Timetable",
        description: "Please assign teachers first in the Assign Teachers tab.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    // Simulate timetable generation with progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setIsGenerated(true);
          toast({
            title: "Timetable Generated Successfully",
            description: "The academic timetable has been created and is now locked for the semester.",
          });
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const handleRecreateWarning = () => {
    setShowWarning(true);
  };

  const handleRecreateConfirm = () => {
    setIsGenerated(false);
    setProgress(0);
    setShowWarning(false);
    toast({
      title: "Timetable Reset",
      description: "The current timetable has been reset. You can now generate a new one.",
      variant: "destructive",
    });
  };

  const getProgressLabel = () => {
    if (progress < 20) return "Analyzing class requirements...";
    if (progress < 40) return "Optimizing teacher assignments...";
    if (progress < 60) return "Generating time slots...";
    if (progress < 80) return "Resolving conflicts...";
    if (progress < 100) return "Finalizing schedule...";
    return "Complete!";
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-fm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Timetable Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Prerequisites Check */}
          <div className="space-y-3">
            <h3 className="font-semibold">Prerequisites</h3>
            <div className="flex items-center gap-2">
              {teachersAssigned ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Teachers have been assigned</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-sm text-destructive">Teachers must be assigned first</span>
                </>
              )}
            </div>
          </div>

          {/* Generation Controls */}
          <div className="space-y-4">
            {!isGenerated && !isGenerating && (
              <div className="text-center">
                <Button
                  onClick={handleGenerateTimetable}
                  size="lg"
                  disabled={!teachersAssigned}
                  className="h-12 px-8"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Generate Semester Timetable
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  This will create the complete academic schedule for the semester
                </p>
              </div>
            )}

            {isGenerating && (
              <Card className="bg-secondary/10">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 animate-spin" />
                      <span className="font-medium">Generating Timetable...</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                    <p className="text-sm text-muted-foreground">{getProgressLabel()}</p>
                    <div className="text-center">
                      <Badge variant="secondary">{progress}% Complete</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {isGenerated && (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Timetable has been successfully generated and is now locked for the semester.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-center">
                  <Button
                    onClick={handleRecreateWarning}
                    variant="destructive"
                    className="h-10"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Recreate Timetable
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generated Schedule Display */}
      {isGenerated && (
        <Card className="shadow-fm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Generated Academic Schedule
              <Badge variant="outline" className="ml-2">Locked</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScheduleDashboard />
          </CardContent>
        </Card>
      )}

      {/* Warning Dialog for Recreate */}
      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Recreate Timetable Warning
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert className="border-destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Warning:</strong> This action will permanently delete the current timetable and reset all schedule assignments. This cannot be undone.
              </AlertDescription>
            </Alert>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• All scheduled classes will be removed</p>
              <p>• Students and staff will lose access to current schedules</p>
              <p>• You will need to regenerate the entire timetable</p>
              <p>• Teacher assignments will remain intact</p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowWarning(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRecreateConfirm}
                className="flex-1"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Recreate Timetable
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GenerateTimetable;