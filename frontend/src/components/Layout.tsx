import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="flex h-screen w-screen bg-[#0f172a] text-[#e2e8f0] font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8 bg-[#0b0f19]">
        <Outlet />
      </main>
    </div>
  );
}
