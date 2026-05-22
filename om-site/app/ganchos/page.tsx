"use client";
import { useState } from "react";
import { useGanchos } from "@/hooks/useSheet";
import { addRow, updateRow, deleteRow, toggleFavorite } from "@/lib/api";
import { ExportButton } from "@/components/ExportButton";
import { CrudActions } from "@/components/CrudActions";
import { Toast } from "@/components/Toast";
import { useToast } from "@/hooks/useToast";
import { Copy, Check } from "lucide-react";

export default function GanchosPage() {
  const { data, isLoading, mutate } = useGanchos();
  const [copied, setCopied] = useState<string | null>(null);
  const { message: toast, show: showToast, hide: hideToast } = useToast();

  const ganchos = [...(data ?? [])].sort((a: Record<string, string>, b: Record<string, string>) =>
    (b.favorito === "true" ? 1 : 0) - (a.favorito === "true" ? 1 : 0)
  );

  async function handleAddGancho() {
    if (!confirm("Confirmar novo gancho?")) return;

    const gancho = prompt("Ganchos / texto:", "")?.trim() ?? "";
    const onde_usar = prompt("Onde usar:", "")?.trim() ?? "";

    if (!gancho) {
      alert("O texto do gancho é obrigatório.");
      return;
    }

    if (!confirm("Confirmar inserção deste gancho?")) return;
    await addRow("ganchos", { gancho, onde_usar });
    mutate();
  }

  async function handleEditGancho(g: Record<string, string>) {
    const gancho = prompt("Ganchos / texto:", g["gancho"] || g["texto"] || "")?.trim() ?? "";
    const onde_usar = prompt("Onde usar:", g["onde_usar"] || "")?.trim() ?? "";

    if (!confirm("Confirmar alteração deste gancho?")) return;
    await updateRow("ganchos", g["id"] || "", { gancho, onde_usar });
    mutate();
  }

  async function handleDeleteGancho(g: Record<string, string>) {
    if (!confirm(`Excluir gancho ${g["gancho"] || g["texto"] || "?"}?`)) return;
    await deleteRow("ganchos", g["id"] || "");
    mutate();
  }

  async function handleToggleFavorite(g: Record<string, string>) {
    const isFav = g.favorito === "true";
    await toggleFavorite("ganchos", g["id"] || "", isFav);
    showToast(isFav ? "Removido dos favoritos" : "Adicionado aos favoritos");
    mutate();
  }

  function copyGancho(id: string, texto: string) {
    navigator.clipboard.writeText(texto);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  function getTexto(g: Record<string, string>) {
    return g["gancho"] || g["texto"] || "";
  }
  function getOnde(g: Record<string, string>) {
    return g["onde_usar"] || "";
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-[#F97316] mb-1">4c</p>
          <h1 className="font-display text-3xl text-white">Linguagem e Ganchos</h1>
          <p className="text-white/30 text-sm mt-1">Ganchos anti-ads validados · clique para copiar</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={handleAddGancho}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-purple/20 text-white border border-purple/40 hover:bg-purple/30 transition"
          >
            Novo gancho
          </button>
          <ExportButton sheet="ganchos" label="Exportar ganchos" />
        </div>
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
              <div key={id} className={`card p-5 group ${g.favorito === 'true' ? 'card-fav' : ''}`}>
                <div className="flex items-start gap-4">
                  <span className="text-[10px] font-mono text-white/20 mt-1 w-6 text-right shrink-0">
                    {g["id"]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <blockquote className="text-white/80 text-sm leading-relaxed border-l-2 border-[#F97316]/30 pl-4 mb-3">
                      "{texto}"
                    </blockquote>
                    {onde && (
                      <p className="text-[11px] text-white/30 leading-relaxed">{onde}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => copyGancho(id, texto)}
                      className="shrink-0 p-2 rounded-lg text-white/20 hover:text-white/60 hover:bg-white/5 transition-all"
                    >
                      {isCopied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    </button>
                    <CrudActions
                      favorited={g.favorito === "true"}
                      onFavorite={() => handleToggleFavorite(g)}
                      onEdit={() => handleEditGancho(g)}
                      onDelete={() => handleDeleteGancho(g)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Toast message={toast} onClose={hideToast} />
    </div>
  );
}
