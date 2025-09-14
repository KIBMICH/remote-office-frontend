"use client";

import React, { useState } from "react";
import Tabs from "@/components/ui/Tabs";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";

const jobTitles = [
  { label: "Software Development", value: "software-development" },
  { label: "Product Management", value: "product-management" },
  { label: "Designer", value: "designer" },
  { label: "Marketing", value: "marketing" },
  { label: "Contact Ember", value: "contact-ember" },
];

const departments = [
  { label: "Engineering", value: "engineering" },
  { label: "Design", value: "design" },
  { label: "Marketing", value: "marketing" },
  { label: "Sales", value: "sales" },
  { label: "HR", value: "hr" },
];

// Shared list of countries used in Company and Profile tabs
const countries = [
  { label: "Nigeria", value: "ng" },
  { label: "United States", value: "us" },
  { label: "United Kingdom", value: "uk" },
  { label: "Canada", value: "ca" },
];

export default function SettingsPage() {
  const [active, setActive] = useState("company");
  const [domain, setDomain] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("software-development");
  const [department, setDepartment] = useState("engineering");
  const [contactEmail, setContactEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [info, setInfo] = useState("");
  // Company fields
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyCountry, setCompanyCountry] = useState("ng");
  // Profile fields
  const [profileAddress, setProfileAddress] = useState("");
  const [profileCountry, setProfileCountry] = useState("ng");

  const tabs = [
    { key: "company", label: "Company" },
    { key: "profile", label: "Profile" },
    { key: "security", label: "Security" },
    { key: "notifications", label: "Notifications" },
  ];

  const onLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const currentTabLabel = tabs.find(t => t.key === active)?.label ?? "Company";
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-200">Settings / {currentTabLabel}</h1>

      <div className="mt-4">
        <Tabs tabs={tabs} value={active} onChange={setActive} fullWidth />
      </div>

      {active === "company" && (
        <div className="mt-6 space-y-6">
          {/* Company Information */}
          <Card title="Company Information">
            <div className="space-y-5">
              <p className="text-sm text-gray-400">Manage your organization&#39;s details.</p>
              {/* Grid with logo and form fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Left: Logo + Company name */}
                <div className="border border-gray-800 rounded-lg p-4 bg-gray-950/50">
                  <div className="flex items-center gap-4">
                    {/* Circular placeholder */}
                    <div className="flex flex-col items-center">
                      <div className="h-20 w-20 rounded-full bg-gray-800 ring-1 ring-gray-700/70 flex items-center justify-center relative overflow-hidden">
                        {logoPreview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
                        ) : (
                          <svg className="h-8 w-8 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                            <path d="M7 7l10 10M17 7L7 17" />
                          </svg>
                        )}
                      </div>
                      {/* Small blue chip */}
                      <label className="mt-2 inline-block">
                        <input type="file" accept="image/*" className="hidden" onChange={onLogoChange} />
                        <span className="inline-block px-3 py-1 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">Upload/Logo</span>
                      </label>
                    </div>

                    {/* Company Name text */}
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-200">Company Name</div>
                      <div className="text-xs text-gray-400">Manage your organization&#39;s details</div>
                    </div>
                  </div>

                  {/* Wide grey action */}
                 
                </div>

                {/* Middle: fields */}
                <div className="space-y-4">
                  <Input variant="dark" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company Name" />
                  <Select
                    value={jobTitle}
                    onChange={setJobTitle}
                    options={jobTitles}
                  />
                  <Input variant="dark" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="Contact Email" />
                </div>

                {/* Right: fields */}
                <div className="space-y-4">
                  <Select
                    value={department}
                    onChange={setDepartment}
                    options={departments}
                  />
                  <Input variant="dark" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} placeholder="Contact Number" />
                  <Input variant="dark" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website" />
                </div>
              </div>

              {/* Company Address and Country (wider layout) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2 md:col-span-2">
                  <div className="text-sm text-gray-300">Address</div>
                  <Input variant="dark" value={companyAddress} onChange={(e)=>setCompanyAddress(e.target.value)} placeholder="Address" />
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-300">Country</div>
                  <Select value={companyCountry} onChange={setCompanyCountry} options={countries} />
                </div>
              </div>

              {/* Read-only field */}
              <div>
                <div className="relative">
                  <input
                    value={info}
                    onChange={(e) => setInfo(e.target.value)}
                    readOnly
                    className="w-full bg-gray-900/60 border border-gray-800 rounded-lg px-3 py-2 text-gray-400 placeholder-gray-500 focus:outline-none"
                  />
                  <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-md border border-gray-700 bg-gray-900/80 text-gray-400">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                      <path d="M19 11V7a5 5 0 0 0-10 0v4M5 11h14v10H5V11Z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Manage Subscription (low emphasis) */}
              <div>
                <button className="w-full text-left bg-gray-900/60 border border-gray-800 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-900/70">
                  Manage Subscription
                </button>
              </div>

              {/* Company Domain */}
              <div>
                <div className="text-sm font-semibold text-gray-300 mb-2">Company Domain</div>
                <div className="flex gap-3">
                  <Input
                    variant="dark"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="Company Domain"
                    className="flex-1"
                  />
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">Save Domain</Button>
                </div>
              </div>

              {/* Billing & Subscription */}
              <div>
                <div className="text-sm font-semibold text-gray-300 mb-3">Billing & Subscription</div>
                <div className="bg-gray-950/50 border border-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-300">Current Plan: <span className="font-medium text-gray-200">Pro (Unlimited Users)</span></div>
                  <div className="text-sm text-gray-400 mt-1">Next Billing Date: <span className="text-gray-300">August 15, 2024</span></div>
                  <div className="mt-3">
                    <Button size="sm" className="bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700">Manage Subscription</Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Subscription Details */}
          <Card title="Subscription Details" action={<button className="h-5 w-5 rounded-full border border-gray-700 text-gray-500 hover:text-gray-300" aria-label="toggle"/>} className="">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-sm font-medium text-gray-200">Pro (Unlimited Users)</div>
              <Badge color="green">Active</Badge>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-gray-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-black">
                  <tr className="text-gray-300">
                    <th className="px-4 py-3 border-b border-gray-800">Subscription Plan</th>
                    <th className="px-4 py-3 border-b border-gray-800">Email</th>
                    <th className="px-4 py-3 border-b border-gray-800">Role</th>
                    <th className="px-4 py-3 border-b border-gray-800">Status</th>
                    <th className="px-4 py-3 border-b border-gray-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-gray-950/40" : "bg-gray-950/20"}>
                      <td className="px-4 py-3 border-b border-gray-900 text-gray-200">{r.name}</td>
                      <td className="px-4 py-3 border-b border-gray-900 text-gray-300">{r.email}</td>
                      <td className="px-4 py-3 border-b border-gray-900 text-gray-300">{r.role}</td>
                      <td className="px-4 py-3 border-b border-gray-900">
                        <Badge color={r.status === "Active" ? "green" : r.status === "Pending" ? "yellow" : "gray"}>{r.status}</Badge>
                      </td>
                      <td className="px-4 py-3 border-b border-gray-900">
                        <div className="flex items-center gap-4 text-sm">
                          <button className="text-blue-400 hover:underline">Edit</button>
                          <button className="text-red-400 hover:underline">Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save Company Settings</Button>
            </div>
          </Card>
        </div>
      )}

      {active === "profile" && (
        <div className="mt-6 space-y-6">
          <Card title="Personal Information">
            <div className="space-y-5">
              {/* Top grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Avatar column */}
                <div className="border border-gray-800 rounded-lg p-4 bg-gray-950/50">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-20 w-20 rounded-full bg-gray-700 ring-1 ring-gray-600/60 flex items-center justify-center">
                        <svg className="h-8 w-8 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <circle cx="12" cy="8" r="3" />
                          <path d="M4 20a8 8 0 0 1 16 0" />
                        </svg>
                      </div>
                      <button className="mt-2 inline-flex px-3 py-1 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700">Upload/Change</button>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-200">Profile Picture</div>
                    </div>
                  </div>
                </div>

                {/* Middle fields */}
                <div className="space-y-4">
                  <Input variant="dark" placeholder="First Name" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
                  <Input variant="dark" placeholder="Phone Number" value={contactNumber} onChange={(e)=>setContactNumber(e.target.value)} />
                  <Input variant="dark" placeholder="Job Title" />
                </div>

                {/* Right fields */}
                <div className="space-y-4">
                  <Input variant="dark" placeholder="Last Name" />
                  <Input variant="dark" placeholder="Phone Number" />
                  <Select value={department} onChange={setDepartment} options={departments} />
                </div>
              </div>

              {/* Read-only email bar with lock */}
              <div className="relative">
                <Input variant="dark" readOnly placeholder="(Read-only)" value="" />
                <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-md border border-gray-700 bg-gray-900/80 text-gray-400">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                    <path d="M19 11V7a5 5 0 0 0-10 0v4M5 11h14v10H5V11Z" />
                  </svg>
                </button>
              </div>

              {/* Primary email visible input */}
              <Input variant="dark" value={contactEmail} onChange={(e)=>setContactEmail(e.target.value)} placeholder="alice.smith@remotehub.com" />

              {/* Secondary grouped controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <div className="text-sm text-gray-300">Email</div>
                  <div className="relative">
                    <Input variant="dark" readOnly placeholder="(Read-only)" />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">○</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-300">Timezone</div>
                  <div className="relative">
                    <Select value="utc-5" onChange={()=>{}} options={[{label:"UTC-5:00 Eastern Time (US, Canada)", value:"utc-5"}]} />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">○</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-300">Language</div>
                  <div className="relative">
                    <Select value="en-us" onChange={()=>{}} options={[{label:"English (US)", value:"en-us"}]} />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">○</div>
                  </div>
                </div>
              </div>

              {/* Address and Country */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2 md:col-span-2">
                  <div className="text-sm text-gray-300">Address</div>
                  <Input variant="dark" value={profileAddress} onChange={(e)=>setProfileAddress(e.target.value)} placeholder="Address" />
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-300">Country</div>
                  <Select value={profileCountry} onChange={setProfileCountry} options={countries} />
                </div>
                <div className="hidden md:block" />
              </div>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {active !== "company" && active !== "profile" && (
        <Card>
          <div className="text-gray-400 text-sm">This section is a placeholder for the {tabs.find(t=>t.key===active)?.label} tab.</div>
        </Card>
      )}
    </div>
  );
}

const rows = [
  { name: "Alice Smith", email: "alice@remotehub.com", role: "Team Lead", status: "Active" },
  { name: "Bob Johnson", email: "bob@remotehub.com", role: "Developer", status: "Active" },
  { name: "Charlie Brown", email: "charlie@remotehub.com", role: "Designer", status: "Active" },
  { name: "Diana Prince", email: "diana@remotehub.com", role: "Marketing", status: "Pending" },
  { name: "Eve Adams", email: "eve@remotehub.com", role: "HR", status: "Active" },
] as const;
