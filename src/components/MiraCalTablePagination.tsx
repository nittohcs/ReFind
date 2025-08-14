import { TablePagination, TablePaginationProps } from "@mui/material";
import { Table as RTTable } from "@tanstack/react-table";

type MiraCalTablePaginationProps<TData> = {
    table: RTTable<TData>,
} & Omit<TablePaginationProps, "count" | "page" | "onPageChange" | "rowsPerPage">;

export const MiraCalTablePagination = <TData,> ({
    table,
    ...props
}: MiraCalTablePaginationProps<TData>) => {
    return (
        <TablePagination
            sx={{
                ".MuiTablePagination-spacer": {
                    flex: "none",
                },
            }}
            colSpan={table.getVisibleFlatColumns().length}
            labelRowsPerPage="ページあたりの件数"
            labelDisplayedRows={({ count, from, to }) => `${count}件中の${from}件目から${to}件目`}
            count={table.getPrePaginationRowModel().rows.length}
            page={table.getState().pagination.pageIndex}
            onPageChange={(_event, page) => table.setPageIndex(page)}
            rowsPerPage={table.getState().pagination.pageSize}
            onRowsPerPageChange={(event) => table.setPageSize(+event.target.value)}
            rowsPerPageOptions={[25, 50, 100, 200]}
            {...props}
        />
    );
};
export default MiraCalTablePagination;
