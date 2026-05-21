"use client";
import { useEffect } from "react";

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#13102a] border border-white/10 rounded-xl px-4 py-3 shadow-xl text-sm text-white/80 animate-fade-in">
      <span>{message}</span>
      <button
        onClick={onClose}
        className="text-white/30 hover:text-white/70 transition text-xs leading-none ml-1"
        aria-label="Fechar"
      >
        ✕
      </button>
    </div>
  );
}