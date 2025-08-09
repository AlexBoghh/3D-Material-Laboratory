import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import * as THREE from 'three'

function CrystalCube({ isDragging, isExpanded = false, materialProps = {} }) {
  const meshRef = useRef()
  const materialRef = useRef()

  // Floating animation using GSAP
  useEffect(() => {
    // Add slight delay to ensure mesh is fully mounted
    const timer = setTimeout(() => {
      if (meshRef.current) {
        gsap.to(meshRef.current.position, {
          y: 0.03,
          duration: 2,
          yoyo: true,
          repeat: -1,
          ease: "power2.inOut"
        })
      }
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  // Cube stays the same size throughout - no scaling animation

  // Static rotation for the cube (optional slight tilt)
  useFrame(() => {
    if (meshRef.current) {
      // Keep cube at a slight tilt but don't rotate it
      meshRef.current.rotation.x = 0.1
      meshRef.current.rotation.y = 0.1
    }
  })

  // Update material properties smoothly
  useEffect(() => {
    if (materialRef.current && Object.keys(materialProps).length > 0) {
      gsap.to(materialRef.current, {
        roughness: materialProps.roughness !== undefined ? materialProps.roughness : 0.0,
        metalness: materialProps.metalness !== undefined ? materialProps.metalness : 0.05,
        opacity: materialProps.opacity !== undefined ? materialProps.opacity : 0.4,
        transmission: materialProps.transmission !== undefined ? materialProps.transmission : 0.95,
        clearcoat: materialProps.clearcoat !== undefined ? materialProps.clearcoat : 1,
        clearcoatRoughness: materialProps.clearcoatRoughness !== undefined ? materialProps.clearcoatRoughness : 0.05,
        envMapIntensity: materialProps.envMapIntensity !== undefined ? materialProps.envMapIntensity : 1,
        ior: materialProps.ior !== undefined ? materialProps.ior : 1.5,
        thickness: materialProps.thickness !== undefined ? materialProps.thickness : 0.5,
        duration: 0.8,
        ease: 'power2.inOut'
      })
      
      // Set color directly
      if (materialProps.color) {
        materialRef.current.color = new THREE.Color(materialProps.color)
      }
      
      // Set reflectivity if available
      if (materialProps.reflectivity !== undefined) {
        materialRef.current.reflectivity = materialProps.reflectivity
      }
    }
  }, [materialProps])

  // Default material values
  const defaultMaterial = {
    color: materialProps.color || '#d0d0d0',
    transmission: materialProps.transmission !== undefined ? materialProps.transmission : 0.95,
    opacity: materialProps.opacity !== undefined ? materialProps.opacity : 0.4,
    metalness: materialProps.metalness !== undefined ? materialProps.metalness : 0.05,
    roughness: materialProps.roughness !== undefined ? materialProps.roughness : 0.0,
    thickness: materialProps.thickness !== undefined ? materialProps.thickness : 0.5,
    clearcoat: materialProps.clearcoat !== undefined ? materialProps.clearcoat : 1,
    clearcoatRoughness: materialProps.clearcoatRoughness !== undefined ? materialProps.clearcoatRoughness : 0.05,
    envMapIntensity: materialProps.envMapIntensity !== undefined ? materialProps.envMapIntensity : 1,
    ior: materialProps.ior !== undefined ? materialProps.ior : 1.5,
    reflectivity: materialProps.reflectivity !== undefined ? materialProps.reflectivity : 0.5
  }

  return (
    <group>
      {/* Dynamic Material Cube */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[0.25, 0.25, 0.25]} />
        <meshPhysicalMaterial
          ref={materialRef}
          {...defaultMaterial}
        />
      </mesh>
    </group>
  )
}

export default CrystalCube