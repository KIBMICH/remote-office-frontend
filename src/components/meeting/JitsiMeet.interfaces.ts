// JitsiMeet component interfaces and types

export interface JitsiEventData {
  [key: string]: unknown;
  error?: string;
  displayName?: string;
  id?: string;
}

export interface JitsiMeetExternalAPI {
  dispose: () => void;
  addEventListener: (event: string, listener: (data: JitsiEventData) => void) => void;
  removeEventListener: (event: string, listener: (data: JitsiEventData) => void) => void;
  executeCommand: (command: string, value?: unknown) => void;
}

export interface JitsiMeetConfig {
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
      stunServers: readonly { urls: string }[];
    };
    analytics?: {
      disabled: boolean;
    };
    disableRtx?: boolean;
    enableLipSync?: boolean;
    prejoinPageEnabled?: boolean;
  };
  interfaceConfigOverwrite?: {
    SHOW_JITSI_WATERMARK?: boolean;
    SHOW_WATERMARK_FOR_GUESTS?: boolean;
    SHOW_POWERED_BY?: boolean;
  };
}

export interface JitsiMeetProps {
  roomName: string;
  userName: string;
  onMeetingEnd?: (roomName: string) => void;
  onError?: (error: Error) => void;
  className?: string;
}

// Global window interface extension
declare global {
  interface Window {
    JitsiMeetExternalAPI: new (domain: string, options: JitsiMeetConfig) => JitsiMeetExternalAPI;
  }
}

// Event handler types
export type JitsiEventHandler = (data: JitsiEventData) => void;

export interface JitsiEventHandlers {
  videoConferenceJoined: JitsiEventHandler;
  conferenceReady: JitsiEventHandler;
  videoTrackAdded: JitsiEventHandler;
  videoTrackRemoved: JitsiEventHandler;
  cameraError: JitsiEventHandler;
  micError: JitsiEventHandler;
  readyToClose: JitsiEventHandler;
  participantJoined: JitsiEventHandler;
  participantLeft: JitsiEventHandler;
  participantKicked: JitsiEventHandler;
  videoConferenceLeft: JitsiEventHandler;
  errorOccurred: JitsiEventHandler;
}

// Component state interface
export interface JitsiMeetState {
  isLoading: boolean;
  isVoiceOnly: boolean;
  hasError: boolean;
  permissionError: boolean;
}

// Configuration constants
export const JITSI_CONFIG = {
  DOMAINS: ["meet.jit.si", "meet.jit.si:443", "jitsi.riot.im"],
  STUN_SERVERS: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' }
  ],
  INIT_RETRY_LIMIT: 10,
  LOADING_TIMEOUT: 5000,
  HEADER_HEIGHT: 80,
} as const;
