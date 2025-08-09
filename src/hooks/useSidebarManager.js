import { useState, useCallback, useEffect } from 'react'

export function useSidebarManager(isExpanded, isCollapsing) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)
  const [activeTab, setActiveTab] = useState(null)
  const [shouldShowSidebar, setShouldShowSidebar] = useState(false)

  useEffect(() => {
    if (isExpanded && !shouldShowSidebar && !isCollapsing) {
      const timer = setTimeout(() => {
        setShouldShowSidebar(true)
        setIsSidebarVisible(true)
      }, 1200)
      
      return () => clearTimeout(timer)
    } else if (!isExpanded && !isCollapsing) {
      // Only hide immediately if not in a collapse animation
      setIsSidebarVisible(false)
      setShouldShowSidebar(false)
      setActiveTab(null)
    }
  }, [isExpanded, shouldShowSidebar, isCollapsing])

  // Handle collapse animation
  useEffect(() => {
    if (isCollapsing) {
      // Start hiding the sidebar with animation
      setIsSidebarVisible(false)
      setShouldShowSidebar(false)
    }
  }, [isCollapsing])

  const handleTabClick = useCallback((tabId) => {
    setActiveTab(tabId)
  }, [])

  const triggerHide = useCallback(() => {
    setIsSidebarVisible(false)
  }, [])

  return {
    isSidebarVisible,
    activeTab,
    handleTabClick,
    triggerHide
  }
}