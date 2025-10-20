// JitsiMeet component styles
export const jitsiStyles = {
  // Container styles
  container: {
    position: 'relative' as const,
    height: '100%',
    minHeight: '500px',
    paddingTop: '80px',
  },
  
  // Video container styles
  videoContainer: {
    minHeight: '420px',
    height: 'calc(100% - 80px)',
    width: '100%',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    marginTop: '0',
    paddingTop: '0'
  },

  // Header styles
  header: {
    position: 'absolute' as const,
    top: '0',
    left: '0',
    right: '0',
    zIndex: 20,
    background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent)',
    padding: '1rem',
    backdropFilter: 'blur(4px)',
  },

  // Loading overlay styles
  loadingOverlay: {
    position: 'absolute' as const,
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: '#111827',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    padding: '1rem',
  },

  // Error container styles
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    backgroundColor: '#111827',
    borderRadius: '0.75rem',
    border: '1px solid #374151',
  },
};

// CSS classes for dynamic styling
export const cssClasses = {
  container: 'relative bg-gray-900 rounded-xl border border-gray-800 overflow-hidden',
  header: 'absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4 backdrop-blur-sm meeting-header',
  videoContainer: 'w-full h-full min-h-[420px] sm:min-h-[520px] md:min-h-[600px] jitsi-container',
  loadingSpinner: 'animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4',
  loadingText: 'text-white text-lg',
  loadingSubtext: 'text-gray-400 text-sm mt-2',
  loadingHint: 'text-gray-500 text-xs mt-2',
  buttonGroup: 'space-y-2',
  button: 'w-full',
  headerContent: 'flex items-center justify-between',
  headerInfo: 'flex items-center gap-3',
  roomBadge: 'bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium',
  userName: 'text-white text-sm font-medium',
  headerControls: 'flex items-center gap-2',
  videoButton: 'text-white border-white/20 hover:bg-white/10',
  leaveButton: 'text-red-400 border-red-400/50 hover:bg-red-400/10',
  errorIcon: 'text-yellow-400 text-2xl mb-4',
  errorTitle: 'text-lg font-semibold text-white mb-2',
  errorMessage: 'text-gray-400 mb-4',
  errorActions: 'space-y-3',
  errorHelp: 'mt-4 text-sm text-gray-500',
  errorList: 'text-left mt-2 space-y-1',
};

// Global CSS injection for video fixes
export const injectGlobalStyles = (): void => {
  const style = document.createElement('style');
  style.textContent = `
    .jitsi-iframe, iframe[src*="meet.jit.si"] {
      width: 100% !important;
      height: 100% !important;
      min-height: 500px !important;
      border: none !important;
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      z-index: 1 !important;
      margin-top: 0 !important;
      padding-top: 0 !important;
    }
    .meeting-header {
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .meeting-header * {
      text-shadow: none !important;
      box-shadow: none !important;
    }
    .jitsi-container {
      position: relative !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
    }
    
    /* Hide all Jitsi branding and logos */
    iframe[src*="meet.jit.si"] * {
      /* Hide Jitsi logo in video area */
      [class*="jitsi-logo"],
      [class*="jitsi-watermark"],
      [class*="watermark"],
      [class*="logo"],
      [id*="jitsi-logo"],
      [id*="jitsi-watermark"],
      [id*="watermark"],
      [id*="logo"],
      .jitsi-logo,
      .jitsi-watermark,
      .watermark,
      .logo,
      [data-testid*="jitsi-logo"],
      [data-testid*="watermark"],
      [aria-label*="Jitsi"],
      [title*="Jitsi"],
      img[src*="jitsi"],
      img[alt*="Jitsi"],
      img[alt*="jitsi"],
      .powered-by,
      .powered-by-jitsi,
      [class*="powered"],
      [id*="powered"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        width: 0 !important;
        overflow: hidden !important;
      }
    }
    
    /* Additional hiding for any remaining branding */
    iframe[src*="meet.jit.si"] {
      /* Hide any top-right corner branding */
      .top-right-corner,
      .header-logo,
      .branding,
      .jitsi-branding {
        display: none !important;
      }
    }
    
    /* More aggressive hiding for Jitsi logos in video area */
    iframe[src*="meet.jit.si"] body * {
      /* Target any element that might contain Jitsi branding */
      [class*="jitsi"],
      [id*="jitsi"],
      [class*="watermark"],
      [id*="watermark"],
      [class*="logo"],
      [id*="logo"],
      [class*="brand"],
      [id*="brand"],
      [class*="powered"],
      [id*="powered"],
      [data-testid*="jitsi"],
      [data-testid*="watermark"],
      [data-testid*="logo"],
      [aria-label*="jitsi"],
      [aria-label*="Jitsi"],
      [title*="jitsi"],
      [title*="Jitsi"],
      img[src*="jitsi"],
      img[src*="Jitsi"],
      img[alt*="jitsi"],
      img[alt*="Jitsi"],
      svg[class*="jitsi"],
      svg[id*="jitsi"],
      div[class*="jitsi"],
      div[id*="jitsi"],
      span[class*="jitsi"],
      span[id*="jitsi"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        width: 0 !important;
        overflow: hidden !important;
        position: absolute !important;
        left: -9999px !important;
        top: -9999px !important;
      }
    }
    
    /* Add Remotify branding to replace Jitsi logo */
    iframe[src*="meet.jit.si"] body::before {
      content: "🏢 Remotify" !important;
      position: fixed !important;
      top: 20px !important;
      left: 20px !important;
      z-index: 9999 !important;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
      padding: 10px 18px !important;
      border-radius: 12px !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-weight: 700 !important;
      font-size: 16px !important;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2) !important;
      letter-spacing: 0.8px !important;
      border: 2px solid rgba(255, 255, 255, 0.2) !important;
      backdrop-filter: blur(10px) !important;
    }
    
    /* Hide the original Jitsi logo area completely */
    iframe[src*="meet.jit.si"] body [class*="leftwatermark"],
    iframe[src*="meet.jit.si"] body [class*="watermark"],
    iframe[src*="meet.jit.si"] body [class*="logo"],
    iframe[src*="meet.jit.si"] body [id*="logo"],
    iframe[src*="meet.jit.si"] body [class*="branding"],
    iframe[src*="meet.jit.si"] body [id*="branding"] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      height: 0 !important;
      width: 0 !important;
    }
  `;
  document.head.appendChild(style);
};

// Video sizing utility
export const applyVideoSizing = (containerElement: HTMLElement): boolean => {
  try {
    const iframe = containerElement.querySelector('iframe');
    if (iframe) {
      Object.assign(iframe.style, {
        width: '100%',
        height: '100%',
        minHeight: '500px',
        border: 'none',
        position: 'absolute',
        top: '0',
        left: '0',
        marginTop: '0',
        paddingTop: '0',
        zIndex: '1'
      });
      return true;
    }
  } catch (error) {
    console.log("Note: Could not apply video sizing fixes");
  }
  return false;
};
