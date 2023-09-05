import Link from "next/link";
import { IconType } from "react-icons";

import { cn } from "../lib/utils";

interface SidebarMenuProps {
  label: string;
  active: boolean;
  href: string;
  icon: IconType;
  onClose?: () => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  label,
  active,
  href,
  icon: Icon,
  onClose,
}) => {
  return (
    <li
      className={cn(
        "px-3 py-4 rounded-[6px] bg-transparent hover:bg-[#DFE9FA80] transition-colors border-b border-[#DFE9FA] last:border-none",
        active && "bg-[#DFE9FA80]"
      )}
    >
      <Link href={href} onClick={onClose} className="flex items-center gap-x-4">
        <Icon size={20} className="text-main-dark" />
        <p className="text-base text-main-dark font-bold">{label}</p>
      </Link>
    </li>
  );
};

export default SidebarMenu;
