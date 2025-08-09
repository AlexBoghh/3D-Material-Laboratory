export const sidebarStyles = {
  glassmorphism: {
    name: 'Glassmorphism',
    sidebar: {
      background: 'rgba(246, 244, 242, 0.85)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.03), 0 2px 10px rgba(0, 0, 0, 0.02)',
      borderRadius: '16px'
    },
    tab: {
      background: 'transparent',
      hoverBackground: 'rgba(255, 255, 255, 0.4)',
      activeBackground: 'rgba(255, 255, 255, 0.6)',
      color: 'rgba(0, 0, 0, 0.6)',
      hoverColor: 'rgba(0, 0, 0, 0.8)',
      activeColor: 'rgba(0, 0, 0, 0.9)',
      borderRadius: '10px'
    }
  },
  
  neumorphism: {
    name: 'Neumorphism',
    sidebar: {
      background: '#F6F4F2',
      backdropFilter: 'none',
      border: 'none',
      boxShadow: '20px 20px 60px #d1cfcd, -20px -20px 60px #ffffff',
      borderRadius: '20px'
    },
    tab: {
      background: '#F6F4F2',
      hoverBackground: '#F6F4F2',
      activeBackground: '#F6F4F2',
      color: 'rgba(0, 0, 0, 0.6)',
      hoverColor: 'rgba(0, 0, 0, 0.8)',
      activeColor: 'rgba(0, 0, 0, 0.9)',
      borderRadius: '15px',
      boxShadow: '8px 8px 16px #d1cfcd, -8px -8px 16px #ffffff',
      hoverBoxShadow: '4px 4px 8px #d1cfcd, -4px -4px 8px #ffffff',
      activeBoxShadow: 'inset 4px 4px 8px #d1cfcd, inset -4px -4px 8px #ffffff'
    }
  },
  
  minimal: {
    name: 'Minimal',
    sidebar: {
      background: '#ffffff',
      backdropFilter: 'none',
      border: '1px solid #e0e0e0',
      boxShadow: 'none',
      borderRadius: '8px'
    },
    tab: {
      background: 'transparent',
      hoverBackground: '#f5f5f5',
      activeBackground: '#000000',
      color: 'rgba(0, 0, 0, 0.7)',
      hoverColor: 'rgba(0, 0, 0, 0.9)',
      activeColor: '#ffffff',
      borderRadius: '4px'
    }
  },
  
  gradient: {
    name: 'Gradient Modern',
    sidebar: {
      background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,240,240,0.9) 100%)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.08)',
      borderRadius: '20px'
    },
    tab: {
      background: 'transparent',
      hoverBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      activeBackground: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: 'rgba(0, 0, 0, 0.6)',
      hoverColor: '#ffffff',
      activeColor: '#ffffff',
      borderRadius: '12px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },
  
  dark: {
    name: 'Dark Mode',
    sidebar: {
      background: 'rgba(20, 20, 20, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
      borderRadius: '16px'
    },
    tab: {
      background: 'transparent',
      hoverBackground: 'rgba(255, 255, 255, 0.1)',
      activeBackground: 'rgba(255, 255, 255, 0.2)',
      color: 'rgba(255, 255, 255, 0.6)',
      hoverColor: 'rgba(255, 255, 255, 0.9)',
      activeColor: '#ffffff',
      borderRadius: '10px'
    }
  },
  
  brutalist: {
    name: 'Brutalist',
    sidebar: {
      background: '#F6F4F2',
      backdropFilter: 'none',
      border: '3px solid #000000',
      boxShadow: '8px 8px 0px #000000',
      borderRadius: '0px'
    },
    tab: {
      background: 'transparent',
      hoverBackground: '#000000',
      activeBackground: '#ff0000',
      color: '#000000',
      hoverColor: '#ffffff',
      activeColor: '#ffffff',
      borderRadius: '0px',
      border: '2px solid transparent',
      hoverBorder: '2px solid #000000',
      fontWeight: 'bold'
    }
  },
  
  material: {
    name: 'Material Design',
    sidebar: {
      background: '#ffffff',
      backdropFilter: 'none',
      border: 'none',
      boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
      borderRadius: '4px'
    },
    tab: {
      background: 'transparent',
      hoverBackground: 'rgba(0, 0, 0, 0.04)',
      activeBackground: 'rgba(103, 58, 183, 0.12)',
      color: 'rgba(0, 0, 0, 0.87)',
      hoverColor: 'rgba(0, 0, 0, 0.87)',
      activeColor: '#673ab7',
      borderRadius: '4px',
      ripple: true
    }
  },
  
  floating: {
    name: 'Floating Cards',
    sidebar: {
      background: 'transparent',
      backdropFilter: 'none',
      border: 'none',
      boxShadow: 'none',
      borderRadius: '0px',
      padding: '0'
    },
    tab: {
      background: 'rgba(255, 255, 255, 0.95)',
      hoverBackground: 'rgba(255, 255, 255, 1)',
      activeBackground: '#4a90e2',
      color: 'rgba(0, 0, 0, 0.7)',
      hoverColor: 'rgba(0, 0, 0, 0.9)',
      activeColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      hoverBoxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
      margin: '8px 0',
      transform: 'scale(1)',
      hoverTransform: 'scale(1.05) translateX(4px)'
    }
  }
}