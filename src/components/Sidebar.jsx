import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import SidebarTab from './SidebarTab'
import MaterialPanel from './MaterialPanel'
import { 
  MaterialsIcon, 
  FinishesIcon, 
  LightingIcon, 
  CompareIcon, 
  ProjectsIcon, 
  ExportIcon 
} from './SidebarIcons'
import { sidebarStyles } from '../styles/sidebarStyles'

function Sidebar({ isVisible, onTabClick, activeTab, styleTheme = 'glassmorphism', isCollapsing, onMaterialChange, currentMaterial }) {
  const sidebarRef = useRef()
  const tabsRef = useRef([])
  
  console.log('Sidebar render - isVisible:', isVisible, 'isCollapsing:', isCollapsing)

  const tabs = [
    { id: 'materials', icon: <MaterialsIcon />, label: 'Materials', tooltip: 'Select coating materials' },
    { id: 'finishes', icon: <FinishesIcon />, label: 'Finishes', tooltip: 'Gold, Silver, Bronze variations' },
    { id: 'lighting', icon: <LightingIcon />, label: 'Lighting', tooltip: 'Adjust lighting conditions' },
    { id: 'compare', icon: <CompareIcon />, label: 'Compare', tooltip: 'Side-by-side comparison' },
    { id: 'projects', icon: <ProjectsIcon />, label: 'Projects', tooltip: 'Manage saved projects' },
    { id: 'export', icon: <ExportIcon />, label: 'Export', tooltip: 'Export images/videos' }
  ]

  // Set initial hidden state on mount
  useEffect(() => {
    if (sidebarRef.current && !isVisible) {
      gsap.set(sidebarRef.current, {
        x: -280,
        opacity: 0,
        display: 'none'
      })
    }
  }, [])

  useEffect(() => {
    console.log('Sidebar useEffect - isVisible:', isVisible, 'sidebarRef:', !!sidebarRef.current)
    if (isVisible && sidebarRef.current) {
      console.log('Animating sidebar IN')
      const tl = gsap.timeline()
      
      gsap.set(sidebarRef.current, {
        x: -280,
        opacity: 0,
        display: 'flex',
        visibility: 'visible'
      })

      tl.to(sidebarRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out'
      })

      if (tabsRef.current.length > 0) {
        tl.fromTo(tabsRef.current,
          {
            x: -30,
            opacity: 0
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.08,
            ease: 'power2.out'
          },
          '-=0.3'
        )
      }
    } else if (!isVisible && sidebarRef.current) {
      console.log('Animating sidebar OUT')
      const tl = gsap.timeline()
      
      // First fade out tabs with a smooth scale down
      if (tabsRef.current.length > 0) {
        console.log('Animating tabs OUT')
        tl.to(tabsRef.current, {
          x: -20,
          opacity: 0,
          scale: 0.95,
          duration: 0.25,
          stagger: {
            each: 0.04,
            from: 'end'
          },
          ease: 'power2.inOut'
        })
      }

      // Then slide and fade the sidebar with a gentle ease
      tl.to(sidebarRef.current, {
        x: -100,
        opacity: 0,
        scale: 0.98,
        duration: 0.35,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.set(sidebarRef.current, { 
            display: 'none',
            scale: 1  // Reset scale for next appearance
          })
        }
      }, '-=0.15')
    }
  }, [isVisible])

  const currentStyle = sidebarStyles[styleTheme] || sidebarStyles.glassmorphism

  return (
    <div 
      ref={sidebarRef} 
      className="sidebar" 
      style={{ 
        display: 'flex', // Always flex, GSAP will handle visibility
        padding: currentStyle.sidebar.padding || '24px 16px'
      }}
    >
      <div 
        className="sidebar-content"
        style={{
          background: currentStyle.sidebar.background,
          backdropFilter: currentStyle.sidebar.backdropFilter,
          border: currentStyle.sidebar.border,
          boxShadow: currentStyle.sidebar.boxShadow,
          borderRadius: currentStyle.sidebar.borderRadius
        }}>
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            ref={el => tabsRef.current[index] = el}
          >
            <SidebarTab
              icon={tab.icon}
              label={tab.label}
              onClick={() => onTabClick(tab.id)}
              isActive={activeTab === tab.id}
              tooltip={tab.tooltip}
              styleTheme={currentStyle.tab}
            />
          </div>
        ))}
      </div>
      
      {/* Panel Content */}
      {activeTab === 'materials' && (
        <div className="sidebar-panel">
          <MaterialPanel 
            onMaterialChange={onMaterialChange}
            currentMaterial={currentMaterial}
          />
        </div>
      )}
    </div>
  )
}

export default Sidebar