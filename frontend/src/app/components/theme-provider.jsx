// src/components/theme-provider.js

"use client"

import { ThemeProvider as NextThemeProvider } from "next-themes"

export function ThemeProvider({ children }) {
  return (
    <NextThemeProvider attribute="class">
      {children}
    </NextThemeProvider>
  )
}
