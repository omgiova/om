"use client";

import { useEffect, useMemo, useState } from "react";

/* ------------------------------------------------------------------ *
 * Protótipo do diagnóstico de presença digital.
 * Conteúdo vem de public/dados/diagnostico.csv — editar o CSV muda a
 * página, sem tocar neste arquivo.
 * Visual deliberadamente neutro (Arial, preto no branco) para não
 * interferir na avaliação do conteúdo.
 * ------------------------------------------------------------------ */

type Letra = "A" | "B" | "C";

type Linha = {
  foco: number;
  nivel: string;
  num1: number;
  pergunta1: string;
  subtitulo1: string;
  resposta1: Letra;
  textoResposta1: string;
  num2: number;
  pergunta2: string;
  subtitulo2: string;
  resposta2: Letra;
  textoResposta2: string;
  diagnostico: string;
};

type Pergunta = {
  num: number;
  enunciado: string;
  subtitulo: string;
  opcoes: { letra: Letra; texto: string }[];
};

type Foco = { foco: number; nivel: string; num1: number; num2: number };

const LETRAS: Letra[] = ["A", "B", "C"];

/* Texto de abertura do resultado. Sem citar nomes de etapas nem
   quantidades — a leitura abaixo dele já entrega isso. */
const METODOLOGIA =
  "A leitura a seguir cruza suas respostas com base em um modelo consolidado de " +
  "construção de marca, em que cada etapa só se sustenta quando a anterior já está " +
  "firme. É por isso que o resultado aponta o que já está construído antes de indicar " +
  "o que vem depois: presença digital não se conquista de uma vez, se acumula.";

/* --- parser de CSV: separador ";" e campos entre aspas --- */
function parseCsv(texto: string): string[][] {
  const linhas: string[][] = [];
  let campo = "";
  let atual: string[] = [];
  let dentroDeAspas = false;

  const limpo = texto.replace(/^﻿/, "").replace(/\r\n/g, "\n");

  for (let i = 0; i < limpo.length; i++) {
    const c = limpo[i];

    if (dentroDeAspas) {
      if (c === '"') {
        if (limpo[i + 1] === '"') {
          campo += '"';
          i++;
        } else {
          dentroDeAspas = false;
        }
      } else {
        campo += c;
      }
      continue;
    }

    if (c === '"') dentroDeAspas = true;
    else if (c === ";") {
      atual.push(campo);
      campo = "";
    } else if (c === "\n") {
      atual.push(campo);
      linhas.push(atual);
      atual = [];
      campo = "";
    } else campo += c;
  }

  if (campo !== "" || atual.length) {
    atual.push(campo);
    linhas.push(atual);
  }

  return linhas.filter((l) => l.some((c) => c.trim() !== ""));
}

function montarLinhas(csv: string): Linha[] {
  const [cabecalho, ...corpo] = parseCsv(csv);
  const idx = (nome: string) => cabecalho.indexOf(nome);

  const col = {
    foco: idx("foco"),
    nivel: idx("nivel_cbbe"),
    num1: idx("num_pergunta_1"),
    pergunta1: idx("pergunta_1"),
    subtitulo1: idx("subtitulo_1"),
    resposta1: idx("resposta_1"),
    texto1: idx("texto_resposta_1"),
    num2: idx("num_pergunta_2"),
    pergunta2: idx("pergunta_2"),
    subtitulo2: idx("subtitulo_2"),
    resposta2: idx("resposta_2"),
    texto2: idx("texto_resposta_2"),
    diagnostico: idx("diagnostico"),
  };

  return corpo.map((l) => ({
    foco: Number(l[col.foco]),
    nivel: l[col.nivel],
    num1: Number(l[col.num1]),
    pergunta1: l[col.pergunta1],
    subtitulo1: l[col.subtitulo1],
    resposta1: l[col.resposta1] as Letra,
    textoResposta1: l[col.texto1],
    num2: Number(l[col.num2]),
    pergunta2: l[col.pergunta2],
    subtitulo2: l[col.subtitulo2],
    resposta2: l[col.resposta2] as Letra,
    textoResposta2: l[col.texto2],
    diagnostico: l[col.diagnostico],
  }));
}

/* --- estilos --- */
const preto = "#000";
const fonte = "Arial, Helvetica, sans-serif";

/* tamanhos que escalam com a largura da tela — legíveis no celular
   sem ficarem grandes demais no desktop */
const tEnunciado = "clamp(21px, 5.4vw, 25px)";
const tSubtitulo = "clamp(15px, 4vw, 16px)";
const tOpcao = "clamp(16px, 4.2vw, 17px)";
const tCorpo = "clamp(16px, 4.2vw, 17px)";
const tRotulo = "clamp(12px, 3.2vw, 13px)";

const sTela: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 100,
  background: "#fff",
  color: preto,
  fontFamily: fonte,
  overflowY: "auto",
  WebkitTextSizeAdjust: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "clamp(16px, 4vw, 32px) clamp(12px, 3.5vw, 16px)",
};

const sCaixa: React.CSSProperties = {
  width: "100%",
  maxWidth: 720,
  background: "#fff",
  border: `1px solid ${preto}`,
  padding: "clamp(20px, 5.5vw, 32px)",
};

const sBotaoOpcao: React.CSSProperties = {
  display: "block",
  width: "100%",
  textAlign: "left",
  background: "#fff",
  color: preto,
  border: `1px solid ${preto}`,
  padding: "clamp(14px, 3.8vw, 16px)",
  marginBottom: 10,
  font: `400 ${tOpcao}/1.5 ${fonte}`,
  cursor: "pointer",
};

const sBotaoTexto: React.CSSProperties = {
  background: "none",
  border: "none",
  borderBottom: `1px solid ${preto}`,
  color: preto,
  font: `400 ${tRotulo}/1 ${fonte}`,
  padding: "0 0 2px",
  cursor: "pointer",
};

/* engrenagem desenhada à mão para não trazer estilo de biblioteca de ícone */
function IconeEngrenagem() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
    </svg>
  );
}

export default function DiagnosticoPage() {
  const [linhas, setLinhas] = useState<Linha[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [passo, setPasso] = useState(0);
  const [respostas, setRespostas] = useState<Record<number, Letra>>({});
  const [concluido, setConcluido] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [vendoRespostas, setVendoRespostas] = useState(false);

  useEffect(() => {
    fetch("/dados/diagnostico.csv")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((t) => setLinhas(montarLinhas(t)))
      .catch((e) => setErro(String(e)));
  }, []);

  const perguntas = useMemo<Pergunta[]>(() => {
    if (!linhas) return [];
    const mapa = new Map<number, Pergunta>();

    for (const l of linhas) {
      for (const lado of [1, 2] as const) {
        const num = lado === 1 ? l.num1 : l.num2;
        const enunciado = lado === 1 ? l.pergunta1 : l.pergunta2;
        const subtitulo = lado === 1 ? l.subtitulo1 : l.subtitulo2;
        const letra = lado === 1 ? l.resposta1 : l.resposta2;
        const texto = lado === 1 ? l.textoResposta1 : l.textoResposta2;

        if (!mapa.has(num)) mapa.set(num, { num, enunciado, subtitulo, opcoes: [] });
        const p = mapa.get(num)!;
        if (!p.opcoes.some((o) => o.letra === letra)) p.opcoes.push({ letra, texto });
      }
    }

    return [...mapa.values()]
      .map((p) => ({
        ...p,
        opcoes: LETRAS.map((L) => p.opcoes.find((o) => o.letra === L)!).filter(Boolean),
      }))
      .sort((a, b) => a.num - b.num);
  }, [linhas]);

  const focos = useMemo<Foco[]>(() => {
    if (!linhas) return [];
    const mapa = new Map<number, Foco>();
    for (const l of linhas) {
      if (!mapa.has(l.foco))
        mapa.set(l.foco, { foco: l.foco, nivel: l.nivel, num1: l.num1, num2: l.num2 });
    }
    return [...mapa.values()].sort((a, b) => a.foco - b.foco);
  }, [linhas]);

  const resultado = useMemo(() => {
    if (!linhas) return [];
    return focos.map((f) => {
      const r1 = respostas[f.num1];
      const r2 = respostas[f.num2];
      const linha = linhas.find(
        (l) => l.foco === f.foco && l.resposta1 === r1 && l.resposta2 === r2
      );
      return { foco: f.foco, nivel: f.nivel, texto: linha?.diagnostico ?? "" };
    });
  }, [linhas, focos, respostas]);

  function responder(num: number, letra: Letra) {
    const novas = { ...respostas, [num]: letra };
    setRespostas(novas);
    if (passo + 1 < perguntas.length) setPasso(passo + 1);
    else setConcluido(true);
  }

  function reiniciar() {
    setRespostas({});
    setPasso(0);
    setConcluido(false);
  }

  /* moldura comum: caixa branca + engrenagem persistente abaixo dela */
  function Moldura({ children }: { children: React.ReactNode }) {
    return (
      <div style={sTela}>
        <div style={{ width: "100%", maxWidth: 720 }}>
          <div style={sCaixa}>{children}</div>

          <div style={{ position: "relative", marginTop: 10 }}>
            <button
              type="button"
              aria-label="Configurações"
              onClick={() => setMenuAberto(!menuAberto)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                background: "#fff",
                color: preto,
                border: `1px solid ${preto}`,
                cursor: "pointer",
                padding: 0,
              }}
            >
              <IconeEngrenagem />
            </button>

            {menuAberto && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 36,
                  background: "#fff",
                  border: `1px solid ${preto}`,
                  minWidth: 180,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setVendoRespostas(!vendoRespostas);
                    setMenuAberto(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    background: "#fff",
                    color: preto,
                    border: "none",
                    padding: "10px 14px",
                    font: `400 ${tRotulo}/1.3 ${fonte}`,
                    cursor: "pointer",
                  }}
                >
                  {vendoRespostas ? "Voltar ao diagnóstico" : "Ver respostas"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (erro)
    return (
      <Moldura>
        <p style={{ font: `400 ${tCorpo}/1.55 ${fonte}` }}>
          Não foi possível carregar o diagnóstico ({erro}).
        </p>
      </Moldura>
    );

  if (!linhas)
    return (
      <Moldura>
        <p style={{ font: `400 ${tCorpo}/1.55 ${fonte}` }}>Carregando…</p>
      </Moldura>
    );

  /* --- conferência: as 36 respostas, separadas pelos 4 níveis --- */
  if (vendoRespostas)
    return (
      <Moldura>
        <p style={{ font: `400 ${tRotulo}/1 ${fonte}`, margin: "0 0 20px", letterSpacing: ".08em" }}>
          TODAS AS RESPOSTAS · {linhas.length} CRUZAMENTOS
        </p>

        {focos.map((f) => {
          const doFoco = linhas.filter((l) => l.foco === f.foco);
          return (
            <div key={f.foco} style={{ marginBottom: 32 }}>
              <p
                style={{
                  font: `700 ${tSubtitulo}/1.3 ${fonte}`,
                  margin: "0 0 4px",
                  paddingBottom: 8,
                  borderBottom: `1px solid ${preto}`,
                }}
              >
                Nível {f.foco} · {f.nivel}
              </p>
              <p style={{ font: `400 ${tRotulo}/1.5 ${fonte}`, margin: "8px 0 18px" }}>
                Pergunta {doFoco[0].num1} × Pergunta {doFoco[0].num2}
              </p>

              {doFoco.map((l) => (
                <div key={l.resposta1 + l.resposta2} style={{ marginBottom: 16 }}>
                  <p style={{ font: `700 ${tRotulo}/1.3 ${fonte}`, margin: "0 0 4px" }}>
                    {l.resposta1} + {l.resposta2}
                  </p>
                  <p style={{ font: `400 ${tCorpo}/1.55 ${fonte}`, margin: 0 }}>{l.diagnostico}</p>
                </div>
              ))}
            </div>
          );
        })}
      </Moldura>
    );

  /* --- resultado --- */
  if (concluido)
    return (
      <Moldura>
          <p style={{ font: `400 ${tRotulo}/1 ${fonte}`, margin: "0 0 20px", letterSpacing: ".08em" }}>
            DIAGNÓSTICO
          </p>

          <p style={{ font: `400 ${tSubtitulo}/1.6 ${fonte}`, margin: "0 0 28px" }}>
            {METODOLOGIA}
          </p>

          {resultado.map((r, i) => (
            <p
              key={r.foco}
              style={{
                font: `400 ${tCorpo}/1.6 ${fonte}`,
                margin: i < resultado.length - 1 ? "0 0 22px" : "0 0 28px",
              }}
            >
              {r.texto}
            </p>
          ))}

        <button type="button" style={sBotaoTexto} onClick={reiniciar}>
          Refazer
        </button>
      </Moldura>
    );

  /* --- uma pergunta por vez --- */
  const p = perguntas[passo];
  if (!p) return null;

  return (
    <Moldura>
        <p style={{ font: `400 ${tRotulo}/1 ${fonte}`, margin: "0 0 24px", letterSpacing: ".08em" }}>
          {passo + 1} / {perguntas.length}
        </p>

        <p style={{ font: `700 ${tEnunciado}/1.3 ${fonte}`, margin: "0 0 6px" }}>{p.enunciado}</p>
        <p style={{ font: `400 ${tSubtitulo}/1.5 ${fonte}`, margin: "0 0 24px" }}>{p.subtitulo}</p>

        <div>
          {p.opcoes.map((o) => (
            <button
              key={o.letra}
              type="button"
              style={sBotaoOpcao}
              onClick={() => responder(p.num, o.letra)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = preto;
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.color = preto;
              }}
            >
              {o.texto}
            </button>
          ))}
        </div>

      {passo > 0 && (
        <div style={{ marginTop: 18 }}>
          <button type="button" style={sBotaoTexto} onClick={() => setPasso(passo - 1)}>
            Voltar
          </button>
        </div>
      )}
    </Moldura>
  );
}
