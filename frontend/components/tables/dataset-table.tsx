"use client"

import { useState } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Eye, TestTube } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DatasetRow } from "@/lib/types"
import { getPredictionColor, getPredictionEmoji, formatNumber } from "@/lib/utils"
import { FeaturesForm } from "@/components/classify/features-form"
import { ResultPanel } from "@/components/classify/result-panel"
import { predict } from "@/lib/api"
import toast from "react-hot-toast"

interface DatasetTableProps {
  data: DatasetRow[]
  onClassifyRow?: (row: DatasetRow) => void
}

export function DatasetTable({ data, onClassifyRow }: DatasetTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [selectedRow, setSelectedRow] = useState<DatasetRow | null>(null)
  const [classificationResult, setClassificationResult] = useState<any>(null)
  const [isClassifying, setIsClassifying] = useState(false)

  const handleClassifyRow = async (row: DatasetRow) => {
    setIsClassifying(true)
    setSelectedRow(row)
    
    try {
      const result = await predict({
        features: {
          orbital_period_days: row.orbital_period_days,
          transit_duration_hours: row.transit_duration_hours,
          planetary_radius_re: row.planetary_radius_re,
          transit_depth_ppm: row.transit_depth_ppm,
          teff_k: row.teff_k,
          rstar_rs: row.rstar_rs,
          logg: row.logg,
          feh: row.feh,
        }
      })
      
      setClassificationResult(result)
      toast.success("Classification completed!")
    } catch (error) {
      console.error("Classification error:", error)
      toast.error("Failed to classify exoplanet")
    } finally {
      setIsClassifying(false)
    }
  }

  const columns: ColumnDef<DatasetRow>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "mission",
      header: "Mission",
      cell: ({ row }) => (
        <Badge variant="outline" className="uppercase">
          {row.getValue("mission")}
        </Badge>
      ),
    },
    {
      accessorKey: "orbital_period_days",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Period (days)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const period = parseFloat(row.getValue("orbital_period_days"))
        return <div>{formatNumber(period, 1)}</div>
      },
    },
    {
      accessorKey: "transit_duration_hours",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Duration (h)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const duration = parseFloat(row.getValue("transit_duration_hours"))
        return <div>{formatNumber(duration, 1)}</div>
      },
    },
    {
      accessorKey: "planetary_radius_re",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Radius (R⊕)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const radius = parseFloat(row.getValue("planetary_radius_re"))
        return <div>{formatNumber(radius, 2)}</div>
      },
    },
    {
      accessorKey: "transit_depth_ppm",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Depth (ppm)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const depth = parseFloat(row.getValue("transit_depth_ppm"))
        return <div>{formatNumber(depth, 0)}</div>
      },
    },
    {
      accessorKey: "teff_k",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Teff (K)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const teff = parseFloat(row.getValue("teff_k"))
        return <div>{formatNumber(teff, 0)}</div>
      },
    },
    {
      accessorKey: "label",
      header: "Label",
      cell: ({ row }) => {
        const label = row.getValue("label") as string
        return (
          <Badge className={getPredictionColor(label)}>
            {getPredictionEmoji(label)} {label.replace('_', ' ')}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const rowData = row.original

        return (
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(rowData.id)}
                >
                  Copy ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem
                  onClick={() => handleClassifyRow(rowData)}
                  disabled={isClassifying}
                >
                  <TestTube className="mr-2 h-4 w-4" />
                  {isClassifying ? "Classifying..." : "Classify"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Exoplanet Details</DialogTitle>
                <DialogDescription>
                  Detailed information for exoplanet {rowData.id}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium">Basic Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>ID:</strong> {rowData.id}</p>
                      <p><strong>Mission:</strong> {rowData.mission.toUpperCase()}</p>
                      <p><strong>Label:</strong> 
                        <Badge className={`ml-2 ${getPredictionColor(rowData.label)}`}>
                          {getPredictionEmoji(rowData.label)} {rowData.label.replace('_', ' ')}
                        </Badge>
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Orbital Parameters</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Period:</strong> {formatNumber(rowData.orbital_period_days, 2)} days</p>
                      <p><strong>Duration:</strong> {formatNumber(rowData.transit_duration_hours, 2)} hours</p>
                      <p><strong>Depth:</strong> {formatNumber(rowData.transit_depth_ppm, 0)} ppm</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium">Planetary Properties</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Radius:</strong> {formatNumber(rowData.planetary_radius_re, 2)} Earth radii</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Stellar Properties</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Temperature:</strong> {formatNumber(rowData.teff_k, 0)} K</p>
                      <p><strong>Radius:</strong> {formatNumber(rowData.rstar_rs, 2)} solar radii</p>
                      <p><strong>Surface Gravity:</strong> {formatNumber(rowData.logg, 2)} log g</p>
                      <p><strong>Metallicity:</strong> {formatNumber(rowData.feh, 2)} [Fe/H]</p>
                    </div>
                  </div>
                </div>
                
                {classificationResult && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-4">AI Classification Result</h4>
                    <ResultPanel result={classificationResult} />
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by ID..."
          value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("id")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
