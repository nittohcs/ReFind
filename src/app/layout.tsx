import "@/components/ConfigureAmplifyClientSide";
import "@/components/ConfigureYup";
import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import MiraCalThemeProvider from "@/components/MiraCalThemeProvider";
import AuthenticatorProvider from "@/components/AuthenticatorProvider";
import AuthProvider from "@/components/AuthProvider";
import APIClientProvider from "@/components/APIClientProvider";
import MiraCalQueryClientProvider from "@/components/MiraCalQueryClientProvider";
import MiraCalSnackbarProvider from "@/components/MiraCalSnackbarProvider";
import MiraCalFavicon from "@/components/MiraCalFavicon";

export const metadata: Metadata = {
  title: "ReFind",
  description: "座席確認システム",
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang="ja">
      <head>
        <MiraCalFavicon />
      </head>
      <body>
        <AppRouterCacheProvider>
          <MiraCalThemeProvider>
            <MiraCalSnackbarProvider>
              <AuthenticatorProvider>
                <AuthProvider>
                  <APIClientProvider>
                    <MiraCalQueryClientProvider>
                      {children}
                    </MiraCalQueryClientProvider>
                  </APIClientProvider>
                </AuthProvider>
              </AuthenticatorProvider>
            </MiraCalSnackbarProvider>
          </MiraCalThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
