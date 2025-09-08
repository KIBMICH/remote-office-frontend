import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const items = [
  { title: "Project Alpha Sync", time: "Today, 11:00 AM" },
  { title: "Marketing Strategy Review", time: "Tomorrow, 02:00 PM" },
  { title: "Quarterly Team Retrospective", time: "Fri, 09:00 AM" },
];

export default function UpcomingMeetings() {
  return (
    <Card title="Upcoming Meetings" action={<a href="#" className="text-blue-400 hover:text-blue-300">View All →</a>}>
      <ul className="space-y-3">
        {items.map((m) => (
          <li key={m.title} className="flex items-center justify-between bg-gray-900/60 border border-gray-800 rounded-lg px-4 py-3">
            <div>
              <div className="text-sm text-gray-100 font-medium">{m.title}</div>
              <div className="text-xs text-gray-400">{m.time}</div>
            </div>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600">Join</Button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
