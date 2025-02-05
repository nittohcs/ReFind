"use client";

import { createTheme, useMediaQuery, CssBaseline, ThemeProvider, GlobalStyles } from "@mui/material";
import { FC, PropsWithChildren } from "react";

export const MiraCalThemeProvider: FC<PropsWithChildren> = ({ children }) => {
    const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const theme = createTheme({
        palette: {
            //mode: isDarkMode ? "dark" : "light",
            mode: isDarkMode ? "light" : "light",
            background: {},
        },
        components: {
            MuiCard: {
                defaultProps: {
                    variant: 'outlined'
                }
            },
            MuiAppBar: {
                defaultProps: {
                    elevation: 0,
                    color: 'inherit',
                }
            },
            MuiToolbar: {
                defaultProps: {
                    variant: 'dense'
                }
            },
            // MuiAutocomplete: {
            //     defaultProps: {
            //         noOptionsText: <>{t('noOptions')}</>
            //     }
            // },
            MuiButton: {
                defaultProps: {
                    disableElevation: true
                }
            }
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyles styles={{
                a: {
                    textDecoration: "none",
                    color: "inherit",
                },
            }} />
            {children}
        </ThemeProvider>
    );
};
export default MiraCalThemeProvider;
