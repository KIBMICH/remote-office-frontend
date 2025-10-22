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
    disableDeepLinking: true,
    prejoinPageEnabled: false,
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
    MOBILE_APP_PROMO: false,
  },
});

// Video setup utilities
export const setupVideoSizing = (containerElement: HTMLElement): void => {
  const applySizing = () => applyVideoSizing(containerElement);
  [1000, 2000, 3000, 5000].forEach(delay => 
    setTimeout(() => applySizing(), delay)
  );
};

// Dynamic branding removal utility with CSS overlay approach
export const removeJitsiBranding = (containerElement: HTMLElement): void => {
  // Create single black overlay at top-left and rely on CSS ::before for logo
  const createWatermarkOverlay = () => {
    const overlay = document.createElement('div');
    overlay.id = 'jitsi-watermark-overlay';
    overlay.style.cssText = `
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 220px !important;
      height: 70px !important;
      z-index: 1001 !important;
      background: #000000 !important;
      opacity: 0.9 !important;
      border-radius: 0 0 15px 0 !important;
      pointer-events: none !important;
    `;
    containerElement.appendChild(overlay);
  };

  const hideJitsiElements = () => {
    const iframe = containerElement.querySelector('iframe[src*="meet.jit.si"]');
    if (!iframe) return;

    try {
      const iframeElement = iframe as HTMLIFrameElement;
      const iframeDoc = iframeElement.contentDocument || iframeElement.contentWindow?.document;
      if (!iframeDoc) return;

      // Inject a script to hide branding from within the iframe
      const script = iframeDoc.createElement('script');
      script.textContent = `
        (function() {
          function hideJitsiBranding() {
            // Hide any elements containing Jitsi or 8x8 branding
            const jitsiSelectors = [
              '[class*="jitsi"]',
              '[id*="jitsi"]',
              '[class*="8x8"]',
              '[id*="8x8"]',
              '[class*="eight"]',
              '[id*="eight"]',
              '[class*="logo"]',
              '[id*="logo"]',
              '[class*="brand"]',
              '[id*="brand"]',
              '[class*="watermark"]',
              '[id*="watermark"]',
              '[class*="branding"]',
              '[id*="branding"]',
              '[data-testid*="jitsi"]',
              '[data-testid*="8x8"]',
              '[data-testid*="logo"]',
              '[aria-label*="jitsi"]',
              '[aria-label*="Jitsi"]',
              '[aria-label*="8x8"]',
              '[title*="jitsi"]',
              '[title*="Jitsi"]',
              '[title*="8x8"]',
              'img[src*="jitsi"]',
              'img[alt*="jitsi"]',
              'img[src*="8x8"]',
              'img[alt*="8x8"]',
              'svg[class*="jitsi"]',
              'svg[class*="8x8"]',
              'div[class*="jitsi"]',
              'div[class*="8x8"]',
              'span[class*="jitsi"]',
              'span[class*="8x8"]',
              'h1[class*="jitsi"]',
              'h1[class*="8x8"]',
              'h2[class*="jitsi"]',
              'h2[class*="8x8"]',
              'h3[class*="jitsi"]',
              'h3[class*="8x8"]',
              'p[class*="jitsi"]',
              'p[class*="8x8"]',
              'a[class*="jitsi"]',
              'a[class*="8x8"]'
            ];

            jitsiSelectors.forEach(selector => {
              const elements = document.querySelectorAll(selector);
              elements.forEach(element => {
                if (element.textContent?.toLowerCase().includes('jitsi') || 
                    element.textContent?.toLowerCase().includes('8x8') ||
                    element.className?.toLowerCase().includes('jitsi') ||
                    element.className?.toLowerCase().includes('8x8') ||
                    element.id?.toLowerCase().includes('jitsi') ||
                    element.id?.toLowerCase().includes('8x8')) {
                  element.style.display = 'none';
                  element.style.visibility = 'hidden';
                  element.style.opacity = '0';
                  element.style.height = '0';
                  element.style.width = '0';
                  element.style.position = 'absolute';
                  element.style.left = '-9999px';
                  element.style.top = '-9999px';
                }
              });
            });
            
            // Specifically target watermark background images
            const watermarkElements = document.querySelectorAll('*');
            watermarkElements.forEach(element => {
              const style = element.style;
              const computedStyle = window.getComputedStyle(element);
              
              // Check for watermark background images
              if (style.backgroundImage?.includes('watermark.svg') ||
                  computedStyle.backgroundImage?.includes('watermark.svg') ||
                  style.backgroundImage?.includes('images/watermark.svg') ||
                  computedStyle.backgroundImage?.includes('images/watermark.svg')) {
                element.style.backgroundImage = 'none';
                element.style.background = 'none';
                element.style.display = 'none';
                element.style.visibility = 'hidden';
                element.style.opacity = '0';
                element.style.height = '0';
                element.style.width = '0';
                element.style.position = 'absolute';
                element.style.left = '-9999px';
                element.style.top = '-9999px';
              }
            });
            
            // Target specific branding elements while preserving functionality
            const brandingSelectors = [
              '[class*="jitsi-logo"]',
              '[class*="jitsi-brand"]',
              '[class*="jitsi-branding"]',
              '[class*="8x8-logo"]',
              '[class*="8x8-brand"]',
              '[class*="watermark"]',
              '[class*="logo"]:not([class*="button"]):not([class*="control"]):not([class*="toolbar"])',
              '[id*="jitsi-logo"]',
              '[id*="jitsi-brand"]',
              '[id*="8x8-logo"]',
              '[id*="8x8-brand"]',
              '[id*="watermark"]',
              '[id*="logo"]:not([id*="button"]):not([id*="control"])'
            ];
            
            brandingSelectors.forEach(selector => {
              try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                  // Only hide if it's clearly a branding element, not a functional element
                  const text = element.textContent?.toLowerCase() || '';
                  const className = element.className?.toLowerCase() || '';
                  const id = element.id?.toLowerCase() || '';
                  
                  if (text.includes('jitsi') || text.includes('8x8') || 
                      className.includes('logo') || className.includes('brand') || className.includes('watermark') ||
                      id.includes('logo') || id.includes('brand') || id.includes('watermark')) {
                    element.style.display = 'none';
                    element.style.visibility = 'hidden';
                    element.style.opacity = '0';
                    element.style.height = '0';
                    element.style.width = '0';
                    element.style.position = 'absolute';
                    element.style.left = '-9999px';
                    element.style.top = '-9999px';
                  }
                });
              } catch (e) {
                // Ignore selector errors
              }
            });
          }
          
          // Run immediately and on DOM changes
          hideJitsiBranding();
          setInterval(hideJitsiBranding, 100);
          
          const observer = new MutationObserver(hideJitsiBranding);
          observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'id']
          });
        })();
      `;
      
      if (iframeDoc.head) {
        iframeDoc.head.appendChild(script);
      }
    } catch (error) {
      // Cross-origin restrictions might prevent access
      console.log('Cannot access iframe content for branding removal:', error);
    }
  };

  // Create single watermark overlay immediately
  createWatermarkOverlay();

  // Run immediately and then more frequently
  hideJitsiElements();
  [100, 300, 500, 1000, 1500, 2000, 3000, 4000, 5000, 7000, 10000].forEach(delay => 
    setTimeout(hideJitsiElements, delay)
  );
  
  // Also run on any DOM changes
  const observer = new MutationObserver(() => {
    setTimeout(hideJitsiElements, 100);
  });
  
  try {
    const iframeElement = containerElement.querySelector('iframe[src*="meet.jit.si"]') as HTMLIFrameElement;
    if (iframeElement && iframeElement.contentDocument) {
      observer.observe(iframeElement.contentDocument.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'id']
      });
    }
  } catch (error) {
    // Cross-origin restrictions
    console.log('Cannot observe iframe mutations:', error);
  }
};

// Cleanup function to remove all watermark overlays
export const cleanupWatermarkOverlays = (containerElement: HTMLElement): void => {
  // Remove all overlays with watermark-related IDs
  const overlays = containerElement.querySelectorAll('[id*="jitsi-watermark-overlay"], [id*="watermark-overlay"], [data-watermark-overlay="true"]');
  overlays.forEach(overlay => overlay.remove());
};

// Mobile responsive watermark overlay
export const createAdvancedWatermarkOverlay = (containerElement: HTMLElement): void => {
  // Remove existing overlays first
  cleanupWatermarkOverlays(containerElement);
  
  // Create responsive overlay at top-left
  const overlay = document.createElement('div');
  overlay.id = 'jitsi-watermark-overlay';
  
  // Get responsive dimensions based on screen size
  const getResponsiveDimensions = () => {
    const width = window.innerWidth;
    if (width < 640) {
      return { width: '120px', height: '40px', borderRadius: '0 0 8px 0' };
    } else if (width < 1024) {
      return { width: '180px', height: '55px', borderRadius: '0 0 12px 0' };
    } else {
      return { width: '220px', height: '70px', borderRadius: '0 0 15px 0' };
    }
  };
  
  const dimensions = getResponsiveDimensions();
  
  overlay.style.cssText = `
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: ${dimensions.width} !important;
    height: ${dimensions.height} !important;
    z-index: 1001 !important;
    background: #141414 !important;
    opacity: 1 !important;
    border-radius: ${dimensions.borderRadius} !important;
    pointer-events: none !important;
  `;
  
  // Update dimensions on window resize
  const updateDimensions = () => {
    const newDimensions = getResponsiveDimensions();
    overlay.style.width = newDimensions.width;
    overlay.style.height = newDimensions.height;
    overlay.style.borderRadius = newDimensions.borderRadius;
  };
  
  window.addEventListener('resize', updateDimensions);
  containerElement.appendChild(overlay);
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

