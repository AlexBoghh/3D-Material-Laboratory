// Minimal Material Presets - Essential materials only
// Designed to match the clean, minimal aesthetic

export const materialPresets = {
  // Default Material - Light Gray
  defaultGray: {
    name: 'Light Gray',
    color: '#B8B8B8',
    transmission: 0.6,
    opacity: 0.7,
    metalness: 0.0,
    roughness: 0.1,
    clearcoat: 0.2,
    clearcoatRoughness: 0.05,
    envMapIntensity: 0.4,
    ior: 1.5,
    reflectivity: 0.15,
    thickness: 0.5
  },
  
  // Glass
  clearGlass: {
    name: 'Clear Glass',
    color: '#ffffff',
    transmission: 0.95,
    opacity: 0.1,
    metalness: 0.0,
    roughness: 0.0,
    clearcoat: 1,
    clearcoatRoughness: 0.0,
    envMapIntensity: 1,
    ior: 1.5,
    reflectivity: 0.5,
    thickness: 0.5
  },
  
  // Metals
  goldPolished: {
    name: 'Gold',
    color: '#FFD700',
    metalness: 1.0,
    roughness: 0.05,
    clearcoat: 0.3,
    clearcoatRoughness: 0.02,
    envMapIntensity: 1.2,
    ior: 1.47
  },
  
  silverPolished: {
    name: 'Silver',
    color: '#F5F5F5',
    metalness: 1.0,
    roughness: 0.03,
    clearcoat: 0.4,
    clearcoatRoughness: 0.01,
    envMapIntensity: 1.5,
    ior: 1.45
  },
  
  bronzePolished: {
    name: 'Bronze',
    color: '#CD7F32',
    metalness: 1.0,
    roughness: 0.08,
    clearcoat: 0.35,
    clearcoatRoughness: 0.03,
    envMapIntensity: 1.1,
    ior: 1.48
  },
  
  blackChrome: {
    name: 'Black Chrome',
    color: '#2C2C2C',
    metalness: 1.0,
    roughness: 0.12,
    clearcoat: 0.6,
    clearcoatRoughness: 0.04,
    envMapIntensity: 0.9,
    ior: 1.46
  },
  
  // Crystal
  diamond: {
    name: 'Crystal',
    color: '#ffffff',
    transmission: 0.95,
    opacity: 0.1,
    metalness: 0.0,
    roughness: 0.0,
    clearcoat: 1,
    clearcoatRoughness: 0.0,
    envMapIntensity: 2.0,
    ior: 2.417,
    reflectivity: 1.0,
    thickness: 0.5
  },
  
  // Rose Gold
  roseGold: {
    name: 'Rose Gold',
    color: '#E8B4B8',
    metalness: 1.0,
    roughness: 0.06,
    clearcoat: 0.35,
    clearcoatRoughness: 0.025,
    envMapIntensity: 1.15,
    ior: 1.47
  }
}

// Get all materials as array - simplified for minimal interface
export const getAllMaterials = () => {
  return Object.entries(materialPresets)
    .map(([key, preset]) => ({ key, ...preset }))
}