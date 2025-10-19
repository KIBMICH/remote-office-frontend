"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface Meeting {
  id: string;
  title: string;
  description: string;
  scheduledAt: string;
  duration: number;
  isPublic: boolean;
  status: string;
  roomName: string;
  participants: Array<{ id: string; name: string; email: string }>;
  maxParticipants: number;
  createdAt: string;
  createdBy: string;
}

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMeetingCreated: (meeting: Meeting) => void;
}

interface MeetingFormData {
  title: string;
  description: string;
  duration: number;
  isPublic: boolean;
  scheduledAt: string;
}

export default function CreateMeetingModal({ 
  isOpen, 
  onClose, 
  onMeetingCreated 
}: CreateMeetingModalProps) {
  const [formData, setFormData] = useState<MeetingFormData>({
    title: "",
    description: "",
    duration: 60,
    isPublic: false,
    scheduledAt: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16), // 1 hour from now
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError("Meeting title is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/meetings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create meeting");
      }

      // Success - notify parent and close modal
      onMeetingCreated(result.meeting);
      onClose();
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        duration: 60,
        isPublic: false,
        scheduledAt: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
      });

    } catch (error) {
      console.error("Error creating meeting:", error);
      setError(error instanceof Error ? error.message : "Failed to create meeting");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof MeetingFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(""); // Clear error when user starts typing
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Create New Meeting</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Meeting Title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter meeting title..."
              variant="dark"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter meeting description (optional)..."
              className="w-full px-3 py-2 bg-gray-950/60 border border-gray-800 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Duration (minutes)"
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", parseInt(e.target.value) || 60)}
                variant="dark"
                min={15}
                max={480}
              />
            </div>
            <div>
              <Input
                label="Scheduled Time"
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => handleInputChange("scheduledAt", e.target.value)}
                variant="dark"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => handleInputChange("isPublic", e.target.checked)}
              className="h-4 w-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500 focus:ring-2"
            />
            <label htmlFor="isPublic" className="text-sm text-gray-300">
              Make this meeting public (anyone with the link can join)
            </label>
          </div>

          {error && (
            <div className="p-3 bg-red-900/50 border border-red-800 rounded-md">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="flex items-center gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={isLoading || !formData.title.trim()}
            >
              {isLoading ? "Creating..." : "Create Meeting"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
