import { useRouter } from "next/router";
import { useMemo } from "react";
import { SlUser, SlUserFollowing } from "react-icons/sl";
import { PiBookOpenTextLight } from "react-icons/pi";

import Logo from "./logo";
import { Button } from "./ui/button";
import SidebarMenu from "./sidebar-menu";
import api from "../lib/api";

const Sidebar = () => {
  const router = useRouter();
  const { pathname } = router;

  const routes = useMemo(
    () => [
      {
        label: "회원 관리",
        active: pathname === "/",
        href: "/",
        icon: SlUser,
      },
      {
        label: "작가 관리",
        active: pathname === "/authors",
        href: "/authors",
        icon: SlUserFollowing,
      },
      {
        label: "전자책 관리",
        active: pathname === "/ebooks",
        href: "/ebooks",
        icon: PiBookOpenTextLight,
      },
    ],
    [pathname]
  );

  const handleLogout = async () => {
    await api.post("/auth/logout");
    router.reload();
  };

  return (
    <aside className="max-w-[320px] w-full h-full hidden md:flex flex-col gap-y-8 p-10 shadow-sidebar fixed inset-0">
      <Logo />
      <nav className="flex-1">
        <ul>
          {routes.map((route) => (
            <SidebarMenu key={route.label} {...route} />
          ))}
        </ul>
      </nav>
      <Button
        size="default"
        onClick={handleLogout}
        className="w-[107px] font-bold"
      >
        로그아웃
      </Button>
    </aside>
  );
};

export default Sidebar;
