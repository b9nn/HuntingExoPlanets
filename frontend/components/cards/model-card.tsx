"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ModelInfo } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ModelCardProps {
  model: ModelInfo
  isBest?: boolean
  className?: string
}

export function ModelCard({ model, isBest = false, className }: ModelCardProps) {
  const normalizePct = (val?: number | null) => {
    if (val === null || val === undefined) return 0
    return val > 1 ? val / 100 : val
  }

  const metrics = [
    { label: "Accuracy", value: normalizePct(model.metrics?.accuracy) },
    { label: "Precision", value: normalizePct(model.metrics?.precision) },
    { label: "Recall", value: normalizePct(model.metrics?.recall) },
    { label: "F1 Score", value: normalizePct(model.metrics?.f1) },
  ]

  return (
    <Card className={cn(
      "relative transition-all hover:shadow-md",
      isBest && "ring-2 ring-primary/20 bg-primary/5",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{model.name}</CardTitle>
          {isBest && (
            <Badge variant="default" className="text-xs">
              Best Model
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{metric.label}</span>
              <span className="font-medium">{(metric.value * 100).toFixed(1)}%</span>
            </div>
            <Progress 
              value={metric.value * 100} 
              className="h-2"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
