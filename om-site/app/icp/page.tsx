"use client";
import { useState } from "react";
import { useICP } from "@/hooks/useSheet";
import { ExportButton } from "@/components/ExportButton";
import { ICP } from "@/lib/types";
import clsx from "clsx";

export default function ICPPage() {
  const { data, isLoading } = useICP();
  const [filtro, setFiltro] = useState<"Todos" | "Prioritário" | "Secundário">("Todos");

  const icps: ICP[] = data ?? [];
  const filtrados = filtro === "Todos" ? icps : icps.filter(i => i.tipo === filtro);

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-[#F97316] mb-1">2</p>
          <h1 className="font-display text-3xl text-white">ICP — Para Quem Falamos</h1>
          <p className="text-white/30 text-sm mt-1 max-w-xl">
            "Eu sei o que faço. Mas as pessoas certas não me encontram — e quem me encontra não entende o meu valor."
          </p>
        </div>
        <ExportButton sheet="icp" label="Exportar ICP" />
      </div>

      {/* Filtro */}
      <div className="flex gap-2 mb-8">
        {(["Todos", "Prioritário", "Secundário"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={clsx(
              "px-4 py-1.5 text-xs rounded-lg transition-all",
              filtro === f
                ? "bg-purple/30 text-white border border-purple/40"
                : "text-white/30 hover:text-white/60 hover:bg-white/5"
            )}
          >{f}</button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-white/30 text-sm">Carregando...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtrados.map(icp => (
            <div key={icp.id} className="card p-6">
              <div className="flex items-start gap-4">
                <span className="text-[10px] font-mono text-white/20 mt-1 w-6 text-right shrink-0">
                  {icp.id}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-base font-semibold text-white">{icp.perfil}</h2>
                    <span className={clsx(
                      "chip",
                      icp.tipo === "Prioritário" ? "chip-green" : "chip-muted"
                    )}>
                      {icp.tipo}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#F97316]/60 mb-1">
                        Dor principal
                      </p>
                      <p className="text-sm text-white/70">{icp.dor_principal}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#F97316]/60 mb-1">
                        Contexto
                      </p>
                      <p className="text-sm text-white/50 leading-relaxed">{icp.contexto}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
