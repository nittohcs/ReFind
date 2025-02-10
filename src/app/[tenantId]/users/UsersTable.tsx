"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Box, Toolbar } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import DebouncedTextField from "@/components/DebouncedTextField";
import MiraCalTable from "@/components/MiraCalTable";
import { useReFindUsers } from "@/hooks/ReFindUser";
import { useTable, useTableOption } from "@/hooks/table";
import { ReFindUser } from "@/types/user";
import { useTenantId } from "../hook";

type TableRow = ReFindUser & {
    isAdminString: string,
};

function ToTableRow(user: ReFindUser): TableRow {
    return {
        ...user,
        isAdminString: user.isAdmin ? "管理者" : "",
    };
}

const columnHelper = createColumnHelper<TableRow>();

export default function UsersTable() {
    const tenantId = useTenantId();
    const router = useRouter();

    const query = useReFindUsers();
    const data = useMemo(() => (query.data ?? []).map(x => ToTableRow(x)), [query.data]);

    const columns = useMemo(() => [
        columnHelper.accessor("id", {
            id: "id",
            header: "ID",
        }),
        columnHelper.accessor("name", {
            header: "氏名",
        }),
        columnHelper.accessor("floorName", {
            header: "フロア",
        }),
        columnHelper.accessor("seatName", {
            header: "座席",
        }),
    ], []);

    const options = useTableOption<TableRow>({
        sorting: [{
            id: "id",
            desc: false,
        }],
    });

    const table = useTable({ data, columns, options });

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
                    </Toolbar>
                </Box>
                <Box>
                    <MiraCalTable
                        table={table}
                        onRowClick={user => user.floorId && router.push(`/${tenantId}/floors/${user.floorId}?filter=${user.name}`)}
                    />
                </Box>
            </Box>
        </Box>
    );
}
