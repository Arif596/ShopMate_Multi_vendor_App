// src/components/common/RoleBadge.jsx
import { Store, User } from "lucide-react";

const roleStyles = {
  Vendor: {
    icon: Store,
    className: "bg-amber-500/20 text-amber-500 border-amber-500/40",
  },
  User: {
    icon: User,
    className: "bg-primary/20 text-primary border-primary/40",
  },
};

const RoleBadge = ({ role, className = "" }) => {
  if (!role) return null;
  const { icon: Icon, className: style } = roleStyles[role] ?? roleStyles.User;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full border ${style} ${className}`}
    >
      <Icon className="w-3 h-3" />
      {role}
    </span>
  );
};

export default RoleBadge;