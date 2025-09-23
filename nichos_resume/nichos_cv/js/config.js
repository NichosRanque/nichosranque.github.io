// ===================== PORTFOLIO CONFIGURATION =====================

/**
 * Portfolio Configuration File
 * Contains all configurable settings and constants for the tactical portfolio
 */

// ===================== APPLICATION SETTINGS =====================

const portfolioConfig = {
    // Application Info
    app: {
        name: "José Sirias - Tactical HQ",
        version: "2.0.0",
        description: "Business Intelligence Operative Portfolio",
        author: "José Sirias Monge",
        buildDate: "2025-07-31"
    },

    // Performance Settings
    performance: {
        loadingScreenDuration: 3000,
        animationDelay: 200,
        radarSweepDuration: 6000,
        sessionTimeout: 30 * 60 * 1000, // 30 minutes
        maxRadarContacts: 4,
        progressBarAnimationSpeed: 2500
    },

    // Visual Settings
    visual: {
        theme: "tactical-green",
        enableAnimations: true,
        enableGlitchEffects: true,
        enableRadarSystem: true,
        maxSectionWidth: "1400px",
        enableParticles: false,
        enableSoundEffects: false
    },

    // Security Settings
    security: {
        maxLoginAttempts: 3,
        lockoutDuration: 5 * 60 * 1000, // 5 minutes
        sessionWarningTime: 5 * 60 * 1000, // 5 minutes before expiry
        enableBruteForceProtection: true,
        enableSessionTimeout: true
    },

    // Content Settings
    content: {
        maxProjectsPerPage: 12,
        maxExperienceItems: 10,
        maxSkillCategories: 6,
        maxAchievements: 8,
        enableProjectFiltering: true,
        enableDynamicContent: true
    },

    // API and External Services
    external: {
        fontAwesomeVersion: "6.0.0",
        googleFonts: ["Orbitron:400,700,900", "Rajdhani:300,400,500,600,700"],
        enableAnalytics: false,
        enableContactForm: true
    },

    // Responsive Breakpoints
    breakpoints: {
        mobile: "768px",
        tablet: "1024px",
        desktop: "1200px",
        widescreen: "1600px"
    },

    // Tactical Theme Colors
    colors: {
        primary: "#00ff88",
        accent: "#00d4ff", 
        danger: "#ff4757",
        warning: "#ffa502",
        success: "#2ed573",
        dark: "#0a0a0a",
        darkSecondary: "#111111",
        darkTertiary: "#1a1a1a"
    },

    // Animation Settings
    animations: {
        enableHardwareAcceleration: true,
        enableAntiBlur: true,
        enableSmoothScrolling: true,
        transitionDuration: "0.3s",
        hoverScale: 1.05,
        pulseIntensity: 1.1
    },

    // Radar System Configuration
    radar: {
        enabled: true,
        sweepSpeed: 6000, // milliseconds
        maxContacts: 4,
        beamWidth: 15, // degrees
        contactLifetime: 20000, // 20 seconds
        generationInterval: 3000, // 3 seconds
        detectionRange: {
            min: 20, // % from center
            max: 45  // % from center
        }
    },

    // Admin Panel Settings
    admin: {
        enableAdvancedFeatures: true,
        enableDataExport: true,
        enableDataImport: true,
        enableThemeCustomization: true,
        enableBackup: true,
        autoSaveInterval: 30000 // 30 seconds
    },

    // Contact Information
    contact: {
        enableContactForm: true,
        enableSocialLinks: true,
        showLocation: true,
        enableMapIntegration: false,
        socialPlatforms: ["linkedin", "github"],
        contactMethods: ["form", "social"]
    },

    // Feature Flags
    features: {
        enableAdmin: true,
        enableDarkMode: true,
        enableTacticalMode: true,
        enableMobileOptimizations: true,
        enableKeyboardNavigation: true,
        enableAccessibility: true,
        enablePWA: false,
        enableOfflineMode: false
    },

    // Development Settings
    development: {
        enableDebugMode: false,
        enableConsoleLogging: true,
        enablePerformanceMonitoring: false,
        enableErrorTracking: false,
        showLoadTimes: false
    },

    // SEO and Meta Settings
    seo: {
        title: "José Sirias - BI Analyst | Tactical Portfolio",
        description: "Business Intelligence specialist focused on process improvement and digital transformation. Expert in Power BI, Excel automation, and data analytics.",
        keywords: ["Business Intelligence", "Data Analytics", "Power BI", "Excel", "VBA", "Costa Rica", "BI Analyst"],
        author: "José Sirias Monge",
        ogImage: "jose_sirias_portrait.webp",
        twitterCard: "summary_large_image"
    }
};

// ===================== UTILITY FUNCTIONS =====================

/**
 * Get configuration value by path
 * @param {string} path - Dot notation path (e.g., 'app.name')
 * @param {*} defaultValue - Default value if path not found
 */
function getConfig(path, defaultValue = null) {
    const keys = path.split('.');
    let value = portfolioConfig;
    
    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return defaultValue;
        }
    }
    
    return value;
}

/**
 * Set configuration value by path
 * @param {string} path - Dot notation path
 * @param {*} value - Value to set
 */
function setConfig(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let target = portfolioConfig;
    
    for (const key of keys) {
        if (!(key in target) || typeof target[key] !== 'object') {
            target[key] = {};
        }
        target = target[key];
    }
    
    target[lastKey] = value;
}

/**
 * Check if feature is enabled
 * @param {string} featureName - Name of the feature
 */
function isFeatureEnabled(featureName) {
    return getConfig(`features.${featureName}`, false);
}

/**
 * Get theme color
 * @param {string} colorName - Name of the color
 */
function getThemeColor(colorName) {
    return getConfig(`colors.${colorName}`, '#000000');
}

/**
 * Get breakpoint value
 * @param {string} breakpointName - Name of the breakpoint
 */
function getBreakpoint(breakpointName) {
    return getConfig(`breakpoints.${breakpointName}`, '768px');
}

/**
 * Initialize configuration
 */
function initializeConfig() {
    // Apply any stored user preferences
    const storedTheme = localStorage.getItem('portfolioTheme');
    if (storedTheme) {
        setConfig('visual.theme', storedTheme);
    }
    
    // Apply development settings
    if (getConfig('development.enableDebugMode')) {
        console.log('🔧 Debug mode enabled');
        console.log('📊 Portfolio Config:', portfolioConfig);
    }
    
    // Set CSS custom properties for dynamic theming
    if (typeof document !== 'undefined') {
        const root = document.documentElement;
        Object.entries(portfolioConfig.colors).forEach(([name, value]) => {
            root.style.setProperty(`--color-${name}`, value);
        });
    }
}

// ===================== ENVIRONMENT DETECTION =====================

const environment = {
    isProduction: !getConfig('development.enableDebugMode', false),
    isDevelopment: getConfig('development.enableDebugMode', false),
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isTouch: 'ontouchstart' in window,
    supportsWebGL: (() => {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
        } catch (e) {
            return false;
        }
    })(),
    supportsLocalStorage: (() => {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    })()
};

// ===================== EXPORT FOR GLOBAL ACCESS =====================

// Make configuration globally available
if (typeof window !== 'undefined') {
    window.portfolioConfig = portfolioConfig;
    window.getConfig = getConfig;
    window.setConfig = setConfig;
    window.isFeatureEnabled = isFeatureEnabled;
    window.getThemeColor = getThemeColor;
    window.getBreakpoint = getBreakpoint;
    window.environment = environment;
}

// Initialize configuration on load
document.addEventListener('DOMContentLoaded', initializeConfig);

console.log('⚙️ Portfolio Configuration Loaded Successfully');
