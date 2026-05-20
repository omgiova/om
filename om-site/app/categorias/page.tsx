"use client";
import { useCategorias } from "@/hooks/useSheet";
import { addRow, updateRow, deleteRow, toggleFavorite } from "@/lib/api";
import { ExportButton } from "@/components/ExportButton";
import { CrudActions } from "@/components/CrudActions";
import { Categoria } from "@/lib/types";
import { Plus } from "lucide-react";

function removeAccents(v: string) {
  return v.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}
function normalizeCategoria(v: string) {
  return removeAccents(v).toLowerCase().trim();
}

const COLS = [
  {
    key: "educacao",
    label: "Educação",
    accent: "text-purple-300",
    border: "border-purple-500/40",
    chipBg: "bg-purple-500/10 text-purple-300",
    btnBg: "bg-purple-500/10 text-purple-300 border-purple-500/30 hover:bg-purple-500/20",
  },
  {
    key: "bastidores",
    label: "Bastidores",
    accent: "text-violet-300",
    border: "border-violet-500/40",
    chipBg: "bg-violet-500/10 text-violet-300",
    btnBg: "bg-violet-500/10 text-violet-300 border-violet-500/30 hover:bg-violet-500/20",
  },
  {
    key: "resultado",
    label: "Resultado",
    accent: "text-green-400",
    border: "border-green-500/40",
    chipBg: "bg-green-500/10 text-green-400",
    btnBg: "bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20",
  },
  {
    key: "branding",
    label: "Branding",
    accent: "text-[#F97316]",
    border: "border-[#F97316]/40",
    chipBg: "bg-[#F97316]/10 text-[#F97316]",
    btnBg: "bg-[#F97316]/10 text-[#F97316] border-[#F97316]/30 hover:bg-[#F97316]/20",
  },
];

export default function CategoriasPage() {
  const { data, isLoading, mutate } = useCategorias();
  const rows: Categoria[] = (data ?? []) as Categoria[];

  // Agrupa por categoria normalizada
  const grupos = rows.reduce<Record<string, Categoria[]>>((acc, r) => {
    const key = normalizeCategoria(r.categoria ?? "");
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  async function handleAdd(categoriaKey: string, categoriaLabel: string) {
    const subcategoria = prompt(`Nova subcategoria em ${categoriaLabel}:`)?.trim() ?? "";
    if (!subcategoria) return;
    if (!confirm(`Adicionar "${subcategoria}" em ${categoriaLabel}?`)) return;
    await addRow("categorias", { categoria: categoriaLabel, subcategoria });
    mutate();
  }

  async function handleEdit(item: Categoria) {
    const subcategoria = prompt("Editar subcategoria:", item.subcategoria)?.trim() ?? "";
    if (!subcategoria) return;
    if (!confirm(`Salvar "${subcategoria}"?`)) return;
    await updateRow("categorias", item.id, { categoria: item.categoria, subcategoria });
    mutate();
  }

  async function handleDelete(item: Categoria) {
    if (!confirm(`Excluir "${item.subcategoria}"?`)) return;
    await deleteRow("categorias", item.id);
    mutate();
  }

  async function handleToggle(item: Categoria) {
    await toggleFavorite("categorias", item.id, item.favorito === "true");
    mutate();
  }

  return (
    <div className="p-4 sm:p-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-10">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-[#F97316] mb-1">4a</p>
          <h1 className="font-display text-3xl text-white">Categorias de Conteúdo</h1>
          <p className="text-white/30 text-sm mt-2">
            A voz da Open Mídia se organiza em 4 categorias — todo conteúdo se encaixa em uma delas.
          </p>
        </div>
        <ExportButton sheet="categorias" label="Exportar categorias" />
      </div>

      {isLoading ? (
        <p className="text-white/30 text-sm">Carregando...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {COLS.map(col => {
            const items = grupos[col.key] ?? [];
            return (
              <div key={col.key} className="card p-5 flex flex-col gap-4">
                {/* Cabeçalho da categoria */}
                <div className={`flex items-center justify-between pb-3 border-b ${col.border}`}>
                  <h2 className={`text-xs font-semibold uppercase tracking-[.2em] ${col.accent}`}>
                    {col.label}
                  </h2>
                  <span className="text-[10px] text-white/20">{items.length}</span>
                </div>

                {/* Subcategorias */}
                <div className="flex flex-col gap-2">
                  {items.length === 0 && (
                    <p className="text-white/20 text-xs italic">Nenhuma subcategoria.</p>
                  )}
                  {items.map(item => (
                    <div
                      key={item.id}
                      className="group flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white/4 border border-white/5"
                    >
                      <span className="text-sm text-white/70 leading-snug">{item.subcategoria}</span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <CrudActions
                          favorited={item.favorito === "true"}
                          onFavorite={() => handleToggle(item)}
                          onEdit={() => handleEdit(item)}
                          onDelete={() => handleDelete(item)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Botão nova subcategoria */}
                <button
                  onClick={() => handleAdd(col.key, col.label)}
                  className={`mt-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${col.btnBg}`}
                >
                  <Plus size={12} />
                  Nova subcategoria
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
