"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface ConfusionHeatmapProps {
  matrix: number[][]
  labels: string[]
  className?: string
}

export function ConfusionHeatmap({ matrix, labels, className }: ConfusionHeatmapProps) {
  const [isNormalized, setIsNormalized] = useState(true)
  
  // Calculate normalized matrix
  const normalizedMatrix = matrix.map(row => {
    const sum = row.reduce((a, b) => a + b, 0)
    return sum > 0 ? row.map(val => val / sum) : row
  })

  const displayMatrix = isNormalized ? normalizedMatrix : matrix

  const getColorIntensity = (value: number) => {
    if (isNormalized) {
      return `rgba(59, 130, 246, ${value})` // Blue gradient
    } else {
      const max = Math.max(...matrix.flat())
      return `rgba(59, 130, 246, ${value / max})`
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Confusion Matrix</CardTitle>
            <CardDescription>
              Model performance across different classes
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsNormalized(!isNormalized)}
          >
            {isNormalized ? "Show Absolute" : "Show Normalized"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Matrix */}
          <div className="grid grid-cols-4 gap-2">
            {/* Empty corner */}
            <div></div>
            
            {/* Predicted labels */}
            {labels.map((label, i) => (
              <div key={i} className="text-center text-sm font-medium text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  {label}
                </Badge>
              </div>
            ))}
            
            {/* Actual labels and matrix cells */}
            {labels.map((actualLabel, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center text-sm font-medium text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    {actualLabel}
                  </Badge>
                </div>
                {labels.map((predictedLabel, j) => (
                  <TooltipProvider key={j}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "h-12 w-full rounded border flex items-center justify-center text-xs font-medium transition-colors hover:ring-2 hover:ring-primary/20",
                            displayMatrix[i][j] > 0.5 ? "text-white" : "text-black"
                          )}
                          style={{ backgroundColor: getColorIntensity(displayMatrix[i][j]) }}
                        >
                          {isNormalized 
                            ? `${(displayMatrix[i][j] * 100).toFixed(1)}%`
                            : displayMatrix[i][j].toString()
                          }
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <p className="font-medium">
                            Actual: {actualLabel}
                          </p>
                          <p className="font-medium">
                            Predicted: {predictedLabel}
                          </p>
                          <p className="text-sm">
                            {isNormalized 
                              ? `${(displayMatrix[i][j] * 100).toFixed(1)}%`
                              : `${displayMatrix[i][j]} samples`
                            }
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </React.Fragment>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Lower</span>
            <div className="flex space-x-1">
              {[0, 0.25, 0.5, 0.75, 1].map((intensity) => (
                <div
                  key={intensity}
                  className="h-3 w-4 rounded"
                  style={{ backgroundColor: getColorIntensity(intensity) }}
                />
              ))}
            </div>
            <span>Higher</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
