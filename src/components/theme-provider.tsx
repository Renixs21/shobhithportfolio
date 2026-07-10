"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * Wraps the app with next-themes. Dark mode is the default; the toggle
 * in the navbar switches between "dark" and "light". The class is
 * applied to <html> so the `.light` / `.dark` token blocks activate.
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
