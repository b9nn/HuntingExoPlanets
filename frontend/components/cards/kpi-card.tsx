"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: number
  unit?: string
  change?: number
  changeLabel?: string
  icon?: LucideIcon
  description?: string
  className?: string
}

export function KpiCard({
  title,
  value,
  unit = "%",
  change,
  changeLabel,
  icon: Icon,
  description,
  className
}: KpiCardProps) {
  const formatValue = (val: number) => {
    return (val * 100).toFixed(1)
  }

  const getTrendIcon = () => {
    if (!change) return Minus
    return change > 0 ? TrendingUp : TrendingDown
  }

  const getTrendColor = () => {
    if (!change) return "text-muted-foreground"
    return change > 0 ? "text-green-600" : "text-red-600"
  }

  const TrendIcon = getTrendIcon()

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">
            {formatValue(value)}{unit}
          </div>
          
          {change !== undefined && (
            <div className="flex items-center space-x-2 text-xs">
              <TrendIcon className={cn("h-3 w-3", getTrendColor())} />
              <span className={cn("font-medium", getTrendColor())}>
                {change > 0 ? "+" : ""}{change?.toFixed(1)}{unit}
              </span>
              {changeLabel && (
                <span className="text-muted-foreground">
                  {changeLabel}
                </span>
              )}
            </div>
          )}
          
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
