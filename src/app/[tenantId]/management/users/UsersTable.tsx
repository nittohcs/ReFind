"use client";

import { useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box, Button, Card, CardContent, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AddIcon from "@mui/icons-material/Add";
import LockResetIcon from "@mui/icons-material/LockReset";
import DownloadIcon from "@mui/icons-material/Download";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { createColumnHelper } from "@tanstack/react-table";
import DebouncedTextField from "@/components/DebouncedTextField";
import MiraCalSelectCheckboxHeader from "@/components/MiraCalSelectCheckboxHeader";
import MiraCalSelectCheckboxCell from "@/components/MiraCalSelectCheckboxCell";
import MiraCalTable from "@/components/MiraCalTable";
import { useReFindUsers } from "@/hooks/ReFindUser";
import { useTable, useTableOption } from "@/hooks/table";
import { useDialogStateWithData, useEnqueueSnackbar, useMenu } from "@/hooks/ui";
import { useGetTenant } from "@/services/graphql";
import { ReFindUser } from "@/types/user";
import { useTenantId } from "../../hook";
import DeleteUserDialog from "./DeleteUserDialog";
import ReleaseSeatDialog from "./ReleaseSeatDialog";
import BulkEditUserDialog from "./BulkEditUserDialog";
import ResetPasswordDialog from "./ResetPasswordDialog";
import { QRCodeSVG } from "qrcode.react";
import { useReactToPrint } from "react-to-print";
import { downloadCSV } from "@/services/util";

type TableRow = ReFindUser & {
    isAdminString: string,
};

function ToTableRow(user: ReFindUser, fields: string[]): TableRow {
    // return {
    //     ...user,
    //     isAdminString: user.isAdmin ? "管理者" : "",
    // };
    const row: TableRow = {} as TableRow;
    if (fields.includes("ユーザーID")) row.id = user.id;
    if (fields.includes("name")) row.name = user.name;
    if (fields.includes("email")) row.email = user.email;
    if (fields.includes("isAdmin")) row.isAdmin = user.isAdmin;
    if (fields.includes("isAdminString")) row.isAdminString = user.isAdmin ? "管理者" : "";
    
    return row;    
}

const columnHelper = createColumnHelper<TableRow>();

export default function UsersTable() {
    const tenantId = useTenantId();
    const router = useRouter();
    const qTenant = useGetTenant(tenantId);
    const qUsers = useReFindUsers();
    
    const selectedFields = useMemo(() => ["ユーザーID", "name", "isAdminString"], []);
    const data = useMemo(() => (qUsers.data ?? []).map(x => ToTableRow(x, selectedFields)), [qUsers.data, selectedFields]);
    
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
        // メールアドレスを使用していないため非表示
        // columnHelper.accessor("email", {
        //     header: "メールアドレス",
        // }),
        columnHelper.accessor("isAdminString", {
            header: "管理者",
        }),
        columnHelper.accessor("floorName", {
            header: "フロア",
        }),
        columnHelper.accessor("seatName", {
            header: "座席",
        }),
        columnHelper.accessor("comment", {
            header: "コメント",
        }),
    ], []);

    const options = useTableOption<TableRow>({
        sorting: [{
            id: "id",
            desc: false,
        }],
    });

    const table = useTable({ data, columns, options });

    // CSV出力 ヘッダー部を日本語変換
    const headerMap: Record<string, string> = {
        id: "ユーザーID",
        name: "名前",
        email: "メールアドレス",
        isAdmin: "管理者フラグ",
        isAdminString: "権限"
    };    
    const convertToJapaneseHeaders = (data: TableRow[]) => {
        return data.map(row => {
            const newRow: Record<string, any> = {};
            (Object.keys(row) as (keyof TableRow)[]).forEach(key => {
                const header = headerMap[key];
                if (header) {
                    newRow[header] = row[key];
                }
            });
            return newRow;
        });
    };

    const handleDownload = useCallback(() => {
        if (data.length === 0) {
            return;
        }
        
        const convertedData = convertToJapaneseHeaders(data);
        downloadCSV(convertedData, "ユーザ一覧.csv");
    }, [data]);

    const isSelected = table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();
    const { menuProps, openHandler, withClose } = useMenu();

    const releaseSeatDialogState = useDialogStateWithData<ReFindUser[]>();
    const bulkEditDialogState = useDialogStateWithData<ReFindUser[]>();
    const deleteDialogState = useDialogStateWithData<ReFindUser[]>();
    const resetPasswordDialogState = useDialogStateWithData<ReFindUser[]>();
    const selectedUsers = table.getSelectedRowModel().rows.map(x => x.original);

    const enqueueSnackbar = useEnqueueSnackbar();

    const contentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({ contentRef });

    const checkUserCount = useCallback((e: React.MouseEvent) => {
        const maxUserCount = qTenant.data?.maxUserCount ?? 0;
        const currentUserCount = qUsers.data.length;
        if (currentUserCount >= maxUserCount) {
            e.preventDefault();
            enqueueSnackbar("ユーザーが最大数まで作成されています。", { variant: "error" });
        }
    }, [qTenant.data, qUsers.data, enqueueSnackbar]);

    if (!qTenant.isFetched || !qUsers.isFetched) {
        return null;
    }

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
                            <Button variant="outlined" onClick={() => handlePrint()} 
                                sx={{ whiteSpace: 'nowrap', width: '65px', height: '36px', fontSize: '14px'}}>
                                    QR印刷
                            </Button>
                            <Button variant="outlined" onClick={openHandler} >操作</Button>
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
                                        一括設定
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
                                    <IconButton onClick={() => qUsers.refetch()} disabled={qUsers.isFetching}>
                                        <RefreshIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                            <Link href={`/${tenantId}/management/users/bulkImport`}>
                                <Tooltip title="一括取込">
                                    <IconButton onClick={checkUserCount}>
                                        <GroupAddIcon />
                                    </IconButton>
                                </Tooltip>
                            </Link>
                            <Link href={`/${tenantId}/management/users/register`}>
                                <Tooltip title="登録">
                                    <IconButton onClick={checkUserCount}>
                                        <AddIcon />
                                    </IconButton>
                                </Tooltip>
                            </Link>
                            <Tooltip title="CSVダウンロード">
                                    <IconButton onClick={handleDownload}>
                                        <DownloadIcon />
                                    </IconButton>
                                </Tooltip>
                        </Toolbar>
                    )}
                </Box>
                <Box>
                    <MiraCalTable
                        table={table}
                        onRowClick={user => { router.push(`/${tenantId}/management/users/${user.id}`); }}
                    />
                </Box>                
                <Box ref={contentRef} sx={{ "@media print": { display: "flex" }, display: "none" }} flexDirection="row" flexWrap="wrap" gap={2} pt={2}>
                    {selectedUsers.map(user => (
                        <Card key={user.id} sx={{ pageBreakInside: "avoid" }}>
                            <CardContent>
                                <Typography>{user.name}</Typography>
                                <QRCodeSVG value={user.id} size={128} />
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box>
            <DeleteUserDialog {...deleteDialogState} resetRowSelection={() => table.resetRowSelection()} />
            <ReleaseSeatDialog {...releaseSeatDialogState} resetRowSelection={() => table.resetRowSelection()} />
            <BulkEditUserDialog {...bulkEditDialogState} resetRowSelection={() => table.resetRowSelection()} />
            <ResetPasswordDialog {...resetPasswordDialogState} resetRowSelection={() => table.resetRowSelection()} />
        </Box>
    );
};
