"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const nav = [
  { href: "/",            label: "Dashboard",          num: "—"  },
  { href: "/identidade",  label: "Identidade",          num: "1"  },
  { href: "/icp",         label: "ICP",                 num: "2"  },
  { href: "/comunicamos", label: "Como Comunicamos",    num: "3"  },
  { href: "/categorias",  label: "Categorias",          num: "4a" },
  { href: "/materiais",   label: "Materiais Gratuitos", num: "4b" },
  { href: "/ganchos",     label: "Linguagem e Ganchos", num: "4c" },
  { href: "/posts",       label: "Sugestões de Posts",  num: "5"  },
  { href: "/pesquisas",   label: "Pesquisas",           num: "6"  },
];

export function Sidebar() {
  const path = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 flex flex-col border-r border-white/5 bg-[#0a0a16] z-40">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/5">
        <span className="font-display text-lg text-white leading-tight">
          Open Mídia
        </span>
        <p className="text-[10px] text-purple-300 mt-0.5 tracking-widest uppercase">
          Studio
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {nav.map(({ href, label, num }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-5 py-2.5 text-sm transition-all",
                active
                  ? "text-white bg-purple/20 border-r-2 border-[#F97316]"
                  : "text-white/40 hover:text-white/80 hover:bg-white/3"
              )}
            >
              <span className={clsx(
                "text-[10px] font-mono w-6 text-center shrink-0",
                active ? "text-[#F97316]" : "text-white/20"
              )}>
                {num}
              </span>
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/5">
        <p className="text-[10px] text-white/20">
          Método Fora da Caixa
        </p>
      </div>
    </aside>
  );
}
