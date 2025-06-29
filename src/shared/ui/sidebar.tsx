// Inspired by https://github.com/dillionverma/llm.report/blob/main/components/sidebar.tsx

'use client';
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/tooltip';
import { cn } from '@/shared/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/shared/ui/button';

const sidebarVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      state: {
        expanded: 'w-64',
        collapsed: 'w-16',
      },
    },
    defaultVariants: {
      state: 'expanded',
    },
  }
);
type SidebarContextProps = {
  state: 'expanded' | 'collapsed';
  setState: (state: 'expanded' | 'collapsed') => void;
  toggle: () => void;
};
export const SidebarContext = createContext<SidebarContextProps>(
  {} as SidebarContextProps
);
export function useSidebar() {
  return useContext(SidebarContext);
}
type SidebarProviderProps = {
  children: ReactNode;
};
export function SidebarProvider({ children }: SidebarProviderProps) {
  const [state, setState] = useState<'expanded' | 'collapsed'>('expanded');
  const contextValue = useMemo(
    () => ({
      state,
      setState,
      toggle: () =>
        setState(state === 'expanded' ? 'collapsed' : 'expanded'),
    }),
    [state]
  );
  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
}
type SidebarProps = {
  className?: string;
  children: ReactNode;
};
export function Sidebar({ className, children }: SidebarProps) {
  const { state } = useSidebar();
  return (
    <div
      className={cn(
        'hidden md:fixed md:inset-y-0 md:left-0 md:z-30 md:flex md:flex-col',
        sidebarVariants({ state }),
        className
      )}
    >
      <div className='flex h-full w-full flex-col'>{children}</div>
    </div>
  );
}
type SidebarInsetProps = {
  className?: string;
  children: ReactNode;
};
export function SidebarInset({
  className,
  children,
}: SidebarInsetProps) {
  const { state } = useSidebar();
  return (
    <main
      className={cn(
        'transition-[margin-left] ease-in-out duration-300',
        state === 'collapsed' ? 'md:ml-16' : 'md:ml-64',
        className
      )}
    >
      {children}
    </main>
  );
}
type SidebarContentProps = {
  className?: string;
  children: ReactNode;
};
export function SidebarContent({
  className,
  children,
}: SidebarContentProps) {
  return (
    <div
      className={cn(
        'flex flex-col flex-grow bg-sidebar border-r border-sidebar-border overflow-y-auto',
        className
      )}
    >
      {children}
    </div>
  );
}
type SidebarTriggerProps = {
  className?: string;
};
export function SidebarTrigger({
  className,
  ...props
}: SidebarTriggerProps) {
  const { state, toggle } = useSidebar();
  return (
    <Button
      variant='ghost'
      size='icon'
      className={cn(className)}
      onClick={toggle}
      {...props}
    >
      <ChevronLeft
        className={cn(
          'transition-transform duration-300',
          state === 'collapsed' && 'rotate-180'
        )}
      />
    </Button>
  );
}
type SidebarHeaderProps = {
  className?: string;
  children: ReactNode;
};
export function SidebarHeader({
  className,
  children,
}: SidebarHeaderProps) {
  const { state } = useSidebar();
  return (
    <header
      className={cn(
        'p-3 h-14 flex items-center',
        state === 'collapsed' && 'justify-center',
        className
      )}
    >
      {state === 'expanded' ? (
        children
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent side='right'>ProDvor</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </header>
  );
}
type SidebarMenuProps = {
  className?: string;
  children: ReactNode;
};
export function SidebarMenu({ className, children }: SidebarMenuProps) {
  return (
    <nav className={cn('flex-grow flex flex-col', className)}>
      {children}
    </nav>
  );
}
type SidebarMenuItemProps = {
  className?: string;
  children: ReactNode;
};
export function SidebarMenuItem({
  className,
  children,
}: SidebarMenuItemProps) {
  return <div className={cn('px-2 py-1', className)}>{children}</div>;
}
type SidebarMenuSubProps = {
  className?: string;
  children: ReactNode;
};
export function SidebarMenuSub({
  className,
  children,
}: SidebarMenuSubProps) {
  return (
    <div className={cn('pl-4 flex flex-col', className)}>
      {children}
    </div>
  );
}
type SidebarMenuSubItemProps = {
  className?: string;
  children: ReactNode;
};
export function SidebarMenuSubItem({
  className,
  children,
}: SidebarMenuSubItemProps) {
  return (
    <div className={cn('py-1', className)}>{children}</div>
  );
}
const buttonVariants = cva(
  'inline-flex items-center justify-start text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full',
  {
    variants: {
      variant: {
        default:
          'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent',
        active: 'text-sidebar-primary bg-sidebar-accent',
      },
      size: {
        default: 'h-10 px-3',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  tooltip?: string;
}
const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      children,
      tooltip,
      ...props
    },
    ref
  ) => {
    const { state } = useSidebar();
    const child =
      state === 'expanded' ? (
        <span className='flex gap-3 items-center'>{children}</span>
      ) : (
        <span className='flex gap-3 items-center justify-center'>
          {children}
        </span>
      );
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={cn(
                'rounded-lg',
                buttonVariants({ variant, size, className })
              )}
              ref={ref}
              {...props}
            >
              {child}
            </button>
          </TooltipTrigger>
          {state === 'collapsed' && tooltip && (
            <TooltipContent side='right'>{tooltip}</TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  }
);
SidebarMenuButton.displayName = 'SidebarMenuButton';
export { SidebarMenuButton };
const sidebarMenuSubButtonVariants = cva(
  'inline-flex items-center justify-start text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full',
  {
    variants: {
      variant: {
        default:
          'text-sidebar-foreground/70 hover:text-sidebar-foreground',
        active: 'text-sidebar-primary',
      },
      size: {
        default: 'h-8 px-3',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
export interface SidebarMenuSubButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof sidebarMenuSubButtonVariants> {
  asChild?: boolean;
}
const SidebarMenuSubButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuSubButtonProps
>(
  (
    { className, variant, size, asChild = false, href, ...props },
    ref
  ) => {
    const Comp = href ? 'a' : 'button';
    return (
      <Comp
        className={cn(
          'rounded-md',
          sidebarMenuSubButtonVariants({ variant, size, className })
        )}
        ref={ref}
        href={href}
        {...props}
      />
    );
  }
);
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton';
export { SidebarMenuSubButton };

export function SidebarSeparator({ className }: { className?: string }) {
    return (
        <hr className={cn("border-sidebar-border", className)} />
    )
}
