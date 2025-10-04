"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface MetricSparkProps {
  data: Array<{ name: string; value: number }>
  color?: string
  height?: number
  className?: string
}

export function MetricSpark({ 
  data, 
  color = "hsl(var(--primary))", 
  height = 60,
  className 
}: MetricSparkProps) {
  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <XAxis hide dataKey="name" />
          <YAxis hide domain={[0, 1]} />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background px-3 py-2 shadow-md">
                    <p className="text-sm font-medium">
                      {(payload[0].value * 100).toFixed(1)}%
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#gradient-${color})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
