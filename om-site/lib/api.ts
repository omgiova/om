const BASE = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL!;

// ── GET ──────────────────────────────────────────────────────
export async function getSheet(sheet: string) {
  const url = `${BASE}?action=getAll&sheet=${sheet}`;
  const res = await fetch(url);
  const json = await res.json();
  if (!json.ok) throw new Error(json.error);
  return json.data;
}

// ── POST ─────────────────────────────────────────────────────
async function post(body: object) {
  const res = await fetch(BASE, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error);
  return json.data;
}

export const addRow    = (sheet: string, data: object) =>
  post({ action: "add", sheet, data });

export const updateRow = (sheet: string, id: string, data: object) =>
  post({ action: "update", sheet, id, data });

export const deleteRow = (sheet: string, id: string) =>
  post({ action: "delete", sheet, id });

export const updateIdentidade = (data: object) =>
  post({ action: "updateIdentidade", data });

export const updateComunicamos = (data: object) =>
  post({ action: "updateComunicamos", data });

// ── EXPORT CONTEXT (para IA) ─────────────────────────────────
export async function exportContext(sheet = "all", filtro = "") {
  const url = `${BASE}?action=exportContext&sheet=${sheet}&filtro=${encodeURIComponent(filtro)}`;
  const res = await fetch(url);
  return res.text();
}