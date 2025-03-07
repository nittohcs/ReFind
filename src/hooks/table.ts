"use client";

import { useState } from "react";
import { rankItem } from "@tanstack/match-sorter-utils";
import { ColumnDef, ColumnFiltersState, FilterFn, PaginationState, RowSelectionState, SortingState, TableOptions, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({ itemRank });
    return itemRank.passed;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const startsWith: FilterFn<any> = (row, columnId, filterValue, _addMeta) => {
    const value = row.getValue(columnId) as string;
    return value.startsWith(filterValue);
};

export type UseTableOptions = {
    columnFilters?: ColumnFiltersState | (() => ColumnFiltersState),
    globalFilter?: string | (() => string),
    sorting?: SortingState | (() => SortingState),
    rowSelection?: RowSelectionState | (() => RowSelectionState),
    pagination?: PaginationState | (() => PaginationState),
    rowsPerPage?: number[] | (() => number[]),
};

export function useTableOption<TData,>(options?: UseTableOptions) {
    const {
        columnFilters: defaultColumnFilters = [],
        globalFilter: defaultGlobalFilter = "",
        sorting: defaultSorting = [],
        rowSelection: defaultRowSelection = {},
        pagination: defaultPagination = {pageIndex: 0,pageSize: 25,},
        rowsPerPage: defaultPerPageOptions = {rowsPerPageOptions: [25,50,100,200]},
    } = options || {};

    const [pagination, setPaginations] = useState<PaginationState>(defaultPagination);
    const [columnFilters, setColumnFilters] = useState(defaultColumnFilters);
    const [globalFilter, setGlobalFilter] = useState(defaultGlobalFilter);
    const [sorting, setSorting] = useState(defaultSorting);
    const [rowSelection, setRowSelection] = useState(defaultRowSelection);
    const [rowsPerPage, setRowsPerPageOptions] = useState(defaultPerPageOptions);

    return {
        state: {
            pagination,
            columnFilters,
            globalFilter,
            sorting,
            rowSelection,
            rowsPerPage,
        },
        onPaginationChange: setPaginations,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        onRowsPerPageChange: setRowsPerPageOptions,
    } as Partial<TableOptions<TData>>;
}

export function useTable<TData,>({
    data,
    columns,
    options,
}: {
    data: TData[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: ColumnDef<TData, any>[],
    options: Partial<TableOptions<TData>>,
}) {
    const table = useReactTable<TData>({
        data,
        columns,
        ...options,
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return table;
}
