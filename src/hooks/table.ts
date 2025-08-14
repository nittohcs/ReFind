"use client";

import { useState } from "react";
import { rankItem } from "@tanstack/match-sorter-utils";
import { ColumnDef, ColumnFiltersState, FilterFn, PaginationState, RowSelectionState, SortingState, TableOptions, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

// 部分一致
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _fuzzyFilter = <TData>(): FilterFn<TData> => (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({ itemRank });
    return itemRank.passed;
};

// 前方一致
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const startsWith = <TData>(): FilterFn<TData> =>  (row, columnId, filterValue, _addMeta) => {
    const value = row.getValue(columnId) as string;
    return value.startsWith(filterValue);
};

// 前方・後方一致
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const includesText = <TData>(): FilterFn<TData> => (row, columnId, filterValue, _addMeta) => {
    const value = row.getValue(columnId) as string;
    return value?.toLowerCase().includes(filterValue.toLowerCase());
};

// 前方・後方一致(AND複数条件)
export const multiKeywordIncludesAllColumns = <TData>(): FilterFn<TData> => (row, _columnId, filterValue) => {
    const keywords = filterValue.toLowerCase().split(/\s+/);
  
    return keywords.every((keyword: string) =>
      row.getAllCells().some(cell => {
        const value = cell.getValue() as string;
        return value?.toLowerCase().includes(keyword);
      })
    );
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
        globalFilterFn: includesText(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return table;
}
