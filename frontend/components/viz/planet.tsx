"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Mesh } from "three"

interface PlanetProps {
  radius?: number
  distance?: number
  orbitalPeriod?: number
  color?: string
  emissiveIntensity?: number
  position?: [number, number, number]
}

export function Planet({ 
  radius = 0.3, 
  distance = 8, 
  orbitalPeriod = 365.25,
  color = "#4ade80",
  emissiveIntensity = 0.1,
  position = [0, 0, 0]
}: PlanetProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Orbital motion
      const time = state.clock.getElapsedTime()
      const angularVelocity = (2 * Math.PI) / (orbitalPeriod / 10) // Scale down for visualization
      const x = Math.cos(time * angularVelocity) * distance
      const z = Math.sin(time * angularVelocity) * distance
      
      meshRef.current.position.set(x, position[1], z)
      
      // Rotation
      meshRef.current.rotation.y += delta * 2
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshBasicMaterial 
        color={color}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  )
}
