import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./components/theme-provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>IMF Gadget System</title>
        <meta name="description" content="IMF Gadget Management System" />

        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />

        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AuthProvider>
            <div className="min-h-screen bg-gradient-to-br from-background to-background/90">
              <Navbar />
              <main className="container mx-auto px-4 py-6">{children}</main>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
