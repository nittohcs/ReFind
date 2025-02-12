"use client";

import { FC, useMemo, useRef } from "react";
import { Box, Button, Card, CardContent, Toolbar, Typography } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import { QRCodeSVG } from "qrcode.react";
import { useReactToPrint } from "react-to-print";
import { Seat } from "@/API";
import DebouncedTextField from "@/components/DebouncedTextField";
import MiraCalSelectCheckboxCell from "@/components/MiraCalSelectCheckboxCell";
import MiraCalSelectCheckboxHeader from "@/components/MiraCalSelectCheckboxHeader";
import MiraCalTable from "@/components/MiraCalTable";
import { useTable, useTableOption } from "@/hooks/table";

const columnHelper = createColumnHelper<Seat>();

type SeatsTableProps = {
    seats: Seat[],
};

export const SeatsTable: FC<SeatsTableProps> = ({
    seats,
}) => {
    const columns = useMemo(() => [
        columnHelper.display({
            id: "select",
            header: MiraCalSelectCheckboxHeader,
            cell: MiraCalSelectCheckboxCell,
            maxSize: 20,
        }),
        columnHelper.accessor("name", {
            header: "座席",
        }),
    ], []);

    const options = useTableOption<Seat>({
        sorting: [{
            id: "name",
            desc: false,
        }],
    });

    const table = useTable({ data: seats, columns, options });

    const isSelected = table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();
    const selectedSeats = table.getSelectedRowModel().rows.map(x => x.original);

    const contentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({ contentRef });

    return (
        <>
            <Box display="flex">
                <Box flexGrow={1}>
                    <Box>
                        {isSelected ? (
                            <Toolbar disableGutters>
                                <Box display="flex" flexGrow={1} gap={1} mr={2} alignItems="center">
                                    <Box>{`${table.getSelectedRowModel().rows.length}件選択中`}</Box>
                                    <Button variant="outlined" onClick={() => table.resetRowSelection()}>選択解除</Button>
                                </Box>
                                <Button variant="outlined" onClick={() => handlePrint()}>印刷</Button>
                            </Toolbar>
                        ) : (
                            <Toolbar disableGutters>
                                <DebouncedTextField
                                    variant="filled"
                                    label="検索"
                                    size="small"
                                    //autoFocus
                                    value={table.getState().globalFilter}
                                    onChange={table.setGlobalFilter}
                                    fullWidth
                                />
                            </Toolbar>
                        )}
                    </Box>
                    <Box>
                        <MiraCalTable
                            table={table}
                        />
                    </Box>
                </Box>
            </Box>
            <Box ref={contentRef} sx={{ "@media print": { display: "flex" }, display: "none" }} flexDirection="row" flexWrap="wrap" gap={2} pt={2}>
                {selectedSeats.map(seat => (
                    <Card key={seat.id} sx={{ pageBreakInside: "avoid" }}>
                        <CardContent>
                            <Typography>{seat.name}</Typography>
                            <QRCodeSVG value={seat.id} size={128} />
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </>
    );
};
export default SeatsTable;
