"use client";
import { useState } from "react";
import { useICP } from "@/hooks/useSheet";
import { addRow, updateRow, deleteRow, toggleFavorite } from "@/lib/api";
import { ExportButton } from "@/components/ExportButton";
import { CrudActions } from "@/components/CrudActions";
import { ICP } from "@/lib/types";
import clsx from "clsx";

export default function ICPPage() {
  const { data, isLoading, mutate } = useICP();
  const [filtro, setFiltro] = useState<"Todos" | "Prioritário" | "Secundário">("Todos");

  const icps: ICP[] = (data ?? []) as ICP[];
  const filtrados = filtro === "Todos" ? icps : icps.filter(i => i.tipo === filtro);

  async function handleAddICP() {
    if (!confirm("Confirmar novo ICP?")) return;

    const tipo = prompt("Tipo (Prioritário / Secundário):", "Prioritário")?.trim() ?? "";
    const perfil = prompt("Perfil:", "")?.trim() ?? "";
    const dor_principal = prompt("Dor principal:", "")?.trim() ?? "";
    const contexto = prompt("Contexto:", "")?.trim() ?? "";

    if (!tipo || !perfil || !dor_principal || !contexto) {
      alert("Preencha todos os campos.");
      return;
    }

    if (!confirm("Confirmar inserção deste ICP?")) return;
    await addRow("icp", { tipo, perfil, dor_principal, contexto });
    mutate();
  }

  async function handleEditICP(icp: ICP) {
    const tipo = prompt("Tipo:", icp.tipo)?.trim() ?? "";
    const perfil = prompt("Perfil:", icp.perfil)?.trim() ?? "";
    const dor_principal = prompt("Dor principal:", icp.dor_principal)?.trim() ?? "";
    const contexto = prompt("Contexto:", icp.contexto)?.trim() ?? "";

    if (!confirm("Confirmar alteração deste ICP?")) return;
    await updateRow("icp", icp.id, { tipo, perfil, dor_principal, contexto });
    mutate();
  }

  async function handleDeleteICP(icp: ICP) {
    if (!confirm(`Excluir ICP ${icp.perfil}?`)) return;
    await deleteRow("icp", icp.id);
    mutate();
  }

  async function handleToggleFavorite(icp: ICP) {
    await toggleFavorite("icp", icp.id, icp.favorito === "true");
    mutate();
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-[#F97316] mb-1">2</p>
          <h1 className="font-display text-3xl text-white">ICP — Para Quem Falamos</h1>
          <p className="text-white/30 text-sm mt-1 max-w-xl">
            "Eu sei o que faço. Mas as pessoas certas não me encontram — e quem me encontra não entende o meu valor."
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={handleAddICP}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-purple/20 text-white border border-purple/40 hover:bg-purple/30 transition"
          >
            Novo ICP
          </button>
          <ExportButton sheet="icp" label="Exportar ICP" />
        </div>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <CrudActions
                  favorited={icp.favorito === "true"}
                  onFavorite={() => handleToggleFavorite(icp)}
                  onEdit={() => handleEditICP(icp)}
                  onDelete={() => handleDeleteICP(icp)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
