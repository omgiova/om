"use client";
import { useIdentidade } from "@/hooks/useSheet";
import { addRow, updateRow, deleteRow, toggleFavorite } from "@/lib/api";
import { ExportButton } from "@/components/ExportButton";
import { CrudActions } from "@/components/CrudActions";

export default function IdentidadePage() {
  const { data, isLoading, mutate } = useIdentidade();
  const rows: Record<string, string>[] = data ?? [];

  // Agrupa por seção preservando a ordem de inserção
  const grupos = rows.reduce<Record<string, Record<string, string>[]>>((acc, r) => {
    const secao = r["secao"] || "Geral";
    if (!acc[secao]) acc[secao] = [];
    acc[secao].push(r);
    return acc;
  }, {});

  async function handleAddIdentidade() {
    if (!confirm("Confirmar novo item em Identidade?")) return;
    const secao    = prompt("Seção:", "")?.trim() ?? "";
    const chave    = prompt("Chave:", "")?.trim() ?? "";
    const conteudo = prompt("Conteúdo:", "")?.trim() ?? "";
    if (!chave || !conteudo) { alert("Chave e conteúdo são obrigatórios."); return; }
    if (!confirm("Confirmar inserção deste item?")) return;
    await addRow("identidade", { secao, chave, conteudo });
    mutate();
  }

  async function handleEditIdentidade(row: Record<string, string>) {
    const secao    = prompt("Seção:", row.secao    || "")?.trim() ?? "";
    const chave    = prompt("Chave:", row.chave    || "")?.trim() ?? "";
    const conteudo = prompt("Conteúdo:", row.conteudo || "")?.trim() ?? "";
    if (!confirm("Confirmar alteração deste item?")) return;
    await updateRow("identidade", row.id || "", { secao, chave, conteudo });
    mutate();
  }

  async function handleDeleteIdentidade(row: Record<string, string>) {
    if (!confirm(`Excluir item ${row.chave || "sem chave"}?`)) return;
    await deleteRow("identidade", row.id || "");
    mutate();
  }

  async function handleToggleFavorite(row: Record<string, string>) {
    await toggleFavorite("identidade", row.id || "", row.favorito === "true");
    mutate();
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-10">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-[#F97316] mb-1">1</p>
          <h1 className="font-display text-3xl text-white">Identidade da Marca</h1>
          <p className="text-white/30 text-sm mt-2 max-w-lg italic">
            "Agência de marketing que aumenta o posicionamento digital através de conteúdo orgânico."
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center shrink-0">
          <button
            onClick={handleAddIdentidade}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-purple/20 text-white border border-purple/40 hover:bg-purple/30 transition"
          >
            Novo item
          </button>
          <ExportButton sheet="identidade" label="Exportar identidade" />
        </div>
      </div>

      {isLoading ? (
        <p className="text-white/30 text-sm">Carregando...</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(grupos).map(([secao, items]) => (
            <div key={secao} className="card p-6">
              {/* Cabeçalho da seção */}
              <h2 className="text-[10px] uppercase tracking-[.2em] text-[#F97316]/70 mb-5 pb-3 border-b border-white/5">
                {secao}
              </h2>

              {/* Grid de itens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                {items.map((r, i) => {
                  const chave    = r["chave"]    || "";
                  const conteudo = r["conteudo"] || "";
                  return (
                    <div key={i} className="flex flex-col gap-1.5 group">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[10px] uppercase tracking-widest text-[#F97316]/60">
                          {chave}
                        </p>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <CrudActions
                            favorited={r.favorito === "true"}
                            onFavorite={() => handleToggleFavorite(r)}
                            onEdit={() => handleEditIdentidade(r)}
                            onDelete={() => handleDeleteIdentidade(r)}
                          />
                        </div>
                      </div>
                      <p className="copy-text">{conteudo}</p>
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
