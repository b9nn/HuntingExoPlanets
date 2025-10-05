"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { FEATURE_LABELS } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface FeatureImportanceBarProps {
  data: Array<{ name: string; importance: number }>
  className?: string
}

export function FeatureImportanceBar({ data, className }: FeatureImportanceBarProps) {
  const safeData = (data || []).filter(d => Number.isFinite(d.importance) && !isNaN(d.importance))
  const chartData = safeData.map(item => ({
    name: FEATURE_LABELS[item.name as keyof typeof FEATURE_LABELS] || item.name,
    importance: Math.max(0, Math.min(1, item.importance)),
    originalName: item.name
  }))

  if (!chartData.length) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Feature Importance</CardTitle>
          <CardDescription>
            Top features contributing to model predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">No feature importance data available.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Feature Importance</CardTitle>
        <CardDescription>
          Top features contributing to model predictions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData}
              layout="horizontal"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis 
                type="number" 
                domain={[0, 1]}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              />
              <YAxis 
                type="category" 
                dataKey="name"
                width={150}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="rounded-lg border bg-background px-3 py-2 shadow-md">
                        <p className="font-medium">{data.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Importance: {(data.importance * 100).toFixed(1)}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {data.originalName}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar 
                dataKey="importance" 
                fill="hsl(var(--primary))"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
