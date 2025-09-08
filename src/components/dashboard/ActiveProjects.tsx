import React from "react";
import Card from "@/components/ui/Card";
import Progress from "@/components/ui/Progress";

type Project = {
  name: string;
  progress: number;
  due: string;
  members: number;
};

const data: Project[] = [
  { name: "RemoteHub Redesign", progress: 75, due: "2024-07-30", members: 5 },
  { name: "Mobile App Integration", progress: 40, due: "2024-08-15", members: 3 },
  { name: "AI Feature Development", progress: 90, due: "2024-07-20", members: 4 },
];

export default function ActiveProjects() {
  return (
    <Card title="Active Projects" action={<a href="#" className="text-blue-400 hover:text-blue-300">View All →</a>}>
      <div className="overflow-hidden rounded-lg border border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-900/60 text-gray-300">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Project</th>
              <th className="text-left px-4 py-3 font-medium">Progress</th>
              <th className="text-left px-4 py-3 font-medium">Due Date</th>
              <th className="text-left px-4 py-3 font-medium">Members</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.name} className="odd:bg-gray-950/40 even:bg-gray-900/40">
                <td className="px-4 py-3 text-gray-100">{p.name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Progress value={p.progress} className="w-40" />
                    <span className="text-gray-300">{p.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-300">{p.due}</td>
                <td className="px-4 py-3 text-gray-300">{p.members}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
