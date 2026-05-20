// ============================================================
// OPEN MÍDIA DIGITAL — Apps Script Web App v2
// Planilha: om_planilha_v3
// Cole todo esse conteúdo no Código.gs, salve e reimplante
// ============================================================

const ABAS = {
  identidade:   "1. Identidade",
  icp:          "2. ICP",
  comunicamos:  "3. Como Comunicamos",
  categorias:   "4a. Categorias",
  materiais:    "4b. Materiais Gratuitos",
  ganchos:      "4c. Linguagem e Ganchos",
  posts:        "5. Sugestões de Posts",
  pesquisas:    "6. Pesquisas",
};

const HEADER_ROW = 2;
const HEADER_ROW_OVERRIDES = {
  categorias: 1,
};

const SKIP_ROWS = {
  icp: [3, 4],
};

function detectHeaderRow(dados) {
  const maxScan = Math.min(5, dados.length);
  for (let i = 0; i < maxScan; i++) {
    const row = dados[i];
    if (!row) continue;

    const normalized = row
      .map(cell => normalizeKey(String(cell)))
      .filter(value => value && value !== "");

    if (normalized.length >= 2) {
      return i + 1;
    }
  }
  return HEADER_ROW;
}

function getHeaderRow(sheetKey, dados) {
  if (HEADER_ROW_OVERRIDES[sheetKey]) return HEADER_ROW_OVERRIDES[sheetKey];
  return detectHeaderRow(dados);
}

function doGet(e) {
  const p      = e.parameter;
  const action = p.action  || "getAll";
  const sheet  = p.sheet   || "posts";
  const filtro = p.filtro  || "";

  try {
    if (action === "exportContext") {
      const texto = exportContext(sheet, filtro);
      return ContentService
        .createTextOutput(texto)
        .setMimeType(ContentService.MimeType.TEXT);
    }

    if (action === "getAll") {
      return jsonOk(getData(sheet));
    }

    return jsonOk({ message: "action desconhecida: " + action });

  } catch (err) {
    return jsonErr(err.message);
  }
}

function doPost(e) {
  try {
    const body   = JSON.parse(e.postData.contents);
    const action = body.action;
    const sheet  = body.sheet || "posts";
    const data   = body.data  || {};
    const id     = body.id    || "";

    let result;

    switch (action) {
      case "add":              result = addRow(sheet, data);           break;
      case "update":           result = updateRow(sheet, id, data);    break;
      case "delete":           result = deleteRow(sheet, id);          break;
      case "updateIdentidade": result = updateIdentidade(data);        break;
      case "updateComunicamos":result = updateComunicamos(data);       break;
      default: throw new Error("action desconhecida: " + action);
    }

    return jsonOk(result);

  } catch (err) {
    return jsonErr(err.message);
  }
}

function detectHeaderRow(dados) {
  const maxScan = Math.min(5, dados.length);
  for (let i = 0; i < maxScan; i++) {
    const row = dados[i];
    if (!row) continue;

    const normalized = row
      .map(cell => normalizeKey(String(cell)))
      .filter(value => value && value !== "");

    if (normalized.length >= 2) {
      return i + 1;
    }
  }
  return HEADER_ROW;
}

function getHeaderRow(sheetKey, dados) {
  if (HEADER_ROW_OVERRIDES[sheetKey]) return HEADER_ROW_OVERRIDES[sheetKey];
  return detectHeaderRow(dados);
}

function getData(sheetKey) {
  const nomeDaAba = ABAS[sheetKey];
  if (!nomeDaAba) throw new Error("Aba desconhecida: " + sheetKey);

  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const ws    = ss.getSheetByName(nomeDaAba);
  if (!ws) throw new Error("Aba não encontrada na planilha: " + nomeDaAba);

  const dados   = ws.getDataRange().getValues();
  const headerRow = getHeaderRow(sheetKey, dados);
  const headers = dados[headerRow - 1].map(h => normalizeKey(String(h)));
  const hasId   = headers.includes("id");
  const skip    = SKIP_ROWS[sheetKey] || [];
  const rows    = [];

  let generatedId = 1;
  for (let i = headerRow; i < dados.length; i++) {
    const rowNum = i + 1;
    if (skip.includes(rowNum)) continue;

    const row = {};
    headers.forEach((h, j) => {
      if (h) row[h] = String(dados[i][j]).trim();
    });

    if (Object.values(row).every(v => v === "")) continue;
    if (!hasId) {
      row["id"] = String(generatedId).padStart(2, "0");
      generatedId += 1;
    }

    rows.push(row);
  }

  return rows;
}

// ← ÚNICA FUNÇÃO ALTERADA
function addRow(sheetKey, data) {
  const nomeDaAba = ABAS[sheetKey];
  const ss  = SpreadsheetApp.getActiveSpreadsheet();
  const ws  = ss.getSheetByName(nomeDaAba);
  const headerRow = getHeaderRow(sheetKey, ws.getDataRange().getValues());
  const headers = ws.getRange(headerRow, 1, 1, ws.getLastColumn()).getValues()[0]
    .map(h => normalizeKey(String(h)));

  const extraKeys = Object.keys(data).filter(k => !headers.includes(k));
  if (extraKeys.length > 0) {
    ws.getRange(headerRow, headers.length + 1, 1, extraKeys.length)
      .setValues([extraKeys]);
    headers.push(...extraKeys);
  }

  const lastRow = ws.getLastRow();
  const newId   = String(lastRow - headerRow).padStart(2, "0");
  data["id"] = newId;

  const newRow = headers.map(h => data[h] || "");
  ws.appendRow(newRow);

  // Copia formatação da linha anterior para a nova
  const novaLinha = ws.getLastRow();
  ws.getRange(novaLinha - 1, 1, 1, ws.getLastColumn())
    .copyTo(
      ws.getRange(novaLinha, 1, 1, ws.getLastColumn()),
      SpreadsheetApp.CopyPasteType.PASTE_FORMAT,
      false
    );

  return { id: newId, inserted: true };
}

function updateRow(sheetKey, id, data) {
  const nomeDaAba = ABAS[sheetKey];
  const ss  = SpreadsheetApp.getActiveSpreadsheet();
  const ws  = ss.getSheetByName(nomeDaAba);
  const all = ws.getDataRange().getValues();
  const headerRow = getHeaderRow(sheetKey, all);
  const headers = all[headerRow - 1].map(h => normalizeKey(String(h)));
  const hasId = headers.includes("id");
  const skip    = SKIP_ROWS[sheetKey] || [];

  const extraKeys = Object.keys(data).filter(k => !headers.includes(k));
  if (extraKeys.length > 0) {
    ws.getRange(headerRow, headers.length + 1, 1, extraKeys.length)
      .setValues([extraKeys]);
    headers.push(...extraKeys);
  }

  let currentIndex = 0;
  for (let i = headerRow; i < all.length; i++) {
    const rowNum = i + 1;
    if (skip.includes(rowNum)) continue;
    currentIndex += 1;

    const rowId = hasId
      ? String(all[i][0]).trim()
      : String(currentIndex).padStart(2, "0");

    if (String(rowId) !== String(id).trim()) continue;

    headers.forEach((h, j) => {
      if (data[h] !== undefined) {
        ws.getRange(rowNum, j + 1).setValue(data[h]);
      }
    });
    return { updated: id };
  }

  throw new Error("ID não encontrado: " + id);
}

function deleteRow(sheetKey, id) {
  const nomeDaAba = ABAS[sheetKey];
  const ss  = SpreadsheetApp.getActiveSpreadsheet();
  const ws  = ss.getSheetByName(nomeDaAba);
  const all = ws.getDataRange().getValues();
  const headerRow = getHeaderRow(sheetKey, all);
  const headers = all[headerRow - 1].map(h => normalizeKey(String(h)));
  const hasId = headers.includes("id");
  const skip = SKIP_ROWS[sheetKey] || [];

  let currentIndex = 0;
  for (let i = headerRow; i < all.length; i++) {
    const rowNum = i + 1;
    if (skip.includes(rowNum)) continue;
    currentIndex += 1;

    const rowId = hasId
      ? String(all[i][0]).trim()
      : String(currentIndex).padStart(2, "0");

    if (String(rowId) !== String(id).trim()) continue;

    ws.deleteRow(rowNum);
    return { deleted: id };
  }

  throw new Error("ID não encontrado: " + id);
}

function updateIdentidade(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName(ABAS["identidade"]);
  const all = ws.getDataRange().getValues();

  const updated = [];
  for (let i = HEADER_ROW; i < all.length; i++) {
    const chave = String(all[i][1]).trim();
    if (data[chave] !== undefined) {
      ws.getRange(i + 1, 3).setValue(data[chave]);
      updated.push(chave);
    }
  }
  return { updated };
}

function updateComunicamos(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName(ABAS["comunicamos"]);
  const all = ws.getDataRange().getValues();

  const updated = [];
  for (let i = HEADER_ROW; i < all.length; i++) {
    const chave = String(all[i][1]).trim();
    if (data[chave] !== undefined) {
      ws.getRange(i + 1, 3).setValue(data[chave]);
      updated.push(chave);
    }
  }
  return { updated };
}

function exportContext(sheetKey, filtro) {
  const agora = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  let out = `# OPEN MÍDIA DIGITAL — Contexto do Projeto\n`;
  out    += `_Gerado em: ${agora}_\n\n`;

  const alvo = sheetKey === "all"
    ? Object.keys(ABAS)
    : [sheetKey];

  alvo.forEach(key => {
    try {
      const rows = getData(key);
      out += exportBloco(key, rows, filtro) + "\n";
    } catch(err) {
      out += `\n## ${key.toUpperCase()}\n_Erro ao carregar: ${err.message}_\n`;
    }
  });

  return out;
}

function exportBloco(key, rows, filtro) {
  const sep = "=".repeat(60);
  let b = `\n${sep}\n`;

  switch (key) {

    case "identidade": {
      b += `## 1. IDENTIDADE DA MARCA\n\n`;
      let secaoAtual = "";
      rows.forEach(r => {
        const secao    = r["seção"]    || r["secao"]    || "";
        const chave    = r["chave"]    || "";
        const conteudo = r["conteúdo"] || r["conteudo"] || "";
        if (!chave) return;
        if (secao && secao !== secaoAtual) {
          b += `\n### ${secao}\n`;
          secaoAtual = secao;
        }
        b += `**${chave}:** ${conteudo}\n\n`;
      });
      break;
    }

    case "icp": {
      b += `## 2. ICP — PARA QUEM FALAMOS\n\n`;
      rows.forEach(r => {
        const tipo   = r["tipo"]          || "";
        const perfil = r["perfil"]        || "";
        const dor    = r["dor_principal"] || "";
        const ctx    = r["contexto"]      || "";
        if (!perfil) return;
        b += `### ${perfil} _(${tipo})_\n`;
        b += `**Dor principal:** ${dor}\n`;
        b += `**Contexto:** ${ctx}\n\n`;
      });
      break;
    }

    case "comunicamos": {
      b += `## 3. COMO COMUNICAMOS\n\n`;
      let secaoAtual = "";
      rows.forEach(r => {
        const secao    = r["seção"]    || r["secao"]    || "";
        const chave    = r["chave"]    || "";
        const conteudo = r["conteúdo"] || r["conteudo"] || "";
        if (!chave) return;
        if (secao && secao !== secaoAtual) {
          b += `\n### ${secao}\n`;
          secaoAtual = secao;
        }
        b += `**${chave}:** ${conteudo}\n\n`;
      });
      break;
    }

    case "categorias": {
      b += `## 4a. CATEGORIAS DE CONTEÚDO\n\n`;
      b += `| Educação | Bastidores | Resultado | Branding |\n`;
      b += `|---|---|---|---|\n`;
      rows.forEach(r => {
        const vals = Object.values(r);
        b += `| ${vals.join(" | ")} |\n`;
      });
      b += "\n";
      break;
    }

    case "materiais": {
      b += `## 4b. MATERIAIS GRATUITOS\n\n`;
      let nichoAtual = "";
      rows.forEach(r => {
        const nicho     = r["nicho"]     || "";
        const titulo    = r["título"]    || r["titulo"]    || "";
        const principio = r["princípio"] || r["principio"] || "";
        if (!titulo) return;
        if (nicho !== nichoAtual) {
          b += `\n### ${nicho}\n`;
          nichoAtual = nicho;
        }
        b += `- **${titulo}** _(${principio})_\n`;
      });
      break;
    }

    case "ganchos": {
      b += `## 4c. LINGUAGEM E GANCHOS ANTI-ADS\n\n`;
      rows.forEach(r => {
        const gancho = r["gancho_/_texto"] || r["gancho"] || r[Object.keys(r)[1]] || "";
        const onde   = r["onde_usar"]      || "";
        if (!gancho) return;
        b += `> "${gancho}"\n`;
        b += `_Onde usar: ${onde}_\n\n`;
      });
      break;
    }

    case "posts": {
      b += `## 5. SUGESTÕES DE POSTS\n\n`;
      let catAtual = "";
      const filtrados = filtro
        ? rows.filter(r =>
            (r["categoria"]    || "").toLowerCase().includes(filtro.toLowerCase()) ||
            (r["subcategoria"] || "").toLowerCase().includes(filtro.toLowerCase()) ||
            (r["formato"]      || "").toLowerCase().includes(filtro.toLowerCase()))
        : rows;

      filtrados.forEach(r => {
        const cat    = r["categoria"]     || "";
        const subcat = r["subcategoria"]  || "";
        const fmt    = r["formato"]       || "";
        const copy   = r["copy_completa"] || r["copy"] || "";

        if (cat !== catAtual) {
          b += `\n### ${cat.toUpperCase()}\n`;
          catAtual = cat;
        }
        b += `\n#### ${subcat} · ${fmt}\n\n`;
        b += `${copy}\n`;
        b += `${"─".repeat(40)}\n`;
      });
      break;
    }

    case "pesquisas": {
      b += `## 6. PESQUISAS — DADOS DE MERCADO E SEO\n\n`;
      rows.forEach(r => {
        const dado = r["dado_/_termo"] || r["dado"] || r[Object.keys(r)[1]] || "";
        const vol  = r["volume"] || "";
        const obs  = r["observação"] || r["observacao"] || r[Object.keys(r)[3]] || "";
        if (!dado) return;
        if (vol) {
          b += `- **${dado}** · Volume: ${vol} · ${obs}\n`;
        } else {
          b += `- **${dado}** — ${obs}\n`;
        }
      });
      break;
    }

    default:
      b += `## ${key.toUpperCase()}\n`;
      rows.forEach(r => {
        b += Object.entries(r)
          .filter(([,v]) => v)
          .map(([k,v]) => `**${k}:** ${v}`)
          .join(" · ") + "\n";
      });
  }

  return b;
}

function normalizeKey(str) {
  return str
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_\/]/g, "");
}

function jsonOk(data) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, data }))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonErr(msg) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: false, error: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}