// JitsiMeet component styles
export const jitsiStyles = {
  // Container styles - responsive padding for mobile
  container: {
    position: 'relative' as const,
    height: '100%',
    minHeight: '500px',
    paddingTop: '50px', // Reduced padding for mobile
  },
  
  // Video container styles - responsive height calculation
  videoContainer: {
    minHeight: '420px',
    height: 'calc(100% - 50px)', // Adjusted to match reduced padding
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
    background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.9), transparent)',
    padding: '1rem 1.5rem',
    minHeight: '60px',
    // Removed backdropFilter blur to prevent blurriness
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
  header: 'absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/90 to-transparent p-2 sm:p-3 md:p-5 meeting-header',
  videoContainer: 'w-full h-full min-h-[300px] sm:min-h-[420px] md:min-h-[520px] lg:min-h-[600px] jitsi-container',
  loadingSpinner: 'animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-purple-600 mx-auto mb-4',
  loadingText: 'text-white text-base sm:text-lg',
  loadingSubtext: 'text-gray-400 text-xs sm:text-sm mt-2',
  loadingHint: 'text-gray-500 text-xs mt-2',
  buttonGroup: 'space-y-2',
  button: 'w-full',
  headerContent: 'flex flex-row items-center justify-between gap-2 sm:gap-3 md:gap-4',
  headerInfo: 'flex flex-row items-center gap-1 sm:gap-2 md:gap-3',
  roomBadge: 'bg-purple-600 text-white px-1 py-0.5 sm:px-2 sm:py-1 md:px-3 rounded-full text-xs sm:text-sm font-medium',
  userName: 'text-white text-xs sm:text-sm font-medium truncate max-w-[80px] sm:max-w-[120px] md:max-w-none',
  headerControls: 'flex items-center gap-2 sm:gap-3',
  videoButton: 'text-white border-white/20 hover:bg-white/10 text-xs sm:text-sm px-1 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-2',
  leaveButton: 'text-red-400 border-red-400/50 hover:bg-red-400/10 text-xs sm:text-sm px-1 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-2',
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
      /* Ensure video clarity */
      image-rendering: auto !important;
      -webkit-backface-visibility: hidden !important;
      backface-visibility: hidden !important;
      transform: translateZ(0) !important;
    }
    .meeting-header {
      text-rendering: optimizeSpeed;
      -webkit-font-smoothing: auto;
      -moz-osx-font-smoothing: auto;
      font-smooth: never;
    }
    .meeting-header * {
      text-shadow: none !important;
      box-shadow: none !important;
    }
    
    /* Mobile-specific header optimizations */
    @media (max-width: 639px) {
      .meeting-header {
        padding: 0.5rem 1rem !important;
        min-height: 50px !important;
        background: transparent !important;
        backdrop-filter: none !important;
      }
      
      .meeting-header .header-content {
        gap: 0.5rem !important;
      }
      
      .meeting-header .header-info {
        gap: 0.5rem !important;
      }
      
      .meeting-header .room-badge {
        font-size: 0.625rem !important;
        padding: 0.125rem 0.375rem !important;
        background: transparent !important;
        /* Removed backdrop-filter blur */
      }
      
      .meeting-header .user-name {
        font-size: 0.625rem !important;
        max-width: 60px !important;
        background: transparent !important;
        padding: 0.125rem 0.375rem !important;
        border-radius: 0.25rem !important;
        /* Removed backdrop-filter blur */
      }
      
      .meeting-header .video-button,
      .meeting-header .leave-button {
        font-size: 0.625rem !important;
        padding: 0.125rem 0.375rem !important;
        min-width: 45px !important;
        background: transparent !important;
        /* Removed backdrop-filter blur */
        border: 1px solid rgba(255, 255, 255, 0.3) !important;
      }
    }
    .jitsi-container {
      position: relative !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
    }
    
    /* Hide all Jitsi and 8x8 branding and logos - including pre-join screen */
    iframe[src*="meet.jit.si"] *,
    iframe[src*="meet.jit.si"] body *,
    iframe[src*="meet.jit.si"] div *,
    iframe[src*="8x8.vc"] *,
    iframe[src*="8x8.vc"] body *,
    iframe[src*="8x8.vc"] div * {
      /* Hide Jitsi logo in video area */
      [class*="jitsi-logo"],
      [class*="jitsi-watermark"],
      [class*="watermark"],
      [class*="logo"],
      [class*="brand"],
      [class*="branding"],
      [id*="jitsi-logo"],
      [id*="jitsi-watermark"],
      [id*="watermark"],
      [id*="logo"],
      [id*="brand"],
      [id*="branding"],
      .jitsi-logo,
      .jitsi-watermark,
      .watermark,
      .logo,
      .brand,
      .branding,
      [data-testid*="jitsi-logo"],
      [data-testid*="watermark"],
      [data-testid*="logo"],
      [data-testid*="brand"],
      [aria-label*="Jitsi"],
      [aria-label*="jitsi"],
      [title*="Jitsi"],
      [title*="jitsi"],
      img[src*="jitsi"],
      img[src*="Jitsi"],
      img[alt*="Jitsi"],
      img[alt*="jitsi"],
      .powered-by,
      .powered-by-jitsi,
      [class*="powered"],
      [id*="powered"],
      /* Additional selectors for newer Jitsi versions */
      [class*="leftwatermark"],
      [class*="rightwatermark"],
      [class*="topwatermark"],
      [class*="bottomwatermark"],
      [id*="leftwatermark"],
      [id*="rightwatermark"],
      [id*="topwatermark"],
      [id*="bottomwatermark"],
      /* 8x8 specific branding */
      [class*="8x8"],
      [id*="8x8"],
      [class*="eight"],
      [id*="eight"],
      [data-testid*="8x8"],
      [aria-label*="8x8"],
      [title*="8x8"],
      img[src*="8x8"],
      img[alt*="8x8"] {
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
    
    /* Specific targeting for pre-join screen logo */
    iframe[src*="meet.jit.si"] body div[class*="prejoin"],
    iframe[src*="meet.jit.si"] body div[class*="left-panel"],
    iframe[src*="meet.jit.si"] body div[class*="welcome"],
    iframe[src*="meet.jit.si"] body div[class*="meeting"],
    iframe[src*="meet.jit.si"] body div[class*="header"],
    iframe[src*="meet.jit.si"] body div[class*="logo"],
    iframe[src*="meet.jit.si"] body div[class*="brand"],
    iframe[src*="meet.jit.si"] body div[class*="branding"],
    iframe[src*="meet.jit.si"] body div[class*="jitsi"],
    iframe[src*="meet.jit.si"] body span[class*="logo"],
    iframe[src*="meet.jit.si"] body span[class*="brand"],
    iframe[src*="meet.jit.si"] body span[class*="jitsi"],
    iframe[src*="meet.jit.si"] body h1[class*="logo"],
    iframe[src*="meet.jit.si"] body h2[class*="logo"],
    iframe[src*="meet.jit.si"] body h3[class*="logo"],
    iframe[src*="meet.jit.si"] body p[class*="logo"],
    iframe[src*="meet.jit.si"] body a[class*="logo"],
    iframe[src*="meet.jit.si"] body img[class*="logo"],
    iframe[src*="meet.jit.si"] body svg[class*="logo"],
    iframe[src*="meet.jit.si"] body [class*="jitsi-logo"],
    iframe[src*="meet.jit.si"] body [class*="jitsi-brand"],
    iframe[src*="meet.jit.si"] body [class*="jitsi-branding"],
    iframe[src*="meet.jit.si"] body [id*="jitsi-logo"],
    iframe[src*="meet.jit.si"] body [id*="jitsi-brand"],
    iframe[src*="meet.jit.si"] body [id*="jitsi-branding"],
    iframe[src*="meet.jit.si"] body [data-testid*="jitsi-logo"],
    iframe[src*="meet.jit.si"] body [data-testid*="logo"],
    iframe[src*="meet.jit.si"] body [aria-label*="jitsi"],
    iframe[src*="meet.jit.si"] body [aria-label*="Jitsi"],
    iframe[src*="meet.jit.si"] body [title*="jitsi"],
    iframe[src*="meet.jit.si"] body [title*="Jitsi"] {
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
    
    /* Additional aggressive hiding for any remaining Jitsi text */
    iframe[src*="meet.jit.si"] body * {
      /* Hide any element that might contain Jitsi text */
      &:has-text("jitsi"),
      &:has-text("Jitsi"),
      &:has-text("JITSI") {
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
    
    /* Ultra-aggressive pre-join screen logo hiding */
    iframe[src*="meet.jit.si"] body div[class*="prejoin"] *,
    iframe[src*="meet.jit.si"] body div[class*="left-panel"] *,
    iframe[src*="meet.jit.si"] body div[class*="welcome"] *,
    iframe[src*="meet.jit.si"] body div[class*="meeting"] *,
    iframe[src*="meet.jit.si"] body div[class*="header"] *,
    iframe[src*="meet.jit.si"] body div[class*="logo"] *,
    iframe[src*="meet.jit.si"] body div[class*="brand"] *,
    iframe[src*="meet.jit.si"] body div[class*="branding"] *,
    iframe[src*="meet.jit.si"] body div[class*="jitsi"] *,
    iframe[src*="meet.jit.si"] body span[class*="logo"] *,
    iframe[src*="meet.jit.si"] body span[class*="brand"] *,
    iframe[src*="meet.jit.si"] body span[class*="jitsi"] *,
    iframe[src*="meet.jit.si"] body h1[class*="logo"] *,
    iframe[src*="meet.jit.si"] body h2[class*="logo"] *,
    iframe[src*="meet.jit.si"] body h3[class*="logo"] *,
    iframe[src*="meet.jit.si"] body p[class*="logo"] *,
    iframe[src*="meet.jit.si"] body a[class*="logo"] *,
    iframe[src*="meet.jit.si"] body img[class*="logo"] *,
    iframe[src*="meet.jit.si"] body svg[class*="logo"] *,
    iframe[src*="meet.jit.si"] body [class*="jitsi-logo"] *,
    iframe[src*="meet.jit.si"] body [class*="jitsi-brand"] *,
    iframe[src*="meet.jit.si"] body [class*="jitsi-branding"] *,
    iframe[src*="meet.jit.si"] body [id*="jitsi-logo"] *,
    iframe[src*="meet.jit.si"] body [id*="jitsi-brand"] *,
    iframe[src*="meet.jit.si"] body [id*="jitsi-branding"] *,
    iframe[src*="meet.jit.si"] body [data-testid*="jitsi-logo"] *,
    iframe[src*="meet.jit.si"] body [data-testid*="logo"] *,
    iframe[src*="meet.jit.si"] body [aria-label*="jitsi"] *,
    iframe[src*="meet.jit.si"] body [aria-label*="Jitsi"] *,
    iframe[src*="meet.jit.si"] body [title*="jitsi"] *,
    iframe[src*="meet.jit.si"] body [title*="Jitsi"] * {
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
    
    /* Specific targeting for watermark background image */
    iframe[src*="meet.jit.si"] body *[style*="background-image: url(images/watermark.svg)"],
    iframe[src*="meet.jit.si"] body *[style*="background-image:url(images/watermark.svg)"],
    iframe[src*="meet.jit.si"] body *[style*="watermark.svg"],
    iframe[src*="meet.jit.si"] body *[style*="background-image"],
    iframe[src*="meet.jit.si"] body *[class*="watermark"],
    iframe[src*="meet.jit.si"] body *[id*="watermark"],
    iframe[src*="meet.jit.si"] body *[class*="logo"],
    iframe[src*="meet.jit.si"] body *[id*="logo"] {
      background-image: none !important;
      background: none !important;
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
    
    /* Inject JavaScript to hide Jitsi branding dynamically */
    iframe[src*="meet.jit.si"] body::after {
      content: "" !important;
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      z-index: 10000 !important;
      pointer-events: none !important;
      background: transparent !important;
    }
    
    /* Targeted branding removal - keep pre-join functionality */
    iframe[src*="meet.jit.si"] body div[class*="leftwatermark"],
    iframe[src*="meet.jit.si"] body div[class*="rightwatermark"],
    iframe[src*="meet.jit.si"] body div[class*="topwatermark"],
    iframe[src*="meet.jit.si"] body div[class*="bottomwatermark"],
    iframe[src*="meet.jit.si"] body div[class*="jitsi-logo"],
    iframe[src*="meet.jit.si"] body div[class*="jitsi-brand"],
    iframe[src*="meet.jit.si"] body div[class*="jitsi-branding"],
    iframe[src*="meet.jit.si"] body div[class*="logo"],
    iframe[src*="meet.jit.si"] body div[class*="brand"],
    iframe[src*="meet.jit.si"] body div[class*="watermark"],
    iframe[src*="meet.jit.si"] body span[class*="jitsi-logo"],
    iframe[src*="meet.jit.si"] body span[class*="logo"],
    iframe[src*="meet.jit.si"] body h1[class*="jitsi"],
    iframe[src*="meet.jit.si"] body h2[class*="jitsi"],
    iframe[src*="meet.jit.si"] body h3[class*="jitsi"],
    iframe[src*="meet.jit.si"] body p[class*="jitsi"],
    iframe[src*="meet.jit.si"] body a[class*="jitsi"],
    iframe[src*="meet.jit.si"] body img[class*="jitsi"],
    iframe[src*="meet.jit.si"] body svg[class*="jitsi"],
    iframe[src*="8x8.vc"] body div[class*="leftwatermark"],
    iframe[src*="8x8.vc"] body div[class*="rightwatermark"],
    iframe[src*="8x8.vc"] body div[class*="topwatermark"],
    iframe[src*="8x8.vc"] body div[class*="bottomwatermark"],
    iframe[src*="8x8.vc"] body div[class*="8x8-logo"],
    iframe[src*="8x8.vc"] body div[class*="8x8-brand"],
    iframe[src*="8x8.vc"] body div[class*="logo"],
    iframe[src*="8x8.vc"] body div[class*="brand"],
    iframe[src*="8x8.vc"] body div[class*="watermark"],
    iframe[src*="8x8.vc"] body span[class*="8x8-logo"],
    iframe[src*="8x8.vc"] body span[class*="logo"],
    iframe[src*="8x8.vc"] body h1[class*="8x8"],
    iframe[src*="8x8.vc"] body h2[class*="8x8"],
    iframe[src*="8x8.vc"] body h3[class*="8x8"],
    iframe[src*="8x8.vc"] body p[class*="8x8"],
    iframe[src*="8x8.vc"] body a[class*="8x8"],
    iframe[src*="8x8.vc"] body img[class*="8x8"],
    iframe[src*="8x8.vc"] body svg[class*="8x8"] {
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
    
    /* Force video to take full width and ensure clarity */
    iframe[src*="meet.jit.si"] body div[class*="video"],
    iframe[src*="meet.jit.si"] body div[class*="conference"],
    iframe[src*="meet.jit.si"] body div[class*="meeting"] {
      width: 100% !important;
      left: 0 !important;
      margin-left: 0 !important;
      /* Ensure video clarity */
      image-rendering: auto !important;
      -webkit-backface-visibility: hidden !important;
      backface-visibility: hidden !important;
      transform: translateZ(0) !important;
    }
    
    /* Ensure video elements are crisp */
    iframe[src*="meet.jit.si"] body video,
    iframe[src*="meet.jit.si"] body canvas {
      image-rendering: auto !important;
      -webkit-backface-visibility: hidden !important;
      backface-visibility: hidden !important;
      transform: translateZ(0) !important;
    }
    
    /* Single overlay at top-left (where Jitsi watermark usually sits) - Desktop only */
    .jitsi-container::after {
      content: "" !important;
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 200px !important;
      height: 70px !important;
      z-index: 1001 !important;
      background: #111111 !important;
      border-radius: 0 0 12px 0 !important;
      pointer-events: none !important;
    }
    
    /* Mobile overlay - smaller size */
    @media (max-width: 639px) {
      .jitsi-container::after {
        width: 305px !important;
        height: 60px !important;
        background: #111111 !important;
        display: block !important;
        visibility: visible !important;
      }
    }
    
    /* Desktop screens */
    @media (min-width: 1024px) {
      .jitsi-container::after {
        width: 240px !important;
        height: 80px !important;
        border-radius: 0 0 15px 0 !important;
      }
    }
    
    /* Logo overlay - Desktop only */
    .jitsi-container::before {
      /* Replace text with logo image */
      content: "" !important;
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 200px !important;
      height: 70px !important;
      z-index: 1002 !important;
      background: url('/remote_logo.png') no-repeat left center / 60px auto !important;
      border-radius: 0 0 12px 0 !important;
      box-shadow: none !important;
      pointer-events: none !important;
      opacity: 1 !important;
      backdrop-filter: none !important;
      border: 0 !important;
      user-select: none !important;
    }
    
    /* Mobile logo overlay - smaller size */
    @media (max-width: 639px) {
      .jitsi-container::before {
        width: 120px !important;
        height: 40px !important;
        background: url('/remote_logo.png') no-repeat left center / 40px auto !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        z-index: 1002 !important;
      }
    }
    
    /* Desktop screens - Logo */
    @media (min-width: 1024px) {
      .jitsi-container::before {
        width: 240px !important;
        height: 80px !important;
        background: url('/remote_logo.png') no-repeat left center / 70px auto !important;
        border-radius: 0 0 15px 0 !important;
      }
    }
    
    /* Mobile-specific overrides - ensure overlays work on mobile */
    @media (max-width: 639px) {
      .jitsi-container::after,
      .jitsi-container::before {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        pointer-events: none !important;
      }
      
      /* Show Jitsi logo on mobile by overriding the hiding rules */
      iframe[src*="meet.jit.si"] body * [class*="jitsi-logo"],
      iframe[src*="meet.jit.si"] body * [class*="jitsi-watermark"],
      iframe[src*="meet.jit.si"] body * [class*="watermark"],
      iframe[src*="meet.jit.si"] body * [class*="logo"],
      iframe[src*="meet.jit.si"] body * [id*="jitsi-logo"],
      iframe[src*="meet.jit.si"] body * [id*="jitsi-watermark"],
      iframe[src*="meet.jit.si"] body * [id*="watermark"],
      iframe[src*="meet.jit.si"] body * [id*="logo"],
      iframe[src*="meet.jit.si"] body * .jitsi-logo,
      iframe[src*="meet.jit.si"] body * .jitsi-watermark,
      iframe[src*="meet.jit.si"] body * .watermark,
      iframe[src*="meet.jit.si"] body * .logo,
      iframe[src*="meet.jit.si"] body * [class*="leftwatermark"],
      iframe[src*="meet.jit.si"] body * [class*="rightwatermark"],
      iframe[src*="meet.jit.si"] body * [class*="topwatermark"],
      iframe[src*="meet.jit.si"] body * [class*="bottomwatermark"],
      iframe[src*="meet.jit.si"] body * [id*="leftwatermark"],
      iframe[src*="meet.jit.si"] body * [id*="rightwatermark"],
      iframe[src*="meet.jit.si"] body * [id*="topwatermark"],
      iframe[src*="meet.jit.si"] body * [id*="bottomwatermark"] {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        height: auto !important;
        width: auto !important;
        overflow: visible !important;
        position: static !important;
        left: auto !important;
        top: auto !important;
      }
    }
    
    /* Remove additional iframe-side branding badge */
    iframe[src*="meet.jit.si"] body::before,
    iframe[src*="8x8.vc"] body::before { content: none !important; }
    
    /* Hide the original Jitsi logo area completely */
    iframe[src*="meet.jit.si"] body [class*="leftwatermark"],
    iframe[src*="meet.jit.si"] body [class*="rightwatermark"],
    iframe[src*="meet.jit.si"] body [class*="topwatermark"],
    iframe[src*="meet.jit.si"] body [class*="bottomwatermark"],
    iframe[src*="meet.jit.si"] body [class*="watermark"],
    iframe[src*="meet.jit.si"] body [class*="logo"],
    iframe[src*="meet.jit.si"] body [class*="brand"],
    iframe[src*="meet.jit.si"] body [class*="branding"],
    iframe[src*="meet.jit.si"] body [id*="leftwatermark"],
    iframe[src*="meet.jit.si"] body [id*="rightwatermark"],
    iframe[src*="meet.jit.si"] body [id*="topwatermark"],
    iframe[src*="meet.jit.si"] body [id*="bottomwatermark"],
    iframe[src*="meet.jit.si"] body [id*="watermark"],
    iframe[src*="meet.jit.si"] body [id*="logo"],
    iframe[src*="meet.jit.si"] body [id*="brand"],
    iframe[src*="meet.jit.si"] body [id*="branding"],
    /* Hide any footer branding */
    iframe[src*="meet.jit.si"] body footer,
    iframe[src*="meet.jit.si"] body [class*="footer"],
    iframe[src*="meet.jit.si"] body [id*="footer"],
    /* Hide any header branding */
    iframe[src*="meet.jit.si"] body header,
    iframe[src*="meet.jit.si"] body [class*="header"],
    iframe[src*="meet.jit.si"] body [id*="header"] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      height: 0 !important;
      width: 0 !important;
      position: absolute !important;
      left: -9999px !important;
      top: -9999px !important;
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
