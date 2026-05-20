"use client";
import { usePesquisas } from "@/hooks/useSheet";
import { ExportButton } from "@/components/ExportButton";

const VOL_COLOR: Record<string, string> = {
  "Alto":       "text-green-400",
  "Médio":      "text-yellow-400",
  "Baixo-médio":"text-orange-400",
  "–":          "text-white/20",
};

export default function PesquisasPage() {
  const { data, isLoading } = usePesquisas();
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

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-[#F97316] mb-1">6</p>
          <h1 className="font-display text-3xl text-white">Pesquisas</h1>
          <p className="text-white/30 text-sm mt-1">Dados de Mercado e SEO · Brasil 2025-26</p>
        </div>
        <ExportButton sheet="pesquisas" label="Exportar pesquisas" />
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
                  <div key={i} className="card p-4">
                    <p className="text-sm text-white/80 font-medium">
                      {getVal(r, ["dado", "termo"])}
                    </p>
                    <p className="text-xs text-white/40 mt-1">
                      {getVal(r, ["observa", "obs"])}
                    </p>
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
                    <div key={i} className="card p-4 flex items-start gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-white/80 font-medium">{dado}</p>
                        <p className="text-xs text-white/30 mt-1">{obs}</p>
                      </div>
                      <span className={`text-sm font-semibold shrink-0 ${VOL_COLOR[vol] ?? "text-white/40"}`}>
                        {vol}
                      </span>
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
                  <div key={i} className="card p-4">
                    <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">
                      {Object.values(r).filter(Boolean).join(" · ")}
                    </p>
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
