// Lighting presets for the 3D material laboratory
// Based on material simulation document recommendations for PBR lighting
//
// Environment Mapping Strategy:
// - Studio: 'studio' - Neutral professional lighting (5500K)
// - Outdoor: 'city' - Bright daylight with urban reflections (6500K)
// - Sunset: 'sunset' - Warm golden hour lighting (3200K)
// - Night: 'apartment' - Warm interior lighting for dramatic contrast (3800K)
//
// Each HDRI provides both environment lighting and realistic reflections
// Intensities are carefully balanced to avoid loading flashes during transitions

const lightingPresets = {
  studio: {
    key: 'studio',
    name: 'Studio',
    description: 'Professional studio lighting with even illumination',
    // HDRI Environment configuration
    environment: 'studio',
    environmentIntensity: 1.0,
    // DirectionalLight configuration - simulating studio key light
    intensity: 1.8, // Increased for better material visibility
    position: [5, 10, 7.5],
    rotationY: 45, // degrees for UI display
    // Shadow configuration for realism
    shadows: true,
    shadowMapSize: 2048,
    shadowRadius: 10,
    shadowBlurSamples: 25,
    shadowBias: -0.0005,
    shadowNormalBias: 0.02,
    // Contact shadows for enhanced ground interaction
    contactShadows: {
      opacity: 0.25, // Increased for better visibility
      scale: 0.8, // Larger shadow area
      blur: 1.2 // More blur for softer shadows
    },
    // Visual indicator gradient
    gradient: 'linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%)',
    // Optimized for material types
    materialOptimization: {
      standard: { envMapIntensity: 1.0 },
      physical: { envMapIntensity: 1.2 },
      metallic: { envMapIntensity: 1.5 }
    }
  },

  outdoor: {
    key: 'outdoor',
    name: 'Outdoor',
    description: 'Natural sunlight with blue sky ambience',
    // HDRI Environment configuration
    environment: 'city',
    environmentIntensity: 1.0, // Will be multiplied by environment's base intensity (1.2)
    // Strong directional light simulating sun
    intensity: 2.0,
    position: [10, 15, 5],
    rotationY: 60,
    shadows: true,
    shadowMapSize: 2048,
    shadowRadius: 8,
    shadowBlurSamples: 20,
    shadowBias: -0.0003,
    shadowNormalBias: 0.015,
    contactShadows: {
      opacity: 0.25,
      scale: 0.8,
      blur: 1.2
    },
    gradient: 'linear-gradient(135deg, #87CEEB 0%, #98D8C8 100%)',
    materialOptimization: {
      standard: { envMapIntensity: 1.2 },
      physical: { envMapIntensity: 1.4 },
      metallic: { envMapIntensity: 2.0 }
    }
  },

  sunset: {
    key: 'sunset',
    name: 'Sunset',
    description: 'Warm golden hour lighting with soft shadows',
    // HDRI Environment configuration
    environment: 'sunset',
    environmentIntensity: 1.0, // Will be multiplied by environment's base intensity (0.8)
    // Warm, lower intensity light
    intensity: 1.5,
    position: [8, 6, 10],
    rotationY: 75,
    shadows: true,
    shadowMapSize: 1024, // Softer shadows
    shadowRadius: 15,
    shadowBlurSamples: 30,
    shadowBias: -0.0008,
    shadowNormalBias: 0.025,
    contactShadows: {
      opacity: 0.2,
      scale: 0.7,
      blur: 1.5
    },
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
    materialOptimization: {
      standard: { envMapIntensity: 1.3 },
      physical: { envMapIntensity: 1.6 },
      metallic: { envMapIntensity: 1.8 }
    }
  },

  night: {
    key: 'night',
    name: 'Night',
    description: 'Dramatic low-key lighting with strong contrasts',
    // HDRI Environment configuration
    environment: 'apartment', // Use warm apartment lighting for night scene
    environmentIntensity: 1.0, // Will be multiplied by environment's base intensity (0.4)
    // Low intensity with strong contrast
    intensity: 0.8,
    position: [3, 8, -5],
    rotationY: 120,
    shadows: true,
    shadowMapSize: 1024,
    shadowRadius: 20,
    shadowBlurSamples: 35,
    shadowBias: -0.001,
    shadowNormalBias: 0.03,
    contactShadows: {
      opacity: 0.4,
      scale: 0.5,
      blur: 2.0
    },
    gradient: 'linear-gradient(135deg, #2C3E50 0%, #4A6741 100%)',
    materialOptimization: {
      standard: { envMapIntensity: 0.8 },
      physical: { envMapIntensity: 1.0 },
      metallic: { envMapIntensity: 1.2 }
    }
  }
}

// Default lighting configuration
export const defaultLighting = lightingPresets.studio

// Get all lighting presets as array
export function getLightingPresets() {
  return Object.values(lightingPresets)
}

// Get specific preset by key
export function getLightingPreset(key) {
  return lightingPresets[key] || defaultLighting
}

// Calculate optimal settings based on material type
export function getOptimizedLighting(lightingConfig, materialType = 'standard') {
  const lighting = { ...lightingConfig }
  const optimization = lighting.materialOptimization?.[materialType]
  
  if (optimization) {
    lighting.environmentIntensity *= optimization.envMapIntensity || 1.0
  }
  
  return lighting
}

// Performance optimization based on device capabilities
export function getPerformanceOptimizedLighting(lightingConfig, deviceTier = 'desktop') {
  const lighting = { ...lightingConfig }
  
  switch (deviceTier) {
    case 'mobile':
      lighting.shadowMapSize = Math.min(lighting.shadowMapSize, 1024)
      lighting.shadowBlurSamples = Math.min(lighting.shadowBlurSamples, 15)
      lighting.environmentIntensity *= 0.7 // Reduce for performance
      break
    case 'tablet':
      lighting.shadowMapSize = Math.min(lighting.shadowMapSize, 1512)
      lighting.shadowBlurSamples = Math.min(lighting.shadowBlurSamples, 20)
      break
    case 'desktop':
    default:
      // Use full quality settings
      break
  }
  
  return lighting
}