"use client"

import { useState } from "react"
import { FeaturesForm } from "@/components/classify/features-form"
import { ResultPanel } from "@/components/classify/result-panel"
import { CSVUpload } from "@/components/classify/csv-upload"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PredictResponse, FeatureFormData } from "@/lib/types"
import { predict } from "@/lib/api"
import { TestTube, Sparkles, Target } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import toast from "react-hot-toast"

export default function ClassifyPage() {
  const [result, setResult] = useState<PredictResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastPrediction, setLastPrediction] = useState<FeatureFormData | null>(null)

  const handleSubmit = async (data: FeatureFormData) => {
    setIsLoading(true)
    setLastPrediction(data)
    
    try {
      const predictionResult = await predict({
        modelId: data.modelId,
        features: {
          orbital_period_days: data.orbital_period_days,
          transit_duration_hours: data.transit_duration_hours,
          planetary_radius_re: data.planetary_radius_re,
          transit_depth_ppm: data.transit_depth_ppm,
          teff_k: data.teff_k,
          rstar_rs: data.rstar_rs,
          logg: data.logg,
          feh: data.feh,
        }
      })
      
      setResult(predictionResult)
      toast.success("Classification completed successfully!")
    } catch (error) {
      console.error("Classification error:", error)
      toast.error("Failed to classify exoplanet. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewExplanations = () => {
    if (result) {
      // Store the current prediction in localStorage for the explanations page
      localStorage.setItem('lastClassification', JSON.stringify({
        features: lastPrediction,
        result: result,
        timestamp: new Date().toISOString()
      }))
      // Navigate to explanations page with the prediction data
      window.location.href = '/explanations?tab=local'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <TestTube className="mr-3 h-8 w-8 text-primary" />
          Exoplanet Classification
        </h1>
        <p className="text-muted-foreground">
          Use AI-powered ensemble models to classify exoplanets as confirmed, candidates, or false positives
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Model Accuracy
            </CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              Best ensemble model performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Features Analyzed
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Key astronomical parameters
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Classification Classes
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              Confirmed
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Confirmed, Candidate, False Positive
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="manual" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Input</TabsTrigger>
          <TabsTrigger value="csv">CSV Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Form */}
            <FeaturesForm 
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />

            {/* Results */}
            {result && (
              <ResultPanel 
                result={result}
                onViewExplanations={handleViewExplanations}
              />
            )}

            {/* Instructions when no result */}
            {!result && !isLoading && (
              <Card>
                <CardHeader>
                  <CardTitle>How to Use</CardTitle>
                  <CardDescription>
                    Follow these steps to classify an exoplanet
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium">Enter Parameters</h4>
                        <p className="text-sm text-muted-foreground">
                          Input the astronomical parameters from transit observations
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium">Select Model</h4>
                        <p className="text-sm text-muted-foreground">
                          Choose from ensemble models (Stacking recommended)
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium">Get Classification</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive prediction with confidence scores and explanations
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Example Parameters</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Orbital Period: 365.25 days (Earth-like)</p>
                      <p>• Transit Duration: 13.5 hours</p>
                      <p>• Planetary Radius: 1.0 Earth radii</p>
                      <p>• Transit Depth: 1000 ppm</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="csv">
          <CSVUpload />
        </TabsContent>
      </Tabs>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Classifying exoplanet...</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
