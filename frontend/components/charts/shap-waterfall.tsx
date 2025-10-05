"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type ShapItem = { feature: string; value: number; contribution: number }

interface ShapWaterfallProps {
  title?: string
  description?: string
  shap: ShapItem[]
  height?: number
}

export function ShapWaterfall({ title = "SHAP Feature Contributions", description = "Feature contributions to prediction", shap, height = 300 }: ShapWaterfallProps) {
  const data = Array.isArray(shap) ? shap.filter(s => s && Number.isFinite(s.contribution)) : []
  const sorted = [...data].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
  const maxAbs = Math.max(0.000001, ...sorted.map(s => Math.abs(s.contribution)))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2" style={{ maxHeight: height, overflowY: "auto" }}>
          {sorted.length === 0 && (
            <div className="text-sm text-muted-foreground">No SHAP data available.</div>
          )}
          {sorted.map((item, index) => {
            const isPositive = item.contribution > 0
            return (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-44 text-sm font-medium truncate">
                  {item.feature}
                </div>
                <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
                  <div
                    className={`absolute top-0 h-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{
                      width: `${Math.min((Math.abs(item.contribution) / maxAbs) * 100, 100)}%`,
                      left: isPositive ? '0' : 'auto',
                      right: isPositive ? 'auto' : '0'
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                    {item.contribution > 0 ? '+' : ''}{Number.isFinite(item.contribution) ? item.contribution.toFixed(3) : '0.000'}
                  </div>
                </div>
                <div className="w-16 text-xs text-muted-foreground text-right">
                  {Number.isFinite(item.value) ? item.value.toFixed(2) : ''}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}


