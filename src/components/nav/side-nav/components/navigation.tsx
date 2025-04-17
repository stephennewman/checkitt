"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigations, type Navigation as NavigationType } from "@/config/site";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from 'lucide-react';
import React, { useState } from "react";

const NavItem: React.FC<{ item: NavigationType; level?: number }> = ({ item, level = 0 }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const paddingLeft = level > 0 ? `pl-${2 + level * 2}` : 'pl-2';

  if (item.isHeader) {
    const HeaderIcon = item.icon;
    if (item.children && item.children.length > 0) {
      return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-3">
          <CollapsibleTrigger asChild>
             <button className={cn(
               "flex w-full items-center rounded-md px-2 py-1.5 text-left",
               "border-b border-border/50",
               "bg-slate-200/60 dark:bg-slate-800",
               "hover:bg-slate-300 dark:hover:bg-slate-700"
             )}>
                {HeaderIcon && <HeaderIcon size={16} className="mr-2 text-slate-800 dark:text-slate-200 flex-shrink-0" />}
                <span className="flex-grow text-sm font-bold text-slate-700 dark:text-slate-300 tracking-wider">
                  {item.name}
                </span>
                 <ChevronRight 
                   size={14} 
                   className={cn("transition-transform duration-200", isOpen && "rotate-90")} 
                 />
             </button>
           </CollapsibleTrigger>
           <CollapsibleContent className="space-y-1 pt-1">
              {item.children.map((child) => (
                <NavItem key={child.name} item={child} level={level + 1} />
             ))}
           </CollapsibleContent>
         </Collapsible>
      );
    } else {
       return (
          <div className="mt-3 flex items-center rounded-md px-2 py-1.5 border-b border-border/50 bg-slate-200/60 dark:bg-slate-800">
             {HeaderIcon && <HeaderIcon size={16} className="mr-2 text-slate-800 dark:text-slate-200" />}
             <span className="text-sm font-bold text-slate-700 dark:text-slate-300 tracking-wider">
              {item.name}
             </span>
           </div>
        );
    }
  }

  const Icon = item.icon;
  const isActive = pathname === item.href;

  if (!item.href) return null;

  const isTopLevelLink = level === 0;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center rounded-md py-1.5",
        isTopLevelLink ? "px-2 mt-3" : paddingLeft,
        "hover:bg-slate-200 dark:hover:bg-slate-800",
        isActive ? "bg-slate-200 dark:bg-slate-800" : "bg-transparent",
      )}
    >
      {Icon && <Icon size={16} className="mr-2 text-slate-800 dark:text-slate-200 flex-shrink-0" />}
      <span className={cn(
        "text-sm text-slate-700 dark:text-slate-300",
        isTopLevelLink && "font-bold tracking-wider"
      )}>
        {item.name}
      </span>
    </Link>
  );
};

export default function Navigation() {
  return (
    <nav className="flex-grow flex-col space-y-1 p-2 overflow-y-auto">
      {navigations.map((item) => (
        <NavItem key={item.name} item={item} />
      ))}
    </nav>
  );
}
