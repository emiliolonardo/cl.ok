# D.O.S. Time OS

Scaffold iniziale per una web app SaaS di time tracking avanzato ispirata a Clockify, con identità visuale e architetturale D.O.S.

## Struttura progetto

```txt
.
├─ apps/
│  └─ web/
│     ├─ public/
│     │  ├─ fonts/
│     │  └─ icons/
│     ├─ src/
│     │  ├─ app/
│     │  │  ├─ (workspace)/
│     │  │  │  ├─ dashboard/
│     │  │  │  ├─ timer/
│     │  │  │  ├─ entries/
│     │  │  │  ├─ projects/
│     │  │  │  ├─ tasks/
│     │  │  │  ├─ analytics/
│     │  │  │  ├─ reports/
│     │  │  │  ├─ team/
│     │  │  │  ├─ calendar/
│     │  │  │  ├─ abcde/
│     │  │  │  ├─ mesh/
│     │  │  │  ├─ knowledge/
│     │  │  │  ├─ prompt-ops/
│     │  │  │  └─ settings/
│     │  │  ├─ layout.tsx
│     │  │  └─ globals.css
│     │  ├─ components/
│     │  ├─ features/
│     │  ├─ design-system/
│     │  ├─ lib/
│     │  ├─ store/
│     │  ├─ hooks/
│     │  ├─ types/
│     │  └─ tests/
│     ├─ package.json
│     ├─ tailwind.config.ts
│     └─ tsconfig.json
├─ packages/
│  ├─ ui/
│  ├─ config-eslint/
│  └─ config-ts/
├─ docs/
│  ├─ Design-System.md
│  ├─ IA.md
│  └─ UX-Copy.md
├─ .github/workflows/
├─ package.json
└─ pnpm-workspace.yaml
```

## Note

- `apps/web/src/design-system/tokens.ts` contiene i design token base.
- Le route in `app/(workspace)` riflettono i moduli principali del sistema operativo D.O.S.
- La struttura è pronta per evolvere in multi-tenant SaaS.

## Avvio rapido

```bash
pnpm install
pnpm dev
```

L'app web viene avviata di default su `http://localhost:5466` (redirect automatico a `/dashboard`).

Comandi disponibili:
- `pnpm dev`
- `pnpm dev:default-port` (usa la porta standard Next, tipicamente `3000`)
- `pnpm build`
- `pnpm lint`

Questo workspace usa `pnpm` come package manager unico (`pnpm-workspace.yaml` + `packageManager` in root). Evitare `npm install` per non generare lockfile incoerenti.
