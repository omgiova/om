"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
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
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Barra topo — só mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#0a0a16] border-b border-white/5 z-50 flex items-center px-4 gap-3">
        <button
          onClick={() => setOpen(true)}
          className="p-1.5 text-white/50 hover:text-white transition"
        >
          <Menu size={20} />
        </button>
        <div>
          <span className="font-display text-base text-white leading-tight">Open Mídia</span>
          <p className="text-[9px] text-purple-300 tracking-widest uppercase leading-none mt-0.5">Studio</p>
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "fixed left-0 top-0 h-screen w-56 flex flex-col border-r border-white/5 bg-[#0a0a16] z-50 transition-transform duration-300",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="px-5 py-6 border-b border-white/5 flex items-start justify-between">
          <div>
            <span className="font-display text-lg text-white leading-tight">
              Open Mídia
            </span>
            <p className="text-[10px] text-purple-300 mt-0.5 tracking-widest uppercase">
              Studio
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-1 text-white/30 hover:text-white transition mt-0.5"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {nav.map(({ href, label, num }) => {
            const active = path === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
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
            Painel de estratégia
          </p>
        </div>
      </aside>
    </>
  );
}
