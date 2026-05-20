"use client";
import { useState } from "react";
import { exportContext } from "@/lib/api";
import { Copy, Download, Loader2 } from "lucide-react";

type Props = {
  sheet?: string;
  filtro?: string;
  label?: string;
};

export function ExportButton({ sheet = "all", filtro = "", label = "Exportar contexto" }: Props) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const texto = await exportContext(sheet, filtro);
      await navigator.clipboard.writeText(texto);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    setLoading(true);
    try {
      const texto = await exportContext(sheet, filtro);
      const blob = new Blob([texto], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `om-contexto-${sheet}-${Date.now()}.md`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExport}
        disabled={loading}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 hover:bg-[#F97316]/20 transition-all disabled:opacity-50"
      >
        {loading ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <Copy size={12} />
        )}
        {copied ? "Copiado!" : label}
      </button>
      <button
        onClick={handleDownload}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/8 transition-all disabled:opacity-50"
      >
        <Download size={12} />
        .md
      </button>
    </div>
  );
}
