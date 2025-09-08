import React from "react";
import Card from "@/components/ui/Card";

export default function Productivity() {
  return (
    <Card title="Productivity" action={<a href="#" className="text-blue-400 hover:text-blue-300">Filter</a>}>
      <div className="grid grid-cols-3 gap-4 items-end h-40">
        <Bar height="40%" label="Tasks" value="28" />
        <Bar height="20%" label="Messages" value="14" />
        <Bar height="80%" label="Files" value="56" />
      </div>
      <p className="text-xs text-gray-400 mt-3">Overview of your recent activities.</p>
    </Card>
  );
}

function Bar({ height, label, value }: { height: string; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-14 bg-gray-800 rounded flex items-end justify-center" style={{ height: "120px" }}>
        <div className="w-10 bg-gray-300/20 rounded" style={{ height }}>
          <div className="w-full h-full rounded bg-gray-100/10" />
        </div>
      </div>
      <span className="text-xs text-gray-300">{label}</span>
      <span className="text-xs text-gray-500">{value}</span>
    </div>
  );
}
