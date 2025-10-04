"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { 
  Sun, 
  Moon, 
  Monitor, 
  Wifi, 
  WifiOff,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MISSIONS } from "@/lib/constants"
import { useApiHealth } from "@/hooks/use-api-health"

interface TopbarProps {
  selectedMission?: string
  onMissionChange?: (mission: string) => void
}

export function Topbar({ selectedMission, onMissionChange }: TopbarProps) {
  const { theme, setTheme } = useTheme()
  const { data: health, isLoading } = useApiHealth()

  const formatLastUpdate = (isoString: string) => {
    const date = new Date(isoString)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 1) return "Just now"
    if (diffHours < 24) return `${diffHours}h ago`
    return `${Math.floor(diffHours / 24)}d ago`
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <h1 className="text-xl font-bold">ExoAI</h1>
          <span className="ml-2 text-sm text-muted-foreground">
            Exoplanet Discovery & Classification
          </span>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center space-x-2">
            {/* Mission Selector */}
            <Select
              value={selectedMission}
              onValueChange={onMissionChange}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Mission" />
              </SelectTrigger>
              <SelectContent>
                {MISSIONS.map((mission) => (
                  <SelectItem key={mission.value} value={mission.value}>
                    {mission.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Last Update Badge */}
            {health && !isLoading && (
              <Badge variant="outline" className="text-xs">
                <Wifi className="mr-1 h-3 w-3" />
                Updated {formatLastUpdate(health.last_ingest_iso)}
              </Badge>
            )}

            {/* Backend Status */}
            <Badge 
              variant={health ? "default" : "destructive"}
              className="text-xs"
            >
              {health ? (
                <>
                  <Wifi className="mr-1 h-3 w-3" />
                  Online
                </>
              ) : (
                <>
                  <WifiOff className="mr-1 h-3 w-3" />
                  Offline
                </>
              )}
            </Badge>
          </div>

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
