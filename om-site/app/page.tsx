"use client";
import Link from "next/link";
import { usePosts, useMateriais, useGanchos, useICP } from "@/hooks/useSheet";
import { ExportButton } from "@/components/ExportButton";
import { FileText, Users, Zap, Package, ArrowRight } from "lucide-react";

const sections = [
  { href: "/identidade",  num: "1",  label: "Identidade",          desc: "Posicionamento, pilares e regras de produção" },
  { href: "/icp",         num: "2",  label: "ICP",                  desc: "Perfis de cliente ideal — prioritários e secundários" },
  { href: "/comunicamos", num: "3",  label: "Como Comunicamos",     desc: "As duas camadas, tom de voz e vocabulário" },
  { href: "/categorias",  num: "4a", label: "Categorias",           desc: "As 4 categorias, subcategorias e formatos" },
  { href: "/materiais",   num: "4b", label: "Materiais Gratuitos",  desc: "Banco de iscas por nicho" },
  { href: "/ganchos",     num: "4c", label: "Ganchos Anti-Ads",     desc: "Ganchos validados e onde usar cada um" },
  { href: "/posts",       num: "5",  label: "Sugestões de Posts",   desc: "Banco de posts com copy completa" },
  { href: "/pesquisas",   num: "6",  label: "Pesquisas",            desc: "Dados de mercado e SEO" },
];

export default function Dashboard() {
  const posts     = usePosts();
  const materiais = useMateriais();
  const ganchos   = useGanchos();
  const icp       = useICP();

  const stats = [
    { icon: FileText, label: "Posts",     value: posts.data?.length     ?? "–" },
    { icon: Package,  label: "Materiais", value: materiais.data?.length ?? "–" },
    { icon: Zap,      label: "Ganchos",   value: ganchos.data?.length   ?? "–" },
    { icon: Users,    label: "ICPs",      value: icp.data?.length       ?? "–" },
  ];

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="text-[10px] tracking-[.2em] uppercase text-[#F97316] mb-2">
            Open Mídia Digital
          </p>
          <h1 className="font-display text-4xl text-white leading-tight">
            Studio
          </h1>
          <p className="text-white/40 mt-2 text-sm">
            Painel de estratégia · Método Fora da Caixa
          </p>
        </div>
        <ExportButton sheet="all" label="Exportar projeto completo" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="card p-4">
            <div className="flex items-center gap-2 text-white/30 mb-3">
              <Icon size={14} />
              <span className="text-xs">{label}</span>
            </div>
            <p className="text-3xl font-display text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Seções */}
      <div className="grid grid-cols-2 gap-3">
        {sections.map(({ href, num, label, desc }) => (
          <Link key={href} href={href} className="card p-5 group flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono text-[#F97316]/60 w-6 text-center">
                {num}
              </span>
              <div>
                <p className="text-sm font-medium text-white group-hover:text-[#F97316] transition-colors">
                  {label}
                </p>
                <p className="text-xs text-white/30 mt-0.5">{desc}</p>
              </div>
            </div>
            <ArrowRight size={14} className="text-white/20 group-hover:text-[#F97316] transition-colors shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
