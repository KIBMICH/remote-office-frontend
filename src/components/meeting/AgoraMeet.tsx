"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import ChatPanel from "./ChatPanel";

type AgoraMeetProps = {
  roomName: string;
  userName: string;
  className?: string;
  appId?: string; // If not provided, will try NEXT_PUBLIC_AGORA_APP_ID
  token?: string | null; // If not provided, will try fetch(`/api/agora/token`)
  onError?: (error: Error) => void;
  onMeetingEnd?: (roomName: string) => void;
};

type AgoraRTCClient = import("agora-rtc-sdk-ng").IAgoraRTCClient;
type RemoteUser = import("agora-rtc-sdk-ng").IAgoraRTCRemoteUser;
type ILocalTrack = import("agora-rtc-sdk-ng").ILocalTrack;

export default function AgoraMeet({
  roomName,
  userName,
  className = "",
  appId,
  token,
  onError,
  onMeetingEnd,
}: AgoraMeetProps) {
  const clientRef = useRef<AgoraRTCClient | null>(null);
  const localAudioRef = useRef<ILocalTrack | null>(null);
  const localVideoRef = useRef<ILocalTrack | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const localTileRef = useRef<HTMLDivElement | null>(null);
  const screenTrackRef = useRef<ILocalTrack | null>(null);
  const joiningRef = useRef(false); // Prevent multiple simultaneous joins
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [activeSpeakerUid, setActiveSpeakerUid] = useState<string | number | null>(null);
  const [shareError, setShareError] = useState("");
  const [gridCols, setGridCols] = useState(1);

  const getInviteUrl = () => {
    if (typeof window === "undefined") return "";
    // Share the current URL which already includes the roomName
    return window.location.href;
  };

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(getInviteUrl());
    } catch {}
  };

  type WebShareNavigator = Navigator & { share?: (data: ShareData) => Promise<void> };

  const shareInvite = async () => {
    const url = getInviteUrl();
    try {
      const nav = navigator as WebShareNavigator;
      if (nav.share) {
        await nav.share({ title: "Meeting Invite", text: `Join ${roomName}`, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {}
  };

  const importAgora = useCallback(async () => {
    const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
    return AgoraRTC;
  }, []);

  const getCreds = useCallback(async () => {
    const resolvedAppId = appId || process.env.NEXT_PUBLIC_AGORA_APP_ID || "";
    if (!resolvedAppId) throw new Error("Agora App ID missing. Set NEXT_PUBLIC_AGORA_APP_ID or pass appId prop.");

    if (typeof token !== "undefined") return { appId: resolvedAppId, token };

    try {
      const res = await fetch(`/api/agora/token?channel=${encodeURIComponent(roomName)}`);
      if (res.ok) {
        const data = await res.json();
        return { appId: resolvedAppId, token: data?.token ?? null };
      }
    } catch {}
    
    return { appId: resolvedAppId, token: null };
  }, [appId, token, roomName]);

  const clearGrid = () => {
    if (gridRef.current) {
      gridRef.current.innerHTML = "";
    }
    localTileRef.current = null;
  };

  const mountRemote = (user: RemoteUser) => {
    if (!gridRef.current) return;
    const id = `remote-${user.uid}`;
    let el = gridRef.current.querySelector(`#${CSS.escape(id)}`) as HTMLDivElement | null;
    if (!el) {
      el = document.createElement("div");
      el.id = id;
      el.style.width = "100%";
      el.style.height = "100%";
      el.style.position = "relative";
      el.style.background = "#000";
      el.style.borderRadius = "0.5rem";
      el.style.overflow = "hidden";
      el.style.aspectRatio = "16 / 9";
      el.style.maxWidth = "100%";
      gridRef.current.appendChild(el);
    }
    return el;
  };

  const mountLocal = () => {
    if (!gridRef.current) return null;

    const existing = gridRef.current.querySelector(`#local-self`);
    if (existing && existing !== localTileRef.current) {
      existing.remove();
    }
    if (!localTileRef.current) {
      const el = document.createElement("div");
      el.id = "local-self";
      el.style.width = "100%";
      el.style.height = "100%";
      el.style.position = "relative";
      el.style.background = "#000";
      el.style.borderRadius = "0.5rem";
      el.style.overflow = "hidden";
      el.style.aspectRatio = "16 / 9";
      el.style.maxWidth = "100%";
      gridRef.current.appendChild(el);
      localTileRef.current = el;
    }
    return localTileRef.current;
  };

  const leave = useCallback(async (silent = false) => {
    try {
      const client = clientRef.current;
      localAudioRef.current?.close();
      localVideoRef.current?.close();
      screenTrackRef.current?.close();
      localAudioRef.current = null;
      localVideoRef.current = null;
      screenTrackRef.current = null;
      
      
      if (gridRef.current) {
        gridRef.current.innerHTML = "";
      }
      localTileRef.current = null;

      if (client) {
        await client.unpublish();
        await client.leave();
        client.removeAllListeners();
        clientRef.current = null;
      }
      
      // Clear remote users
      setRemoteUsers([]);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Error during leave:", e);
    } finally {
      if (!silent) {
        setIsJoined(false);
        onMeetingEnd?.(roomName);
      }
    }
  }, [onMeetingEnd, roomName]);

  const join = useCallback(async () => {
    // Prevent multiple simultaneous joins
    if (joiningRef.current || isJoined) {
      return;
    }
    
    try {
      joiningRef.current = true;
      setIsLoading(true);
      setHasError(false);
      setErrorMessage("");
      
      // Clean up any existing connection and tracks before joining
      await leave(true); // Pass true to skip state updates during cleanup
      
      // Clear grid to prevent duplicate video elements
      clearGrid();
      
      const AgoraRTC = await importAgora();
      const { appId: useAppId, token: useToken } = await getCreds();

      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = client;

      // Track remote users
      client.on("user-published", async (user: RemoteUser, mediaType: "audio" | "video" | "datachannel") => {
        if (mediaType === "video" || mediaType === "audio") {
          await client.subscribe(user, mediaType);
          if (mediaType === "video") {
            const el = mountRemote(user);
            if (el) user.videoTrack?.play(el);
          }
          if (mediaType === "audio") user.audioTrack?.play();
          setRemoteUsers(Array.from(client.remoteUsers));
        }
      });

      client.on("user-unpublished", (user: RemoteUser) => {
        setRemoteUsers(Array.from(client.remoteUsers));
      });

      client.on("user-left", (user: RemoteUser) => {
        const el = gridRef.current?.querySelector(`#remote-${CSS.escape(String(user.uid))}`);
        el?.remove();
        setRemoteUsers(Array.from(client.remoteUsers));
      });

      // Active speaker detection
      client.enableAudioVolumeIndicator?.();
      type VolumeIndicator = { uid: string | number; level: number };
      client.on("volume-indicator", (volumes: VolumeIndicator[]) => {
        if (!Array.isArray(volumes) || volumes.length === 0) return;
        const top = volumes.reduce((a, b) => (b.level > a.level ? b : a));
        setActiveSpeakerUid(top.uid);
        // Add a subtle class on remote tile
        const targetId = `remote-${top.uid}`;
        gridRef.current?.querySelectorAll('[id^="remote-"]').forEach((node) => {
          const div = node as HTMLDivElement;
          if (div.id === targetId) {
            div.style.outline = "2px solid #7c3aed"; // purple
          } else {
            div.style.outline = "none";
          }
        });
      });

      // Join channel
      const uid = await client.join(useAppId, roomName, useToken || null, null);

      // Create local tracks
      // Preflight permission request for clearer UX
      try {
        const preflight = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        preflight.getTracks().forEach(t => t.stop());
      } catch (permErr) {
        throw new Error("Camera/Microphone permission denied. Please allow access and retry.");
      }

      const [micTrack, camTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      localAudioRef.current = micTrack;
      localVideoRef.current = camTrack;

      // Publish
      await client.publish([micTrack, camTrack]);

      // Play local video in the grid (Teams-like stage)
      const localEl = mountLocal();
      if (localEl) camTrack.play(localEl);

      setIsJoined(true);
      setIsLoading(false);
      joiningRef.current = false;
    } catch (e) {
      setHasError(true);
      setIsLoading(false);
      joiningRef.current = false;
      const msg = (e as Error)?.message || "Unknown error";
      setErrorMessage(msg);
      // Also surface to console for debugging
      // eslint-disable-next-line no-console
      console.error("Agora join error:", e);
      onError?.(e as Error);
    }
  }, [getCreds, importAgora, onError, roomName, isJoined, leave, clearGrid]);

  const toggleMic = async () => {
    const track = localAudioRef.current;
    if (!track) return;
    if (micOn) {
      await track.setEnabled(false);
      setMicOn(false);
    } else {
      await track.setEnabled(true);
      setMicOn(true);
    }
  };

  const toggleCam = async () => {
    const track = localVideoRef.current;
    if (!track) return;
    if (camOn) {
      await track.setEnabled(false);
      setCamOn(false);
    } else {
      await track.setEnabled(true);
      setCamOn(true);
    }
  };

  const toggleShare = useCallback(async () => {
    const client = clientRef.current;
    if (!client) return;
    const AgoraRTC = await importAgora();
    if (!sharing) {
      // Start screen share
      try {
        const screenTrack = await AgoraRTC.createScreenVideoTrack({ encoderConfig: "1080p_1" }, "auto");
        // createScreenVideoTrack can return a single track or a tuple; normalize to the video track
        const normalizedTrack = (Array.isArray(screenTrack) ? screenTrack[0] : screenTrack) as unknown as ILocalTrack;
        screenTrackRef.current = normalizedTrack;
        // Unpublish camera and publish screen
        if (localVideoRef.current) await client.unpublish([localVideoRef.current]);
        await client.publish([normalizedTrack]);
        setSharing(true);
      } catch (e: unknown) {
        // eslint-disable-next-line no-console
        console.error("Screen share failed", e);
        const msg = (e instanceof Error ? e.message : String(e)).toLowerCase();
        if (msg.includes("notallowed") || msg.includes("permission")) {
          setShareError("Screen share blocked. Please allow screen selection and try again.");
        } else {
          setShareError("Could not start screen share. Try a different tab/window.");
        }
        setTimeout(() => setShareError(""), 4000);
      }
    } else {
      // Stop screen share
      try {
        if (screenTrackRef.current) {
          await client.unpublish([screenTrackRef.current]);
          screenTrackRef.current.stop?.();
          screenTrackRef.current.close?.();
          screenTrackRef.current = null;
        }
        if (localVideoRef.current) {
          await client.publish([localVideoRef.current]);
        }
      } finally {
        setSharing(false);
      }
    }
  }, [importAgora, sharing]);

  useEffect(() => {
    // Auto-join only on desktop; on mobile, wait for user to click Join button
    // This prevents permission issues and multiple video feeds on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                     (typeof window !== "undefined" && window.innerWidth < 768);
    
    if (!isMobile) {
      join();
    } else {
      setIsLoading(false);
    }
    
    const containerEl = containerRef.current;
    return () => {
      // Ensure cleanup on unmount
      leave();
      if (containerEl) containerEl.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomName]);

  // Responsive grid columns based on container width
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const computeCols = (width: number) => {
      if (width < 640) return 1; // mobile
      if (width < 1024) return 2; // tablet
      return 3; // desktop
    };
    const RO: typeof ResizeObserver | undefined = (window as unknown as { ResizeObserver?: typeof ResizeObserver }).ResizeObserver;
    let ro: ResizeObserver | null = null;
    if (RO) {
      ro = new RO((entries: ResizeObserverEntry[]) => {
        for (const entry of entries) {
          const w = entry.contentRect?.width || container.clientWidth;
          setGridCols(computeCols(w));
        }
      });
      try {
        ro.observe(container);
      } catch {}
    }
    // Initial measure
    setGridCols(computeCols(container.clientWidth));
    return () => {
      try { ro?.disconnect(); } catch {}
    };
  }, []);

  if (hasError) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] bg-gray-900 rounded-xl border border-gray-800 ${className}`}>
        <div className="text-center p-6 max-w-md">
          <div className="text-red-400 text-2xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-white mb-2">Failed to Load Meeting (Agora)</h3>
          <p className="text-gray-400 mb-2">There was an error connecting to the meeting.</p>
          {errorMessage && (
            <p className="text-red-300 text-sm mb-4 break-words">{errorMessage}</p>
          )}
          <div className="space-y-3">
            <Button onClick={join} variant="primary" className="w-full">Try Again</Button>
          </div>
        </div>
        {shareError && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-20 z-20 bg-red-600 text-white text-sm px-3 py-2 rounded">
            {shareError}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative bg-gray-900 rounded-xl border border-gray-800 overflow-hidden ${className}`} style={{ minHeight: '70vh' }}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/90 to-transparent p-3 flex flex-wrap items-center justify-between gap-2 gap-y-2">
        <div className="flex items-center gap-2">

          <div className="text-white text-sm">{userName}</div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap justify-end">
          <Button onClick={copyInviteLink} variant="outline" size="sm" className="hidden sm:inline-flex">Copy Invite Link</Button>
          <Button onClick={shareInvite} variant="outline" size="sm" className="hidden sm:inline-flex">Share</Button>
          {isJoined ? (
            <Button onClick={() => { leave().catch(() => {}); }} variant="outline" size="sm" className="text-red-400 border-red-400/50 hover:bg-red-400/10">Leave</Button>
          ) : (
            <Button 
              onClick={join} 
              variant="primary" 
              size="sm"
              disabled={isLoading || joiningRef.current}
            >
              {isLoading ? "Joining..." : "Join"}
            </Button>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 items-center justify-center z-20 px-4 flex">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
            <p className="text-white">Joining meeting...</p>
            <p className="text-gray-400 text-sm mt-2">Room: {roomName}</p>
          </div>
        </div>
      )}

      {/* Stage/grid */}
      <div ref={containerRef} className="w-full h-[74dvh] sm:h-[80vh] relative">
        {(() => {
          const participantCount = (isJoined ? 1 : 0) + remoteUsers.length;
          const cols = participantCount === 1 ? 1 : Math.max(1, Math.min(gridCols, 3));
          return (
            <div
              ref={gridRef}
              className={`absolute inset-0 grid gap-2 p-2 ${participantCount === 1 ? 'place-items-center' : ''}`}
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            />
          );
        })()}
        {/* Bottom toolbar */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-4 z-20
          grid grid-cols-3 gap-2
          sm:flex sm:flex-wrap sm:items-center sm:gap-3
          bg-black/60 backdrop-blur rounded-2xl sm:rounded-full px-2 py-2 sm:px-4 sm:py-3
          border border-white/10 max-w-[calc(100%-1rem)] w-auto min-w-[0]"
        >
          <button onClick={toggleMic} aria-label="Toggle Mic" className={`h-10 w-10 grid place-items-center rounded-full ${micOn ? 'bg-white/10 text-white' : 'bg-red-600 text-white'}`}>
            {/* mic icon */}
            {micOn ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2Z"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M19 11a7 7 0 0 1-9.8 6.46l1.5-1.5A5 5 0 0 0 17 11h2Zm-1.27-7.73 1.41 1.41-3.14 3.14V11a4 4 0 0 1-6.4 3.2l1.55-1.55A2 2 0 0 0 13 11V9.83l4.73-4.56ZM5.27 4.27l1.41-1.41L20.14 16.3l-1.41 1.41-2.12-2.12A6.97 6.97 0 0 1 13 17.92V21h-2v-3.08A7 7 0 0 1 5 11h2a5 5 0 0 0 5 5c.5 0 .98-.07 1.44-.2L5.27 4.27ZM9 5a3 3 0 0 1 5.32-1.8l-1.49 1.44A1 1 0 0 0 12 5v.59L9 8.48V5Z"/></svg>
            )}
          </button>
          <button onClick={toggleCam} aria-label="Toggle Camera" className={`h-10 w-10 grid place-items-center rounded-full ${camOn ? 'bg-white/10 text-white' : 'bg-yellow-600 text-white'}`}>
            {/* video icon */}
            {camOn ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M17 10.5V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3.5l4 4v-11l-4 4Z"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M2.7 4.1 3.8 3 21 20.2l-1.1 1.1-3.2-3.2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7c0-.5.2-1 .5-1.3L2.7 4.1Zm14.3 3v4.88l4-4v7.96l-4-4V17a3 3 0 0 1-3 3H6.12l10.88-10.9Z"/></svg>
            )}
          </button>
          <button onClick={toggleShare} aria-label="Share Screen" className={`h-10 w-10 grid place-items-center rounded-full ${sharing ? 'bg-white/10 text-white' : 'bg-white/10 text-white'}`}>
            {/* screen share icon */}
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M3 4h18v12H3V4Zm8 16v-2H3v2h8Zm10 0v-2h-8v2h8ZM8 11l4-4 4 4h-3v3h-2v-3H8Z"/></svg>
          </button>
          <button onClick={() => setShowParticipants((v) => !v)} aria-label="Participants" className={`h-10 w-10 grid place-items-center rounded-full bg-white/10 text-white ${showParticipants ? 'ring-2 ring-purple-500' : ''}`}>
            {/* participants icon */}
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm-9 9a9 9 0 1 1 18 0H3Z"/></svg>
          </button>
          <button onClick={() => setShowChat((v) => !v)} aria-label="Chat" className={`h-10 w-10 grid place-items-center rounded-full bg-white/10 text-white ${showChat ? 'ring-2 ring-purple-500' : ''}`}>
            {/* chat icon */}
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M2 4h20v12H6l-4 4V4Z"/></svg>
          </button>
          <button onClick={() => { leave().catch(() => {}); }} aria-label="Leave" className="h-10 w-10 grid place-items-center rounded-full bg-red-600 text-white">
            {/* leave icon */}
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M10 3h4v4h-4V3Zm-7 7h18v4H3v-4Zm7 7h4v4h-4v-4Z"/></svg>
          </button>
        </div>
      </div>

      {/* Right side panels */}
      {(showParticipants || showChat) && (
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[360px] max-w-[90%] bg-gray-950/90 backdrop-blur border-l border-gray-800 z-30 flex">
          {showParticipants && (
            <aside className="w-full h-full p-3 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-200">Participants ({remoteUsers.length + (isJoined ? 1 : 0)})</h3>
                <Button size="sm" variant="outline" onClick={() => setShowParticipants(false)}>Close</Button>
              </div>
              <ul className="space-y-2">
                {isJoined && (
                  <li className="text-sm text-gray-200 flex items-center justify-between">
                    <span>You (local)</span>
                    <span className="text-xs text-gray-400">{micOn ? '🎤' : '🔇'} {camOn ? '📹' : '🚫'}</span>
                  </li>
                )}
                {remoteUsers.map((u) => (
                  <li key={String(u.uid)} className="text-sm text-gray-200 flex items-center justify-between">
                    <span>{String(u.uid)} {activeSpeakerUid === u.uid ? '• speaking' : ''}</span>
                    <span className="text-xs text-gray-400">remote</span>
                  </li>
                ))}
              </ul>
            </aside>
          )}
          {showChat && (
            <div className="w-full h-full border-l border-gray-800">
              <ChatPanel onSend={() => {}} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export type { AgoraMeetProps };

