"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { DatasetTable } from "@/components/tables/dataset-table"
import { getDataset } from "@/lib/api"
import { MISSIONS } from "@/lib/constants"
import { Mission } from "@/lib/types"
import { Database, Download, Upload, Filter } from "lucide-react"
import { downloadCSV } from "@/lib/utils"

export default function DatasetsPage() {
  const [selectedMission, setSelectedMission] = useState<Mission>('kepler')
  const [searchTerm, setSearchTerm] = useState("")

  const { data: dataset, isLoading } = useQuery({
    queryKey: ["dataset", selectedMission, searchTerm],
    queryFn: () => getDataset({ 
      mission: selectedMission,
      search: searchTerm || undefined,
      limit: 100 
    }),
  })

  const handleExport = () => {
    if (dataset?.rows) {
      downloadCSV(dataset.rows, `exoplanets-${selectedMission}.csv`)
    }
  }

  const handleMissionChange = (mission: string) => {
    setSelectedMission(mission as Mission)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <Database className="mr-3 h-8 w-8 text-primary" />
          Exoplanet Datasets
        </h1>
        <p className="text-muted-foreground">
          Explore and analyze exoplanet data from Kepler, K2, and TESS missions
        </p>
      </div>

      {/* Mission Tabs */}
      <Tabs value={selectedMission} onValueChange={handleMissionChange}>
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full grid-cols-3">
            {MISSIONS.map((mission) => (
              <TabsTrigger key={mission.value} value={mission.value}>
                {mission.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleExport} disabled={!dataset?.rows}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Dataset Content */}
        {MISSIONS.map((mission) => (
          <TabsContent key={mission.value} value={mission.value} className="space-y-6">
            {/* Mission Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      {mission.label} Mission
                      <Badge variant="outline" className="ml-2">
                        {mission.value.toUpperCase()}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{mission.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Total Objects</h4>
                    <div className="text-2xl font-bold">
                      {isLoading ? <Skeleton className="h-8 w-16" /> : (dataset?.total ?? 0)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Confirmed</h4>
                    <div className="text-2xl font-bold text-green-600">
                      {isLoading ? <Skeleton className="h-8 w-16" /> : (dataset?.classCounts?.confirmed ?? 0)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Candidates</h4>
                    <div className="text-2xl font-bold text-yellow-600">
                      {isLoading ? <Skeleton className="h-8 w-16" /> : (dataset?.classCounts?.candidate ?? 0)}
                    </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">False Positive</h4>
                    <div className="text-2xl font-bold text-red-600">
                      {isLoading ? <Skeleton className="h-8 w-16" /> : (dataset?.classCounts?.false_positive ?? 0)}
                    </div>
                  </div>
                  </div>
                  {/* Removed duplicate per-page false positives block */}
                </div>
              </CardContent>
            </Card>

            {/* Dataset Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Dataset Explorer</CardTitle>
                    <CardDescription>
                      Interactive table with filtering, sorting, and classification capabilities
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      <Filter className="mr-1 h-3 w-3" />
                      {(dataset?.rows?.length ?? 0)} rows
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : dataset?.rows ? (
                  <DatasetTable key={selectedMission} data={dataset.rows} />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No data available for {mission.label} mission</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mission Statistics */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Data Quality</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Complete Records</span>
                      <span className="font-medium">
                        {dataset?.rows ? 
                          `${Math.round((dataset.rows.filter(r => r.orbital_period_days > 0).length / dataset.rows.length) * 100)}%` 
                          : '0%'}
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ 
                          width: `${dataset?.rows ? 
                            Math.round((dataset.rows.filter(r => r.orbital_period_days > 0).length / dataset.rows.length) * 100) 
                            : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Confirmed Rate</span>
                      <span className="font-medium">
                        {dataset?.rows ? 
                          `${Math.round((dataset.rows.filter(r => r.label === 'confirmed').length / dataset.rows.length) * 100)}%` 
                          : '0%'}
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ 
                          width: `${dataset?.rows ? 
                            Math.round((dataset.rows.filter(r => r.label === 'confirmed').length / dataset.rows.length) * 100) 
                            : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mission Characteristics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Primary Target</span>
                      <span className="font-medium">
                        {mission.value === 'kepler' && 'Main Sequence Stars'}
                        {mission.value === 'k2' && 'Variable Targets'}
                        {mission.value === 'tess' && 'Bright Stars'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Field of View</span>
                      <span className="font-medium">
                        {mission.value === 'kepler' && '115 deg²'}
                        {mission.value === 'k2' && '115 deg²'}
                        {mission.value === 'tess' && '2300 deg²'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">
                        {mission.value === 'kepler' && '2009-2018'}
                        {mission.value === 'k2' && '2014-2018'}
                        {mission.value === 'tess' && '2018-present'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Detection Method</span>
                      <span className="font-medium">Transit Photometry</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Usage Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>How to Use the Dataset Explorer</CardTitle>
                <CardDescription>
                  Tips for analyzing exoplanet data effectively
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-medium">Table Features</h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• <strong>Sorting:</strong> Click column headers to sort data</li>
                      <li>• <strong>Filtering:</strong> Use the search box to filter by ID</li>
                      <li>• <strong>Column Visibility:</strong> Show/hide columns as needed</li>
                      <li>• <strong>Selection:</strong> Select multiple rows for batch operations</li>
                      <li>• <strong>Pagination:</strong> Navigate through large datasets</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Analysis Tools</h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• <strong>View Details:</strong> Click actions menu for detailed view</li>
                      <li>• <strong>Classify:</strong> Run AI classification on any row</li>
                      <li>• <strong>Export:</strong> Download data as CSV for external analysis</li>
                      <li>• <strong>Compare:</strong> Select multiple objects for comparison</li>
                      <li>• <strong>Visualize:</strong> Use the 3D visualization for selected objects</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

