"use client"

import { Suspense, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Stars } from "@react-three/drei"
import { Star } from "./star"
import { Planet } from "./planet"
import { Rings } from "./rings"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Orbit, Settings, Play, Pause } from "lucide-react"
import { PredictResponse } from "@/lib/types"
import { getPredictionEmoji, getPredictionColor } from "@/lib/utils"

interface PlanetCanvasProps {
  features?: {
    orbital_period_days: number
    planetary_radius_re: number
    transit_depth_ppm: number
    teff_k: number
    rstar_rs: number
  }
  prediction?: PredictResponse
  className?: string
}

function Scene({ features, prediction }: PlanetCanvasProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [isPaused, setIsPaused] = useState(false)

  useFrame((state, delta) => {
    if (groupRef.current && !isPaused) {
      groupRef.current.rotation.y += delta * 0.1
    }
  })

  // Calculate parameters from features
  const starRadius = features ? Math.max(1, features.rstar_rs * 1.5) : 2
  const starTemperature = features?.teff_k || 5778
  const planetRadius = features ? Math.max(0.1, features.planetary_radius_re * 0.3) : 0.3
  const orbitalPeriod = features?.orbital_period_days || 365.25
  const orbitalDistance = Math.max(5, Math.sqrt(orbitalPeriod / 365.25) * 8)

  // Get planet color based on prediction
  const getPlanetColor = () => {
    if (!prediction) return "#4ade80" // Default green
    
    switch (prediction.prediction) {
      case 'confirmed':
        return "#22c55e" // Green
      case 'candidate':
        return "#f59e0b" // Amber
      case 'false_positive':
        return "#ef4444" // Red
      default:
        return "#4ade80"
    }
  }

  const planetColor = getPlanetColor()

  return (
    <group ref={groupRef}>
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
      />
      
      <Star 
        temperature={starTemperature}
        radius={starRadius}
        position={[0, 0, 0]}
      />
      
      <Planet
        radius={planetRadius}
        distance={orbitalDistance}
        orbitalPeriod={orbitalPeriod}
        color={planetColor}
        emissiveIntensity={prediction ? 0.2 : 0.1}
      />
      
      {/* Add rings for larger planets */}
      {planetRadius > 0.5 && (
        <Rings
          innerRadius={planetRadius * 1.5}
          outerRadius={planetRadius * 2}
          position={[orbitalDistance, 0, 0]}
        />
      )}
    </group>
  )
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Loading 3D visualization...</p>
      </div>
    </div>
  )
}

export function PlanetCanvas({ features, prediction, className }: PlanetCanvasProps) {
  const [showControls, setShowControls] = useState(false)
  const [customPeriod, setCustomPeriod] = useState(features?.orbital_period_days || 365.25)
  const [customRadius, setCustomRadius] = useState(features?.planetary_radius_re || 1.0)
  const [customInclination, setCustomInclination] = useState(90)
  const [customDepth, setCustomDepth] = useState(features?.transit_depth_ppm || 1000)

  const currentFeatures = {
    ...features,
    orbital_period_days: customPeriod,
    planetary_radius_re: customRadius,
    transit_depth_ppm: customDepth,
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Orbit className="mr-2 h-5 w-5" />
              3D Exoplanet Visualization
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowControls(!showControls)}
          >
            <Settings className="mr-2 h-4 w-4" />
            {showControls ? "Hide" : "Show"} Controls
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 3D Canvas */}
          <div className="relative h-96 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden">
            <Canvas camera={{ position: [0, 10, 15], fov: 50 }}>
              <ambientLight intensity={0.2} />
              <pointLight position={[0, 0, 0]} intensity={0.8} />
              <Suspense fallback={null}>
                <Scene 
                  features={currentFeatures} 
                  prediction={prediction}
                />
                <OrbitControls 
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  maxDistance={50}
                  minDistance={5}
                />
              </Suspense>
            </Canvas>
            
            {/* Classification Overlay */}
            {prediction && (
              <div className="absolute top-4 right-4">
                <Badge 
                  variant="secondary" 
                  className={`${getPredictionColor(prediction.prediction)} text-lg px-3 py-1`}
                >
                  {getPredictionEmoji(prediction.prediction)} {prediction.prediction}
                </Badge>
              </div>
            )}
          </div>

          {/* Controls Panel */}
          {showControls && (
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium">Visualization Controls</h4>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Orbital Period (days)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[customPeriod]}
                      onValueChange={([value]) => setCustomPeriod(value)}
                      min={1}
                      max={1000}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-sm text-muted-foreground text-center">
                      {customPeriod.toFixed(1)} days
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Planetary Radius (Earth radii)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[customRadius]}
                      onValueChange={([value]) => setCustomRadius(value)}
                      min={0.1}
                      max={10}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="text-sm text-muted-foreground text-center">
                      {customRadius.toFixed(1)} Earth radii
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Inclination (degrees)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[customInclination]}
                      onValueChange={([value]) => setCustomInclination(value)}
                      min={0}
                      max={90}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-sm text-muted-foreground text-center">
                      {customInclination.toFixed(0)}°
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Transit Depth (ppm)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[customDepth]}
                      onValueChange={([value]) => setCustomDepth(value)}
                      min={100}
                      max={10000}
                      step={100}
                      className="w-full"
                    />
                    <div className="text-sm text-muted-foreground text-center">
                      {customDepth.toFixed(0)} ppm
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-2">
                <Button variant="outline" size="sm">
                  <Play className="mr-2 h-4 w-4" />
                  Reset Animation
                </Button>
                <Button variant="outline" size="sm">
                  <Pause className="mr-2 h-4 w-4" />
                  Pause/Resume
                </Button>
              </div>
            </div>
          )}

          {/* Info Panel */}
          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Current Parameters</h4>
              <div className="space-y-1 text-muted-foreground">
                <p>Orbital Period: {customPeriod.toFixed(1)} days</p>
                <p>Planetary Radius: {customRadius.toFixed(1)} Earth radii</p>
                <p>Transit Depth: {customDepth.toFixed(0)} ppm</p>
                <p>Star Temperature: {features?.teff_k || 5778} K</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Visualization Notes</h4>
              <div className="space-y-1 text-muted-foreground">
                <p>• Drag to rotate view</p>
                <p>• Scroll to zoom</p>
                <p>• Planet color reflects classification</p>
                <p>• Orbital speed scaled for visibility</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
