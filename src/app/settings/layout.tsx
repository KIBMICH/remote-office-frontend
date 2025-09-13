import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-gray-100">
      <DashboardHeader />
      <div className="pt-16">
        <div className="flex h-[calc(100vh-64px)]">
          <div className="hidden md:block sticky top-16 self-start h-[calc(100vh-64px)] overflow-y-auto">
            <Sidebar showHeader={false} />
          </div>
          <main className="flex-1 h-[calc(100vh-64px)] overflow-y-auto p-6">
            <div className="space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
