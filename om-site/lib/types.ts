// ── 1. Identidade ────────────────────────────────────────────
export type Identidade = {
  secao: string;
  chave: string;
  conteudo: string;
};

// ── 2. ICP ───────────────────────────────────────────────────
export type ICP = {
  id: string;
  tipo: "Prioritário" | "Secundário";
  perfil: string;
  dor_principal: string;
  contexto: string;
};

// ── 3. Como Comunicamos ──────────────────────────────────────
export type Comunicamos = {
  secao: string;
  chave: string;
  conteudo: string;
};

// ── 4a. Categorias ───────────────────────────────────────────
export type Categoria = {
  educacao: string;
  bastidores: string;
  resultado: string;
  branding: string;
};

// ── 4b. Materiais Gratuitos ──────────────────────────────────
export type Material = {
  id: string;
  nicho: string;
  titulo: string;
  principio: string;
};

// ── 4c. Linguagem e Ganchos ──────────────────────────────────
export type Gancho = {
  id: string;
  gancho: string;    // key normalizada pode variar
  onde_usar: string;
};

// ── 5. Sugestões de Posts ────────────────────────────────────
export type Post = {
  id: string;
  categoria: string;
  subcategoria: string;
  formato: string;
  copy_completa: string;
};

// ── 6. Pesquisas ─────────────────────────────────────────────
export type Pesquisa = {
  tipo: string;
  dado: string;
  volume: string;
  observacao: string;
};
