"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, IconButton, Popper, Toolbar, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import { useQueryClient } from "@tanstack/react-query";
import { useReactToPrint } from "react-to-print";
import { Seat, SeatOccupancy, User } from "@/API";
import MiraCalBreadcrumbs from "@/components/MiraCalBreadcrumbs";
import DebouncedTextField from "@/components/DebouncedTextField";
import { SeatBox } from "@/components/SeatBox";
import { useAuthState } from "@/hooks/auth";
import { useSeatOccupancy } from "@/hooks/seatOccupancy";
import { checkImageExists, useStorageFileURL } from "@/hooks/storage";
import { useContentsSize, useDialogStateWithData, useEnqueueSnackbar } from "@/hooks/ui";
import { graphqlGetFileDownloadUrl, useUsersByTenantId } from "@/services/graphql";
import { queryKeys } from "@/services/queryKeys";
import { useTenantId } from "../../hook";
import { ConfirmDialog, ConfirmDialogData } from "./ConfirmDialog";

export default function Page({ params }: { params: { floorId: string } }) {
    const tenantId = useTenantId();
    const floorId = decodeURIComponent(params.floorId);
    const authState = useAuthState();
    const qUsers = useUsersByTenantId(tenantId);
    const users = useMemo(() => qUsers.data ?? [], [qUsers.data]);
    const {isReady, myOccupancy, mySeat, myFloor, seatOccupancyMap, allFloors, allSeats} = useSeatOccupancy();
    const floor = useMemo(() => allFloors.find(x => x.id === floorId) ?? null, [allFloors, floorId]);
    const seats = useMemo(() => allSeats.filter(x => x.floorId === floorId), [allSeats, floorId]);

    const confirmDialogState = useDialogStateWithData<ConfirmDialogData>();

    const enqueueSnackbar = useEnqueueSnackbar();
    const handleSeatClick = useCallback((seat: Seat, occupancy: SeatOccupancy | null) => {
        // 管理者はダブルクリックで全座席解放

        // 既に座席が使用中
        if (occupancy && occupancy.userId) {
            if (occupancy === myOccupancy) {
                // 自分が使用中
                //enqueueSnackbar("選択した座席を使用中です。", { variant: "info" });
                return;
            } else {
                // 他人が使用中
                if (authState.groups?.admins) {
                    // confirmDialogState.open({
                    //     title: "座席強制解放",
                    //     message: `選択した座席は${occupancy.userName}が使用中です。座席を強制解放します。`,
                    //     newSeat: null,
                    //     oldSeat: seat,
                    //     userId: authState.username ?? "",
                    //     userName: authState.name ?? "",
                    // });
                } else {
                    enqueueSnackbar(`選択した座席は${occupancy.userName}が使用中です。`, { variant: "error" });
                }
                return;
            }
        }

        // 空席選択時
        if (mySeat) {
            // 別の座席へ移動する場合
            confirmDialogState.open({
                title: "座席変更",
                message: `フロア「${myFloor?.name}」の座席「${mySeat.name}」を解放し、フロア「${floor?.name}」の座席「${seat.name}」を確保します。`,
                newSeat: seat,
                oldSeat: mySeat,
                userId: authState.username ?? "",
                userName: authState.name ?? "",
            });
        } else {
            // 自席がない状態で確保する場合
            confirmDialogState.open({
                title: "座席確保",
                message: `フロア「${floor?.name}」の座席「${seat.name}」を確保します。`,
                newSeat: seat,
                oldSeat: null,
                userId: authState.username ?? "",
                userName: authState.name ?? "",
            });
        }
    }, [myOccupancy, mySeat, enqueueSnackbar, confirmDialogState, authState.username, authState.name, authState.groups?.admins, myFloor, floor?.name]);

    // ダブルクリック時のイベント実装する
    const handleSeatDoubleClick = useCallback((seat: Seat, occupancy: SeatOccupancy | null) => {

        // 既に座席が使用中
        if (occupancy && occupancy.userId) {
            if (occupancy === myOccupancy) {
                // 自分が使用中
                confirmDialogState.open({
                    title: "座席解放",
                    message: `現在の座席を解放します。`,
                    newSeat: null,
                    oldSeat: seat,
                    userId: authState.username ?? "",
                    userName: authState.name ?? "",
                });
                return;
            } else {
                // 他人が使用中
                if (authState.groups?.admins) {
                    // 管理者の場合
                    // フロアの座席を開放
                    if (authState.groups?.admins) {
                        confirmDialogState.open({
                            title: "座席強制解放",
                            message: `選択した座席は${occupancy.userName}が使用中です。座席を強制解放します。`,
                            newSeat: null,
                            oldSeat: seat,
                            userId: authState.username ?? "",
                            userName: authState.name ?? "",
                        });
                    } else {
                        // 一般ユーザーは何もしない
                    }
                } else {
                    // 一般ユーザーの場合
                    //enqueueSnackbar(`選択した座席は${occupancy.userName}が使用中です。`, { variant: "error" });
                }
                return;
            }
        }
    }, [myOccupancy, enqueueSnackbar, confirmDialogState, authState.username, authState.name, authState.groups?.admins]);


    const imageQuery = useStorageFileURL(floor?.imagePath ?? "");

    const router = useRouter();
    const searchParams = useSearchParams();
    const [filterString, setFilterString] = useState(() => searchParams.get("filter") || "");
    const handleChange = useCallback((s: string) => {
        const urlSearchParams = new URLSearchParams(searchParams);
        if (s) {
            urlSearchParams.set("filter", s);
        } else {
            urlSearchParams.delete("filter");
        }
        router.replace(`/${tenantId}/floors/${params.floorId}?${urlSearchParams.toString()}`);
        setFilterString(s);
    }, [searchParams, router, tenantId, params.floorId]);

    const { elementRef, contentsWidth, contentsHeight, updateContentsSize } = useContentsSize();

    const queryClient = useQueryClient();
    const [popperComment, setPopperComment] = useState("");
    const [popperImageUrl, setPopperImageUrl] = useState("");
    const [isExistPopperImage, setIsExitPopperImage] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [commentForegroundColor, setCommentForegroundColor] = useState("");
    const [commentBackgroundColor, setCommentBackgroundColor] = useState("");
    const [popperBorderColor, setPopperBorderColor] = useState("");

    const handleMouseEnter = useCallback(async (e: React.MouseEvent<HTMLElement>, user: User) => {
        setAnchorEl(e.currentTarget);
        setPopperComment(user.comment);
        setCommentForegroundColor(user.commentForegroundColor ?? "#000000ff");
        const backgroundColor = user.commentBackgroundColor ?? "#ffffffff";
        setCommentBackgroundColor(backgroundColor);
        const [r, g, b, a] = backgroundColor.substring(1).match(/.{2}/g)!.map(x => parseInt(x, 16));
        const r2 = r * 0.5;
        const g2 = g * 0.5;
        const b2 = b * 0.5;
        const toHex = (value: number) => Math.round(value).toString(16).padStart(2, "0");
        const borderColor = `#${toHex(r2)}${toHex(g2)}${toHex(b2)}${toHex(a)}`;
        setPopperBorderColor(borderColor);

        // ユーザー画像を取得
        const expiresIn = 900;
        const imagePath = `public/${tenantId}/users/${user.id}`;
        let imageUrl = queryClient.getQueryData<string>(queryKeys.storage(imagePath));
        if (imageUrl) {
            const state = queryClient.getQueryState<string>(queryKeys.storage(imagePath));
            if (!state || state.isInvalidated || Date.now() - state.dataUpdatedAt >= expiresIn * 1000) {
                imageUrl = "";
            }
        }
        if (!imageUrl) {
            imageUrl = await graphqlGetFileDownloadUrl(imagePath, expiresIn);
            if (!imageUrl) {
                throw new Error("ダウンロードURLの取得に失敗しました。");
            }
            queryClient.setQueryData<string>(queryKeys.storage(imagePath), _item => imageUrl);
        }
        setPopperImageUrl(imageUrl);
    }, [queryClient, tenantId]);
    const handleMouseLeave = useCallback((_e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(null);
        setPopperComment("");
        setPopperImageUrl("");
        setIsExitPopperImage(false);
    }, []);
    useEffect(() => {
        const checkImage = async () => {
            const isExist = await checkImageExists(popperImageUrl);
            setIsExitPopperImage(isExist);
        };
        checkImage();
    }, [popperImageUrl]);

    const contentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({ contentRef });

    return (
        <>
            <MiraCalBreadcrumbs>
                <Link href={`/${tenantId}`}>ホーム</Link>
                <Link href={`/${tenantId}/floors`}>座席</Link>
                <Typography>{floor?.name}</Typography>
            </MiraCalBreadcrumbs>
            {isReady && floor && imageQuery.isFetched && imageQuery.data && qUsers.isFetched && (
                <>
                    <Box pt={2} ref={elementRef}>
                        <Toolbar disableGutters>
                            <DebouncedTextField
                                variant="filled"
                                label="検索"
                                size="small"
                                // autoFocus
                                value={filterString}
                                onChange={handleChange}
                                fullWidth
                            />
                            {authState.groups?.admins && floor && (
                                <>
                                    <Tooltip title="印刷">
                                        <IconButton onClick={() => handlePrint()}>
                                            <PrintIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Link href={`/${tenantId}/floors/${floor.id}/edit`}>
                                        <Tooltip title="座席編集">
                                            <IconButton>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Link>
                                </>
                            )}
                        </Toolbar>
                    </Box>
                    <Box ref={contentRef} sx={{ position: "relative", "@media screen": { overflow: "auto", width: { xs: contentsWidth - 8, sm: contentsWidth - 16 }, height: contentsHeight } }}>
                        <Image
                            src={imageQuery.data}
                            alt="座席表"
                            width={floor.imageWidth}
                            height={floor.imageHeight}
                            onLoadingComplete={updateContentsSize}
                        />
                        {seats.map(seat => {
                            const occupancy = seatOccupancyMap.get(seat.id) ?? null;
                            const userId = occupancy?.userId ?? null;
                            let user = users.find(x => x.id === userId) ?? null;
                            let name = occupancy?.userName ?? null;
                            if (filterString && !name?.includes(filterString)) {
                                name = null;
                                user = null;
                            }
                            return (
                                <SeatBox
                                    key={seat.id}
                                    seat={seat}
                                    isChangeColor={!!name}
                                    onClick={() => handleSeatClick(seat, occupancy)}
                                    onDoubleClick={() => handleSeatDoubleClick(seat, occupancy)} // 実装中
                                    onMouseEnter={(e) => user && handleMouseEnter(e, user)}
                                    onMouseLeave={(e) => handleMouseLeave(e)}
                                >
                                    {name ?? seat.name}
                                </SeatBox>
                            );
                        })}
                        <ConfirmDialog {...confirmDialogState} />
                        <Popper open={!!anchorEl} anchorEl={anchorEl}>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: commentBackgroundColor,
                                color: commentForegroundColor,
                                padding: "5px",
                                border: `2px solid ${popperBorderColor}`,
                                borderRadius: "5px",
                            }}>
                                <Box>
                                    {popperImageUrl && isExistPopperImage ? (
                                        <Image src={popperImageUrl} alt="" width={48} height={48} />
                                    ) : (
                                        <Box width={48} height={48} />
                                    )}
                                </Box>
                                <Box>{popperComment}</Box>
                            </Box>
                        </Popper>
                    </Box>
                </>
            )}
        </>
    );
}