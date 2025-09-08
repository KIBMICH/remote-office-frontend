"use client";
import React from "react";
import QuickActions from "@/components/dashboard/QuickActions";
import ActiveProjects from "@/components/dashboard/ActiveProjects";
import Productivity from "@/components/dashboard/Productivity";
import UpcomingMeetings from "@/components/dashboard/UpcomingMeetings";
import UnreadMessages from "@/components/dashboard/UnreadMessages";
import { useAuthContext } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, loading } = useAuthContext();
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">
          {loading ? "Welcome back..." : `Welcome back, ${user?.name ?? "User"}!`}
        </h1>
        <p className="text-sm text-gray-300">Quick Actions</p>
      </header>

      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ActiveProjects />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UpcomingMeetings />
            <UnreadMessages />
          </div>
        </div>
        <div className="space-y-6">
          <Productivity />
        </div>
      </div>
    </div>
  );
}
