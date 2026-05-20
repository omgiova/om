"use client";
import { useState } from "react";
import { useComunicamos } from "@/hooks/useSheet";
import { addRow, updateRow, deleteRow, toggleFavorite } from "@/lib/api";
import { ExportButton } from "@/components/ExportButton";
import { CrudActions } from "@/components/CrudActions";

export default function ComunicamosPage() {
  const { data, isLoading, mutate } = useComunicamos();
  const rows: Record<string, string>[] = data ?? [];

  const grupos = rows.reduce<Record<string, Record<string, string>[]>>((acc, r) => {
    const secao = r["secao"] || "Geral";
    if (!acc[secao]) acc[secao] = [];
    acc[secao].push(r);
    return acc;
  }, {});

  async function handleAddComunicamos() {
    if (!confirm("Confirmar novo item em Como Comunicamos?")) return;

    const secao = prompt("Seção:", "")?.trim() ?? "";
    const chave = prompt("Chave:", "")?.trim() ?? "";
    const conteudo = prompt("Conteúdo:", "")?.trim() ?? "";

    if (!chave || !conteudo) {
      alert("Chave e conteúdo são obrigatórios.");
      return;
    }

    if (!confirm("Confirmar inserção deste item?")) return;
    await addRow("comunicamos", { secao, chave, conteudo });
    mutate();
  }

  async function handleEditComunicamos(row: Record<string, string>) {
    const secao = prompt("Seção:", row.secao || "")?.trim() ?? "";
    const chave = prompt("Chave:", row.chave || "")?.trim() ?? "";
    const conteudo = prompt("Conteúdo:", row.conteudo || row["conteúdo"] || "")?.trim() ?? "";

    if (!confirm("Confirmar alteração deste item?")) return;
    await updateRow("comunicamos", row.id || "", { secao, chave, conteudo });
    mutate();
  }

  async function handleDeleteComunicamos(row: Record<string, string>) {
    if (!confirm(`Excluir item ${row.chave || "sem chave"}?`)) return;
    await deleteRow("comunicamos", row.id || "");
    mutate();
  }

  async function handleToggleFavorite(row: Record<string, string>) {
    await toggleFavorite("comunicamos", row.id || "", row.favorito === "true");
    mutate();
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-[#F97316] mb-1">3</p>
          <h1 className="font-display text-3xl text-white">Como Comunicamos</h1>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={handleAddComunicamos}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-purple/20 text-white border border-purple/40 hover:bg-purple/30 transition"
          >
            Novo item
          </button>
          <ExportButton sheet="comunicamos" label="Exportar comunicação" />
        </div>
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
                    <div key={i} className="flex gap-4 items-start">
                      <span className="text-[11px] font-mono text-purple-400/60 w-40 shrink-0 pt-0.5 text-right">
                        {chave}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                          {conteudo}
                        </p>
                      </div>
                      <CrudActions
                        favorited={r.favorito === "true"}
                        onFavorite={() => handleToggleFavorite(r)}
                        onEdit={() => handleEditComunicamos(r)}
                        onDelete={() => handleDeleteComunicamos(r)}
                      />
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
