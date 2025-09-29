import { uniqueId } from "lodash";

interface MenuitemsType {
  [x: string]: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: string;
  children?: MenuitemsType[];
  chip?: string;
  chipColor?: string;
  variant?: string;
  external?: boolean;
}
import {
  IconUserCircle,
  IconBook,
  IconUsers,
  IconUserCheck,
  IconNotes,
  IconChartBar,
  IconWallet,
  IconBell
} from "@tabler/icons-react";



const Menuitems: MenuitemsType[] = [
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconChartBar,
    href: "/app/dashboard",
    chipColor: "secondary",
  },
  {
    id: uniqueId(),
    title: "HR-Admins",
    icon: IconUserCheck,
    href: "/app/teachers",
  },
  {
    id: uniqueId(),
    title: "Employees",
    icon: IconUserCircle,
    href: "/app/students",
  },
  {
    id: uniqueId(),
    title: "Supervisors",
    icon: IconUsers,
    href: "/app/parents",
  },
  {
    id: uniqueId(),
    title: "Subjects",
    icon: IconBook,
    href: "/app/subjects",
  },
  {
    id: uniqueId(),
    title: "Quizzes",
    icon: IconNotes,
    href: "/app/quizzes",
  },
  {
    id: uniqueId(),
    title: "Stripe Subscriptions",
    icon: IconWallet,
    href: "/app/subscriptions",
  },
  {
    id: uniqueId(),
    title: "Notifications",
    icon: IconBell,
    href: "/app/notifications",
  },
  // {
  //   id: uniqueId(),
  //   title: "Settings",
  //   icon: IconSettings,
  //   href: "/app/settings",
  // },
];

export default Menuitems;
