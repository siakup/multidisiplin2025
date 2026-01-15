import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import NavbarSwitcher from "./components/NavbarSwitcher";
import ColorblindModeProviderWrapper from "@/components/ColorblindModeProvider";
import GlobalColorblindToggle from "@/components/GlobalColorblindToggle";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "CARLO Universitas Pertamina",
  description: "Manage campus facilities efficiently with our comprehensive system.",
  icons: {
    icon: "/image/logo_uper.png",
    apple: "/image/logo_uper.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
      >
        <ColorblindModeProviderWrapper>
          <NavbarSwitcher />
          {children}
          {/* Fixed toggle button di kanan atas */}
          <GlobalColorblindToggle />
        </ColorblindModeProviderWrapper>
      </body>
    </html>
  );
}
