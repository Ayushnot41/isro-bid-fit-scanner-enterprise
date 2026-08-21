import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ISRO Bid-Fit Scanner Enterprise | Autonomous Procurement Intelligence",
  description:
    "Autonomous E-Procurement Intelligence, GD&T Tolerance Engine and Statutory MSME Compliance Platform for ISRO Tenders.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_Y2xlcmsuaXNyby5kZXYk"}
      appearance={{
        variables: {
          colorPrimary: "#10b981",        // emerald-500
          colorBackground: "#08090a",
          colorInputBackground: "#0e1115",
          colorInputText: "#f4f4f5",
          colorText: "#f4f4f5",
          borderRadius: "0.75rem",
        },
        elements: {
          card: "bg-[#0e1115] border border-[#222730] shadow-2xl",
          headerTitle: "text-white font-bold",
          headerSubtitle: "text-zinc-400",
          socialButtonsBlockButton: "border-[#222730] bg-[#13161a] text-zinc-200 hover:bg-[#1e2228]",
          formFieldInput: "bg-[#0a0b0e] border-[#222730] text-white focus:border-emerald-500/50",
          formButtonPrimary: "bg-emerald-600 hover:bg-emerald-500 text-white",
          footerActionLink: "text-emerald-400 hover:text-emerald-300",
        },
      }}
    >
      <html
        lang="en"
        className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
        suppressHydrationWarning
      >
        <body className="font-sans bg-[#08090a] text-zinc-100 antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
