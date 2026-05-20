"use client";
import { useState } from "react";
import { useGanchos } from "@/hooks/useSheet";
import { ExportButton } from "@/components/ExportButton";
import { Copy, Check } from "lucide-react";

export default function GanchosPage() {
  const { data, isLoading } = useGanchos();
  const [copied, setCopied] = useState<string | null>(null);

  const ganchos = data ?? [];

  function copyGancho(id: string, texto: string) {
    navigator.clipboard.writeText(texto);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  // Pega o texto do gancho — a chave pode variar dependendo da normalização
  function getTexto(g: Record<string, string>) {
    return g["gancho_/_texto"] || g["gancho"] || g[Object.keys(g)[1]] || "";
  }
  function getOnde(g: Record<string, string>) {
    return g["onde_usar"] || g[Object.keys(g)[2]] || "";
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-[#F97316] mb-1">4c</p>
          <h1 className="font-display text-3xl text-white">Linguagem e Ganchos</h1>
          <p className="text-white/30 text-sm mt-1">Ganchos anti-ads validados · clique para copiar</p>
        </div>
        <ExportButton sheet="ganchos" label="Exportar ganchos" />
      </div>

      {isLoading ? (
        <p className="text-white/30 text-sm">Carregando...</p>
      ) : (
        <div className="flex flex-col gap-3">
          {ganchos.map((g: Record<string, string>) => {
            const texto = getTexto(g);
            const onde  = getOnde(g);
            const id    = g["id"] || texto.slice(0, 10);
            const isCopied = copied === id;

            return (
              <div key={id} className="card p-5 group">
                <div className="flex items-start gap-4">
                  <span className="text-[10px] font-mono text-white/20 mt-1 w-6 text-right shrink-0">
                    {g["id"]}
                  </span>
                  <div className="flex-1">
                    <blockquote className="text-white/80 text-sm leading-relaxed border-l-2 border-[#F97316]/30 pl-4 mb-3">
                      "{texto}"
                    </blockquote>
                    {onde && (
                      <p className="text-[11px] text-white/30 leading-relaxed">{onde}</p>
                    )}
                  </div>
                  <button
                    onClick={() => copyGancho(id, texto)}
                    className="shrink-0 p-2 rounded-lg text-white/20 hover:text-white/60 hover:bg-white/5 transition-all"
                  >
                    {isCopied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
