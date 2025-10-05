"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Mesh, Color } from "three"

interface StarProps {
  temperature?: number
  radius?: number
  position?: [number, number, number]
}

export function Star({ 
  temperature = 5778, 
  radius = 2, 
  position = [0, 0, 0] 
}: StarProps) {
  const meshRef = useRef<Mesh>(null)

  // Calculate color based on temperature (simplified blackbody approximation)
  const getStarColor = (temp: number) => {
    if (temp < 3500) return [1, 0.3, 0.1] // Red
    if (temp < 5000) return [1, 0.6, 0.2] // Orange
    if (temp < 6000) return [1, 0.9, 0.7] // Yellow-white
    if (temp < 7500) return [0.9, 0.9, 1] // White
    if (temp < 10000) return [0.8, 0.8, 1] // Blue-white
    return [0.6, 0.7, 1] // Blue
  }

  const color = getStarColor(temperature)

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Slow rotation
      meshRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, 48, 48]} />
      <meshStandardMaterial 
        color={new Color(color[0], color[1], color[2])}
        emissive={new Color(color[0], color[1], color[2])}
        emissiveIntensity={1.2}
        metalness={0.1}
        roughness={0.5}
      />
    </mesh>
  )
}
