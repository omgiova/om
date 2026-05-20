"use client";
import { useState } from "react";
import { useMateriais } from "@/hooks/useSheet";
import { addRow, updateRow, deleteRow, toggleFavorite } from "@/lib/api";
import { ExportButton } from "@/components/ExportButton";
import { CrudActions } from "@/components/CrudActions";
import { Material } from "@/lib/types";
import clsx from "clsx";

export default function MateriaisPage() {
  const { data, isLoading, mutate } = useMateriais();
  const [nicho, setNicho] = useState("Todos");

  const materiais: Material[] = data ?? [];
  const nichos = ["Todos", ...Array.from(new Set(materiais.map(m => m.nicho))).filter(Boolean)];
  const filtrados = nicho === "Todos" ? materiais : materiais.filter(m => m.nicho === nicho);

  async function handleAddMaterial() {
    if (!confirm("Confirmar novo material?")) return;

    const nicho = prompt("Nicho:", "")?.trim() ?? "";
    const titulo = prompt("Título:", "")?.trim() ?? "";
    const principio = prompt("Princípio:", "")?.trim() ?? "";

    if (!nicho || !titulo || !principio) {
      alert("Preencha todos os campos para cadastrar o material.");
      return;
    }

    if (!confirm("Confirmar inserção deste material?")) return;
    await addRow("materiais", { nicho, titulo, principio });
    mutate();
  }

  async function handleEditMaterial(material: Material) {
    const nicho = prompt("Nicho:", material.nicho)?.trim() ?? "";
    const titulo = prompt("Título:", material.titulo)?.trim() ?? "";
    const principio = prompt("Princípio:", material.principio)?.trim() ?? "";

    if (!confirm("Confirmar alteração deste material?")) return;
    await updateRow("materiais", material.id, { nicho, titulo, principio });
    mutate();
  }

  async function handleDeleteMaterial(material: Material) {
    if (!confirm(`Excluir material ${material.titulo}?`)) return;
    await deleteRow("materiais", material.id);
    mutate();
  }

  async function handleToggleFavorite(material: Material) {
    await toggleFavorite("materiais", material.id, material.favorito === "true");
    mutate();
  }

  // Agrupar por nicho
  const grupos = filtrados.reduce<Record<string, Material[]>>((acc, m) => {
    if (!acc[m.nicho]) acc[m.nicho] = [];
    acc[m.nicho].push(m);
    return acc;
  }, {});

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-[#F97316] mb-1">4b</p>
          <h1 className="font-display text-3xl text-white">Materiais Gratuitos</h1>
          <p className="text-white/30 text-sm mt-1">{filtrados.length} iscas</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={handleAddMaterial}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-purple/20 text-white border border-purple/40 hover:bg-purple/30 transition"
          >
            Novo material
          </button>
          <ExportButton sheet="materiais" label="Exportar materiais" />
        </div>
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
                  <div key={m.id} className="card p-4">
                    <div className="flex items-start gap-4">
                      <span className="text-[10px] font-mono text-white/20 mt-0.5 w-6 text-right shrink-0">
                        {m.id}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm text-white/80">{m.titulo}</p>
                        <span className="chip chip-purple mt-2">{m.principio}</span>
                      </div>
                      <CrudActions
                        favorited={m.favorito === "true"}
                        onFavorite={() => handleToggleFavorite(m)}
                        onEdit={() => handleEditMaterial(m)}
                        onDelete={() => handleDeleteMaterial(m)}
                      />
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
