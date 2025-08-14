"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box, IconButton, Toolbar, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import DownloadIcon from "@mui/icons-material/Download";
import { createColumnHelper } from "@tanstack/react-table";
import Sortable from "sortablejs";
import { Floor } from "@/API";
import DebouncedTextField from "@/components/DebouncedTextField";
import MiraCalTable from "@/components/MiraCalTable";
import { useTable, useTableOption } from "@/hooks/table";
import { useUpdatedAt } from "@/hooks/ui";
import { graphqlUpdateFloor, useFloorsByTenantId } from "@/services/graphql";
import { useTenantId } from "../../hook";
import { enqueueSnackbar } from "notistack";
import { downloadCSV } from "@/services/util";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/services/queryKeys";
import { useAuthState } from "@/hooks/auth";

function ToTableData(floors: Floor[]) {
    return floors.map((floor, index) => ({ ...floor, sortId: index }));
}

const columnHelper = createColumnHelper<Floor>();

export default function FloorsTable() {
    const tenantId = useTenantId();
    const router = useRouter();
    const authState = useAuthState();

    const query = useFloorsByTenantId(tenantId);
    const [data, setData] = useState(() => ToTableData(query.data ?? []));
    useEffect(() => {
        setData((query.data ?? []).map((floor, _index) => ({ ...floor})));
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

    // 画面の一覧の表示順
    const options = useTableOption<Floor>({
        sorting: [{
            id: "sortId",
            desc: false,
        }],
        pagination: {
            pageIndex: 0,
            pageSize: 200,
        },
        // ページによって表示件数の一覧を変えたかったが未実装
        rowsPerPage: [25,50,100,200],
    });

    const table = useTable({ data, columns, options });

    const handleDownload = useCallback(() => {
        if (data.length === 0) {
            return;
        }
        downloadCSV(data, "Floor.csv");
    }, [data]);

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
            sorted[i].sortId = i+1;
        }
        setData(() => sorted);
        table.setSorting(_x => [{
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
    
    const queryClient = useQueryClient();
    const saveSorting = useCallback(async () => {
        const rows = table.getSortedRowModel().rows;
        const updatedRows = rows.map((row, i) => ({
            ...row.original,
            sortId: i + 1,
        }));
        
        for (const floor of updatedRows) {
            await graphqlUpdateFloor({
                id: floor.id,
                sortId: floor.sortId,
            });
        }
        
        // 一時的にキャッシュを更新（表示の即時反映）
        queryClient.setQueryData<Floor[]>(queryKeys.graphqlFloorsByTenantId(tenantId), () => updatedRows);
        setData(updatedRows);
        
        // サーバーから最新データを取得してキャッシュを正しく更新
        query.refetch();
        
        enqueueSnackbar("ソート順を更新しました。", { variant: "success" });
    }, [table, queryClient, tenantId, query]);
        
    // 検索欄に文字が入力された場合、ソート順の保存が出来ないようにする。    
    const [registSortFlg, changeDisable]  = useState(false);
    const onChangeDisable = function(value: string) : void {    
        if (value.length === 0) {
            // 検索バーが空の場合、ソート順の保存処理が可能
            changeDisable(false);
        }
        else{
            // 検索バーが入力されている場合、ソート順の保存処理が不可能
            changeDisable(true);
        }
        table.setGlobalFilter(value);
    }

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
                                    onChange={e => onChangeDisable(e.toString())}
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
                                        <IconButton id = "btnRegistSort" onClick={saveSorting} disabled = {registSortFlg}>
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
                                {authState.groups?.sysAdmins && (
                                    <Tooltip title="CSVダウンロード">
                                        <IconButton onClick={handleDownload}>
                                            <DownloadIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
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
