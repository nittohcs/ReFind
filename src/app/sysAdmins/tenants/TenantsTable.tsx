"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box, IconButton, Toolbar, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import { createColumnHelper } from "@tanstack/react-table";
import { Tenant } from "@/API";
import DebouncedTextField from "@/components/DebouncedTextField";
import MiraCalTable from "@/components/MiraCalTable";
import { useTable, useTableOption } from "@/hooks/table";
import { useListAllTenants } from "@/services/graphql";

const columnHelper = createColumnHelper<Tenant>();

export default function TenantsTable() {
    const router = useRouter();

    const query = useListAllTenants();
    const data = useMemo(() => query.data ?? [], [query.data]);

    const columns = useMemo(() => [
        columnHelper.accessor("id", {
            id: "id",
            header: "ID",
        }),
        columnHelper.accessor("name", {
            header: "名前",
        }),
        columnHelper.accessor("isSuspended", {
            header: "利用停止中",
        }),
    ], []);

    const options = useTableOption<Tenant>({
        sorting: [{
            id: "name",
            desc: false,
        }],
    });

    const table = useTable({ data, columns, options });

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
                                    //autoFocus
                                    value={table.getState().globalFilter}
                                    onChange={table.setGlobalFilter}
                                    fullWidth
                                />
                                <Tooltip title="更新">
                                    <IconButton onClick={() => query.refetch()} disabled={query.isFetching}>
                                        <RefreshIcon />
                                    </IconButton>
                                </Tooltip>
                                <Link href="/sysAdmins/tenants/register">
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
                                table={table}
                                onRowClick={tenant => router.push(`/sysAdmins/tenants/${tenant.id}`)}
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
