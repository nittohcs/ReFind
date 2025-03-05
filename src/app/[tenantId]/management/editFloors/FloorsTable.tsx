"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box, IconButton, Toolbar, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { createColumnHelper } from "@tanstack/react-table";
import Sortable from "sortablejs";
import { Floor } from "@/API";
import DebouncedTextField from "@/components/DebouncedTextField";
import MiraCalTable from "@/components/MiraCalTable";
import { useTable, useTableOption } from "@/hooks/table";
import { useUpdatedAt } from "@/hooks/ui";
import { useFloorsByTenantId } from "@/services/graphql";
import { useTenantId } from "../../hook";

type TableRow = Floor & {
    // Floorにソート用の項目が無いので、ここで追加
    tmpSortValue: number,
};

function ToTableData(floors: Floor[]) {
    return floors.map((floor, index) => ({ ...floor, tmpSortValue: index }));
}

const columnHelper = createColumnHelper<TableRow>();

export default function FloorsTable() {
    const tenantId = useTenantId();
    const router = useRouter();

    const query = useFloorsByTenantId(tenantId);
    const [data, setData] = useState(() => ToTableData(query.data ?? []));
    useEffect(() => {
        setData((query.data ?? []).map((floor, index) => ({ ...floor, tmpSortValue: index })));
    }, [query.data]);

    const columns = useMemo(() => [
        columnHelper.accessor("id", {
            id: "id",
            header: "ID",
        }),
        columnHelper.accessor("name", {
            header: "名前",
        }),
        columnHelper.accessor("sortId", {
            header: "ソート順",
        })
    ], []);

    const options = useTableOption<TableRow>({
        sorting: [{//id: "tmpSortValue",
            id: "sortId",
            desc: false,
        }],
    });

    const table = useTable({ data, columns, options });

    const [updatedAt, update] = useUpdatedAt("table");
    const tableRef = useRef<HTMLTableSectionElement>(null);
    const sortableRef = useRef<Sortable | null>(null);
    const handleSortEnd = useCallback(({ oldIndex, newIndex }: Sortable.SortableEvent) => {
        if (oldIndex === undefined || newIndex === undefined) {
            return;
        }

        // データをソート
        const sorted = table.getSortedRowModel().rows.map(x => x.original);
        sorted.splice(newIndex, 0, sorted.splice(oldIndex, 1)[0]);
        // ソート用項目の値を更新
        const n = sorted.length;
        for(let i = 0; i < n; ++i) {
            sorted[i].tmpSortValue = i;
        }
        setData(() => sorted);
        table.setSorting(x => [{
            id: "sortId",
            desc: false,
        }]);
        // ソート後のデータでテーブルを再表示する
        update();

        // dataの更新でhandleSortEndも更新されて欲しいが、中で使ってないとlintが怒るので
        console.log(data.length);
    }, [data, table, update]);
    useEffect(() => {
        if (tableRef.current) {
            if (sortableRef.current) {
                sortableRef.current.destroy();
                sortableRef.current = null;
            }

            sortableRef.current = Sortable.create(tableRef.current, {
                animation: 150,
                onEnd: handleSortEnd,
            })
        }

        return () => {
            if (sortableRef.current) {
                sortableRef.current.destroy();
                sortableRef.current = null;
            }
        };
    }, [handleSortEnd]);
    const saveSorting = useCallback(async () => {
        // 見えている順序でソート値を更新
        const rows = table.getSortedRowModel().rows;
        const n = rows.length;
        for(let i = 0; i < n; ++i) {
            // TODO Floorを保存する
            // const floor = rows[i].original;
            // await graphqlUpdateFloor({
            //     id: floor.id,
            //     sortValue: i,
            // });
        }
    }, [table]);

    return (
        <>
            {query.isFetched ? (
                <Box display="flex">
                    <Box flexGrow={1}>
                        <Box>
                            <Toolbar disableGutters>
                                <DebouncedTextField
                                    variant="filled"
                                    label="検索"
                                    size="small"
                                    // autoFocus
                                    value={table.getState().globalFilter}
                                    onChange={table.setGlobalFilter}
                                    fullWidth
                                />
                                <Tooltip title="更新">
                                    <span>
                                        <IconButton onClick={() => query.refetch()} disabled={query.isFetching}>
                                            <RefreshIcon />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                                <Tooltip title="ソート順保存">
                                    <span>
                                        <IconButton onClick={saveSorting}>
                                            <AssignmentTurnedInIcon />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                                <Link href={`/${tenantId}/management/editFloors/register`}>
                                    <Tooltip title="登録">
                                        <IconButton>
                                            <AddIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Link>
                            </Toolbar>
                        </Box>
                        <Box>
                            <MiraCalTable
                                key={updatedAt}
                                tableRef={tableRef}
                                table={table}
                                onRowClick={floor => { router.push(`/${tenantId}/management/editFloors/${floor.id}`); }}
                                sx={{ userSelect: "none" }}
                            />
                        </Box>
                    </Box>
                </Box>
            ) : (
                <></>
            )}
        </>
    );
}
