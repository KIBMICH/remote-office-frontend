// JitsiMeet utility functions

import { JitsiMeetConfig, JITSI_CONFIG } from './JitsiMeet.interfaces';
import { applyVideoSizing, injectGlobalStyles } from './JitsiMeet.styles';

// Permission checking utility
export const checkPermissions = async (): Promise<boolean> => {
  try {
    const [cameraPermission, micPermission] = await Promise.all([
      navigator.permissions.query({ name: 'camera' as PermissionName }),
      navigator.permissions.query({ name: 'microphone' as PermissionName })
    ]);
    
    console.log("🔍 Permission status:", {
      camera: cameraPermission.state,
      microphone: micPermission.state
    });

    return !(cameraPermission.state === 'denied' || micPermission.state === 'denied');
  } catch (error) {
    console.log("Could not check permissions:", error);
    return true; // Continue if we can't check permissions
  }
};

// Jitsi configuration factory
export const createJitsiConfig = (
  roomName: string, 
  userName: string, 
  isVoiceOnly: boolean, 
  containerElement: HTMLElement
): JitsiMeetConfig => ({
  roomName,
  width: "100%",
  height: "100%",
  parentNode: containerElement,
  userInfo: { displayName: userName },
  configOverwrite: {
    startWithAudioMuted: false,
    startWithVideoMuted: false,
    startAudioOnly: isVoiceOnly,
    enableWelcomePage: false,
    enableClosePage: false,
    enableInsecureRoomNameWarning: false,
    enableLayerSuspension: false,
    enableNoisyMicDetection: false,
    enableTalkWhileMuted: false,
    enableNoAudioDetection: false,
    enableJoinWithoutMic: false,
    enableRembrandt: true,
    channelLastN: -1,
    startScreenSharing: false,
    enableRecording: false,
    liveStreamingEnabled: false,
    fileRecordingsEnabled: false,
    localRecording: false,
    p2p: {
      enabled: false,
      stunServers: JITSI_CONFIG.STUN_SERVERS
    },
    analytics: { disabled: true },
    disableRtx: false,
    enableLipSync: true
  },
  interfaceConfigOverwrite: {
    SHOW_JITSI_WATERMARK: false,
    SHOW_WATERMARK_FOR_GUESTS: false,
    SHOW_POWERED_BY: false,
  },
});

// Video setup utilities
export const setupVideoSizing = (containerElement: HTMLElement): void => {
  const applySizing = () => applyVideoSizing(containerElement);
  [1000, 2000, 3000, 5000].forEach(delay => 
    setTimeout(() => applySizing(), delay)
  );
};

export const initializeVideoStyles = (): void => {
  injectGlobalStyles();
};

// Meeting end handler
export const handleMeetingEnd = async (
  roomName: string, 
  onMeetingEnd?: (roomName: string) => void
): Promise<void> => {
  try {
    await fetch(`/api/meetings/end/${encodeURIComponent(roomName)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomName, endedAt: new Date().toISOString() }),
    });
  } catch (error) {
    console.warn("Backend unavailable - meeting end not logged:", error);
  } finally {
    onMeetingEnd?.(roomName);
  }
};

// Permission request utility
export const requestMediaPermissions = async (): Promise<void> => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  stream.getTracks().forEach(track => track.stop());
};

// Error message utilities
export const getPermissionErrorMessage = (): string => 
  "Camera or microphone access denied. Please allow permissions and refresh the page.";

export const getJitsiLoadErrorMessage = (): string => 
  "Failed to load Jitsi Meet API";

export const getMeetingErrorMessage = (): string => 
  "Camera/microphone access denied. Please allow permissions and try again.";

// Console logging utilities
export const logContainerInfo = (node: HTMLDivElement): void => {
  console.log("✅ Container ref attached:", {
    element: node,
    inDOM: node.isConnected,
    classes: node.className,
    dimensions: { width: node.offsetWidth, height: node.offsetHeight }
  });
};

export const logPermissionStatus = (camera: string, microphone: string): void => {
  console.log("🔍 Permission status:", { camera, microphone });
};

export const logJitsiInitialization = (roomName: string, userName: string): void => {
  console.log("Initializing Jitsi for room:", roomName, "user:", userName);
};

export const logApiCreation = (config: JitsiMeetConfig): void => {
  console.log("🚀 Creating Jitsi API with options:", config);
};

export const logApiSuccess = (): void => {
  console.log("✅ Jitsi API instance created");
};

export const logScriptLoad = (): void => {
  console.log("📡 Jitsi API script loaded");
};

export const logVideoSizing = (): void => {
  console.log("🎥 Applied video sizing fixes");
};

export const logVideoToggle = (): void => {
  console.log("🎥 Video and audio toggled to ensure they're active");
};

export const logVideoTrackAdded = (track: unknown): void => {
  console.log("📹 Video track added:", track);
};

export const logVideoTrackRemoved = (track: unknown): void => {
  console.log("📹 Video track removed:", track);
};

export const logCameraError = (error: unknown): void => {
  console.error("📹 Camera error:", error);
};

export const logMicError = (error: unknown): void => {
  console.error("🎤 Microphone error:", error);
};

export const logParticipantJoined = (participant: unknown): void => {
  console.log("👤 Participant joined:", participant);
};

export const logParticipantLeft = (participant: unknown): void => {
  console.log("👤 Participant left:", participant);
};

export const logParticipantKicked = (participant: unknown): void => {
  console.log("👤 Participant kicked:", participant);
};

export const logVideoConferenceLeft = (): void => {
  console.log("👋 Left video conference");
};

export const logMeetingJoined = (roomName: string): void => {
  console.log("✅ Successfully joined meeting:", roomName);
};

export const logConferenceReady = (roomName: string): void => {
  console.log("✅ Conference ready:", roomName);
};

export const logMeetingEnd = (roomName: string): void => {
  console.log("🔚 Meeting ready to close:", roomName);
};

export const logJitsiError = (error: unknown): void => {
  console.error("Jitsi error:", error);
};

export const logLoadingTimeout = (): void => {
  console.warn("⚠️ Jitsi loading timeout - forcing loading to end");
};

export const logForcedLoadingEnd = (): void => {
  console.log("🔄 Forced loading state to end - video should be visible now");
};

export const logPermissionGranted = (): void => {
  console.log("✅ Permissions granted, retrying meeting...");
};

export const logPermissionDenied = (error: unknown): void => {
  console.error("❌ Permission denied:", error);
};

export const logScriptError = (): void => {
  console.error("❌ Failed to load Jitsi API script");
};

export const logRetryAttempt = (attempt: number, limit: number): void => {
  console.log(`Retrying Jitsi init (attempt ${attempt}/${limit})...`);
};

export const logRetryLimitReached = (): void => {
  console.warn("Jitsi init retry limit reached");
};

export const logContainerNotInDOM = (): void => {
  console.warn("Container not in DOM, waiting for reattachment...");
};

export const logContainerNeverAttached = (): void => {
  console.warn("Container never attached to DOM");
};

export const logDOMNotReady = (): void => {
  console.log("⏳ Waiting for DOM to be ready...");
};

export const logAPIUnavailable = (): void => {
  console.log("⏳ JitsiMeetExternalAPI not available yet...");
};

export const logAPINeverLoaded = (): void => {
  console.error("JitsiMeetExternalAPI never loaded");
};

export const logMissingRequirements = (container: boolean, roomName: string, userName: string): void => {
  console.log("Missing requirements:", { container, roomName, userName });
};

export const logVideoSizingNote = (): void => {
  console.log("Note: Could not apply video sizing fixes");
};

export const logVideoToggleNote = (): void => {
  console.log("Note: Could not toggle video/audio (this is normal)");
};

export const logVideoToggleError = (): void => {
  console.log("Note: Could not toggle video");
};

export const logPermissionCheckError = (error: unknown): void => {
  console.log("Could not check permissions:", error);
};

export const logBackendUnavailable = (error: unknown): void => {
  console.warn("Backend unavailable - meeting end not logged:", error);
};

export const logMeetingEndSuccess = (): void => {
  console.log("Meeting end logged successfully");
};

export const logBackendUnavailableStatus = (statusText: string): void => {
  console.warn("Backend unavailable - meeting end not logged:", statusText);
};

