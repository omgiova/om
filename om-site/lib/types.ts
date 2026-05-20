// ── 1. Identidade ────────────────────────────────────────────
export type Identidade = {
  id?: string;
  secao: string;
  chave: string;
  conteudo: string;
  favorito?: string;
};

// ── 2. ICP ───────────────────────────────────────────────────
export type ICP = {
  id: string;
  tipo: "Prioritário" | "Secundário";
  perfil: string;
  dor_principal: string;
  contexto: string;
  favorito?: string;
};

// ── 3. Como Comunicamos ──────────────────────────────────────
export type Comunicamos = {
  id?: string;
  secao: string;
  chave: string;
  conteudo: string;
  favorito?: string;
};

// ── 4a. Categorias ───────────────────────────────────────────
export type Categoria = {
  id: string;
  categoria: string;
  subcategoria: string;
  favorito?: string;
};

// ── 4b. Materiais Gratuitos ──────────────────────────────────
export type Material = {
  id: string;
  nicho: string;
  titulo: string;
  principio: string;
  favorito?: string;
};

// ── 4c. Linguagem e Ganchos ──────────────────────────────────
export type Gancho = {
  id: string;
  gancho: string;    // key normalizada pode variar
  onde_usar: string;
  favorito?: string;
};

// ── 5. Sugestões de Posts ────────────────────────────────────
export type Post = {
  id: string;
  categoria: string;
  subcategoria: string;
  formato: string;
  copy_completa: string;
  favorito?: string;
};

// ── 6. Pesquisas ─────────────────────────────────────────────
export type Pesquisa = {
  id?: string;
  tipo: string;
  dado: string;
  volume: string;
  observacao: string;
  favorito?: string;
};
