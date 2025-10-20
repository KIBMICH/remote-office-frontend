"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Button from "@/components/ui/Button";

// Jitsi types (since we don't have @types/jitsi-meet)
interface JitsiEventData {
  [key: string]: unknown;
  error?: string;
  displayName?: string;
  id?: string;
}

interface JitsiMeetExternalAPI {
  dispose: () => void;
  addEventListener: (event: string, listener: (data: JitsiEventData) => void) => void;
  removeEventListener: (event: string, listener: (data: JitsiEventData) => void) => void;
  executeCommand: (command: string, value?: unknown) => void;
}

interface JitsiMeetConfig {
  roomName: string;
  width: string | number;
  height: string | number;
  parentNode: HTMLElement;
  userInfo?: {
    displayName?: string;
    email?: string;
  };
  configOverwrite?: {
    startWithAudioMuted?: boolean;
    startWithVideoMuted?: boolean;
    startAudioOnly?: boolean;
    enableWelcomePage?: boolean;
    enableClosePage?: boolean;
    enableInsecureRoomNameWarning?: boolean;
    enableLayerSuspension?: boolean;
    enableNoisyMicDetection?: boolean;
    enableTalkWhileMuted?: boolean;
    enableNoAudioDetection?: boolean;
    enableJoinWithoutMic?: boolean;
    enableRembrandt?: boolean;
    channelLastN?: number;
    startScreenSharing?: boolean;
    enableRecording?: boolean;
    liveStreamingEnabled?: boolean;
    fileRecordingsEnabled?: boolean;
    localRecording?: boolean;
    p2p?: {
      enabled: boolean;
      stunServers: Array<{ urls: string }>;
    };
    analytics?: {
      disabled: boolean;
    };
    disableRtx?: boolean;
    enableLipSync?: boolean;
  };
  interfaceConfigOverwrite?: {
    TOOLBAR_BUTTONS?: string[];
    SETTINGS_SECTIONS?: string[];
    SHOW_JITSI_WATERMARK?: boolean;
    SHOW_WATERMARK_FOR_GUESTS?: boolean;
    SHOW_POWERED_BY?: boolean;
    SHOW_BRAND_WATERMARK?: boolean;
    SHOW_POLICY_WATERMARK?: boolean;
    SHOW_LOBBY_BUTTON?: boolean;
    SHOW_MEETING_TIMER?: boolean;
    SHOW_DEEP_LINKING_PAGE?: boolean;
    SHOW_AUTHENTICATION_PAGE?: boolean;
    SHOW_WELCOME_PAGE?: boolean;
    SHOW_CLOSE_PAGE?: boolean;
    SHOW_PREJOIN_PAGE?: boolean;
    SHOW_LIVE_STREAMING_PAGE?: boolean;
    SHOW_RECORDING_PAGE?: boolean;
    SHOW_TRANSCRIPTION_PAGE?: boolean;
  };
}

interface JitsiMeetProps {
  roomName: string;
  userName: string;
  onMeetingEnd?: (roomName: string) => void;
  onError?: (error: Error) => void;
  className?: string;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: new (domain: string, options: JitsiMeetConfig) => JitsiMeetExternalAPI;
  }
}

export default function JitsiMeet({
  roomName,
  userName,
  onMeetingEnd,
  onError,
  className = "",
}: JitsiMeetProps) {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<JitsiMeetExternalAPI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoiceOnly, setIsVoiceOnly] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const initRetryRef = useRef(0);

  const handleMeetingEnd = useCallback(async () => {
    try {
      // Make POST request to backend
      const response = await fetch(`/api/meetings/end/${encodeURIComponent(roomName)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomName,
          endedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        console.warn("Failed to notify backend of meeting end:", response.statusText);
      }
    } catch (error) {
      console.error("Error notifying backend of meeting end:", error);
    } finally {
      onMeetingEnd?.(roomName);
    }
  }, [roomName, onMeetingEnd]);

  const initializeJitsi = useCallback(async () => {
    if (!jitsiContainerRef.current || !roomName || !userName) {
      console.log("Missing requirements:", {
        container: !!jitsiContainerRef.current,
        roomName,
        userName
      });

      // Retry a few times in case the ref hasn't attached yet or props aren't ready
      if (initRetryRef.current < 20) {
        initRetryRef.current += 1;
        setTimeout(() => {
          initializeJitsi();
        }, 250);
      } else {
        console.warn("Jitsi init retry limit reached");
        setHasError(true);
        setIsLoading(false);
      }
      return;
    }

    try {
      // Clean up existing instance
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }

      // Check if JitsiMeetExternalAPI is available
      if (!window.JitsiMeetExternalAPI) {
        throw new Error("Jitsi Meet API not loaded. Please check your internet connection.");
      }

      console.log("Initializing Jitsi for room:", roomName, "user:", userName);

      const domain = "meet.jit.si"; // You can change this to your own Jitsi instance
      
      const options: JitsiMeetConfig = {
        roomName: roomName,
        width: "100%",
        height: "100%",
        parentNode: jitsiContainerRef.current,
        userInfo: {
          displayName: userName,
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          startAudioOnly: isVoiceOnly,
          enableWelcomePage: false,
          enableClosePage: false,
          enableInsecureRoomNameWarning: false,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_POWERED_BY: false,
        },
      };

      console.log("🚀 Creating Jitsi API with options:", options);
      const api = new window.JitsiMeetExternalAPI(domain, options);
      jitsiApiRef.current = api;
      console.log("✅ Jitsi API instance created");

      // Event listeners
      api.addEventListener("videoConferenceJoined", () => {
        console.log("✅ Successfully joined meeting:", roomName);
        setIsLoading(false);
        setHasError(false);
      });

      // Also listen for the conference ready event
      api.addEventListener("conferenceReady", () => {
        console.log("✅ Conference ready:", roomName);
        setIsLoading(false);
        setHasError(false);
      });

      api.addEventListener("readyToClose", () => {
        console.log("🔚 Meeting ready to close:", roomName);
        handleMeetingEnd();
      });

      api.addEventListener("participantJoined", (participant) => {
        console.log("👤 Participant joined:", participant);
      });

      api.addEventListener("participantLeft", (participant) => {
        console.log("👤 Participant left:", participant);
      });


      api.addEventListener("errorOccurred", (error) => {
        console.error("Jitsi error:", error);
        setHasError(true);
        setIsLoading(false);
        
        // Check if it's a permission error
        if (error.error && (
          error.error.includes('permission') || 
          error.error.includes('camera') || 
          error.error.includes('microphone') ||
          error.error.includes('denied')
        )) {
          setPermissionError(true);
        }
        
        onError?.(new Error(`Meeting error: ${error.error || "Unknown error"}`));
      });

    } catch (error) {
      console.error("Failed to initialize Jitsi:", error);
      setHasError(true);
      setIsLoading(false);
      onError?.(error as Error);
    }
  }, [roomName, userName, isVoiceOnly, handleMeetingEnd, onError]);

  const toggleVoiceOnly = useCallback(() => {
    setIsVoiceOnly(prev => !prev);
  }, []);

  const leaveMeeting = useCallback(() => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand("hangup");
    }
  }, []);

  const requestPermissions = useCallback(async () => {
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      // Stop the stream immediately as we just wanted to request permission
      stream.getTracks().forEach(track => track.stop());
      
      console.log("✅ Permissions granted, retrying meeting...");
      setPermissionError(false);
      setHasError(false);
      setIsLoading(true);
      
      // Retry initialization
      setTimeout(() => {
        initializeJitsi();
      }, 1000);
      
    } catch (error) {
      console.error("❌ Permission denied:", error);
      onError?.(new Error("Camera/microphone access denied. Please allow permissions and try again."));
    }
  }, [initializeJitsi, onError]);

  useEffect(() => {
    // Check browser permissions first
    const checkPermissions = async () => {
      try {
        const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
        console.log("Camera permission:", permissions.state);
        
        const micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        console.log("Microphone permission:", micPermission.state);
      } catch (error) {
        console.log("Could not check permissions:", error);
      }
    };

    checkPermissions();

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.warn("⚠️ Jitsi loading timeout - check browser permissions");
        setHasError(true);
        setIsLoading(false);
        setPermissionError(true);
        onError?.(new Error("Meeting failed to load - please check camera/microphone permissions"));
      }
    }, 30000); // 30 seconds - meetings can take time to fully initialize

    // Load Jitsi Meet API script if not already loaded
    if (!window.JitsiMeetExternalAPI) {
      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.onload = () => {
        console.log("📡 Jitsi API script loaded");
        initializeJitsi();
      };
      script.onerror = () => {
        console.error("❌ Failed to load Jitsi API script");
        setHasError(true);
        setIsLoading(false);
        onError?.(new Error("Failed to load Jitsi Meet API"));
      };
      document.head.appendChild(script);

      return () => {
        clearTimeout(timeoutId);
        document.head.removeChild(script);
      };
    } else {
      // Defer to next tick to ensure the container ref is attached
      setTimeout(() => {
        initializeJitsi();
      }, 0);
    }

    // Cleanup on unmount
    return () => {
      clearTimeout(timeoutId);
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
    };
  }, [initializeJitsi, onError, isLoading]);

  if (hasError) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] bg-gray-900 rounded-xl border border-gray-800 ${className}`}>
        <div className="text-center p-6 max-w-md">
          {permissionError ? (
            <>
              <div className="text-yellow-400 text-2xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold text-white mb-2">Camera & Microphone Required</h3>
              <p className="text-gray-400 mb-4">
                This meeting requires access to your camera and microphone. Please allow permissions to continue.
              </p>
              <div className="space-y-3">
                <Button onClick={requestPermissions} variant="primary" className="w-full">
                  Allow Camera & Microphone
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
                  Refresh Page
                </Button>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <p>If permissions are already allowed, try:</p>
                <ul className="text-left mt-2 space-y-1">
                  <li>• Check your browser&apos;s address bar for blocked permissions</li>
                  <li>• Click the lock icon and allow camera/microphone</li>
                  <li>• Try using Chrome or Firefox</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="text-red-400 text-2xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-white mb-2">Failed to Load Meeting</h3>
              <p className="text-gray-400 mb-4">There was an error connecting to the meeting.</p>
              <Button onClick={() => window.location.reload()} variant="primary">
                Retry
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-gray-900 rounded-xl border border-gray-800 overflow-hidden ${className}`}>
      {/* Header with controls */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {roomName}
            </div>
            <div className="text-white text-sm">
              {userName}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={toggleVoiceOnly}
              variant={isVoiceOnly ? "primary" : "outline"}
              size="sm"
              className="text-white border-white/20 hover:bg-white/10"
            >
              {isVoiceOnly ? "📞 Voice" : "📹 Video"}
            </Button>
            
            <Button
              onClick={leaveMeeting}
              variant="outline"
              size="sm"
              className="text-red-400 border-red-400/50 hover:bg-red-400/10"
            >
              Leave
            </Button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-20 px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-white text-lg">Joining meeting...</p>
            <p className="text-gray-400 text-sm mt-2">Room: {roomName}</p>
            <p className="text-gray-500 text-xs mt-2">Check browser console for details</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              size="sm" 
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Jitsi container */}
      <div 
        ref={jitsiContainerRef} 
        className="w-full h-full min-h-[420px] sm:min-h-[520px] md:min-h-[600px]"
        style={{ minHeight: "420px" }}
      />
    </div>
  );
}

// Explicit named export to ensure module recognition during type checks

export type { JitsiMeetProps };