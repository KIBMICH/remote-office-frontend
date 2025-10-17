"use client";
import React, { useMemo, useState } from "react";
import ParticipantTile from "./ParticipantTile";

type Participant = {
  id: string;
  name: string;
  avatarUrl?: string;
  isMuted?: boolean;
  isScreenShare?: boolean;
};

type VideoGridProps = {
  participants: Participant[];
  pageSize?: number;
};

export default function VideoGrid({ participants, pageSize = 6 }: VideoGridProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(participants.length / pageSize));
  const pageParticipants = useMemo(() => {
    const start = (page - 1) * pageSize;
    return participants.slice(start, start + pageSize);
  }, [participants, page, pageSize]);

  const canPaginate = participants.length > pageSize;

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div
        className="grid gap-4 sm:gap-5"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
      >
        {pageParticipants.map((p) => (
          <ParticipantTile key={p.id} {...p} />
        ))}
      </div>

      {canPaginate && (
        <div className="flex items-center justify-center gap-2 pt-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="h-8 w-8 rounded-lg border border-gray-800 text-gray-300 hover:bg-gray-800/60"
            aria-label="Previous page"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                aria-label={`Go to page ${i + 1}`}
                className={`h-2.5 w-2.5 rounded-full ${i + 1 === page ? "bg-white" : "bg-gray-600"}`}
              />
            ))}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="h-8 w-8 rounded-lg border border-gray-800 text-gray-300 hover:bg-gray-800/60"
            aria-label="Next page"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 6l6 6-6 6"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}


