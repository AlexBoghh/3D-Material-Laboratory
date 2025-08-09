/**
 * Performance utilities for optimizing Three.js lighting and rendering
 * Based on device capabilities and user preferences
 */

// Device performance detection
export function detectDevicePerformance() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  const cores = navigator.hardwareConcurrency || 4
  const memory = navigator.deviceMemory || 4
  const pixelRatio = window.devicePixelRatio || 1
  
  // Performance scoring (0-100)
  let performanceScore = 50 // baseline
  
  // CPU scoring
  if (cores >= 8) performanceScore += 20
  else if (cores >= 6) performanceScore += 10
  else if (cores <= 2) performanceScore -= 20
  
  // Memory scoring
  if (memory >= 8) performanceScore += 15
  else if (memory >= 4) performanceScore += 5
  else if (memory <= 2) performanceScore -= 15
  
  // Mobile penalty
  if (isMobile) performanceScore -= 25
  
  // High DPI penalty
  if (pixelRatio > 2) performanceScore -= 10
  
  // Determine tier
  let tier = 'medium'
  if (performanceScore >= 70) tier = 'high'
  else if (performanceScore <= 40) tier = 'low'
  
  return {
    tier,
    score: Math.max(0, Math.min(100, performanceScore)),
    isMobile,
    cores,
    memory,
    pixelRatio,
    details: {
      supportsShadows: performanceScore >= 50,
      supportsHDRI: performanceScore >= 40,
      supportsTransitions: performanceScore >= 60,
      maxShadowMapSize: isMobile ? 1024 : (performanceScore >= 70 ? 2048 : 1512),
      recommendedLightCount: isMobile ? 2 : (performanceScore >= 70 ? 4 : 3)
    }
  }
}

// Environment-specific optimizations
export function getOptimizedEnvironmentSettings(environment, devicePerformance) {
  const baseSettings = {
    studio: {
      intensity: 1.0,
      shadowMapSize: 2048,
      enableTransitions: true,
      preloadPriority: 'high'
    },
    city: {
      intensity: 1.2,
      shadowMapSize: 2048,
      enableTransitions: true,
      preloadPriority: 'high'
    },
    sunset: {
      intensity: 0.8,
      shadowMapSize: 1512,
      enableTransitions: true,
      preloadPriority: 'medium'
    },
    apartment: {
      intensity: 0.4,
      shadowMapSize: 1024,
      enableTransitions: true,
      preloadPriority: 'medium'
    }
  }
  
  const settings = { ...baseSettings[environment] } || baseSettings.studio
  
  // Apply device-specific optimizations
  switch (devicePerformance.tier) {
    case 'low':
      settings.shadowMapSize = Math.min(settings.shadowMapSize, 1024)
      settings.enableTransitions = false
      settings.intensity *= 0.8 // Reduce for performance
      break
      
    case 'medium':
      settings.shadowMapSize = Math.min(settings.shadowMapSize, 1512)
      break
      
    case 'high':
      // Use full quality
      break
  }
  
  return settings
}

// Shadow optimization based on material requirements
export function getOptimizedShadowSettings(material, lighting, devicePerformance) {
  const baseShadowSettings = {
    mapSize: lighting.shadowMapSize || 2048,
    radius: lighting.shadowRadius || 10,
    blurSamples: lighting.shadowBlurSamples || 25,
    bias: lighting.shadowBias || -0.0005,
    normalBias: lighting.shadowNormalBias || 0.02
  }
  
  // Material-specific optimizations
  const materialOptimizations = {
    standard: {
      // Standard materials benefit from higher quality shadows
      mapSizeMultiplier: 1.0,
      radiusMultiplier: 1.0,
      sampleMultiplier: 1.0
    },
    physical: {
      // Physical materials need precise shadows for realism
      mapSizeMultiplier: 1.2,
      radiusMultiplier: 0.8,
      sampleMultiplier: 1.2
    },
    metallic: {
      // Metallic surfaces show shadow reflections
      mapSizeMultiplier: 1.1,
      radiusMultiplier: 0.9,
      sampleMultiplier: 1.1
    },
    glass: {
      // Glass materials need softer shadows
      mapSizeMultiplier: 0.9,
      radiusMultiplier: 1.3,
      sampleMultiplier: 0.8
    }
  }
  
  const materialType = material?.type || 'standard'
  const optimization = materialOptimizations[materialType] || materialOptimizations.standard
  
  // Apply material optimizations
  let optimizedSettings = {
    mapSize: Math.round(baseShadowSettings.mapSize * optimization.mapSizeMultiplier),
    radius: baseShadowSettings.radius * optimization.radiusMultiplier,
    blurSamples: Math.round(baseShadowSettings.blurSamples * optimization.sampleMultiplier),
    bias: baseShadowSettings.bias,
    normalBias: baseShadowSettings.normalBias
  }
  
  // Apply device performance constraints
  optimizedSettings.mapSize = Math.min(optimizedSettings.mapSize, devicePerformance.details.maxShadowMapSize)
  
  if (devicePerformance.tier === 'low') {
    optimizedSettings.blurSamples = Math.min(optimizedSettings.blurSamples, 15)
    optimizedSettings.radius = Math.min(optimizedSettings.radius, 8)
  } else if (devicePerformance.tier === 'medium') {
    optimizedSettings.blurSamples = Math.min(optimizedSettings.blurSamples, 20)
    optimizedSettings.radius = Math.min(optimizedSettings.radius, 12)
  }
  
  return optimizedSettings
}

// Lighting intensity optimization for different environments
export function getOptimizedIntensity(lightingPreset, environmentType, devicePerformance) {
  let baseIntensity = lightingPreset.intensity || 1.0
  let envIntensity = lightingPreset.environmentIntensity || 0.6
  
  // Environment-specific adjustments
  const environmentAdjustments = {
    studio: { light: 1.0, env: 1.0 },
    city: { light: 1.1, env: 1.2 },
    sunset: { light: 0.9, env: 0.8 },
    apartment: { light: 0.7, env: 0.4 }
  }
  
  const adjustment = environmentAdjustments[environmentType] || environmentAdjustments.studio
  
  baseIntensity *= adjustment.light
  envIntensity *= adjustment.env
  
  // Device performance adjustments
  if (devicePerformance.tier === 'low') {
    baseIntensity *= 0.8
    envIntensity *= 0.7
  } else if (devicePerformance.tier === 'high') {
    baseIntensity *= 1.1
    envIntensity *= 1.2
  }
  
  return {
    lightIntensity: baseIntensity,
    environmentIntensity: envIntensity
  }
}

// Memory usage estimation for different settings
export function estimateMemoryUsage(settings) {
  const shadowMapMemory = (settings.shadowMapSize ** 2) * 4 * 6 / (1024 * 1024) // MB for cube shadow map
  const environmentMemory = {
    studio: 4, // MB
    city: 6,
    sunset: 5,
    apartment: 3
  }
  
  const totalMemory = shadowMapMemory + (environmentMemory[settings.environment] || 4)
  
  return {
    shadowMaps: shadowMapMemory,
    environment: environmentMemory[settings.environment] || 4,
    total: totalMemory,
    warning: totalMemory > 50 // Warn if over 50MB
  }
}

// Performance monitor for runtime adjustments
export class PerformanceMonitor {
  constructor() {
    this.frameRates = []
    this.maxSamples = 60 // 1 second at 60fps
    this.isMonitoring = false
    this.callbacks = []
  }
  
  startMonitoring() {
    this.isMonitoring = true
    this.frameRates = []
    this.lastTime = performance.now()
  }
  
  stopMonitoring() {
    this.isMonitoring = false
  }
  
  recordFrame() {
    if (!this.isMonitoring) return
    
    const now = performance.now()
    const delta = now - this.lastTime
    const fps = 1000 / delta
    
    this.frameRates.push(fps)
    if (this.frameRates.length > this.maxSamples) {
      this.frameRates.shift()
    }
    
    this.lastTime = now
    
    // Check for performance issues
    if (this.frameRates.length >= 30) { // Half second of data
      const averageFPS = this.frameRates.reduce((a, b) => a + b) / this.frameRates.length
      const minFPS = Math.min(...this.frameRates.slice(-30))
      
      if (averageFPS < 45 || minFPS < 30) {
        this.callbacks.forEach(callback => callback({
          averageFPS,
          minFPS,
          suggestion: this.getPerformanceSuggestion(averageFPS, minFPS)
        }))
      }
    }
  }
  
  getPerformanceSuggestion(avgFPS, minFPS) {
    if (avgFPS < 30) {
      return 'severe' // Disable shadows, reduce quality
    } else if (avgFPS < 45) {
      return 'moderate' // Reduce shadow quality, disable transitions
    } else if (minFPS < 30) {
      return 'minor' // Reduce shadow map size
    }
    return 'good'
  }
  
  onPerformanceIssue(callback) {
    this.callbacks.push(callback)
  }
}

export const performanceMonitor = new PerformanceMonitor()