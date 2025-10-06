import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg">Remortify</h3>
          <p className="mt-2 text-sm">
            Virtual office platform for distributed teams. Collaborate
            seamlessly with chat, video calls, file sharing, and task
            management.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-2">Features</h4>
          <ul className="space-y-1">
            <li><Link href="/chat">Team Chat</Link></li>
            <li><Link href="/meetings">Video Meetings</Link></li>
            <li><Link href="/files">File Sharing</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-2">Platform</h4>
          <ul className="space-y-1">
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/projects">Projects</Link></li>
            <li><Link href="/settings">Settings</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-2">Support</h4>
          <ul className="space-y-1">
            <li><Link href="/support">Help Center</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/security">Security</Link></li>
          </ul>
        </div>
      </div>

      <p className="text-center text-xs mt-8">
        © 2025 Remortify. All rights reserved.
      </p>
    </footer>
  );
}
