import {
  CheckCircle,
  Hourglass,
  Navigator,
  XmarkCircle,
} from "@attaditya/iconoir-preact"

interface StatusIconProps {
  className?: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
}

export function StatusIcon({ className, status }: StatusIconProps) {
  const Icon = {
    "pending": Hourglass,
    "in_progress": Navigator,
    "completed": CheckCircle,
    "cancelled": XmarkCircle,
  }[status];

  return <Icon className={className} />;
}

