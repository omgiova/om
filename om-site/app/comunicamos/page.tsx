"use client";
import { useComunicamos } from "@/hooks/useSheet";
import { ExportButton } from "@/components/ExportButton";

export default function ComunicamosPage() {
  const { data, isLoading } = useComunicamos();
  const rows: Record<string, string>[] = data ?? [];

  const grupos = rows.reduce<Record<string, Record<string, string>[]>>((acc, r) => {
    const secao = r["seção"] || r["secao"] || "Geral";
    if (!acc[secao]) acc[secao] = [];
    acc[secao].push(r);
    return acc;
  }, {});

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-[#F97316] mb-1">3</p>
          <h1 className="font-display text-3xl text-white">Como Comunicamos</h1>
        </div>
        <ExportButton sheet="comunicamos" label="Exportar comunicação" />
      </div>

      {isLoading ? (
        <p className="text-white/30 text-sm">Carregando...</p>
      ) : (
        <div className="space-y-8">
          {Object.entries(grupos).map(([secao, items]) => (
            <div key={secao}>
              <h2 className="text-xs uppercase tracking-[.2em] text-[#F97316]/70 mb-4 border-b border-white/5 pb-2">
                {secao}
              </h2>
              <div className="space-y-4">
                {items.map((r, i) => {
                  const chave    = r["chave"]    || "";
                  const conteudo = r["conteúdo"] || r["conteudo"] || "";
                  return (
                    <div key={i} className="flex gap-4">
                      <span className="text-[11px] font-mono text-purple-400/60 w-40 shrink-0 pt-0.5 text-right">
                        {chave}
                      </span>
                      <p className="text-sm text-white/70 leading-relaxed flex-1 whitespace-pre-wrap">
                        {conteudo}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
