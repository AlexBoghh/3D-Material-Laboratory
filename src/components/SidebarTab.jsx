import { useState } from 'react'

function SidebarTab({ icon, label, onClick, isActive = false, tooltip, styleTheme }) {
  const [isHovered, setIsHovered] = useState(false)

  const getTabStyle = () => {
    if (!styleTheme) return {}
    
    let style = {
      background: styleTheme.background,
      color: styleTheme.color,
      borderRadius: styleTheme.borderRadius,
      border: styleTheme.border || 'none',
      fontWeight: styleTheme.fontWeight || 'normal',
      boxShadow: styleTheme.boxShadow || 'none',
      transform: styleTheme.transform || 'none',
      margin: styleTheme.margin || '0 0 6px 0',
      transition: styleTheme.transition || 'all 0.2s ease'
    }

    if (isActive) {
      style = {
        ...style,
        background: styleTheme.activeBackground,
        color: styleTheme.activeColor,
        boxShadow: styleTheme.activeBoxShadow || styleTheme.boxShadow || 'none'
      }
    } else if (isHovered) {
      style = {
        ...style,
        background: styleTheme.hoverBackground,
        color: styleTheme.hoverColor,
        boxShadow: styleTheme.hoverBoxShadow || styleTheme.boxShadow || 'none',
        transform: styleTheme.hoverTransform || styleTheme.transform || 'none',
        border: styleTheme.hoverBorder || styleTheme.border || 'none'
      }
    }

    return style
  }

  return (
    <button
      className="sidebar-tab"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={tooltip}
      style={getTabStyle()}
    >
      <span className="sidebar-tab-icon">{icon}</span>
      <span className="sidebar-tab-label">{label}</span>
    </button>
  )
}

export default SidebarTab