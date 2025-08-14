"use client";

import { useCallback, useMemo } from "react";
import { Box, IconButton, Toolbar, Tooltip } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { createColumnHelper } from "@tanstack/react-table";
import { Floor, Seat, SeatOccupancy } from "@/API";
import MiraCalTable from "@/components/MiraCalTable";
import DebouncedTextField from "@/components/DebouncedTextField";
import { useSeatOccupancy } from "@/hooks/seatOccupancy";
import { useTable, useTableOption } from "@/hooks/table";
import { useSeatOccupanciesByTenantId } from "@/services/graphql";
import { downloadCSV } from "@/services/util";
import { useTenantId } from "../../hook";

type TableRow = {
    seatName: string,
    floorName: string,
    userId: string,
    userName: string,
    date: string,
};

function ToTableRow(record: SeatOccupancy, allSeats: Seat[], allFloors: Floor[]): TableRow {
    const seat = allSeats.find(x => x.id === record.seatId);
    const seatName = seat?.name ?? "";
    const floor = allFloors.find(x => x.id === seat?.floorId);
    const floorName = floor?.name ?? "";
    const utcDate = new Date(record.createdAt);
    const date = utcDate.toLocaleString();
    return {
        seatName,
        floorName,
        userId: record.userId ?? "",
        userName: record.userName ?? "",
        date,
    };
}

const columnHelper = createColumnHelper<TableRow>();

export default function SeatOccupanciesTable() {
    const tenantId = useTenantId();
    const { isReady, allSeats, allFloors } = useSeatOccupancy();
    const qSeatOccupancies = useSeatOccupanciesByTenantId(tenantId);
    const data = useMemo(() => {
        const records = (qSeatOccupancies.data ?? [])
                            .map(x => ToTableRow(x, allSeats, allFloors))
                            .filter(x => x.seatName && x.floorName)
                        ;
        records.sort((a, b) => {
            if (a.seatName !== b.seatName) {
                return a.seatName.localeCompare(b.seatName);
            }
            return (new Date(a.date)).getTime() - (new Date(b.date)).getTime();
        });
        return records;
    }, [qSeatOccupancies.data, allSeats, allFloors]);

    const columns = useMemo(() => [
        columnHelper.accessor("seatName", {
            header: "座席名",
        }),
        columnHelper.accessor("floorName", {
            header: "フロア名",
        }),
        columnHelper.accessor("userId", {
            header: "ユーザーID",
        }),
        columnHelper.accessor("userName", {
            header: "ユーザー名",
        }),
        columnHelper.accessor("date", {
            header: "日時",
        }),
    ], [])

    const options = useTableOption<TableRow>({
        sorting: [
            {
                id: "seatName",
                desc: false,
            },
            {
                id: "date",
                desc: false,
            },
        ],
    });

    const table = useTable({ data, columns, options });

    const handleDownload = useCallback(() => {
        if (data.length === 0) {
            return;
        }
        downloadCSV(data, "座席確保履歴一覧.csv");
    }, [data]);

    if (!isReady) {
        return null;
    }

    return (
        <Box display="flex">
            <Box flexGrow={1}>
                <Box>
                    <Toolbar disableGutters>
                        <DebouncedTextField
                            variant="filled"
                            label="検索"
                            size="small"
                            value={table.getState().globalFilter}
                            onChange={table.setGlobalFilter}
                            fullWidth
                        />
                        <Tooltip title="CSVダウンロード">
                            <IconButton onClick={handleDownload}>
                                <DownloadIcon />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </Box>
                <Box>
                    <MiraCalTable
                        table={table}
                    />
                </Box>
            </Box>
        </Box>
    );
}
