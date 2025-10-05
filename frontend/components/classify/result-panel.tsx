"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PredictResponse } from "@/lib/types"
import { getPredictionColor, getPredictionEmoji, formatPercentage } from "@/lib/utils"
import { PREDICTION_CLASSES } from "@/lib/constants"
import { Brain, BarChart3, ArrowRight } from "lucide-react"
import Link from "next/link"

interface ResultPanelProps {
  result: PredictResponse
  onViewExplanations?: () => void
  className?: string
}

export function ResultPanel({ result, onViewExplanations, className }: ResultPanelProps) {
  // Add defensive checks
  if (!result || !result.prediction || !result.probabilities) {
    return (
      <div className={className}>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <p>No classification result available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const predictionClass = PREDICTION_CLASSES.find(
    c => c.value === result.prediction
  )

  const probabilityEntries = Object.entries(result.probabilities).map(([key, value]) => ({
    class: key,
    probability: value,
    label: PREDICTION_CLASSES.find(c => c.value === key)?.label || key,
    color: PREDICTION_CLASSES.find(c => c.value === key)?.color || "bg-gray-500"
  }))

  // Nicify feature labels for KOI columns
  const FEATURE_LABELS: Record<string, string> = {
    // KOI keys
    koi_period: "Orbital Period",
    koi_duration: "Transit Duration",
    koi_prad: "Planetary Radius",
    koi_depth: "Transit Depth",
    koi_steff: "Star’s Effective Temperature",
    koi_srad: "Star’s Radius",
    koi_slogg: "Star’s Surface Gravity",
    // Friendly API keys
    orbital_period_days: "Orbital Period",
    transit_duration_hours: "Transit Duration",
    planetary_radius_re: "Planetary Radius",
    transit_depth_ppm: "Transit Depth",
    teff_k: "Star’s Effective Temperature",
    rstar_rs: "Star’s Radius",
    logg: "Star’s Surface Gravity",
  }

  const formatContribution = (v: number) => {
    const sign = v > 0 ? "+" : v < 0 ? "" : ""
    const abs = Math.abs(v)
    if (abs === 0) return "0.000"
    if (abs < 0.001) return `${v.toExponential(2)}`
    return `${sign}${abs.toFixed(3)}`.replace(/^\+?/, v > 0 ? "+" : "")
  }

  const topShap = (result.shap || [])
    .slice()
    .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
    .slice(0, 5)

  const maxAbs = Math.max(0.000001, ...topShap.map(s => Math.abs(s.contribution)))

  return (
    <div className={className}>
      {/* Main Prediction */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Classification Result</CardTitle>
              <CardDescription>
                AI-powered exoplanet classification
              </CardDescription>
            </div>
            <Badge 
              variant="secondary" 
              className={`text-lg px-4 py-2 ${getPredictionColor(result.prediction)}`}
            >
              {getPredictionEmoji(result.prediction)} {predictionClass?.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Confidence */}
          <div className="text-center">
            <div className="text-3xl font-bold">
              {formatPercentage(result.probabilities[result.prediction as keyof typeof result.probabilities])}
            </div>
            <p className="text-sm text-muted-foreground">
              Confidence in {predictionClass?.label} prediction
            </p>
          </div>

          {/* Rationale */}
          {result.rationale && (
            <div className="space-y-2">
              <h4 className="font-medium flex items-center">
                <Brain className="mr-2 h-4 w-4" />
                Model Rationale
              </h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                {result.rationale}
              </p>
            </div>
          )}

          {/* Probability Breakdown */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              Probability Breakdown
            </h4>
            {probabilityEntries.map(({ class: className, probability, label, color }) => (
              <div key={className} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{label}</span>
                  <span className="font-medium">{formatPercentage(probability)}</span>
                </div>
                <Progress 
                  value={probability * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>

          {/* SHAP Contributions */}
          {result.shap && result.shap.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Key Contributing Features</h4>
              <div className="space-y-2">
                {topShap.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <span className="text-sm font-medium">{FEATURE_LABELS[item.feature] ?? item.feature}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-48 bg-secondary rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              item.contribution > 0 ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ 
                              width: `${(Math.abs(item.contribution) / maxAbs) * 100}%`,
                              marginLeft: item.contribution > 0 ? '0' : 'auto'
                            }}
                          />
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            item.contribution > 0 ? 'text-green-600' : item.contribution < 0 ? 'text-red-600' : 'text-muted-foreground'
                          }`}
                        >
                          {formatContribution(item.contribution)}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2 pt-4">
            {onViewExplanations && (
              <Button variant="outline" onClick={onViewExplanations} className="flex-1">
                <Brain className="mr-2 h-4 w-4" />
                View Full Explanations
              </Button>
            )}
            <Button asChild className="flex-1">
              <Link href="/explanations">
                <ArrowRight className="mr-2 h-4 w-4" />
                SHAP Analysis
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
