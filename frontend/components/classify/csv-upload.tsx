"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { predictCSV } from "@/lib/api"
import { Upload, FileText, Download, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

interface CSVUploadProps {
  className?: string
}

export function CSVUpload({ className }: CSVUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedData, setProcessedData] = useState<any[] | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type === 'text/csv') {
      setUploadedFile(file)
      setProcessedData(null)
      setDownloadUrl(null)
      toast.success(`File "${file.name}" uploaded successfully`)
    } else {
      toast.error("Please upload a CSV file")
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false
  })

  const handleProcessCSV = async () => {
    if (!uploadedFile) return

    setIsProcessing(true)
    try {
      const blob = await predictCSV(uploadedFile)
      
      // Create download URL
      const url = window.URL.createObjectURL(blob)
      setDownloadUrl(url)
      
      // Parse CSV to show preview
      const text = await blob.text()
      const lines = text.split('\n')
      const headers = lines[0].split(',')
      const rows = lines.slice(1, 6).map(line => {
        const values = line.split(',')
        return headers.reduce((obj, header, index) => {
          obj[header.trim()] = values[index]?.trim() || ''
          return obj
        }, {} as any)
      })
      
      setProcessedData(rows)
      toast.success("CSV processed successfully!")
      
    } catch (error) {
      console.error("Processing error:", error)
      toast.error("Failed to process CSV. Please check the file format.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = 'classified_exoplanets.csv'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success("File downloaded successfully!")
    }
  }

  const handleClear = () => {
    setUploadedFile(null)
    setProcessedData(null)
    if (downloadUrl) {
      window.URL.revokeObjectURL(downloadUrl)
      setDownloadUrl(null)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          CSV Batch Classification
        </CardTitle>
        <CardDescription>
          Upload a CSV file with exoplanet data to classify multiple objects at once
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
            }
          `}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          {isDragActive ? (
            <p className="text-lg font-medium">Drop the CSV file here...</p>
          ) : (
            <div>
              <p className="text-lg font-medium mb-2">
                Drag & drop a CSV file here, or click to select
              </p>
          <p className="text-sm text-muted-foreground">
            CSV must contain columns: koi_period, koi_duration, koi_prad, 
            koi_depth, koi_steff, koi_srad, koi_slogg
          </p>
            </div>
          )}
        </div>

        {/* File Info */}
        {uploadedFile && (
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Badge variant="outline">Ready to process</Badge>
          </div>
        )}

        {/* Processing */}
        {isProcessing && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="font-medium">Processing CSV file...</span>
            </div>
            <Progress value={66} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Analyzing {uploadedFile?.name} and running classification
            </p>
          </div>
        )}

        {/* Results */}
        {processedData && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-600">Processing Complete!</span>
            </div>
            
            {/* Preview */}
            <div className="space-y-2">
              <h4 className="font-medium">Preview (first 5 rows):</h4>
              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-48 overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        {Object.keys(processedData[0] || {}).map((header) => (
                          <th key={header} className="px-3 py-2 text-left font-medium">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {processedData.map((row, index) => (
                        <tr key={index} className="border-t">
                          {Object.values(row).map((value, i) => (
                            <td key={i} className="px-3 py-2">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          {uploadedFile && !processedData && (
            <Button 
              onClick={handleProcessCSV} 
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Process CSV
                </>
              )}
            </Button>
          )}
          
          {downloadUrl && (
            <Button onClick={handleDownload} variant="default" className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download Results
            </Button>
          )}
          
          {(uploadedFile || processedData) && (
            <Button onClick={handleClear} variant="outline">
              Clear
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center">
            <AlertCircle className="mr-2 h-4 w-4" />
            CSV Format Requirements
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• CSV must contain these exact column names:</li>
            <li>• koi_period, koi_duration, koi_prad</li>
            <li>• koi_depth, koi_steff, koi_srad, koi_slogg</li>
            <li>• All values must be numeric</li>
            <li>• Results will include 'is_exoplanet' and 'confidence' columns</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
