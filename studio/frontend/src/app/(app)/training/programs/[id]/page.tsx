'use client';

import { useProgramById } from "@/entities/training-program/api/get-program";
import { TrainingProgramDetailsPage } from "@/views/training-program-details";
import { Skeleton } from "@/shared/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { useEffect, useState } from "react";

export default function ProgramDetailsRoute({ params }: { params: { id: string } }) {
  const program = useProgramById(params.id);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Still rendering on the server or first client render
    return (
        <div className="space-y-6">
            <Card className="overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent>
            </Card>
            <Card>
                <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
                <CardContent><Skeleton className="h-48 w-full" /></CardContent>
            </Card>
        </div>
    )
  }

  if (!program) {
      // After client has mounted and program is still not found
      return <div>Программа не найдена.</div>;
  }

  return <TrainingProgramDetailsPage program={program} />;
}
