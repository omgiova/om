"use client";
import { useState } from "react";
import { usePosts } from "@/hooks/useSheet";
import { ExportButton } from "@/components/ExportButton";
import { Post } from "@/lib/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import clsx from "clsx";

const CATEGORIAS = ["Todas", "Educação", "Bastidores", "Resultado", "Branding"];
const FORMATOS = ["Todos", "Carrossel", "Reel", "Post estático", "Story sequencial"];

const COR_CAT: Record<string, string> = {
  "Educação":   "chip-purple",
  "Bastidores": "chip-muted",
  "Resultado":  "chip-green",
  "Branding":   "chip-orange",
};

function PostCard({ post }: { post: Post }) {
  const [open, setOpen] = useState(false);
  const linhas = post.copy_completa?.split("\n") ?? [];
  const conceito = linhas[0] ?? "";
  const corpo = linhas.slice(1).join("\n").trim();

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full p-4 text-left flex items-start gap-4"
      >
        <span className="text-[10px] font-mono text-white/20 mt-0.5 w-6 shrink-0 text-right">
          {post.id}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={clsx("chip", COR_CAT[post.categoria] ?? "chip-muted")}>
              {post.categoria}
            </span>
            <span className="chip chip-muted">{post.subcategoria}</span>
            <span className="chip chip-muted">{post.formato}</span>
          </div>
          <p className="text-sm text-white/70 truncate">{conceito}</p>
        </div>
        <div className="text-white/20 shrink-0">
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 ml-10 border-t border-white/5 pt-4">
          <pre className="copy-text">{post.copy_completa}</pre>
        </div>
      )}
    </div>
  );
}

export default function PostsPage() {
  const { data, isLoading } = usePosts();
  const [cat,    setCat]    = useState("Todas");
  const [fmt,    setFmt]    = useState("Todos");
  const [busca,  setBusca]  = useState("");

  const posts: Post[] = data ?? [];

  const filtrados = posts.filter(p => {
    const okCat = cat === "Todas" || p.categoria === cat;
    const okFmt = fmt === "Todos" || p.formato === fmt;
    const okBusca = !busca || p.copy_completa?.toLowerCase().includes(busca.toLowerCase());
    return okCat && okFmt && okBusca;
  });

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-[#F97316] mb-1">5</p>
          <h1 className="font-display text-3xl text-white">Sugestões de Posts</h1>
          <p className="text-white/30 text-sm mt-1">{filtrados.length} posts</p>
        </div>
        <ExportButton sheet="posts" label="Exportar posts" />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Buscar na copy..."
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-purple/50 w-52"
        />
        <div className="flex gap-1">
          {CATEGORIAS.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={clsx(
                "px-3 py-1.5 text-xs rounded-lg transition-all",
                cat === c
                  ? "bg-purple/30 text-white border border-purple/40"
                  : "text-white/30 hover:text-white/60 hover:bg-white/5"
              )}
            >{c}</button>
          ))}
        </div>
        <div className="flex gap-1">
          {FORMATOS.map(f => (
            <button
              key={f}
              onClick={() => setFmt(f)}
              className={clsx(
                "px-3 py-1.5 text-xs rounded-lg transition-all",
                fmt === f
                  ? "bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/30"
                  : "text-white/30 hover:text-white/60 hover:bg-white/5"
              )}
            >{f}</button>
          ))}
        </div>
      </div>

      {/* Lista */}
      {isLoading ? (
        <p className="text-white/30 text-sm">Carregando...</p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtrados.map(p => <PostCard key={p.id} post={p} />)}
          {filtrados.length === 0 && (
            <p className="text-white/20 text-sm text-center py-12">Nenhum post encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
}
