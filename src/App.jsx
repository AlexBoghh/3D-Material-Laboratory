import { Suspense, useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Environment, useEnvironment } from '@react-three/drei'
import { gsap } from 'gsap'
import CrystalCube from './components/CrystalCube'
import Sidebar from './components/Sidebar'
import { useSidebarManager } from './hooks/useSidebarManager'
import { materialPresets } from './config/materialPresets'
import { defaultLighting } from './config/lightingPresets'
import { SmartEnvironmentController, EnvironmentLoadingIndicator } from './components/EnvironmentTransition'
import './App.css'

// Auto-rotating camera component
function AutoRotatingCamera({ isDragging, controlsRef }) {
  const currentAzimuth = useRef(0)
  const autoRotationSpeed = 0.3 // rotation speed in radians per second
  
  useFrame((state, delta) => {
    if (!isDragging && controlsRef.current) {
      // Get current azimuth angle from camera position
      const currentPos = controlsRef.current.object.position
      if (isDragging === false) {
        // Update azimuth angle smoothly
        currentAzimuth.current += autoRotationSpeed * delta
        
        // Apply rotation using OrbitControls azimuth
        controlsRef.current.autoRotate = true
        controlsRef.current.autoRotateSpeed = 2
      }
    } else if (controlsRef.current) {
      // Stop auto-rotation when dragging
      controlsRef.current.autoRotate = false
      
      // Store current azimuth angle
      const pos = controlsRef.current.object.position
      currentAzimuth.current = Math.atan2(pos.z, pos.x)
    }
  })
  
  return null
}

function App({ rectangleRef, buttonRef, isExpanded, setIsExpanded, setIsCollapsing, lightingPreviewMode }) {
  
  const handleExpandClick = () => {
    if (!isExpanded) {
      expandContainer()
    } else {
      collapseContainer()
    }
  }

  const expandContainer = () => {
    if (!rectangleRef.current || !buttonRef.current) return
    
    setIsExpanded(true)
    
    // Get current rectangle and button dimensions
    const rect = rectangleRef.current.getBoundingClientRect()
    const buttonRect = buttonRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    // Calculate scale factors for exact viewport fill
    const scaleX = viewportWidth / rect.width
    const scaleY = viewportHeight / rect.height
    
    // Calculate center point of rectangle
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    // Position rectangle fixed at its current location
    gsap.set(rectangleRef.current, {
      position: 'fixed',
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      transformOrigin: 'center center',
      zIndex: 1000
    })
    
    // Set button initial position
    gsap.set(buttonRef.current, {
      position: 'fixed',
      top: buttonRect.top,
      right: viewportWidth - buttonRect.right
    })
    
    // Create timeline for two-step expansion using scale
    const tl = gsap.timeline()
    
    // STEP 1: Scale Y to fill height - button follows top edge
    tl.to(rectangleRef.current, {
      scaleY: scaleY,
      duration: 0.6,
      ease: "power3.inOut",
      onUpdate: function() {
        const currentScaleY = gsap.getProperty(rectangleRef.current, "scaleY")
        const scaledHeight = rect.height * currentScaleY
        const newTop = centerY - scaledHeight / 2 + 16
        gsap.set(buttonRef.current, { top: newTop })
      }
    })
    // STEP 2: Scale X to fill width - button follows right edge
    .to(rectangleRef.current, {
      scaleX: scaleX,
      borderRadius: 0,
      duration: 0.6,
      ease: "power3.inOut",
      onUpdate: function() {
        const currentScaleX = gsap.getProperty(rectangleRef.current, "scaleX")
        const scaledWidth = rect.width * currentScaleX
        const rightEdge = centerX + scaledWidth / 2
        const newRight = viewportWidth - rightEdge + 16
        gsap.set(buttonRef.current, { right: newRight })
      }
    })
    // Animate button icon rotation
    .to('.expand-button svg', {
      rotation: 180,
      duration: 0.5,
      ease: "back.out(1.7)"
    }, 0.3)
  }

  const collapseContainer = () => {
    if (!rectangleRef.current || !buttonRef.current) return
    
    // Set collapsing state to trigger sidebar animation
    setIsCollapsing(true)
    
    // Get the original rectangle dimensions (before scaling)
    const currentRect = rectangleRef.current.getBoundingClientRect()
    const currentScaleX = gsap.getProperty(rectangleRef.current, "scaleX")
    const currentScaleY = gsap.getProperty(rectangleRef.current, "scaleY")
    
    // Calculate original dimensions
    const originalWidth = currentRect.width / currentScaleX
    const originalHeight = currentRect.height / currentScaleY
    
    // Get center point (which doesn't change during scale)
    const centerX = currentRect.left + currentRect.width / 2
    const centerY = currentRect.top + currentRect.height / 2
    const viewportWidth = window.innerWidth
    
    // Create timeline for two-step collapse with delay for sidebar to disappear
    const tl = gsap.timeline({
      delay: 0.5, // Wait for sidebar to smoothly animate out
      onComplete: () => {
        setIsExpanded(false)
        setIsCollapsing(false) // Reset collapsing state
        // Reset to relative positioning
        gsap.set(rectangleRef.current, {
          position: 'relative',
          top: 'auto',
          left: 'auto',
          transform: 'none',
          scaleX: 1,
          scaleY: 1,
          width: '900px',
          maxWidth: '90%',
          height: '500px',
          zIndex: 'auto',
          borderRadius: '12px'
        })
        // Reset button position
        gsap.set(buttonRef.current, {
          clearProps: 'all'
        })
      }
    })
    
    // STEP 1: Collapse width scale first - button follows right edge inward
    tl.to(rectangleRef.current, {
      scaleX: 1,
      borderRadius: '12px',
      duration: 0.6,
      ease: "power3.inOut",
      onUpdate: function() {
        const currentScale = gsap.getProperty(rectangleRef.current, "scaleX")
        const scaledWidth = originalWidth * currentScale
        const rightEdge = centerX + scaledWidth / 2
        // Subtract button width (40px) and padding (16px) to keep it inside
        const newRight = viewportWidth - rightEdge + 16
        gsap.set(buttonRef.current, { right: newRight })
      }
    })
    // STEP 2: Collapse height scale - button follows top edge downward
    .to(rectangleRef.current, {
      scaleY: 1,
      duration: 0.6,
      ease: "power3.inOut",
      onUpdate: function() {
        const currentScale = gsap.getProperty(rectangleRef.current, "scaleY")
        const scaledHeight = originalHeight * currentScale
        const topEdge = centerY - scaledHeight / 2
        const newTop = topEdge + 16
        gsap.set(buttonRef.current, { top: newTop })
      }
    })
    // Restore button icon rotation
    .to('.expand-button svg', {
      rotation: 0,
      duration: 0.5,
      ease: "back.out(1.7)"
    }, 0.3)
  }

  // Handle escape key to collapse when expanded
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isExpanded) {
        handleExpandClick() // This will call collapseContainer
      }
    }
    
    const handleResize = () => {
      // If expanded, adjust scale to new viewport
      if (isExpanded && rectangleRef.current) {
        const rect = rectangleRef.current.getBoundingClientRect()
        const baseWidth = rect.width / gsap.getProperty(rectangleRef.current, "scaleX")
        const baseHeight = rect.height / gsap.getProperty(rectangleRef.current, "scaleY")
        
        gsap.set(rectangleRef.current, {
          scaleX: window.innerWidth / baseWidth,
          scaleY: window.innerHeight / baseHeight
        })
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleResize)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
    }
  }, [isExpanded, handleExpandClick])

  return (
    <div className="app">
      {/* Background Rectangle with optional dark mode for lighting preview */}
      <div 
        className={`background-rectangle ${lightingPreviewMode ? 'lighting-preview-mode' : ''}`}
        ref={rectangleRef}
      ></div>
      
      {/* Expand Button - Outside rectangle to avoid scaling */}
      <button 
        ref={buttonRef}
        className="expand-button"
        onClick={handleExpandClick}
        aria-label={isExpanded ? "Collapse view" : "Expand view"}
        title={isExpanded ? "Collapse view" : "Expand view"}
      >
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {isExpanded ? (
            // Compress/minimize icon (arrows pointing inward)
            <>
              <path d="M8 3v3a2 2 0 0 1-2 2H3"></path>
              <path d="M16 3v3a2 2 0 0 0 2 2h3"></path>
              <path d="M3 16v2a2 2 0 0 0 2 2h2"></path>
              <path d="M21 16v2a2 2 0 0 1-2 2h-2"></path>
            </>
          ) : (
            // Expand icon (arrows pointing outward)
            <>
              <path d="M3 8V6a2 2 0 0 1 2-2h2"></path>
              <path d="M21 8V6a2 2 0 0 0-2-2h-2"></path>
              <path d="M3 16v2a2 2 0 0 0 2 2h2"></path>
              <path d="M21 16v2a2 2 0 0 1-2 2h-2"></path>
            </>
          )}
        </svg>
      </button>
    </div>
  )
}

// Separate Cube Component - Always centered on screen
function CubeOverlay({ isDragging, controlsRef, setIsDragging, currentMaterial, currentLighting, useHDRI }) {
  const [environmentLoading, setEnvironmentLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [performanceWarning, setPerformanceWarning] = useState(null)
  
  // Convert rotation angle to position
  const lightAngleRad = (currentLighting?.rotationY || 45) * Math.PI / 180
  const lightPosition = [
    Math.cos(lightAngleRad) * (currentLighting?.position?.[0] || 5),
    currentLighting?.position?.[1] || 10,
    Math.sin(lightAngleRad) * (currentLighting?.position?.[2] || 7.5)
  ]
  
  // Handle environment loading state
  const handleEnvironmentLoading = (isLoading, progress) => {
    setEnvironmentLoading(isLoading)
    setLoadingProgress(progress || 0)
  }
  
  // Handle performance feedback
  const handlePerformanceChange = (performanceData) => {
    if (performanceData.suggestion !== 'good') {
      setPerformanceWarning(performanceData)
      // Auto-hide warning after 5 seconds
      setTimeout(() => setPerformanceWarning(null), 5000)
    }
  }

  return (
    <div className="cube-overlay">
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 30 }}
        shadows={currentLighting?.shadows !== false}
        gl={{ 
          alpha: true, 
          antialias: true,
          preserveDrawingBuffer: true 
        }}
        style={{ 
          background: 'transparent',
          width: '100%',
          height: '100%'
        }}
        onCreated={({ gl, scene }) => {
          // Ensure the renderer doesn't affect anything behind it
          gl.setClearColor(0x000000, 0); // Completely transparent
          gl.outputColorSpace = 'srgb';
          // Prevent environment from affecting the HTML background
          scene.backgroundBlurriness = 0;
          scene.backgroundIntensity = 0;
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={
          <mesh>
            <boxGeometry args={[2, 2, 2]} />
            <meshBasicMaterial color="#cccccc" transparent opacity={0.5} />
          </mesh>
        }>
          <ambientLight intensity={useHDRI ? 0.1 : 0.4} /> {/* Further reduced when HDRI is active to show environment effects */}
          
          {/* Main directional light */}
          <directionalLight
            position={lightPosition}
            intensity={useHDRI ? (currentLighting?.intensity || 0.8) * 0.3 : (currentLighting?.intensity || 0.8)}
            castShadow={currentLighting?.shadows !== false}
            shadow-mapSize={[
              currentLighting?.shadowMapSize || 2048, 
              currentLighting?.shadowMapSize || 2048
            ]}
            shadow-radius={currentLighting?.shadowRadius || 10}
            shadow-blurSamples={currentLighting?.shadowBlurSamples || 25}
            shadow-bias={currentLighting?.shadowBias || -0.0005}
            shadow-normalBias={currentLighting?.shadowNormalBias || 0.02}
            shadow-camera-near={0.5}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          
          {/* Rim light for better edge definition */}
          <directionalLight
            position={[-lightPosition[0], lightPosition[1], -lightPosition[2]]}
            intensity={0.3}
            color="#ffffff"
          />
          
          {/* Fill light from below for subtle bounce lighting */}
          <directionalLight
            position={[0, -5, 5]}
            intensity={0.2}
            color="#f0f0f0"
          />
          {/* HDRI Environment - stable single environment to prevent loading flashes */}
          {useHDRI && (
            <Environment
              key="stable-studio-environment"
              preset="studio" // Use single stable preset to prevent recreation
              background={false} // Keep background false to not affect rectangle
              environmentIntensity={2.5} // Much higher intensity to make HDRI effects very visible
              backgroundBlurriness={0}
              backgroundIntensity={0}
              environmentRotation={[0, 0, 0]}
            />
          )}
          <CrystalCube isDragging={isDragging} materialProps={currentMaterial} />
          
          {currentLighting?.contactShadows !== false && (
            <ContactShadows
              position={[0, -0.2, 0]}
              opacity={currentLighting?.contactShadows?.opacity || 0.25}
              scale={currentLighting?.contactShadows?.scale || 0.8}
              blur={currentLighting?.contactShadows?.blur || 1.2}
              far={1}
              resolution={256}
              color="#999999"
            />
          )}
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={false}
            enableRotate={true}
            enableDamping={true}
            dampingFactor={0.03}
            rotateSpeed={0.7}
            autoRotate={false}
            autoRotateSpeed={2}
            onStart={() => setIsDragging(true)}
            onEnd={() => setIsDragging(false)}
          />
          <AutoRotatingCamera isDragging={isDragging} controlsRef={controlsRef} />
        </Suspense>
      </Canvas>
      
      {/* Environment Loading Indicator */}
      <EnvironmentLoadingIndicator 
        isVisible={environmentLoading} 
        progress={loadingProgress} 
      />
      
      {/* Performance Warning Indicator */}
      {performanceWarning && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 152, 0, 0.9)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          fontFamily: 'system-ui, sans-serif',
          backdropFilter: 'blur(8px)',
          zIndex: 1001,
          textAlign: 'center',
          minWidth: '200px'
        }}>
          <div>Performance: {Math.round(performanceWarning.averageFPS)} FPS</div>
          <div style={{ fontSize: '10px', opacity: 0.8, marginTop: '2px' }}>
            {performanceWarning.suggestion === 'severe' && 'Consider reducing quality settings'}
            {performanceWarning.suggestion === 'moderate' && 'Some settings may be reduced'}
            {performanceWarning.suggestion === 'minor' && 'Minor optimizations applied'}
          </div>
        </div>
      )}
    </div>
  )
}

// Main App Component
function AppWithCube() {
  const [isDragging, setIsDragging] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isCollapsing, setIsCollapsing] = useState(false)
  const [currentMaterial, setCurrentMaterial] = useState(materialPresets.defaultGray)
  const [currentLighting, setCurrentLighting] = useState(defaultLighting)
  const [useHDRI, setUseHDRI] = useState(false)
  const controlsRef = useRef()
  const rectangleRef = useRef()
  const buttonRef = useRef()
  
  // Sidebar management - pass isCollapsing to handle animation
  const { isSidebarVisible, activeTab, handleTabClick, triggerHide } = useSidebarManager(isExpanded, isCollapsing)
  const [sidebarStyle, setSidebarStyle] = useState('minimal')
  const [lightingPreviewMode, setLightingPreviewMode] = useState(false)

  return (
    <>
      <App 
        rectangleRef={rectangleRef}
        buttonRef={buttonRef}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        setIsCollapsing={setIsCollapsing}
        lightingPreviewMode={lightingPreviewMode}
      />
      <Sidebar 
        isVisible={isSidebarVisible}
        onTabClick={handleTabClick}
        activeTab={activeTab}
        styleTheme={sidebarStyle}
        isCollapsing={isCollapsing}
        onMaterialChange={setCurrentMaterial}
        currentMaterial={currentMaterial}
        onLightingChange={setCurrentLighting}
        currentLighting={currentLighting}
        lightingPreviewMode={lightingPreviewMode}
        onLightingPreviewModeChange={setLightingPreviewMode}
        useHDRI={useHDRI}
        onHDRIToggle={setUseHDRI}
      />
      <CubeOverlay 
        isDragging={isDragging} 
        controlsRef={controlsRef}
        setIsDragging={setIsDragging}
        currentMaterial={currentMaterial}
        currentLighting={currentLighting}
        useHDRI={useHDRI}
      />
    </>
  )
}

export default AppWithCube