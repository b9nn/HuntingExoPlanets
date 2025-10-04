"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { featureFormSchema, FeatureFormData } from "@/lib/validation"
import { getModels } from "@/lib/api"
import { TestTube, Sliders, Calculator } from "lucide-react"

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TestTube className="mr-2 h-5 w-5" />
          Exoplanet Classification
        </CardTitle>
        <CardDescription>
          Enter the astronomical parameters to classify an exoplanet candidate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Model Selection */}
            <div className="space-y-2">
              <Label>Model</Label>
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
                          {model.metrics.accuracy.toFixed(2)}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Input Method Toggle */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sliders" 
                checked={useSliders}
                onCheckedChange={(checked) => setUseSliders(!!checked)}
              />
              <Label htmlFor="sliders" className="flex items-center">
                <Sliders className="mr-2 h-4 w-4" />
                Use sliders for input
              </Label>
            </div>

            {/* Form Fields */}
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="koi_period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orbital Period (days)</FormLabel>
                    <FormControl>
                      {useSliders ? (
                        <Slider
                          value={[field.value]}
                          onValueChange={([value]) => field.onChange(value)}
                          min={0.1}
                          max={1000}
                          step={0.1}
                          className="w-full"
                        />
                      ) : (
                        <Input
                          type="number"
                          placeholder="365.25"
                          step="0.1"
                          {...field}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="koi_duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transit Duration (hours)</FormLabel>
                    <FormControl>
                      {useSliders ? (
                        <Slider
                          value={[field.value]}
                          onValueChange={([value]) => field.onChange(value)}
                          min={0.1}
                          max={50}
                          step={0.1}
                          className="w-full"
                        />
                      ) : (
                        <Input
                          type="number"
                          placeholder="13.5"
                          step="0.1"
                          {...field}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="koi_prad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Planetary Radius (Earth radii)</FormLabel>
                    <FormControl>
                      {useSliders ? (
                        <Slider
                          value={[field.value]}
                          onValueChange={([value]) => field.onChange(value)}
                          min={0.1}
                          max={20}
                          step={0.1}
                          className="w-full"
                        />
                      ) : (
                        <Input
                          type="number"
                          placeholder="1.0"
                          step="0.1"
                          {...field}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="koi_depth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transit Depth (ppm)</FormLabel>
                    <FormControl>
                      {useSliders ? (
                        <Slider
                          value={[field.value]}
                          onValueChange={([value]) => field.onChange(value)}
                          min={1}
                          max={10000}
                          step={1}
                          className="w-full"
                        />
                      ) : (
                        <Input
                          type="number"
                          placeholder="1000"
                          step="1"
                          {...field}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="koi_steff"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Effective Temperature (K)</FormLabel>
                    <FormControl>
                      {useSliders ? (
                        <Slider
                          value={[field.value]}
                          onValueChange={([value]) => field.onChange(value)}
                          min={2000}
                          max={8000}
                          step={10}
                          className="w-full"
                        />
                      ) : (
                        <Input
                          type="number"
                          placeholder="5778"
                          step="10"
                          {...field}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="koi_srad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stellar Radius (solar radii)</FormLabel>
                    <FormControl>
                      {useSliders ? (
                        <Slider
                          value={[field.value]}
                          onValueChange={([value]) => field.onChange(value)}
                          min={0.1}
                          max={5}
                          step={0.1}
                          className="w-full"
                        />
                      ) : (
                        <Input
                          type="number"
                          placeholder="1.0"
                          step="0.1"
                          {...field}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="koi_slogg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surface Gravity (log g)</FormLabel>
                    <FormControl>
                      {useSliders ? (
                        <Slider
                          value={[field.value]}
                          onValueChange={([value]) => field.onChange(value)}
                          min={3}
                          max={6}
                          step={0.1}
                          className="w-full"
                        />
                      ) : (
                        <Input
                          type="number"
                          placeholder="4.44"
                          step="0.1"
                          {...field}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
              size="lg"
            >
              <Calculator className="mr-2 h-4 w-4" />
              {isLoading ? "Classifying..." : "Classify Exoplanet"}
            </Button>
          </form>
        </Form>

        {/* Quick Examples */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Quick Examples</h4>
          <div className="space-y-2 text-sm">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => form.reset({
                koi_period: 365.25,
                koi_prad: 1.0,
                koi_duration: 13.5,
                koi_depth: 1000,
                koi_steff: 5778,
                koi_srad: 1.0,
                koi_slogg: 4.44,
              })}
            >
              Earth-like
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => form.reset({
                koi_period: 224.7,
                koi_prad: 0.95,
                koi_duration: 10.2,
                koi_depth: 850,
                koi_steff: 5778,
                koi_srad: 1.0,
                koi_slogg: 4.44,
              })}
            >
              Venus-like
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => form.reset({
                koi_period: 687.0,
                koi_prad: 1.1,
                koi_duration: 15.8,
                koi_depth: 1200,
                koi_steff: 5778,
                koi_srad: 1.0,
                koi_slogg: 4.44,
              })}
            >
              Mars-like
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
