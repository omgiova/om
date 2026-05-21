import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Open Mídia — Studio",
  description: "Painel de estratégia de conteúdo · Open Mídia Digital",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Sidebar />
        <main className="lg:ml-56 min-h-screen flex justify-center items-start lg:w-[calc(100%-14rem)] w-full px-4 md:px-6 pt-14 lg:pt-0">
          <div className="w-full max-w-5xl [&>*]:mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
