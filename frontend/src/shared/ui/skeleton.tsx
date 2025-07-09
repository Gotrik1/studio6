import { cn } from "@/shared/lib/utils";
import * as React from "react";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("hologram-skeleton", className)} {...props} />;
}

export { Skeleton };
