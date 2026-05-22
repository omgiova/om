"use client";
import { useState } from "react";
import { usePesquisas } from "@/hooks/useSheet";
import { addRow, updateRow, deleteRow, toggleFavorite } from "@/lib/api";
import { ExportButton } from "@/components/ExportButton";
import { CrudActions } from "@/components/CrudActions";

const VOL_COLOR: Record<string, string> = {
  "Alto":       "text-green-400",
  "Médio":      "text-yellow-400",
  "Baixo-médio":"text-orange-400",
  "–":          "text-white/20",
};

export default function PesquisasPage() {
  const { data, isLoading, mutate } = usePesquisas();
  const rows: Record<string, string>[] = data ?? [];

  const estruturais = rows.filter(r =>
    (r["tipo"] || "").toLowerCase().includes("estrutural") ||
    (r["tipo"] || "").toLowerCase().includes("dado")
  );
  const termos = rows.filter(r =>
    (r["tipo"] || "").toLowerCase().includes("palavra") ||
    (r["tipo"] || "").toLowerCase().includes("termo")
  );
  const outros = rows.filter(r => !estruturais.includes(r) && !termos.includes(r));

  function getVal(r: Record<string, string>, keys: string[]) {
    for (const k of keys) {
      const found = Object.keys(r).find(rk => rk.includes(k));
      if (found && r[found]) return r[found];
    }
    return "";
  }

  async function handleAddPesquisa() {
    if (!confirm("Confirmar nova pesquisa?")) return;

    const tipo = prompt("Tipo:", "")?.trim() ?? "";
    const dado = prompt("Dado / termo:", "")?.trim() ?? "";
    const volume = prompt("Volume:", "")?.trim() ?? "";
    const observacao = prompt("Observação:", "")?.trim() ?? "";

    if (!tipo || !dado) {
      alert("Tipo e dado são obrigatórios.");
      return;
    }

    if (!confirm("Confirmar inserção desta pesquisa?")) return;
    await addRow("pesquisas", { tipo, dado, volume, observacao });
    mutate();
  }

  async function handleEditPesquisa(row: Record<string, string>) {
    const tipo = prompt("Tipo:", row.tipo || "")?.trim() ?? "";
    const dado = prompt("Dado / termo:", getVal(row, ["dado", "termo"]))?.trim() ?? "";
    const volume = prompt("Volume:", row.volume || "")?.trim() ?? "";
    const observacao = prompt("Observação:", getVal(row, ["observa", "obs"]))?.trim() ?? "";

    if (!confirm("Confirmar alteração desta pesquisa?")) return;
    await updateRow("pesquisas", row.id || "", { tipo, dado, volume, observacao });
    mutate();
  }

  async function handleDeletePesquisa(row: Record<string, string>) {
    if (!confirm(`Excluir pesquisa ${getVal(row, ["dado", "termo"]) || "?"}?`)) return;
    await deleteRow("pesquisas", row.id || "");
    mutate();
  }

  async function handleToggleFavorite(row: Record<string, string>) {
    await toggleFavorite("pesquisas", row.id || "", row.favorito === "true");
    mutate();
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-[#F97316] mb-1">6</p>
          <h1 className="font-display text-3xl text-white">Pesquisas</h1>
          <p className="text-white/30 text-sm mt-1">Dados de Mercado e SEO · Brasil 2025-26</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={handleAddPesquisa}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-purple/20 text-white border border-purple/40 hover:bg-purple/30 transition"
          >
            Nova pesquisa
          </button>
          <ExportButton sheet="pesquisas" label="Exportar pesquisas" />
        </div>
      </div>

      {isLoading ? (
        <p className="text-white/30 text-sm">Carregando...</p>
      ) : (
        <div className="space-y-10">
          {/* Dados estruturais */}
          {estruturais.length > 0 && (
            <section>
              <h2 className="text-xs uppercase tracking-widest text-[#F97316]/70 mb-4 border-b border-white/5 pb-2">
                Dados Estruturais
              </h2>
              <div className="space-y-3">
                {estruturais.map((r, i) => (
                  <div key={i} className={`card p-4 flex items-start gap-4 ${r.favorito === 'true' ? 'card-fav' : ''}`}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/80 font-medium">
                        {getVal(r, ["dado", "termo"])}
                      </p>
                      <p className="text-xs text-white/40 mt-1">
                        {getVal(r, ["observa", "obs"])}
                      </p>
                    </div>
                    <CrudActions
                      favorited={r.favorito === "true"}
                      onFavorite={() => handleToggleFavorite(r)}
                      onEdit={() => handleEditPesquisa(r)}
                      onDelete={() => handleDeletePesquisa(r)}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Termos e volume */}
          {termos.length > 0 && (
            <section>
              <h2 className="text-xs uppercase tracking-widest text-[#F97316]/70 mb-4 border-b border-white/5 pb-2">
                Palavras-chave e Volume Estimado
              </h2>
              <div className="space-y-2">
                {termos.map((r, i) => {
                  const dado = getVal(r, ["dado", "termo"]);
                  const vol  = r["volume"] || "–";
                  const obs  = getVal(r, ["observa", "obs"]);
                  return (
                    <div key={i} className={`card p-4 flex items-start gap-4 ${r.favorito === 'true' ? 'card-fav' : ''}`}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/80 font-medium">{dado}</p>
                        <p className="text-xs text-white/30 mt-1">{obs}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold shrink-0 ${VOL_COLOR[vol] ?? "text-white/40"}`}>
                          {vol}
                        </span>
                        <CrudActions
                          favorited={r.favorito === "true"}
                          onFavorite={() => handleToggleFavorite(r)}
                          onEdit={() => handleEditPesquisa(r)}
                          onDelete={() => handleDeletePesquisa(r)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Conclusão e fontes */}
          {outros.length > 0 && (
            <section>
              <h2 className="text-xs uppercase tracking-widest text-[#F97316]/70 mb-4 border-b border-white/5 pb-2">
                Conclusão e Fontes
              </h2>
              <div className="space-y-3">
                {outros.map((r, i) => (
                  <div key={i} className={`card p-4 flex items-start gap-4 ${r.favorito === 'true' ? 'card-fav' : ''}`}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">
                        {Object.values(r).filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <CrudActions
                      favorited={r.favorito === "true"}
                      onFavorite={() => handleToggleFavorite(r)}
                      onEdit={() => handleEditPesquisa(r)}
                      onDelete={() => handleDeletePesquisa(r)}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
