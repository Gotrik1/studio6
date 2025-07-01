'use client';

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/shared/ui/collapsible";
import { SidebarMenuButton } from "@/shared/ui/sidebar";
import { useSidebar } from "@/shared/ui/sidebar";
import { ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useState, useEffect } from 'react';

type CollapsibleSidebarMenuItemProps = {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
    isActive: boolean;
};

export function CollapsibleSidebarMenuItem({ icon: Icon, title, children, isActive }: CollapsibleSidebarMenuItemProps) {
    const { state } = useSidebar();
    const [isOpen, setIsOpen] = useState(isActive);

    useEffect(() => {
        if (state === 'collapsed') {
            setIsOpen(false);
        }
    }, [state]);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
                <SidebarMenuButton variant={isActive ? "active" : "default"} className="w-full justify-between">
                     <div className="flex items-center gap-3">
                        <Icon />
                        {state === 'expanded' && <span>{title}</span>}
                    </div>
                    {state === 'expanded' && (
                        <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")} />
                    )}
                </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div className={cn(
                    "ml-5 my-1 pl-3 border-l border-muted-foreground/20 space-y-1",
                     state === 'collapsed' && "hidden"
                )}>
                    {children}
                </div>
            </CollapsibleContent>
        </Collapsible>
    )
}
