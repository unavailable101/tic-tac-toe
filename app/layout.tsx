import type { Metadata } from "next";
import "./globals.css";
import { initializeTheme } from "./theme";

export const metadata: Metadata = {
  title: "Tic Tac Toe",
  description: "Pick your emoji and play tic-tac-toe with a friend or against the computer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initializeTheme }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
