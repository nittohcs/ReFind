"use client";

import { FC, PropsWithChildren, useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Box, ButtonBase, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import HomeIcon from "@mui/icons-material/Home"
import BusinessIcon from "@mui/icons-material/Business";
import UserMenu from "@/components/UserMenu";
import { useAuthState } from "@/hooks/auth";
import { SideBarOpenContext } from "@/hooks/sideBar";
import { useEnvName } from "@/hooks/ui";

// 次のページを参考にして作成した
// https://mui.com/material-ui/react-drawer/#persistent-drawer

const drawerWidth = 200;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        //duration: theme.transitions.duration.leavingScreen,
        duration: 0,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            //duration: theme.transitions.duration.enteringScreen,
            duration: 0,
        }),
        marginLeft: 0,
    }),
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        //duration: theme.transitions.duration.leavingScreen,
        duration: 0,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            //duration: theme.transitions.duration.enteringScreen,
            duration: 0,
        }),
    }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
}));

type LinkItemProps = {
    href: string,
    text: string,
    icon: React.ReactNode
};
const LinkItem: FC<LinkItemProps> = ({ href, text, icon }) => {
    return (
        <Link href={href}>
            <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        {icon}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                </ListItemButton>
            </ListItem>
        </Link>
    );
};

export const SysAdminsMainUI: FC<PropsWithChildren> = ({
    children,
}) => {
    const isWideEnough = useMediaQuery("(min-width:1000px)", { noSsr: true });
    const authState = useAuthState();
    const [open, setOpen] = useState(isWideEnough);
    const handleDrawerOpen = useCallback(() => {
        setOpen(true);
    }, [setOpen]);
    const handleDrawerClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);
    const env = useEnvName();

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar position="fixed" open={open}>
                <Toolbar variant="dense">
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 2,
                            ...(open && { display: "none" }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box flexGrow={1}>
                        <Link href="/sysAdmins">
                            <ButtonBase sx={{ py: 2, px: 1 }}>
                                <Image width={99} height={29} alt="ReFind" src={`/img/ReFind_logo-${env}.png`} priority />
                            </ButtonBase>
                        </Link>
                    </Box>
                    <UserMenu />
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
                transitionDuration={0}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <LinkItem
                        href="/sysAdmins"
                        text="ホーム"
                        icon={<HomeIcon />}
                    />
                    <LinkItem
                        href="/sysAdmins/tenants"
                        text="テナント"
                        icon={<BusinessIcon />}
                    />
                </List>
            </Drawer>
            <Main open={open} sx={{ p: { xs: 1, sm: 2 }, pb: { xs: 0, sm: 0 } }}>
                <DrawerHeader />
                <SideBarOpenContext.Provider value={open}>
                    {children}
                </SideBarOpenContext.Provider>
            </Main>
        </Box>
    );
};
export default SysAdminsMainUI;
