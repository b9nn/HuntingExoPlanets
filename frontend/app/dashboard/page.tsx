"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { KpiCard } from "@/components/cards/kpi-card"
import { ModelCard } from "@/components/cards/model-card"
import { ConfusionHeatmap } from "@/components/charts/confusion-heatmap"
import { FeatureImportanceBar } from "@/components/charts/feature-importance-bar"
import { getMetrics, getModels, getFeatures } from "@/lib/api"
import { PREDICTION_CLASSES } from "@/lib/constants"
import { Target, TrendingUp, Brain, Zap } from "lucide-react"

export default function DashboardPage() {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["metrics"],
    queryFn: getMetrics,
  })

  const { data: models, isLoading: modelsLoading } = useQuery({
    queryKey: ["models"],
    queryFn: getModels,
  })

  const { data: features, isLoading: featuresLoading } = useQuery({
    queryKey: ["features"],
    queryFn: getFeatures,
  })

  const kpis = metrics && metrics.overall ? [
    {
      title: "Overall Accuracy",
      value: metrics.overall.accuracy || 0,
      icon: Target,
      description: "Model performance across all classes",
    },
    {
      title: "Precision",
      value: metrics.overall.precision || 0,
      icon: TrendingUp,
      description: "True positives / (True positives + False positives)",
    },
    {
      title: "Recall",
      value: metrics.overall.recall || 0,
      icon: Brain,
      description: "True positives / (True positives + False negatives)",
    },
    {
      title: "F1 Score",
      value: metrics.overall.f1 || 0,
      icon: Zap,
      description: "Harmonic mean of precision and recall",
    },
  ] : []

  const getBestModel = () => {
    if (!models || models.length === 0) return null
    return models.reduce((best, current) => 
      (current.metrics?.accuracy || 0) > (best.metrics?.accuracy || 0) ? current : best
    )
  }

  const bestModel = getBestModel()

  if (metricsLoading || modelsLoading || featuresLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of ExoAI model performance and system status
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <KpiCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            description={kpi.description}
          />
        ))}
      </div>

      {/* Model Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Model Performance</CardTitle>
          <CardDescription>
            Ensemble models ranked by accuracy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {models?.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                isBest={model.id === bestModel?.id}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ConfusionHeatmap
          matrix={metrics?.confusionMatrix || []}
          labels={PREDICTION_CLASSES.map(c => c.label)}
        />
        
        <FeatureImportanceBar
          data={features?.importances || []}
        />
      </div>

      {/* System Status */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Best Model
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bestModel?.name}
            </div>
            <p className="text-xs text-muted-foreground">
              {((bestModel?.metrics?.accuracy ?? 0) * 100).toFixed(1)}% accuracy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Models
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {models?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Ensemble algorithms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {features?.importances?.length ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Key features analyzed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {PREDICTION_CLASSES.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Classification categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
          <CardDescription>
            Key insights from the ensemble model performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium">Strengths</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• High accuracy across all models</li>
                <li>• Consistent performance on confirmed exoplanets</li>
                <li>• Good precision-recall balance</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Areas for Improvement</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Candidate vs false positive distinction</li>
                <li>• Handling edge cases in transit data</li>
                <li>• Stellar parameter sensitivity</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Key Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Orbital period most important</li>
                <li>• Transit depth strongly predictive</li>
                <li>• Planetary radius critical factor</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
