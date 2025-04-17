import {
  Activity, Box, ClipboardCheck, Gauge, Network, type LucideIcon, GraduationCap, ShieldCheck, MapPin, Signal, ListChecks, Users, Building, Package, BarChart3
} from "lucide-react";

export type SiteConfig = typeof siteConfig;

export interface Navigation {
  name: string;
  href?: string;
  icon?: LucideIcon;
  isHeader?: boolean;
  children?: Navigation[];
}

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
    name: "People",
    isHeader: true,
    icon: Users,
    children: [
      {
        icon: ClipboardCheck,
        name: "Tasks",
        href: "/execution",
      },
      {
        icon: ListChecks,
        name: "Workflow",
        href: "/workflow",
      },
      {
        icon: GraduationCap,
        name: "Training",
        href: "/training-certification",
      },
    ]
  },
  {
    name: "Places",
    isHeader: true,
    icon: Building,
    children: [
      {
        icon: MapPin,
        name: "Locations",
        href: "/locations",
      },
      {
        icon: Network,
        name: "Processes",
        href: "/sop-canvas",
      },
    ]
  },
  {
    name: "Things",
    isHeader: true,
    icon: Box,
    children: [
      {
        icon: Signal,
        name: "Sensors",
        href: "/sensors",
      },
      {
        icon: Activity,
        name: "Monitoring",
        href: "/monitoring",
      },
    ]
  },
  {
    name: "Reporting",
    isHeader: true,
    icon: BarChart3,
    children: [
      {
        icon: ShieldCheck,
        name: "Compliance",
        href: "/compliance",
      },
      {
        icon: Box,
        name: "Asset Intelligence",
        href: "/asset-intelligence",
      },
      {
        icon: Package,
        name: "Inventory Intelligence",
        href: "/inventory-intelligence",
      },
      {
        icon: Users,
        name: "Workforce Intelligence",
        href: "/workforce-intelligence",
      },
    ]
  },
];
