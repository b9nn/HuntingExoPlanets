"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FeatureImportanceBar } from "@/components/charts/feature-importance-bar"
import { ProbabilityGauge } from "@/components/charts/probability-gauge"
import { useQuery } from "@tanstack/react-query"
import { getFeatures, getShapSample } from "@/lib/api"
import { PredictResponse, FeatureFormData } from "@/lib/types"
import { Brain, Globe, BarChart3, FileText, Upload, AlertCircle } from "lucide-react"
import toast from "react-hot-toast"

export default function ExplanationsPage() {
  const [activeTab, setActiveTab] = useState('local')
  const [localClassification, setLocalClassification] = useState<{
    features: FeatureFormData
    result: PredictResponse
    timestamp: string
  } | null>(null)
  const [jsonInput, setJsonInput] = useState("")

  const { data: globalFeatures } = useQuery({
    queryKey: ["features"],
    queryFn: getFeatures,
  })

  const { data: shapSamples, isLoading: shapLoading } = useQuery({
    queryKey: ["shap-samples"],
    queryFn: getShapSample,
  })

  useEffect(() => {
    // Load last classification from localStorage
    const stored = localStorage.getItem('lastClassification')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setLocalClassification(parsed)
        setJsonInput(JSON.stringify(parsed.result.shap, null, 2))
      } catch (error) {
        console.error('Failed to parse stored classification:', error)
      }
    }
  }, [])

  const handleJsonSubmit = () => {
    try {
      const shapData = JSON.parse(jsonInput)
      if (Array.isArray(shapData)) {
        toast.success("SHAP data loaded successfully")
        // You could process this data here
      } else {
        toast.error("Invalid SHAP data format")
      }
    } catch (error) {
      toast.error("Invalid JSON format")
    }
  }

  const renderWaterfallChart = (shapData: Array<{ feature: string; value: number; contribution: number }>) => {
    const sortedShap = [...shapData].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
    let cumulative = 0

    return (
      <div className="space-y-2">
        {sortedShap.map((item, index) => {
          const isPositive = item.contribution > 0
          const width = Math.abs(item.contribution) * 100
          cumulative += item.contribution
          
          return (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-32 text-sm font-medium truncate">
                {item.feature}
              </div>
              <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
                <div
                  className={`absolute top-0 h-full ${
                    isPositive ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{
                    width: `${Math.min(width, 100)}%`,
                    left: isPositive ? '0' : 'auto',
                    right: isPositive ? 'auto' : '0'
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                  {item.contribution > 0 ? '+' : ''}{item.contribution.toFixed(3)}
                </div>
              </div>
              <div className="w-16 text-xs text-muted-foreground text-right">
                {item.value.toFixed(2)}
              </div>
            </div>
          )
        })}
        
        <div className="border-t pt-2 mt-4">
          <div className="flex items-center justify-between font-medium">
            <span>Final Prediction</span>
            <span className={`${cumulative > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {cumulative > 0 ? '+' : ''}{cumulative.toFixed(3)}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <Brain className="mr-3 h-8 w-8 text-primary" />
          AI Explanations
        </h1>
        <p className="text-muted-foreground">
          Understand how ExoAI makes predictions using SHAP (SHapley Additive exPlanations)
        </p>
      </div>

      {/* Status Banner */}
      {localClassification ? (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <Brain className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Showing local explanations</p>
                <p className="text-sm text-muted-foreground">
                  Based on classification from {new Date(localClassification.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium">No local classification found</p>
                <p className="text-sm text-muted-foreground">
                  Classify an exoplanet first to see local explanations, or upload SHAP data manually.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Local Explanations only */}
        <TabsContent value="local" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* SHAP Waterfall Chart */}
            <Card>
              <CardHeader>
                <CardTitle>SHAP Waterfall (Most Recent)</CardTitle>
                <CardDescription>
                  Feature contributions to the final prediction
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                {localClassification?.result?.shap && Array.isArray(localClassification.result.shap) && localClassification.result.shap.length > 0 ? (
                  renderWaterfallChart(
                    localClassification.result.shap.filter((s: any) => 
                      s && Number.isFinite(s.contribution) && !isNaN(s.contribution)
                    )
                  )
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No SHAP data available</p>
                    <p className="text-sm">Please upload a CSV or submit features on the Classify page to generate explanations.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Probability Gauge */}
            {localClassification && (
              <ProbabilityGauge
                probabilities={localClassification.result.probabilities}
              />
            )}
          </div>

          {/* Manual SHAP Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Manual SHAP Data Upload
              </CardTitle>
              <CardDescription>
                Upload SHAP data in JSON format for custom analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="json-input">SHAP Data (JSON)</Label>
                <Textarea
                  id="json-input"
                  placeholder='[{"feature": "orbital_period_days", "value": 365.25, "contribution": 0.15}, ...]'
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="min-h-32 font-mono text-sm"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleJsonSubmit} disabled={!jsonInput.trim()}>
                  <FileText className="mr-2 h-4 w-4" />
                  Load SHAP Data
                </Button>
                <Button variant="outline" onClick={() => setJsonInput("")}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* SHAP Sample Data */}
          {shapSamples && shapSamples.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Sample SHAP Data</CardTitle>
                <CardDescription>
                  Example SHAP values from the dataset
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Here are some sample SHAP values from our dataset:
                  </p>
                  <div className="grid gap-2">
                    {shapSamples.slice(0, 3).map((sample, index) => (
                      <div key={sample.id} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Sample {index + 1}</span>
                          <Badge variant="outline">{sample.id}</Badge>
                        </div>
                        <div className="space-y-1">
                          {sample.shap.slice(0, 3).map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span>{item.feature}</span>
                              <span className={item.contribution > 0 ? 'text-green-600' : 'text-red-600'}>
                                {item.contribution > 0 ? '+' : ''}{item.contribution.toFixed(3)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* How SHAP Works */}
      <Card>
        <CardHeader>
          <CardTitle>Understanding SHAP Explanations</CardTitle>
          <CardDescription>
            How SHapley Additive exPlanations help us understand AI decisions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-medium">What is SHAP?</h4>
              <p className="text-sm text-muted-foreground">
                SHAP (SHapley Additive exPlanations) is a unified framework for explaining 
                machine learning model outputs. It provides a way to understand how each 
                feature contributes to a specific prediction.
              </p>
              
              <h4 className="font-medium">Key Concepts</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• <strong>Feature Values:</strong> The actual input values</li>
                <li>• <strong>Contributions:</strong> How much each feature pushes toward/away from each class</li>
                <li>• <strong>Base Value:</strong> The model's average prediction</li>
                <li>• <strong>Output:</strong> Base value + sum of contributions</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Reading the Visualizations</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• <strong>Green bars:</strong> Features pushing toward positive prediction</li>
                <li>• <strong>Red bars:</strong> Features pushing toward negative prediction</li>
                <li>• <strong>Bar width:</strong> Magnitude of contribution</li>
                <li>• <strong>Feature order:</strong> Sorted by absolute contribution</li>
              </ul>
              
              <h4 className="font-medium">Interpretation Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Look for the most influential features</li>
                <li>• Consider both magnitude and direction</li>
                <li>• Compare with domain knowledge</li>
                <li>• Check for unexpected contributions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
