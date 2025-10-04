"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Mesh } from "three"

interface RingsProps {
  innerRadius?: number
  outerRadius?: number
  color?: string
  opacity?: number
  position?: [number, number, number]
}

export function Rings({ 
  innerRadius = 0.8, 
  outerRadius = 1.2, 
  color = "#fbbf24",
  opacity = 0.3,
  position = [0, 0, 0]
}: RingsProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Slow rotation
      meshRef.current.rotation.y += delta * 0.05
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <ringGeometry args={[innerRadius, outerRadius, 32]} />
      <meshBasicMaterial 
        color={color}
        transparent
        opacity={opacity}
        side={2} // DoubleSide
      />
    </mesh>
  )
}
