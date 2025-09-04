import { Inter } from "next/font/google";
import "./globals.css";
// import { ThemeProvider } from "@/components/theme-provider";
import { ClientLayoutWrapper } from "@/wrapper/ClientLayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        > */}
        {/* We wrap the children with the new client component */}
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
