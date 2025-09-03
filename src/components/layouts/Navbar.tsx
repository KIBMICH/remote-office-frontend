import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="w-full p-4 border-b">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/">RemoteOffice</Link>
        <div className="flex gap-4">
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </div>
    </nav>
  );
}
