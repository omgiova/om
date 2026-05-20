## apps-script — integração com Google Apps Script (clasp)

Este diretório guarda o código do Google Apps Script ligado ao projeto.

Objetivo
- Manter o código `.gs` versionado junto ao repositório.
- Permitir sincronização local ↔ Apps Script via `clasp`.

Requisitos
- `node` + `npm`
- `@google/clasp` (global ou via `npx`)

Comandos úteis

- Login (já feito no seu ambiente):
```
npx @google/clasp login
```

- Clonar um projeto existente (use o *Script ID*, sem `< >`):
```
npx @google/clasp clone <SCRIPT_ID>
```

- Criar um novo projeto Apps Script e gerar `.clasp.json`:
```
npx @google/clasp create --type standalone --title "om-apps-script"
```

- Trazer alterações do projeto remoto (quando `.clasp.json` existir):
```
npx @google/clasp pull
```

- Enviar alterações locais para o Apps Script:
```
npx @google/clasp push
```

Observações importantes
- Habilite a **Apps Script API** na sua conta: https://script.google.com/home/usersettings (se solicitado). Aguarde alguns minutos após habilitar.
- Não comite tokens/credenciais (`.clasprc.json` ou arquivos de credenciais). Adicione-os ao `.gitignore` local se necessário.
- Se preferir manter os arquivos dentro de `apps-script/`, defina em `.clasp.json` a propriedade `rootDir` com `apps-script`.

Boas práticas
- Mantenha o Script ID e os deployments documentados no README do `apps-script/` (ou num `docs/`).
- Antes de `push`, sempre rodar `clasp pull` para evitar sobrescrever trabalho remoto.
- Use mensagens de commit descritivas ao alterar o código do Apps Script.

Exemplo de `.clasp.json` (modelo): veja `.clasp.json.example` neste diretório — substitua `<SCRIPT_ID>` pelo seu ID.

---
Open Mídia · Maio 2026
