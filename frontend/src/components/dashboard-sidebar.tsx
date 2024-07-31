import { useAuth } from "@/hooks/use-auth";
import AvatarIcon from "../../public/avatar.jpeg";
import Image from "next/image";
import { ChevronsRight, Loader, BellDot } from "lucide-react";
import {
  AnalyticsIcon,
  BoardIcon,
  DownloadIcon,
  HomeIcon,
  PlusCircleIcon,
  SettingsIcon,
  TeamsIcon,
} from "./svgs";
import Link from "next/link";
import { OpenNewTaskSheet } from "./btns";
import { API, fetcher } from "@/fetcher";
export function SideBar() {
  return (
    <div className="h-screen w-72 border-r-border border-1 bg-white py-2 px-3 relative">
      <Avatar />

      {/* nav */}
      <div className=" w-full flex items-center justify-between pt-2">
        <div className=" flex items-center gap-4">
          <BellDot className=" w-4 h-4 text-blackAccent" />
          <div className=" relative  after:top-0 after:absolute after:right-0 after:w-[6px] after:h-[6px] after:rounded-full after:bg-yellow-300 after:z-20 ">
            <Loader className=" w-4 h-4 text-blackAccent" />
          </div>
          <ChevronsRight className=" w-4 h-4 text-blackAccent" />
        </div>
        <LogoutBtn />
      </div>

      {/* menu */}
      <div className=" flex flex-col gap-0 w-full pt-4  ">
        <div className=" flex items-center gap-2 bg-whiteAccent rounded-md px-2 py-1">
          <HomeIcon />
          <Link href={"#"} className=" text-blackAccent">
            Home
          </Link>
        </div>
        <div className=" flex items-center gap-2  px-2 py-1">
          <BoardIcon />
          <Link href={"#"} className=" text-blackAccent">
            Boards
          </Link>
        </div>
        <div className=" flex items-center gap-2  px-2 py-1">
          <SettingsIcon />
          <Link href={"#"} className=" text-blackAccent">
            Settings
          </Link>
        </div>
        <div className=" flex items-center gap-2  px-2 py-1">
          <TeamsIcon />
          <Link href={"#"} className=" text-blackAccent">
            Teams
          </Link>
        </div>
        <div className=" flex items-center gap-2  px-2 py-1">
          <AnalyticsIcon />
          <Link href={"#"} className=" text-blackAccent">
            Analytics
          </Link>
        </div>
      </div>
      <div className=" pt-3">
        <OpenNewTaskSheet variant={"none"} classname=" w-full">
          <p className=" flex items-center gap-2 justify-center">
            Create new task
            <PlusCircleIcon />
          </p>
        </OpenNewTaskSheet>
      </div>

      {/* download message */}
      <div className=" flex items-center gap-1 absolute bottom-3 left-2 right-2 bg-whiteAccent px-2 py-1 rounded-md text-blackAccent">
        <DownloadIcon />
        <div>
          <p className="font-medium">Download the app</p>
          <p className=" text-xs">Get the full experience</p>
        </div>
      </div>
    </div>
  );
}

function Avatar() {
  const { user } = useAuth();

  if (user)
    return (
      <div className=" flex items-center gap-2">
        <div className=" w-5 h-6 rounded-md">
          <Image
            src={AvatarIcon}
            alt="avatar"
            className=" w-full h-full rounded-md "
          />
        </div>
        <p className=" font-semibold text-base">{user.name}</p>
      </div>
    );
  return null;
}

function LogoutBtn() {
  const { signOut } = useAuth();

  return (
    <button
      className=" bg-whiteAccent rounded-sm px-3 py-1 text-blackAccent text-sm  "
      onClick={async () => {
        signOut();
        fetcher(API.user.logout);
      }}
    >
      Logout
    </button>
  );
}
