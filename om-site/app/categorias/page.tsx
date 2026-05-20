"use client";
import { useCategorias } from "@/hooks/useSheet";
import { ExportButton } from "@/components/ExportButton";

const COLS = [
  { key: "educacao",   label: "Educação",   color: "border-purple/40  text-purple-300" },
  { key: "bastidores", label: "Bastidores", color: "border-violet/40  text-violet-300" },
  { key: "resultado",  label: "Resultado",  color: "border-green-500/40 text-green-400" },
  { key: "branding",   label: "Branding",   color: "border-[#F97316]/40 text-[#F97316]" },
];

export default function CategoriasPage() {
  const { data, isLoading } = useCategorias();
  const rows: Record<string, string>[] = data ?? [];

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-[#F97316] mb-1">4a</p>
          <h1 className="font-display text-3xl text-white">Categorias de Conteúdo</h1>
          <p className="text-white/30 text-sm mt-1">
            A voz da Open Mídia se organiza em 4 categorias — todo conteúdo produzido se encaixa em uma delas.
          </p>
        </div>
        <ExportButton sheet="categorias" label="Exportar categorias" />
      </div>

      {isLoading ? (
        <p className="text-white/30 text-sm">Carregando...</p>
      ) : (
        <>
          {/* Grid de subcategorias */}
          <div className="grid grid-cols-4 gap-4 mb-10">
            {COLS.map(col => {
              const items = rows
                .map(r => r[col.key] || r[Object.keys(r).find(k => k.includes(col.key.slice(0,4))) ?? ""] || "")
                .filter(Boolean);
              return (
                <div key={col.key}>
                  <h2 className={`text-xs font-semibold uppercase tracking-widest mb-3 border-b pb-2 ${col.color}`}>
                    {col.label}
                  </h2>
                  <ul className="space-y-1">
                    {items.map((item, i) => (
                      <li key={i} className="text-sm text-white/50 py-1 border-b border-white/3">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
