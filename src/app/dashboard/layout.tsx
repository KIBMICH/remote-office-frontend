"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false); // drawer slide state
  const [overlayVisible, setOverlayVisible] = useState(false); // mount/unmount overlay

  const openMenu = () => {
    setOverlayVisible(true);
    // allow overlay to mount before starting slide animation
    requestAnimationFrame(() => setMobileOpen(true));
  };
  const closeMenu = () => {
    setMobileOpen(false);
    // wait for transition to end before unmounting overlay
    setTimeout(() => setOverlayVisible(false), 300);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    if (overlayVisible) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overlayVisible]);
  return (
    <div className="min-h-screen bg-black text-gray-100">
      <DashboardHeader onMenuClick={openMenu} />
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

      {/* Mobile sidebar overlay */}
      {overlayVisible && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${mobileOpen ? "bg-black/60 opacity-100" : "bg-black/60 opacity-0"}`}
            onClick={closeMenu}
          />
          <div className={`absolute inset-y-0 left-0 w-72 shadow-xl transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <Sidebar showHeader onClose={closeMenu} />
          </div>
        </div>
      )}
    </div>
  );
}
