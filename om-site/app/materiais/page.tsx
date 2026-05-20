"use client";
import { useState } from "react";
import { useMateriais } from "@/hooks/useSheet";
import { ExportButton } from "@/components/ExportButton";
import { Material } from "@/lib/types";
import clsx from "clsx";

export default function MateriaisPage() {
  const { data, isLoading } = useMateriais();
  const [nicho, setNicho] = useState("Todos");

  const materiais: Material[] = data ?? [];
  const nichos = ["Todos", ...Array.from(new Set(materiais.map(m => m.nicho))).filter(Boolean)];
  const filtrados = nicho === "Todos" ? materiais : materiais.filter(m => m.nicho === nicho);

  // Agrupar por nicho
  const grupos = filtrados.reduce<Record<string, Material[]>>((acc, m) => {
    if (!acc[m.nicho]) acc[m.nicho] = [];
    acc[m.nicho].push(m);
    return acc;
  }, {});

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-[#F97316] mb-1">4b</p>
          <h1 className="font-display text-3xl text-white">Materiais Gratuitos</h1>
          <p className="text-white/30 text-sm mt-1">{filtrados.length} iscas</p>
        </div>
        <ExportButton sheet="materiais" label="Exportar materiais" />
      </div>

      {/* Filtro nicho */}
      <div className="flex flex-wrap gap-1 mb-8">
        {nichos.map(n => (
          <button
            key={n}
            onClick={() => setNicho(n)}
            className={clsx(
              "px-3 py-1.5 text-xs rounded-lg transition-all",
              nicho === n
                ? "bg-purple/30 text-white border border-purple/40"
                : "text-white/30 hover:text-white/60 hover:bg-white/5"
            )}
          >{n}</button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-white/30 text-sm">Carregando...</p>
      ) : (
        <div className="space-y-8">
          {Object.entries(grupos).map(([g, items]) => (
            <div key={g}>
              <h2 className="text-sm font-semibold text-[#F97316] mb-3 uppercase tracking-widest">
                {g}
              </h2>
              <div className="flex flex-col gap-2">
                {items.map(m => (
                  <div key={m.id} className="card p-4 flex items-start gap-4">
                    <span className="text-[10px] font-mono text-white/20 mt-0.5 w-6 text-right shrink-0">
                      {m.id}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-white/80">{m.titulo}</p>
                      <span className="chip chip-purple mt-2">{m.principio}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
