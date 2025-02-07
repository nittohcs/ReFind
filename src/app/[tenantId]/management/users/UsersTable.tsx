"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box, Button, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AddIcon from "@mui/icons-material/Add";
import LockResetIcon from "@mui/icons-material/LockReset";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { createColumnHelper } from "@tanstack/react-table";
import DebouncedTextField from "@/components/DebouncedTextField";
import MiraCalSelectCheckboxHeader from "@/components/MiraCalSelectCheckboxHeader";
import MiraCalSelectCheckboxCell from "@/components/MiraCalSelectCheckboxCell";
import MiraCalTable from "@/components/MiraCalTable";
import { useReFindUsers } from "@/hooks/ReFindUser";
import { useTable, useTableOption } from "@/hooks/table";
import { useDialogStateWithData, useEnqueueSnackbar, useMenu } from "@/hooks/ui";
import { ReFindUser } from "@/types/user";
import { useTenantId } from "../../hook";
import DeleteUserDialog from "./DeleteUserDialog";
import ReleaseSeatDialog from "./ReleaseSeatDialog";
import BulkEditUserDialog from "./BulkEditUserDialog";
import ResetPasswordDialog from "./ResetPasswordDialog";

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
        columnHelper.display({
            id: "select",
            header: MiraCalSelectCheckboxHeader,
            cell: MiraCalSelectCheckboxCell,
            maxSize: 20,
        }),
        columnHelper.accessor("id", {
            id: "id",
            header: "ID",
        }),
        columnHelper.accessor("name", {
            header: "氏名",
        }),
        columnHelper.accessor("email", {
            header: "メールアドレス",
        }),
        columnHelper.accessor("isAdminString", {
            header: "管理者",
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

    const isSelected = table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();
    const { menuProps, openHandler, withClose } = useMenu();

    const releaseSeatDialogState = useDialogStateWithData<ReFindUser[]>();
    const bulkEditDialogState = useDialogStateWithData<ReFindUser[]>();
    const deleteDialogState = useDialogStateWithData<ReFindUser[]>();
    const resetPasswordDialogState = useDialogStateWithData<ReFindUser[]>();
    const selectedUsers = table.getSelectedRowModel().rows.map(x => x.original);

    const enqueueSnackbar = useEnqueueSnackbar();

    return (
        <Box display="flex">
            <Box flexGrow={1}>
                <Box>
                    {isSelected ? (
                        <Toolbar disableGutters>
                            <Box display="flex" flexGrow={1} gap={1} mr={2} alignItems="center">
                                <Box>{`${table.getSelectedRowModel().rows.length}件選択中`}</Box>
                                <Button variant="outlined" onClick={() => table.resetRowSelection()}>選択解除</Button>
                            </Box>
                            <Button variant="outlined" onClick={openHandler}>操作</Button>
                            <Menu {...menuProps}>
                                <MenuItem onClick={
                                    withClose(() => {
                                        const data = selectedUsers.filter(x => x.seatId);
                                        if (data.length === 0) {
                                            enqueueSnackbar("座席を確保しているユーザーが選択されていません。", { variant: "warning" });
                                            return;
                                        }
                                        releaseSeatDialogState.open(selectedUsers);
                                    })}>
                                    <ListItemIcon>
                                        <RemoveCircleOutlineIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        座席強制解放
                                    </ListItemText>
                                </MenuItem>
                                <MenuItem onClick={withClose(() => bulkEditDialogState.open(selectedUsers))}>
                                    <ListItemIcon>
                                        <EditIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        一括編集
                                    </ListItemText>
                                </MenuItem>
                                <MenuItem onClick={withClose(() => resetPasswordDialogState.open(selectedUsers))}>
                                    <ListItemIcon>
                                        <LockResetIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        パスワードリセット
                                    </ListItemText>
                                </MenuItem>
                                <MenuItem onClick={withClose(() => deleteDialogState.open(selectedUsers))}>
                                    <ListItemIcon>
                                        <DeleteIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        削除
                                    </ListItemText>
                                </MenuItem>
                            </Menu>
                        </Toolbar>
                    ) : (
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
                            <Link href={`/${tenantId}/management/users/bulkImport`}>
                                <Tooltip title="一括取込">
                                    <IconButton>
                                        <GroupAddIcon />
                                    </IconButton>
                                </Tooltip>
                            </Link>
                            <Link href={`/${tenantId}/management/users/register`}>
                                <Tooltip title="登録">
                                    <IconButton>
                                        <AddIcon />
                                    </IconButton>
                                </Tooltip>
                            </Link>
                        </Toolbar>
                    )}
                </Box>
                <Box>
                    <MiraCalTable
                        table={table}
                        onRowClick={user => { router.push(`/${tenantId}/management/users/${user.id}`); }}
                    />
                </Box>
            </Box>
            <DeleteUserDialog {...deleteDialogState} resetRowSelection={() => table.resetRowSelection()} />
            <ReleaseSeatDialog {...releaseSeatDialogState} resetRowSelection={() => table.resetRowSelection()} />
            <BulkEditUserDialog {...bulkEditDialogState} resetRowSelection={() => table.resetRowSelection()} />
            <ResetPasswordDialog {...resetPasswordDialogState} resetRowSelection={() => table.resetRowSelection()} />
        </Box>
    );
};
