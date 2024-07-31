import { useAuth } from "@/hooks/use-auth";
import { SideBar } from "./dashboard-sidebar";
import { Barlow } from "next/font/google";
import {
  AccessFeature,
  Notesfeature,
  PlusCircleIcon,
  QuestionMark,
  SparkleIcon,
  TagFeature,
} from "./svgs";
import { Input } from "./ui/input";
import { Calendar, Filter, Search, Share2 } from "lucide-react";
import { OpenNewTaskSheet } from "./btns";
import { TaskBoard } from "./task-board";
import { TaskProvider } from "@/hooks/use-tasks";
import { EditorProvider } from "@/hooks/use-editor";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export function DashBoardPage() {
  return (
    <TaskProvider>
      <EditorProvider>
        <div className="flex w-full h-screen">
          <SideBar />
          <div className=" w-full overflow-y-auto bg-whiteAccent px-4 py-4">
            <Greeting />
            <Features />
            <ToolBar />
            <TaskBoard />
          </div>
        </div>
      </EditorProvider>
    </TaskProvider>
  );
}

function Greeting() {
  const { user } = useAuth();
  if (user)
    return (
      <div className="flex items-center justify-between w-full pb-4">
        <p
          className={`text-blackPrimary text-3xl font-semibold ${barlow.className}`}
        >
          Good morning, {user.name}!
        </p>
        <p className=" text-xs text-blackPrimary font-medium flex items-start gap-2">
          Help and feedback <QuestionMark />
        </p>
      </div>
    );
  return null;
}

function Features() {
  return (
    <div className=" grid grid-cols-3 gap-2 w-full pb-4">
      <div className=" flex items-center gap-2 bg-white py-3 px-3 rounded-md">
        <div className=" w-32">
          <TagFeature />
        </div>
        <div className="text-blackAccent">
          <p className=" text-sm  font-semibold">Introducing tags</p>
          <p className=" text-xs">
            Easily categorize and find your notes by adding tags. Keep your
            workspace clutter-free and efficient.
          </p>
        </div>
      </div>
      <div className=" flex items-center gap-2 bg-white py-3 px-3 rounded-md">
        <div className=" w-32">
          <Notesfeature />
        </div>
        <div className="text-blackAccent">
          <p className=" text-sm  font-semibold">Share Notes Instantly</p>
          <p className=" text-xs">
            Effortlessly share your notes with others via email or link. Enhance
            collaboration with quick sharing options.
          </p>
        </div>
      </div>
      <div className=" flex items-center gap-2 bg-white py-3 px-3 rounded-md">
        <div className=" w-32">
          <AccessFeature />
        </div>
        <div className="text-blackAccent">
          <p className=" text-sm  font-semibold">Access Anywhere</p>
          <p className=" text-xs">
            Sync your notes across all devices. Stay productive whether you are
            on your phone, tablet, or computer.
          </p>
        </div>
      </div>
    </div>
  );
}

function ToolBar() {
  return (
    <div className=" w-full flex items-center justify-between text-blackAccent pb-4">
      <div className=" relative">
        <Search className=" w-4 h-4 absolute right-1 top-1/2 -translate-y-1/2 text-blackAccent" />
        <Input placeholder="Search" className=" bg-white py-0 h-8 w-40" />
      </div>
      <div className=" flex items-end gap-2">
        <div className=" flex items-start gap-2 hover:bg-white transition-all px-2 py-1 rounded-md">
          <p className=" text-sm">Calendar view</p>
          <Calendar className=" w-4 h-4 text-blackAccent" />
        </div>
        <div className=" flex items-start gap-2  hover:bg-white transition-all px-2 py-1 rounded-md">
          <p className=" text-sm">Automation</p>
          <SparkleIcon />
        </div>
        <div className=" flex items-start gap-2  hover:bg-white transition-all px-2 py-1 rounded-md">
          <p className=" text-sm">Filter</p>
          <Filter className=" w-4 h-4 text-blackAccent" />
        </div>
        <div className=" flex items-start gap-2  hover:bg-white transition-all px-2 py-1 rounded-md">
          <p className=" text-sm">Share</p>
          <Share2 className=" w-4 h-4 text-blackAccent" />
        </div>

        {/* create new task button */}

        <OpenNewTaskSheet variant="none" classname=" px-1 ">
          <p className=" flex items-center gap-1 justify-center text-sm">
            Create new
            <PlusCircleIcon />
          </p>
        </OpenNewTaskSheet>
      </div>
    </div>
  );
}
