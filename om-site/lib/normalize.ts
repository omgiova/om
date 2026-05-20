const FIELD_ALIASES: Record<string, string> = {
  categorias: "categoria",
  categoria: "categoria",
  subcategorias: "subcategoria",
  subcategoria: "subcategoria",
  formato: "formato",
  formatos: "formato",
  copy_completa: "copy_completa",
  copia_completa: "copy_completa",
  copycompleta: "copy_completa",
  copy: "copy_completa",
  conteudo: "conteudo",
  secao: "secao",
  seção: "secao",
  chave: "chave",
  gancho: "gancho",
  gancho_texto: "gancho",
  "gancho_/_texto": "gancho",
  texto: "gancho",
  onde_usar: "onde_usar",
  ondeusar: "onde_usar",
  "onde usar": "onde_usar",
  tipo: "tipo",
  perfil: "perfil",
  dor_principal: "dor_principal",
  dorprincipal: "dor_principal",
  contexto: "contexto",
  titulo: "titulo",
  principio: "principio",
  dado: "dado",
  termo: "dado",
  volume: "volume",
  observacao: "observacao",
  observa: "observacao",
  obs: "observacao",
  id: "id",
  favorito: "favorito",
  favorita: "favorito",
  categoria_principal: "categoria",
  tags: "tags",
};

function removeAccents(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function normalizeKey(key: string): string {
  return removeAccents(key)
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_");
}

export function canonicalizeField(key: string): string {
  const normalized = normalizeKey(key);
  return FIELD_ALIASES[normalized] ?? normalized;
}

export function normalizeValue(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value).trim();
  if (Array.isArray(value)) return value.join(", ").trim();
  return String(value).trim();
}

export function normalizeRow(row: Record<string, unknown>): Record<string, string> {
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(row)) {
    const field = canonicalizeField(key);
    if (!field) continue;
    normalized[field] = normalizeValue(value);
  }
  return normalized;
}

export function normalizeSheet(rows: Record<string, unknown>[]): Record<string, string>[] {
  return rows.map(normalizeRow);
}
