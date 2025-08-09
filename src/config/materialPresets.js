// Minimal Material Presets - Essential materials only
// Designed to match the clean, minimal aesthetic

export const materialPresets = {
  // Default Material - Matte Gray (Opaque)
  defaultGray: {
    name: 'Light Gray',
    color: '#B8B8B8',
    transmission: 0.0,
    opacity: 1.0,
    metalness: 0.0,
    roughness: 0.7,
    clearcoat: 0.0,
    clearcoatRoughness: 0.0,
    envMapIntensity: 0.3,
    ior: 1.45,
    reflectivity: 0.04,
    thickness: 0.0,
    transparent: false
  },
  
  // Glass - Transparent
  clearGlass: {
    name: 'Clear Glass',
    color: '#ffffff',
    transmission: 1.0,
    opacity: 0.1,
    metalness: 0.0,
    roughness: 0.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    envMapIntensity: 1.0,
    ior: 1.5,
    reflectivity: 0.5,
    thickness: 0.5,
    transparent: true
  },
  
  // Metals - All Opaque
  goldPolished: {
    name: 'Gold',
    color: '#FFD700',
    transmission: 0.0,
    opacity: 1.0,
    metalness: 1.0,
    roughness: 0.05,
    clearcoat: 0.0,
    clearcoatRoughness: 0.0,
    envMapIntensity: 1.0,
    ior: 0.47,
    reflectivity: 1.0,
    thickness: 0.0,
    transparent: false
  },
  
  silverPolished: {
    name: 'Silver',
    color: '#F5F5F5',
    transmission: 0.0,
    opacity: 1.0,
    metalness: 1.0,
    roughness: 0.02,
    clearcoat: 0.0,
    clearcoatRoughness: 0.0,
    envMapIntensity: 1.2,
    ior: 0.18,
    reflectivity: 1.0,
    thickness: 0.0,
    transparent: false
  },
  
  bronzePolished: {
    name: 'Bronze',
    color: '#CD7F32',
    transmission: 0.0,
    opacity: 1.0,
    metalness: 1.0,
    roughness: 0.1,
    clearcoat: 0.0,
    clearcoatRoughness: 0.0,
    envMapIntensity: 0.8,
    ior: 1.18,
    reflectivity: 1.0,
    thickness: 0.0,
    transparent: false
  },
  
  blackChrome: {
    name: 'Black Chrome',
    color: '#1a1a1a',
    transmission: 0.0,
    opacity: 1.0,
    metalness: 1.0,
    roughness: 0.08,
    clearcoat: 0.0,
    clearcoatRoughness: 0.0,
    envMapIntensity: 0.9,
    ior: 2.95,
    reflectivity: 1.0,
    thickness: 0.0,
    transparent: false
  },
  
  // Crystal - Highly Transparent
  diamond: {
    name: 'Crystal',
    color: '#ffffff',
    transmission: 1.0,
    opacity: 0.02,
    metalness: 0.0,
    roughness: 0.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    envMapIntensity: 2.5,
    ior: 2.417,
    reflectivity: 0.9,
    thickness: 0.5,
    transparent: true
  },
  
  // Rose Gold - Opaque Metal
  roseGold: {
    name: 'Rose Gold',
    color: '#E8B4B8',
    transmission: 0.0,
    opacity: 1.0,
    metalness: 1.0,
    roughness: 0.04,
    clearcoat: 0.0,
    clearcoatRoughness: 0.0,
    envMapIntensity: 1.0,
    ior: 0.47,
    reflectivity: 1.0,
    thickness: 0.0,
    transparent: false
  }
}

// Get all materials as array - simplified for minimal interface
export const getAllMaterials = () => {
  return Object.entries(materialPresets)
    .map(([key, preset]) => ({ key, ...preset }))
}