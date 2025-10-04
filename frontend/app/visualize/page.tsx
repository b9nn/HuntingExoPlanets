"use client"

import { useState, useEffect } from "react"
import { PlanetCanvas } from "@/components/viz/planet-canvas"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Orbit, Sparkles, Info } from "lucide-react"
import { PredictResponse, FeatureFormData } from "@/lib/types"
import Link from "next/link"

export default function VisualizePage() {
  const [lastClassification, setLastClassification] = useState<{
    features: FeatureFormData
    result: PredictResponse
    timestamp: string
  } | null>(null)

  useEffect(() => {
    // Load last classification from localStorage
    const stored = localStorage.getItem('lastClassification')
    if (stored) {
      try {
        setLastClassification(JSON.parse(stored))
      } catch (error) {
        console.error('Failed to parse stored classification:', error)
      }
    }
  }, [])

  // Default features for demo
  const defaultFeatures = {
    orbital_period_days: 365.25,
    planetary_radius_re: 1.0,
    transit_depth_ppm: 1000,
    teff_k: 5778,
    rstar_rs: 1.0,
  }

  const currentFeatures = lastClassification?.features || defaultFeatures
  const currentPrediction = lastClassification?.result || null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <Orbit className="mr-3 h-8 w-8 text-primary" />
          3D Visualization
        </h1>
        <p className="text-muted-foreground">
          Interactive 3D visualization of exoplanet systems with real-time parameter adjustment
        </p>
      </div>

      {/* Status Banner */}
      {lastClassification ? (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Sparkles className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Using last classification</p>
                  <p className="text-sm text-muted-foreground">
                    From {new Date(lastClassification.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/classify">New Classification</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Info className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Demo visualization</p>
                  <p className="text-sm text-muted-foreground">
                    Using default parameters. Classify an exoplanet to see prediction-based visualization.
                  </p>
                </div>
              </div>
              <Button size="sm" asChild>
                <Link href="/classify">Try Classifier</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Visualization */}
      <PlanetCanvas 
        features={currentFeatures}
        prediction={currentPrediction}
      />

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Visualization Features
            </CardTitle>
            <Orbit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Interactive</div>
            <p className="text-xs text-muted-foreground">
              Real-time parameter adjustment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Classification Integration
            </CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AI-Powered</div>
            <p className="text-xs text-muted-foreground">
              Visual reflects ML predictions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Physical Accuracy
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              Kepler's Laws
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Realistic</div>
            <p className="text-xs text-muted-foreground">
              Based on orbital mechanics
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How the Visualization Works</CardTitle>
          <CardDescription>
            Understanding the 3D exoplanet visualization system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-medium">Visual Elements</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• <strong>Star:</strong> Color and size based on temperature and radius</li>
                <li>• <strong>Planet:</strong> Size proportional to radius, color reflects classification</li>
                <li>• <strong>Orbit:</strong> Distance calculated using Kepler's 3rd law</li>
                <li>• <strong>Rings:</strong> Added for larger planets (>0.5 Earth radii)</li>
                <li>• <strong>Animation:</strong> Orbital motion scaled for visibility</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Classification Integration</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• <strong>Confirmed:</strong> Green planet color</li>
                <li>• <strong>Candidate:</strong> Amber planet color</li>
                <li>• <strong>False Positive:</strong> Red planet color</li>
                <li>• <strong>Confidence:</strong> Emissive intensity reflects certainty</li>
                <li>• <strong>HUD:</strong> Real-time prediction display</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Controls Guide</CardTitle>
          <CardDescription>
            How to interact with the 3D visualization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium">Mouse Controls</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Left drag:</strong> Rotate view</li>
                <li>• <strong>Right drag:</strong> Pan camera</li>
                <li>• <strong>Scroll:</strong> Zoom in/out</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Parameter Controls</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Sliders:</strong> Adjust orbital parameters</li>
                <li>• <strong>Real-time:</strong> Changes update immediately</li>
                <li>• <strong>Reset:</strong> Return to default values</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Animation Controls</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Play/Pause:</strong> Control orbital motion</li>
                <li>• <strong>Speed:</strong> Scaled for visibility</li>
                <li>• <strong>Loop:</strong> Continuous animation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
