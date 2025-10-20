"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Button from "@/components/ui/Button";

// Import separated modules
import { 
  JitsiMeetProps, 
  JitsiMeetExternalAPI, 
  JitsiEventData, 
  JitsiEventHandlers,
  JITSI_CONFIG 
} from "./JitsiMeet.interfaces";
import { 
  jitsiStyles, 
  cssClasses, 
  applyVideoSizing 
} from "./JitsiMeet.styles";
import { 
  checkPermissions,
  createJitsiConfig,
  setupVideoSizing,
  initializeVideoStyles,
  handleMeetingEnd,
  requestMediaPermissions,
  getPermissionErrorMessage,
  getJitsiLoadErrorMessage,
  getMeetingErrorMessage,
  logContainerInfo,
  logPermissionStatus,
  logJitsiInitialization,
  logApiCreation,
  logApiSuccess,
  logScriptLoad,
  logVideoSizing,
  logVideoToggle,
  logVideoTrackAdded,
  logVideoTrackRemoved,
  logCameraError,
  logMicError,
  logParticipantJoined,
  logParticipantLeft,
  logParticipantKicked,
  logVideoConferenceLeft,
  logMeetingJoined,
  logConferenceReady,
  logMeetingEnd,
  logJitsiError,
  logLoadingTimeout,
  logForcedLoadingEnd,
  logPermissionGranted,
  logPermissionDenied,
  logScriptError,
  logRetryAttempt,
  logRetryLimitReached,
  logContainerNotInDOM,
  logContainerNeverAttached,
  logDOMNotReady,
  logAPIUnavailable,
  logAPINeverLoaded,
  logMissingRequirements,
  logVideoSizingNote,
  logVideoToggleNote,
  logVideoToggleError,
  logPermissionCheckError,
  logBackendUnavailable,
  logMeetingEndSuccess,
  logBackendUnavailableStatus
} from "./JitsiMeet.utils";

export default function JitsiMeet({
  roomName,
  userName,
  onMeetingEnd,
  onError,
  className = "",
}: JitsiMeetProps) {
  // Refs
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<JitsiMeetExternalAPI | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initRetryRef = useRef(0);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isVoiceOnly, setIsVoiceOnly] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [permissionError, setPermissionError] = useState(false);

  // Callbacks
  const containerRefCallback = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      jitsiContainerRef.current = node;
      logContainerInfo(node);
    }
  }, []);

  const handleMeetingEndCallback = useCallback(async () => {
    await handleMeetingEnd(roomName, onMeetingEnd);
  }, [roomName, onMeetingEnd]);

  const clearLoadingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const endLoading = useCallback(() => {
    clearLoadingTimeout();
    setIsLoading(false);
    setHasError(false);
  }, [clearLoadingTimeout]);

  const setupEventListeners = useCallback((api: JitsiMeetExternalAPI) => {
    const eventHandlers: JitsiEventHandlers = {
      videoConferenceJoined: () => {
        logMeetingJoined(roomName);
        endLoading();
      },
      conferenceReady: () => {
        logConferenceReady(roomName);
        endLoading();
        
        // Ensure video/audio are active
        setTimeout(() => {
          try {
            api.executeCommand('toggleVideo');
            api.executeCommand('toggleAudio');
            logVideoToggle();
          } catch (error) {
            logVideoToggleNote();
          }
        }, 1000);
      },
      videoTrackAdded: (track: JitsiEventData) => {
        logVideoTrackAdded(track);
        setIsLoading(false);
        
        setTimeout(() => {
          try {
            api.executeCommand('toggleVideo');
            logVideoToggle();
          } catch (error) {
            logVideoToggleError();
          }
        }, 500);
      },
      videoTrackRemoved: (track: JitsiEventData) => {
        logVideoTrackRemoved(track);
      },
      cameraError: (error: JitsiEventData) => {
        logCameraError(error);
        setPermissionError(true);
        onError?.(new Error("Camera access denied or unavailable"));
      },
      micError: (error: JitsiEventData) => {
        logMicError(error);
        setPermissionError(true);
        onError?.(new Error("Microphone access denied or unavailable"));
      },
      readyToClose: () => {
        logMeetingEnd(roomName);
        handleMeetingEndCallback();
      },
      participantJoined: (participant: JitsiEventData) => {
        logParticipantJoined(participant);
        setIsLoading(false);
      },
      participantLeft: (participant: JitsiEventData) => {
        logParticipantLeft(participant);
      },
      participantKicked: (participant: JitsiEventData) => {
        logParticipantKicked(participant);
      },
      videoConferenceLeft: () => {
        logVideoConferenceLeft();
      },
      errorOccurred: (error: JitsiEventData) => {
        logJitsiError(error);
        setHasError(true);
        setIsLoading(false);
        
        if (error.error && (
          error.error.includes('permission') || 
          error.error.includes('camera') || 
          error.error.includes('microphone') ||
          error.error.includes('denied')
        )) {
          setPermissionError(true);
        }
        
        onError?.(new Error(`Meeting error: ${error.error || "Unknown error"}`));
      }
    };

    Object.entries(eventHandlers).forEach(([event, handler]) => {
      api.addEventListener(event, handler);
    });
  }, [roomName, endLoading, handleMeetingEndCallback, onError]);

  const initializeJitsi = useCallback(async () => {
    if (document.readyState !== 'complete') {
      logDOMNotReady();
      setTimeout(() => initializeJitsi(), 100);
      return;
    }

    if (!window.JitsiMeetExternalAPI) {
      logAPIUnavailable();
      if (initRetryRef.current < JITSI_CONFIG.INIT_RETRY_LIMIT) {
        initRetryRef.current += 1;
        setTimeout(() => initializeJitsi(), 500);
      } else {
        logAPINeverLoaded();
        setHasError(true);
        setIsLoading(false);
        onError?.(new Error("Jitsi Meet API failed to load"));
      }
      return;
    }

    if (!jitsiContainerRef.current || !roomName || !userName) {
      logMissingRequirements(!!jitsiContainerRef.current, roomName, userName);

      if (initRetryRef.current < JITSI_CONFIG.INIT_RETRY_LIMIT) {
        initRetryRef.current += 1;
        logRetryAttempt(initRetryRef.current, JITSI_CONFIG.INIT_RETRY_LIMIT);
        setTimeout(() => initializeJitsi(), 500);
      } else {
        logRetryLimitReached();
        setHasError(true);
        setIsLoading(false);
        onError?.(new Error("Failed to initialize meeting - missing requirements"));
      }
      return;
    }

    if (!jitsiContainerRef.current.isConnected) {
      logContainerNotInDOM();
      if (initRetryRef.current < JITSI_CONFIG.INIT_RETRY_LIMIT) {
        initRetryRef.current += 1;
        setTimeout(() => initializeJitsi(), 500);
      } else {
        logContainerNeverAttached();
        setHasError(true);
        setIsLoading(false);
        onError?.(new Error("Meeting container not available"));
      }
      return;
    }

    initRetryRef.current = 0;

    try {
      // Clean up existing instance
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }

      logJitsiInitialization(roomName, userName);

      const containerElement = jitsiContainerRef.current;
      const config = createJitsiConfig(roomName, userName, isVoiceOnly, containerElement);
      const domain = JITSI_CONFIG.DOMAINS[0];

      logApiCreation(config);
      const api = new window.JitsiMeetExternalAPI(domain, config);
      jitsiApiRef.current = api;
      logApiSuccess();

      // Apply video sizing fixes
      setupVideoSizing(containerElement);

      // Inject global styles
      initializeVideoStyles();

      // Setup event listeners
      setupEventListeners(api);

    } catch (error) {
      console.error("Failed to initialize Jitsi:", error);
      setHasError(true);
      setIsLoading(false);
      onError?.(error as Error);
    }
  }, [roomName, userName, isVoiceOnly, onError, setupEventListeners, endLoading]);

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
      await requestMediaPermissions();
      
      logPermissionGranted();
      setPermissionError(false);
      setHasError(false);
      setIsLoading(true);
      
      clearLoadingTimeout();
      setTimeout(() => initializeJitsi(), 1000);
      
    } catch (error) {
      logPermissionDenied(error);
      onError?.(new Error(getMeetingErrorMessage()));
    }
  }, [initializeJitsi, onError, clearLoadingTimeout]);

  const retryMeeting = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
    setPermissionError(false);
    initRetryRef.current = 0;
    clearLoadingTimeout();
    initializeJitsi();
  }, [initializeJitsi, clearLoadingTimeout]);

  // Main effect
  useEffect(() => {
    let script: HTMLScriptElement | null = null;

    clearLoadingTimeout();

    const initializeMeeting = async () => {
      const permissionsOk = await checkPermissions();
      if (!permissionsOk) {
        setPermissionError(true);
        setHasError(true);
        setIsLoading(false);
        onError?.(new Error(getPermissionErrorMessage()));
        return;
      }

    if (!window.JitsiMeetExternalAPI) {
        script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.onload = () => {
          logScriptLoad();
          clearLoadingTimeout();
          setTimeout(() => initializeJitsi(), 100);
      };
      script.onerror = () => {
          logScriptError();
          clearLoadingTimeout();
        setHasError(true);
        setIsLoading(false);
          onError?.(new Error(getJitsiLoadErrorMessage()));
      };
      document.head.appendChild(script);
      } else {
        clearLoadingTimeout();
        setTimeout(() => initializeJitsi(), 100);
      }
    };

    // Set timeout
    timeoutRef.current = setTimeout(() => {
      if (isLoading) {
        logLoadingTimeout();
        setIsLoading(false);
        logForcedLoadingEnd();
      }
    }, JITSI_CONFIG.LOADING_TIMEOUT);

    initializeMeeting();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (script && document.head.contains(script)) {
        document.head.removeChild(script);
      }
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
    };
  }, [initializeJitsi, onError, isLoading, clearLoadingTimeout]);

  // Error state
  if (hasError) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] bg-gray-900 rounded-xl border border-gray-800 ${className}`}>
        <div className="text-center p-6 max-w-md">
          {permissionError ? (
            <>
              <div className={cssClasses.errorIcon}>🔒</div>
              <h3 className={cssClasses.errorTitle}>Camera & Microphone Required</h3>
              <p className={cssClasses.errorMessage}>
                This meeting requires access to your camera and microphone. Please allow permissions to continue.
              </p>
              <div className={cssClasses.errorActions}>
                <Button onClick={requestPermissions} variant="primary" className={cssClasses.button}>
                  Allow Camera & Microphone
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline" className={cssClasses.button}>
                  Refresh Page
                </Button>
              </div>
              <div className={cssClasses.errorHelp}>
                <p>If permissions are already allowed, try:</p>
                <ul className={cssClasses.errorList}>
                  <li>• Check your browser&apos;s address bar for blocked permissions</li>
                  <li>• Click the lock icon and allow camera/microphone</li>
                  <li>• Try using Chrome or Firefox</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="text-red-400 text-2xl mb-4">⚠️</div>
              <h3 className={cssClasses.errorTitle}>Failed to Load Meeting</h3>
              <p className={cssClasses.errorMessage}>There was an error connecting to the meeting. This could be due to network issues or browser permissions.</p>
              <div className={cssClasses.errorActions}>
                <Button onClick={() => window.location.reload()} variant="primary" className={cssClasses.button}>
                Retry
              </Button>
                <Button onClick={retryMeeting} variant="outline" className={cssClasses.button}>
                  Try Again
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Main component
  return (
    <div 
      className={`${cssClasses.container} ${className}`} 
      style={jitsiStyles.container}
    >
      {/* Header */}
      <div className={cssClasses.header}>
        <div className={cssClasses.headerContent}>
          <div className={cssClasses.headerInfo}>
            <div className={cssClasses.roomBadge}>
              {roomName}
            </div>
            <div className={cssClasses.userName}>
              {userName}
            </div>
          </div>
          
          <div className={cssClasses.headerControls}>
            <Button
              onClick={toggleVoiceOnly}
              variant={isVoiceOnly ? "primary" : "outline"}
              size="sm"
              className={cssClasses.videoButton}
            >
              {isVoiceOnly ? "📞 Voice" : "📹 Video"}
            </Button>
            
            <Button
              onClick={leaveMeeting}
              variant="outline"
              size="sm"
              className={cssClasses.leaveButton}
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
            <div className={cssClasses.loadingSpinner}></div>
            <p className={cssClasses.loadingText}>Joining meeting...</p>
            <p className={cssClasses.loadingSubtext}>Room: {roomName}</p>
            <p className={cssClasses.loadingHint}>Check browser console for details</p>
            <div className={cssClasses.buttonGroup}>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              size="sm" 
                className={cssClasses.button}
            >
              Retry
            </Button>
              <Button 
                onClick={() => setIsLoading(false)} 
                variant="primary" 
                size="sm" 
                className={cssClasses.button}
              >
                Show Video
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Video container */}
      <div 
        key="jitsi-container"
        ref={containerRefCallback} 
        className={cssClasses.videoContainer}
        style={jitsiStyles.videoContainer}
      />
    </div>
  );
}

export type { JitsiMeetProps };