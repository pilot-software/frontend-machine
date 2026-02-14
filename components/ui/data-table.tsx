"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader } from "@/components/ui/loader";

interface Column<T> {
  key: string;
  header: string | React.ReactNode;
  render: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  mobileCard?: (item: T) => React.ReactNode;
  getItemKey: (item: T) => string;
  itemName?: string;
}

export function DataTable<T>({
  data,
  columns,
  loading = false,
  emptyMessage = "No data found",
  mobileCard,
  getItemKey,
  itemName = "items"
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      {/* Mobile: 2-column grid */}
      {mobileCard && (
        <div className="lg:hidden">
          <div className="grid grid-cols-2 gap-3">
            {loading ? (
              <Card className="col-span-2">
                <CardContent className="p-6 text-center">
                  <Loader text="Loading..." />
                </CardContent>
              </Card>
            ) : paginatedData.length === 0 ? (
              <Card className="col-span-2">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground">{emptyMessage}</p>
                </CardContent>
              </Card>
            ) : (
              paginatedData.map((item) => (
                <div key={getItemKey(item)}>{mobileCard(item)}</div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Desktop: Table view */}
      <Card className="hidden lg:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.key} className={column.className}>
                      {column.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-8">
                      <Loader text="Loading..." />
                    </TableCell>
                  </TableRow>
                ) : paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-8">
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item) => (
                    <TableRow key={getItemKey(item)} className="hover:bg-muted/50">
                      {columns.map((column) => (
                        <TableCell key={column.key} className={column.className}>
                          {column.render(item)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {data.length > 0 && (
        <Card>
          <CardContent className="p-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{(currentPage - 1) * pageSize + 1}</span> to{" "}
                <span className="font-medium text-foreground">{Math.min(currentPage * pageSize, data.length)}</span> of{" "}
                <span className="font-medium text-foreground">{data.length}</span> {itemName}
              </div>
              <div className="flex items-center gap-2">
                <Select value={`${pageSize}`} onValueChange={(value) => { setPageSize(Number(value)); setCurrentPage(1); }}>
                  <SelectTrigger className="h-8 w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 25, 50, 100].map((size) => (
                      <SelectItem key={size} value={`${size}`}>{size} rows</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>First</Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Previous</Button>
                <div className="flex items-center gap-1 px-3 py-1 bg-muted rounded-md text-sm font-medium">
                  <span>{currentPage}</span>
                  <span className="text-muted-foreground">/</span>
                  <span>{totalPages}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Next</Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>Last</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
