"use client";
import { useCategorias } from "@/hooks/useSheet";
import { addRow, updateRow, deleteRow, toggleFavorite } from "@/lib/api";
import { ExportButton } from "@/components/ExportButton";
import { CrudActions } from "@/components/CrudActions";
import { Toast } from "@/components/Toast";
import { useToast } from "@/hooks/useToast";

const CATEGORIAS = ["Educação", "Bastidores", "Resultado", "Branding"] as const;

const CAT_COLOR: Record<string, string> = {
  "Educação":   "border-white/90 text-white-300",
  "Bastidores": "border-violet/80  text-violet-300",
  "Resultado":  "border-green-400/60 text-green-400",
  "Branding":   "border-[#F97316]/60 text-[#F97316]",
};

const CAT_HOVER: Record<string, string> = {
  "Educação":   "card-hover-white",
  "Bastidores": "",
  "Resultado":  "card-hover-green",
  "Branding":   "card-hover-orange",
};

const CAT_NORMALIZE: Record<string, string> = {
  "educacao":   "Educação",
  "bastidores": "Bastidores",
  "resultado":  "Resultado",
  "branding":   "Branding",
};

function slugify(str: string): string {
  return str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function resolveCategoria(raw: string): string {
  return CAT_NORMALIZE[slugify(raw)] ?? raw;
}

function normalizeKey(key: string): string {
  return key
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_");
}

function normalizeRow(row: Record<string, string>): Record<string, string> {
  const normalized: Record<string, string> = {};
  Object.entries(row).forEach(([key, value]) => {
    normalized[normalizeKey(key)] = value;
  });
  return normalized;
}

function getSubcategoria(row: Record<string, string>): string {
  return row["subcategoria"] || row["subcategory"] || "";
}

export default function CategoriasPage() {
  const { data, isLoading, mutate } = useCategorias();
  const { message: toast, show: showToast, hide: hideToast } = useToast();
  const rows: Record<string, string>[] = (data ?? []).map(normalizeRow);

  const grupos: Record<string, Record<string, string>[]> = Object.fromEntries(
    CATEGORIAS.map(cat => [cat, []])
  );
  rows.forEach(row => {
    const cat = resolveCategoria(row["categoria"] || "");
    if (cat in grupos) grupos[cat].push(row);
  });

  Object.values(grupos).forEach(items =>
    items.sort((a, b) => (b.favorito === "true" ? 1 : 0) - (a.favorito === "true" ? 1 : 0))
  );

  async function handleAdd(categoria: string) {
    const subcategoria = prompt(`Nova subcategoria em "${categoria}":`, "")?.trim() ?? "";
    if (!subcategoria) return;
    if (!confirm(`Adicionar "${subcategoria}" em ${categoria}?`)) return;
    await addRow("categorias", { categoria: categoria.toUpperCase(), subcategoria });
    mutate();
  }

  async function handleEdit(row: Record<string, string>) {
    const subcategoria = prompt("Subcategoria:", getSubcategoria(row))?.trim() ?? "";
    if (!subcategoria) return;
    if (!confirm("Confirmar atualização?")) return;
    await updateRow("categorias", row.id || "", { subcategoria });
    mutate();
  }

  async function handleDelete(row: Record<string, string>) {
    if (!confirm(`Excluir "${getSubcategoria(row)}"?`)) return;
    await deleteRow("categorias", row.id || "");
    mutate();
  }

  async function handleToggleFavorite(row: Record<string, string>) {
    const isFav = row.favorito === "true";
    await toggleFavorite("categorias", row.id || "", isFav);
    showToast(isFav ? "Removido dos favoritos" : "Adicionado aos favoritos");
    mutate();
  }

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {CATEGORIAS.map(cat => {
            const items = grupos[cat] ?? [];
            const color = CAT_COLOR[cat] ?? "border-white/10 text-white/40";
            return (
              <div key={cat} className={`card p-4 ${CAT_HOVER[cat] ?? ""}`}>
                <div className={`flex items-center justify-between border-b pb-2 mb-3 ${color}`}>
                  <h2 className="text-xs font-semibold uppercase tracking-widest">{cat}</h2>
                  <button
                    onClick={() => handleAdd(cat)}
                    title={`Adicionar subcategoria em ${cat}`}
                    className="text-white/20 hover:text-white/70 transition text-lg leading-none pb-0.5"
                  >
                    +
                  </button>
                </div>

                <div className="space-y-1.5">
                  {items.length === 0 && (
                    <p className="text-white/20 text-xs italic py-1">Sem subcategorias</p>
                  )}
                  {items.map((row, i) => (
                    <div
                      key={row.id || i}
                      className={
                        `flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5 ${row.favorito === 'true' ? 'card-fav' : ''} group`
                      }
                    >
                      <p className="text-sm text-white/60 leading-snug flex-1 min-w-0 line-clamp-2">
                        {getSubcategoria(row)}
                      </p>
                      <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <CrudActions
                          favorited={row.favorito === "true"}
                          onFavorite={() => handleToggleFavorite(row)}
                          onEdit={() => handleEdit(row)}
                          onDelete={() => handleDelete(row)}
                        />
                      </div>
                    </div>
                  ))}
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
