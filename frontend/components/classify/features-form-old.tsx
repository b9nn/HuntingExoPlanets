"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { featureFormSchema, FeatureFormData } from "@/lib/validation"
import { FEATURE_LABELS, FEATURE_DESCRIPTIONS } from "@/lib/constants"
import { HelpCircle, RotateCcw } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { getModels } from "@/lib/api"
import toast from "react-hot-toast"

interface FeaturesFormProps {
  onSubmit: (data: FeatureFormData) => void
  isLoading?: boolean
  defaultValues?: Partial<FeatureFormData>
}

const defaultFormValues: FeatureFormData = {
  koi_period: 365.25,      // orbital_period_days
  koi_prad: 1.0,           // planetary_radius_re
  koi_duration: 13.5,      // transit_duration_hours
  koi_depth: 1000,         // transit_depth_ppm
  koi_steff: 5778,         // teff_k
  koi_srad: 1.0,           // rstar_rs
  koi_slogg: 4.44,         // logg
}

export function FeaturesForm({ onSubmit, isLoading, defaultValues }: FeaturesFormProps) {
  const [useSliders, setUseSliders] = useState(false)
  
  const { data: models } = useQuery({
    queryKey: ["models"],
    queryFn: getModels,
  })

  const form = useForm<FeatureFormData>({
    resolver: zodResolver(featureFormSchema),
    defaultValues: { ...defaultFormValues, ...defaultValues },
  })

  const handleSubmit = (data: FeatureFormData) => {
    onSubmit(data)
  }

  const resetForm = () => {
    form.reset(defaultFormValues)
    toast.success("Form reset to default values")
  }

  const features = [
    {
      name: "orbital_period_days" as keyof FeatureFormData,
      label: "Orbital Period (days)",
      min: 0.1,
      max: 10000,
      step: 0.1,
      description: "Time for planet to complete one orbit around its host star",
    },
    {
      name: "transit_duration_hours" as keyof FeatureFormData,
      label: "Transit Duration (hours)",
      min: 0.1,
      max: 100,
      step: 0.1,
      description: "Duration of the transit event when planet passes in front of star",
    },
    {
      name: "planetary_radius_re" as keyof FeatureFormData,
      label: "Planetary Radius (Earth radii)",
      min: 0.1,
      max: 50,
      step: 0.1,
      description: "Radius of the planet relative to Earth's radius",
    },
    {
      name: "transit_depth_ppm" as keyof FeatureFormData,
      label: "Transit Depth (ppm)",
      min: 1,
      max: 100000,
      step: 1,
      description: "Fractional decrease in stellar brightness during transit",
    },
    {
      name: "teff_k" as keyof FeatureFormData,
      label: "Effective Temperature (K)",
      min: 2000,
      max: 10000,
      step: 1,
      description: "Effective temperature of the host star in Kelvin",
    },
    {
      name: "rstar_rs" as keyof FeatureFormData,
      label: "Stellar Radius (solar radii)",
      min: 0.1,
      max: 50,
      step: 0.01,
      description: "Radius of the host star relative to the Sun's radius",
    },
    {
      name: "logg" as keyof FeatureFormData,
      label: "Surface Gravity (log g)",
      min: 0,
      max: 6,
      step: 0.01,
      description: "Surface gravity of the host star (logarithmic scale)",
    },
    {
      name: "feh" as keyof FeatureFormData,
      label: "Metallicity [Fe/H]",
      min: -3,
      max: 1,
      step: 0.01,
      description: "Metallicity of the host star relative to the Sun",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Exoplanet Features</CardTitle>
            <CardDescription>
              Enter the astronomical parameters for classification
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUseSliders(!useSliders)}
            >
              {useSliders ? "Input Fields" : "Sliders"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetForm}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Model Selection */}
          <div className="space-y-2">
            <Label htmlFor="modelId">Model</Label>
            <Select
              value={form.watch("modelId") || "stacking"}
              onValueChange={(value) => form.setValue("modelId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {models?.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{model.name}</span>
                      <Badge variant="outline" className="ml-2">
                        {(model.metrics.accuracy * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Feature Inputs */}
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature) => {
              const value = form.watch(feature.name)
              const error = form.formState.errors[feature.name]

              return (
                <div key={feature.name} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={feature.name}>{feature.label}</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{feature.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  {useSliders ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{feature.min}</span>
                        <span className="font-medium">{value}</span>
                        <span>{feature.max}</span>
                      </div>
                      <Slider
                        value={[value]}
                        onValueChange={([newValue]) => form.setValue(feature.name, newValue)}
                        min={feature.min}
                        max={feature.max}
                        step={feature.step}
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <Input
                      id={feature.name}
                      type="number"
                      step={feature.step}
                      min={feature.min}
                      max={feature.max}
                      {...form.register(feature.name, { valueAsNumber: true })}
                      className={error ? "border-destructive" : ""}
                    />
                  )}
                  
                  {error && (
                    <p className="text-sm text-destructive">{error.message}</p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Classifying..." : "Classify Exoplanet"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
