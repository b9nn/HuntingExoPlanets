"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ProbabilityGaugeProps {
  probabilities: {
    confirmed: number
    candidate: number
    false_positive: number
  }
  className?: string
}

export function ProbabilityGauge({ probabilities, className }: ProbabilityGaugeProps) {
  const entries = Object.entries(probabilities).map(([key, value]) => ({
    class: key,
    probability: value,
    percentage: value * 100
  }))

  const getClassColor = (className: string) => {
    switch (className) {
      case 'confirmed':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900'
      case 'candidate':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900'
      case 'false_positive':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900'
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900'
    }
  }

  const getClassLabel = (className: string) => {
    switch (className) {
      case 'confirmed':
        return 'Confirmed'
      case 'candidate':
        return 'Candidate'
      case 'false_positive':
        return 'False Positive'
      default:
        return className
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Prediction Probabilities</CardTitle>
        <CardDescription>
          Model confidence for each classification class
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entries.map(({ class: className, probability, percentage }) => (
            <div key={className} className="space-y-2">
              <div className="flex justify-between items-center">
                <Badge className={getClassColor(className)}>
                  {getClassLabel(className)}
                </Badge>
                <span className="font-medium">
                  {percentage.toFixed(1)}%
                </span>
              </div>
              
              {/* Semi-circle gauge */}
              <div className="relative h-16 w-full">
                <svg className="w-full h-full" viewBox="0 0 100 50">
                  {/* Background arc */}
                  <path
                    d="M 10 40 A 40 40 0 0 1 90 40"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                  />
                  
                  {/* Progress arc */}
                  <path
                    d="M 10 40 A 40 40 0 0 1 90 40"
                    fill="none"
                    stroke={className === 'confirmed' ? 'hsl(var(--primary))' : 
                           className === 'candidate' ? 'hsl(var(--warning))' : 
                           'hsl(var(--destructive))'}
                    strokeWidth="8"
                    strokeDasharray={`${percentage * 1.25} 125`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                  
                  {/* Center text */}
                  <text
                    x="50"
                    y="35"
                    textAnchor="middle"
                    className="text-xs font-medium fill-current"
                  >
                    {percentage.toFixed(0)}%
                  </text>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
