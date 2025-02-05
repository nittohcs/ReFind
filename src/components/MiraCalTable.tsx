import { Box, Table, TableBody, TableCell, TableCellProps, TableFooter, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { Table as RTTable, SortDirection, flexRender } from "@tanstack/react-table";
import MiraCalTablePagination from "./MiraCalTablePagination";

type MiraCalTableProps<TData> = {
    table: RTTable<TData>,
    resource?: string,
    onRowClick?: (data: TData) => void,
};

export const MiraCalTable = <TData,> ({
    table,
    resource,
    onRowClick,
}: MiraCalTableProps<TData>) => {
    const rows = table.getRowModel().rows;
    const isRowClickable = table.getIsSomeRowsSelected() || !!onRowClick;
    return (
        <Table size="small">
            <TableHead sx={{
                position: "sticky",
                insetBlockStart: 0,
                bgcolor: "background.paper",
                zIndex: "fab",
            }}>
                {table.getHeaderGroups().map(headerGroup => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map(header => {
                            const cellProps: TableCellProps = {
                                padding: header.column.id === "select" ? "checkbox" : undefined,
                            };
                            const cellSx = {
                                width: header.column.getSize(),
                                whitespace: "nowrap",
                            };
                            if (header.column.getCanSort()) {
                                const isSorted = header.column.getIsSorted();
                                const direction = (isSorted ? isSorted : undefined) as SortDirection | undefined;
                                return (
                                    <TableCell key={header.id} sx={cellSx} {...cellProps}>
                                        {header.isPlaceholder ? null : (
                                            <TableSortLabel
                                                active={!!isSorted}
                                                direction={direction}
                                                sx={{ whitespace: "nowrap" }}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {isSorted && (
                                                    <Box component="span" hidden>
                                                        {isSorted === "desc" ? "sorted descending" : "sorted ascending"}
                                                    </Box>
                                                )}
                                            </TableSortLabel>
                                        )}
                                    </TableCell>
                                );
                            }
                            return (
                                <TableCell key={header.id} {...cellProps} sx={cellSx}>
                                    {header.isPlaceholder ? null : (
                                        flexRender(header.column.columnDef.header, header.getContext())
                                    )}
                                </TableCell>
                            );
                        })}
                    </TableRow>
                ))}
            </TableHead>
            <TableBody>
                {rows.length > 0 ? (
                    rows.map(row => (
                        <TableRow
                            key={row.id}
                            selected={row.getIsSelected()}
                            onClick={table.getIsSomeRowsSelected() ? row.getToggleSelectedHandler() : () => onRowClick && onRowClick(row.original)}
                            hover={isRowClickable}
                            sx={{ cursor: isRowClickable ? "pointer" : "default" }}
                        >
                            {row.getVisibleCells().map(cell => {
                                const isSelectCell = cell.column.id === "select";
                                const cellProps: TableCellProps = isSelectCell ? {
                                    padding: "checkbox",
                                } : {
                                    sx: {
                                        wordBreak: "keep-all",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    },
                                };
                                return (
                                    <TableCell key={cell.id} {...cellProps}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={table.getVisibleLeafColumns().length}>
                            <Box sx={{ p: 4, textAlign: "center", color: "text.disabled" }}>
                                {resource ? `${resource}がありません` : "データがありません"}
                            </Box>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
            <TableFooter
                sx={{
                    position: "sticky",
                    insetBlockEnd: 0,
                    bgcolor: "background.paper",
                }}
            >
                <TableRow>
                    <MiraCalTablePagination table={table} />
                </TableRow>
            </TableFooter>
        </Table>
    );
};
export default MiraCalTable;
