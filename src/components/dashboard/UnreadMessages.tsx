import React from "react";
import Card from "@/components/ui/Card";

const msgs = [
  { channel: "#general", body: "Sarah Connor: Hey team, just wa", time: "10:30 AM" },
  { channel: "Direct: John Doe", body: "John Doe: Regarding the new cli", time: "Yesterday" },
  { channel: "#design-feedback", body: "Emily White: Please review the la", time: "Mon" },
];

export default function UnreadMessages() {
  return (
    <Card title="Unread Messages" action={<a href="#" className="text-blue-400 hover:text-blue-300">View All →</a>}>
      <ul className="divide-y divide-gray-800">
        {msgs.map((m) => (
          <li key={m.channel} className="flex items-center justify-between py-3">
            <div>
              <div className="text-sm text-gray-100 font-medium">{m.channel}</div>
              <div className="text-xs text-gray-400">{m.body}</div>
            </div>
            <span className="text-xs text-gray-500">{m.time}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
