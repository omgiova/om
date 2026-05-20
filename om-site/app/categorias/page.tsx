"use client";
import { useCategorias } from "@/hooks/useSheet";
import { addRow, updateRow, deleteRow, toggleFavorite } from "@/lib/api";
import { ExportButton } from "@/components/ExportButton";
import { CrudActions } from "@/components/CrudActions";

const COLS = [
  { key: "educacao",   label: "Educação",   color: "border-purple/40  text-purple-300" },
  { key: "bastidores", label: "Bastidores", color: "border-violet/40  text-violet-300" },
  { key: "resultado",  label: "Resultado",  color: "border-green-500/40 text-green-400" },
  { key: "branding",   label: "Branding",   color: "border-[#F97316]/40 text-[#F97316]" },
];

const FIELD_ALIASES: Record<string, string> = {
  educacao: "educacao",
  educação: "educacao",
  bastidores: "bastidores",
  resultado: "resultado",
  branding: "branding",
};

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
    const field = FIELD_ALIASES[normalizeKey(key)] ?? normalizeKey(key);
    normalized[field] = value;
  });
  return normalized;
}

export default function CategoriasPage() {
  const { data, isLoading, mutate } = useCategorias();
  const rows: Record<string, string>[] = (data ?? []).map(normalizeRow);
  const hasKnownColumns = rows.some(row => COLS.some(col => Boolean(row[col.key])));
  const fallbackKeys = rows[0]
    ? Object.keys(rows[0]).filter(key => !["id", "favorito", "favorita"].includes(key)).slice(0, 4)
    : [];
  const renderColumns = hasKnownColumns
    ? COLS
    : fallbackKeys.map((key, index) => ({
        key,
        label: COLS[index]?.label ?? key,
        color: COLS[index]?.color ?? "border-white/10 text-white/40",
      }));

  async function handleAddCategoria() {
    if (!confirm("Confirmar novo item em categorias?")) return;

    const educacao = prompt("Educação:", "")?.trim() ?? "";
    const bastidores = prompt("Bastidores:", "")?.trim() ?? "";
    const resultado = prompt("Resultado:", "")?.trim() ?? "";
    const branding = prompt("Branding:", "")?.trim() ?? "";

    if (!educacao && !bastidores && !resultado && !branding) {
      alert("Nenhum dado informado. Operação cancelada.");
      return;
    }

    if (!confirm("Confirmar inserção deste novo item?")) return;

    await addRow("categorias", { educacao, bastidores, resultado, branding });
    mutate();
  }

  async function handleUpdateCategoria(row: Record<string, string>) {
    const educacao = prompt("Educação:", row.educacao || "")?.trim() ?? "";
    const bastidores = prompt("Bastidores:", row.bastidores || "")?.trim() ?? "";
    const resultado = prompt("Resultado:", row.resultado || "")?.trim() ?? "";
    const branding = prompt("Branding:", row.branding || "")?.trim() ?? "";

    if (!confirm("Confirmar atualização deste item?")) return;

    await updateRow("categorias", row.id || "", { educacao, bastidores, resultado, branding });
    mutate();
  }

  async function handleDeleteCategoria(row: Record<string, string>) {
    if (!confirm(`Excluir item "${row.educacao || row.bastidores || row.resultado || row.branding}"?`)) return;
    await deleteRow("categorias", row.id || "");
    mutate();
  }

  async function handleToggleFavorite(row: Record<string, string>) {
    await toggleFavorite("categorias", row.id || "", row.favorito === "true");
    mutate();
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-[#F97316] mb-1">4a</p>
          <h1 className="font-display text-3xl text-white">Categorias de Conteúdo</h1>
          <p className="text-white/30 text-sm mt-1">
            A voz da Open Mídia se organiza em 4 categorias — todo conteúdo produzido se encaixa em uma delas.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={handleAddCategoria}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-purple/20 text-white border border-purple/40 hover:bg-purple/30 transition"
          >
            Nova linha
          </button>
          <ExportButton sheet="categorias" label="Exportar categorias" />
        </div>
      </div>

      {isLoading ? (
        <p className="text-white/30 text-sm">Carregando...</p>
      ) : (() => {
        const visibleRows = rows.filter(row => renderColumns.some(col => Boolean(row[col.key])));
        if (visibleRows.length === 0) {
          return (
            <p className="text-white/40 text-sm">
              Nenhuma categoria carregada. Verifique a planilha ou a implantação do Apps Script.
            </p>
          );
        }

        return (
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-4 mb-3">
              {renderColumns.map(col => (
                <div key={col.key}>
                  <h2 className={`text-xs font-semibold uppercase tracking-widest mb-3 border-b pb-2 ${col.color}`}>
                    {col.label}
                  </h2>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {visibleRows.map((row, rowIndex) => (
                <div key={row.id || rowIndex} className="grid grid-cols-4 gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  {renderColumns.map(col => (
                    <div key={col.key} className="text-sm text-white/60 min-h-[2.5rem]">
                      {row[col.key] || ""}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
