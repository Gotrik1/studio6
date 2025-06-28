'use client';

import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarMenuButton,
  SidebarMenuSub,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface CollapsibleSidebarMenuItemProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

export function CollapsibleSidebarMenuItem({
  icon,
  title,
  children,
}: CollapsibleSidebarMenuItemProps) {
  const { state } = useSidebar();
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (state === 'collapsed') {
      setIsOpen(false);
    }
  }, [state]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <SidebarMenuButton variant="default" className="w-full justify-start">
          {icon}
          <span>{title}</span>
          <ChevronRight
            className={cn(
              'ml-auto h-4 w-4 shrink-0 transition-transform',
              isOpen && 'rotate-90'
            )}
          />
        </SidebarMenuButton>
      </CollapsibleTrigger>
      {state === 'expanded' && (
        <CollapsibleContent className="data-[state=closed]:animate-none data-[state=open]:animate-none">
          <SidebarMenuSub>{children}</SidebarMenuSub>
        </CollapsibleContent>
      )}
    </Collapsible>
  );
}
