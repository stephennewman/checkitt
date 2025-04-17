import { Activity, Box, ClipboardCheck, Gauge, Network, type LucideIcon, MessagesSquare } from "lucide-react";

export type SiteConfig = typeof siteConfig;
export type Navigation = {
  icon: LucideIcon;
  name: string;
  href: string;
};

export const siteConfig = {
  title: "Checkit",
  description: "Template for VisActor and Next.js",
};

export const navigations: Navigation[] = [
  {
    icon: Gauge,
    name: "Dashboard",
    href: "/",
  },
  {
    icon: Activity,
    name: "Monitoring",
    href: "/monitoring",
  },
  {
    icon: Box,
    name: "Asset Intelligence",
    href: "/asset-intelligence",
  },
  {
    icon: ClipboardCheck,
    name: "Execution",
    href: "/execution",
  },
  {
    icon: Network,
    name: "SOP Canvas",
    href: "/sop-canvas",
  },
];
