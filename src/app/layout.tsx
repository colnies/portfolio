import type { Metadata } from "next";
import { dejaVu, basier } from './fonts'
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
    title: 'Colin Nies',
    description: 'Portfolio of Colin Nies - Web Developer and Product Designer specializing in user-centered digital experiences',
    openGraph: {
        title: 'Colin Nies',
        description: 'Portfolio of Colin Nies - Web Developer and Product Designer specializing in user-centered digital experiences',
        url: 'https://colinnies.dev',
        siteName: 'Colin Nies Portfolio',
        images: [
            {
                url: '/main-logo.png',
                width: 1200,
                height: 630,
            }
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Colin Nies',
        description: 'Portfolio of Colin Nies - Web Developer and Product Designer specializing in user-centered digital experiences',
        images: ['https://colinnies.dev/main-logo.png'],
    },
    robots: {
        index: true,
        follow: true,
    },
    icons: {
        icon: '/Favicon-32x32.svg',
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dejaVu.variable} ${basier.variable}`} suppressHydrationWarning>
            <body
                className={` antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
  );
}
