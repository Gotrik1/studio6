'use client'

import * as React from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarMenuButton,
  SidebarMenuSub,
} from "@/components/ui/sidebar"
import { ChevronRight } from "lucide-react"

export function CollapsibleSidebarMenuItem({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <SidebarMenuButton className="w-full justify-start">
            {icon}
            <span className="flex-grow">{title}</span>
            <ChevronRight
              className={`h-4 w-4 transform transition-transform duration-200 ${
                isOpen ? "rotate-90" : ""
              }`}
            />
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>{children}</SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
}
