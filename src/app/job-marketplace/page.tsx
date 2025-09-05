"use client";
import React, { useState } from "react";
import { Search, MapPin, Clock, DollarSign, Filter, ChevronDown } from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  tags: string[];
  postedTime: string;
}

const jobListings: Job[] = [
  {
    id: "1",
    title: "Senior Remote Software Engineer (Backend)",
    company: "TechCorp",
    location: "Remote",
    type: "Full-time",
    salary: "$120k - $180k",
    description: "We are looking for an experienced backend engineer to join our growing team. You'll work on scalable systems and APIs that serve millions of users worldwide.",
    tags: ["Python", "AWS", "Docker"],
    postedTime: "2 days ago"
  },
  {
    id: "2",
    title: "UX Designer (Product-Focused)",
    company: "DesignStudio",
    location: "Remote",
    type: "Full-time",
    salary: "$90k - $130k",
    description: "Join our design team to create beautiful and intuitive user experiences for our web applications and mobile platforms.",
    tags: ["Figma", "UI/UX", "Prototyping"],
    postedTime: "1 day ago"
  },
  {
    id: "3",
    title: "Product Manager (Mobile Platform)",
    company: "MobileFirst",
    location: "Remote",
    type: "Full-time",
    salary: "$110k - $150k",
    description: "Lead the product strategy and roadmap for our mobile platform, working closely with engineering and design teams to deliver exceptional user experiences.",
    tags: ["Product Strategy", "Mobile", "Analytics"],
    postedTime: "3 days ago"
  },
  {
    id: "4",
    title: "Data Scientist (Finance & TypeScript)",
    company: "FinTech Solutions",
    location: "Remote",
    type: "Contract",
    salary: "$80k - $120k",
    description: "Analyze financial data and build predictive models to drive business insights and decision making for our fintech platform.",
    tags: ["Python", "SQL", "Machine Learning"],
    postedTime: "1 day ago"
  },
  {
    id: "5",
    title: "Frontend Developer (React & TypeScript)",
    company: "WebDev Co",
    location: "Remote",
    type: "Full-time",
    salary: "$85k - $125k",
    description: "Build interactive and responsive web applications using modern frontend technologies and best practices for optimal user experience.",
    tags: ["React", "TypeScript", "CSS"],
    postedTime: "4 days ago"
  },
  {
    id: "6",
    title: "Marketing Specialist (Digital & Content)",
    company: "GrowthAgency",
    location: "Remote",
    type: "Part-time",
    salary: "$50k - $70k",
    description: "Develop and execute content marketing strategies to drive brand awareness and lead generation across multiple digital channels.",
    tags: ["Content Marketing", "SEO", "Analytics"],
    postedTime: "2 days ago"
  }
];

export default function JobMarketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedSalary, setSelectedSalary] = useState("");
  const [selectedCompanySize, setSelectedCompanySize] = useState("");
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesJobType = !selectedJobType || job.type === selectedJobType;
    
    return matchesSearch && matchesJobType;
  });

  // Reusable Filters card
  const FiltersCard = () => (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-sm font-semibold mb-4 flex items-center text-white">
        <Filter className="w-4 h-4 mr-2" />
        Filters
      </h3>

      {/* Job Type */}
      <div className="mb-4">
        <h4 className="font-medium mb-2 flex items-center text-white text-sm">
          <Clock className="w-3 h-3 mr-2" />
          Job Type
        </h4>
        <div className="space-y-1">
          {["Full-time", "Part-time", "Contract", "Internship"].map((type) => (
            <label key={type} className="flex items-center text-xs">
              <input
                type="checkbox"
                className="mr-2 w-3 h-3 rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-500"
                checked={selectedJobType === type}
                onChange={(e) => setSelectedJobType(e.target.checked ? type : "")}
              />
              <span className="text-gray-300">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div className="mb-4">
        <h4 className="font-medium mb-2 text-white text-sm">Experience Level</h4>
        <div className="space-y-1">
          {["Entry level", "Mid level", "Senior level", "Executive"].map((level) => (
            <label key={level} className="flex items-center text-xs">
              <input
                type="checkbox"
                className="mr-2 w-3 h-3 rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-500"
                checked={selectedExperience === level}
                onChange={(e) => setSelectedExperience(e.target.checked ? level : "")}
              />
              <span className="text-gray-300">{level}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Salary Range */}
      <div className="mb-4">
        <h4 className="font-medium mb-2 flex items-center text-white text-sm">
          <DollarSign className="w-3 h-3 mr-2" />
          Salary Range
        </h4>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Min $</span>
            <span className="text-xs text-gray-400">Max $</span>
          </div>
          <div className="flex space-x-2">
            <input type="number" placeholder="0" className="w-full px-2 py-1 text-xs bg-gray-800 border border-gray-700 rounded" />
            <input type="number" placeholder="200k" className="w-full px-2 py-1 text-xs bg-gray-800 border border-gray-700 rounded" />
          </div>
        </div>
      </div>

      {/* Company Size */}
      <div className="mb-4">
        <h4 className="font-medium mb-2 text-white text-sm">Company Size</h4>
        <div className="space-y-1">
          {["1-10 employees", "11-50 employees", "51-200 employees", "200+ employees"].map((size) => (
            <label key={size} className="flex items-center text-xs">
              <input
                type="checkbox"
                className="mr-2 w-3 h-3 rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-500"
                checked={selectedCompanySize === size}
                onChange={(e) => setSelectedCompanySize(e.target.checked ? size : "")}
              />
              <span className="text-gray-300">{size}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Technologies */}
      <div>
        <h4 className="font-medium mb-2 text-white text-sm">Technologies</h4>
        <div className="space-y-1">
          {["React", "Python", "AI", "Node.js", "TypeScript", "AWS"].map((tech) => (
            <label key={tech} className="flex items-center text-xs">
              <input
                type="checkbox"
                className="mr-2 w-3 h-3 rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-500"
                checked={selectedTechnologies.includes(tech)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedTechnologies([...selectedTechnologies, tech]);
                  } else {
                    setSelectedTechnologies(selectedTechnologies.filter(t => t !== tech));
                  }
                }}
              />
              <span className="text-gray-300">{tech}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 px-3 rounded text-xs font-medium">
          Apply Filters
        </button>
        <button className="w-full bg-gray-800 hover:bg-gray-700 py-2 px-3 rounded text-xs">
          Clear All
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="text-xl font-bold text-blue-400">🏢 RemoteHub</div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-white hover:text-blue-400 font-medium">Company Dashboard</a>
              <a href="#" className="text-gray-400 hover:text-white">About Us</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">Search over 50k jobs, companies +</span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Filters Sidebar */}
        <div className="hidden md:block w-64 bg-gray-900 border-r border-gray-800 min-h-screen p-4">
          <div className="space-y-4">
            <FiltersCard />
          </div>
        </div>

        {/* Job Listings */}
        <div className="flex-1 p-6">
          {/* Mobile Filters Toggle */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="w-full flex items-center justify-between bg-gray-900 border border-gray-800 rounded px-3 py-2"
            
            >
              <span className="flex items-center text-sm font-medium">
                <Filter className="w-4 h-4 mr-2 text-blue-400" />
                Filters
              </span>
              <ChevronDown
                className={`${isMobileFilterOpen ? "rotate-180" : "rotate-0"} transition-transform duration-200 w-4 h-4 text-gray-400`}
              />
            </button>
            {isMobileFilterOpen && (
              <div className="mt-3">
                <FiltersCard />
              </div>
            )}
          </div>

          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Remote Job Opportunities</h1>
            <p className="text-gray-400 text-sm">Discover your next career move from anywhere in the world.</p>
          </div>
            {/* Job Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredJobs.map((job) => (
                <div key={job.id} className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-xs font-bold">
                          {job.company.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-blue-400 leading-tight">{job.title}</h3>
                          <p className="text-xs text-gray-400">{job.company}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-xs text-gray-400 mb-2">
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {job.type}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-300 mb-3 line-clamp-2">{job.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {job.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">{job.postedTime}</div>
                        <div className="text-xs font-medium text-green-400">{job.salary}</div>
                      </div>
                    </div>
                  </div>
                  
                  <button className="bg-blue-600 hover:bg-blue-700 py-2 px-6 rounded text-xs font-medium mt-2 self-start">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">No jobs found matching your criteria.</p>
              </div>
            )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-400">
              © 2024 RemoteHub. All rights reserved.
            </div>
            <div className="flex space-x-6 text-xs">
              <a href="#" className="text-gray-400 hover:text-white">Company</a>
              <a href="#" className="text-gray-400 hover:text-white">Resources</a>
              <a href="#" className="text-gray-400 hover:text-white">Legal</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
