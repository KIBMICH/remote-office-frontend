import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Progress from "@/components/ui/Progress";
import { projectService, type ProjectResponse } from "@/services/projectService";

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

export default function ActiveProjects() {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch active projects from API
  const fetchActiveProjects = async () => {
    try {
      setLoading(true);
      setError(null);
     
      
      const response = await projectService.getProjects({
        status: "active",
        page: 1,
        limit: 5, // Show top 5 active projects on dashboard
        sortBy: "createdAt",
        sortOrder: "desc"
      });
      
      
      setProjects(response.projects);
    } catch (err) {
      console.error("ActiveProjects: Failed to fetch projects:", err);
      setError("Failed to load active projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveProjects();
  }, []);
  return (
    <Card title="Active Projects" action={<a href="/projects/project-list" className="text-blue-400 hover:text-blue-300">View All →</a>}>
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
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <span className="ml-3">Loading projects...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-red-400">
                  {error}
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  No active projects found
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="odd:bg-gray-950/40 even:bg-gray-900/40">
                  <td className="px-4 py-3 text-gray-100">{project.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Progress value={project.progress || 0} className="w-40" />
                      <span className="text-gray-300">{project.progress || 0}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{formatDate(project.dueDate)}</td>
                  <td className="px-4 py-3 text-gray-300">{project.members?.length || 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
