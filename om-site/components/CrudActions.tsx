"use client";
import { Pencil, Trash2, Star, StarOff } from "lucide-react";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
  onFavorite?: () => void;
  favorited?: boolean;
};

export function CrudActions({ onEdit, onDelete, onFavorite, favorited }: Props) {
  return (
    <div className="flex items-center gap-2">
      {onFavorite && (
        <button
          type="button"
          onClick={onFavorite}
          title={favorited ? "Remover favorito" : "Favoritar"}
          className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition"
        >
          {favorited ? <Star size={16} className="text-yellow-300" /> : <StarOff size={16} />}
        </button>
      )}
      <button
        type="button"
        onClick={onEdit}
        title="Editar"
        className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition"
      >
        <Pencil size={16} />
      </button>
      <button
        type="button"
        onClick={onDelete}
        title="Excluir"
        className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
