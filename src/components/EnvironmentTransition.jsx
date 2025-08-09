import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'
import { detectDevicePerformance, getOptimizedEnvironmentSettings, performanceMonitor } from '../utils/performanceUtils'

/**
 * Advanced Environment Crossfade Component
 * Provides seamless transitions between HDRI environments without loading flashes
 */

function EnvironmentCrossfade({ 
  currentEnvironment, 
  targetEnvironment, 
  intensity = 1.0,
  transitionDuration = 1.2,
  background = false,
  onTransitionComplete
}) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionProgress, setTransitionProgress] = useState(0)
  const currentEnvRef = useRef()
  const targetEnvRef = useRef()
  const transitionStartTime = useRef(0)

  // Smooth easing functions
  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  const easeOutQuart = (t) => {
    return 1 - Math.pow(1 - t, 4)
  }

  // Start transition when environment changes
  useEffect(() => {
    if (currentEnvironment !== targetEnvironment) {
      setIsTransitioning(true)
      setTransitionProgress(0)
      transitionStartTime.current = Date.now()
    }
  }, [currentEnvironment, targetEnvironment])

  // Handle transition animation
  useFrame(() => {
    if (isTransitioning) {
      const elapsed = (Date.now() - transitionStartTime.current) / 1000
      const progress = Math.min(elapsed / transitionDuration, 1)
      const easedProgress = easeInOutCubic(progress)
      
      setTransitionProgress(easedProgress)
      
      if (progress >= 1) {
        setIsTransitioning(false)
        onTransitionComplete?.()
      }
    }
  })

  // Calculate intensities for crossfade
  const currentIntensity = isTransitioning 
    ? intensity * (1 - easeOutQuart(transitionProgress))
    : (currentEnvironment === targetEnvironment ? intensity : 0)
    
  const targetIntensity = isTransitioning 
    ? intensity * easeOutQuart(transitionProgress)
    : (currentEnvironment === targetEnvironment ? 0 : intensity)

  return (
    <>
      {/* Current environment - fading out */}
      {(currentIntensity > 0.01 || !isTransitioning) && (
        <Environment
          key={`current-${currentEnvironment}`}
          preset={currentEnvironment}
          environmentIntensity={Math.max(currentIntensity, 0)}
          background={background && !isTransitioning}
          backgroundBlurriness={0}
          environmentRotation={[0, 0, 0]}
        />
      )}
      
      {/* Target environment - fading in */}
      {(targetIntensity > 0.01 || (isTransitioning && targetEnvironment !== currentEnvironment)) && (
        <Environment
          key={`target-${targetEnvironment}`}
          preset={targetEnvironment}
          environmentIntensity={Math.max(targetIntensity, 0)}
          background={background && isTransitioning && transitionProgress > 0.5}
          backgroundBlurriness={0}
          environmentRotation={[0, 0, 0]}
        />
      )}
    </>
  )
}

/**
 * Environment Preloader - loads specific environments on mount
 */
function EnvironmentPreloader({ environments = [] }) {
  const [preloadedEnvs, setPreloadedEnvs] = useState(new Set())
  
  useEffect(() => {
    // Preload environments by creating hidden Environment components
    // They will load the HDRIs but won't render due to 0 intensity
    const preloadEnv = async (env) => {
      setPreloadedEnvs(prev => new Set([...prev, env]))
    }
    
    environments.forEach(env => {
      if (!preloadedEnvs.has(env)) {
        preloadEnv(env)
      }
    })
  }, [environments, preloadedEnvs])
  
  return (
    <>
      {environments.map(env => (
        <Environment
          key={`preload-${env}`}
          preset={env}
          environmentIntensity={0}
          background={false}
          visible={false}
        />
      ))}
    </>
  )
}

/**
 * Smart Environment Controller with performance optimization
 */
function SmartEnvironmentController({ 
  environment, 
  intensity = 1.0, 
  background = false,
  preloadEnvironments = ['studio', 'city', 'sunset', 'apartment'],
  enableTransitions = true,
  deviceTier = 'auto',
  onPerformanceChange
}) {
  const [currentEnv, setCurrentEnv] = useState(environment)
  const [devicePerformance, setDevicePerformance] = useState(null)
  const [optimizedSettings, setOptimizedSettings] = useState(null)
  
  // Detect device performance and optimize settings
  useEffect(() => {
    const performance = detectDevicePerformance()
    setDevicePerformance(performance)
    
    // Start performance monitoring
    performanceMonitor.startMonitoring()
    performanceMonitor.onPerformanceIssue((data) => {
      onPerformanceChange?.(data)
    })
    
    return () => {
      performanceMonitor.stopMonitoring()
    }
  }, [onPerformanceChange])
  
  // Update optimized settings when environment or performance changes
  useEffect(() => {
    if (devicePerformance) {
      const settings = getOptimizedEnvironmentSettings(environment, devicePerformance)
      setOptimizedSettings(settings)
    }
  }, [environment, devicePerformance])
  
  // Handle environment transition completion
  const handleTransitionComplete = () => {
    setCurrentEnv(environment)
  }
  
  // Record frame for performance monitoring
  useFrame(() => {
    performanceMonitor.recordFrame()
  })
  
  // Wait for performance detection to complete
  if (!devicePerformance || !optimizedSettings) {
    return (
      <Environment
        preset="studio"
        environmentIntensity={0.6}
        background={false}
        backgroundBlurriness={0}
      />
    )
  }
  
  // For low performance devices or when transitions are disabled
  if (devicePerformance.tier === 'low' || !optimizedSettings.enableTransitions || !enableTransitions) {
    return (
      <Environment
        preset={environment}
        environmentIntensity={intensity * optimizedSettings.intensity}
        background={background}
        backgroundBlurriness={0}
        environmentRotation={[0, 0, 0]}
      />
    )
  }
  
  // For medium to high performance devices, use crossfade transitions
  return (
    <>
      {/* Preload environments based on performance tier */}
      {devicePerformance.tier !== 'low' && (
        <EnvironmentPreloader 
          environments={preloadEnvironments.slice(0, devicePerformance.tier === 'high' ? 4 : 2)} 
        />
      )}
      
      {/* Crossfade between environments */}
      <EnvironmentCrossfade
        currentEnvironment={currentEnv}
        targetEnvironment={environment}
        intensity={intensity * optimizedSettings.intensity}
        transitionDuration={devicePerformance.tier === 'high' ? 1.0 : 1.5}
        background={background}
        onTransitionComplete={handleTransitionComplete}
      />
    </>
  )
}

// Environment loading indicator component
function EnvironmentLoadingIndicator({ isVisible, progress = 0 }) {
  if (!isVisible) return null
  
  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '12px',
      fontFamily: 'system-ui, sans-serif',
      backdropFilter: 'blur(8px)',
      zIndex: 1000
    }}>
      Loading environments... {Math.round(progress)}%
    </div>
  )
}

export { 
  EnvironmentCrossfade, 
  EnvironmentPreloader, 
  SmartEnvironmentController,
  EnvironmentLoadingIndicator 
}
export default SmartEnvironmentController