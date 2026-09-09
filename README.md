# MASCON — Sistema de Atividades

Sistema web interno para a agência de contabilidade **MASCON**. Gerenciamento de tarefas **globais e compartilhadas** entre todos os funcionários, com atualização em tempo real e baixo consumo do Firebase.

> Stack: React + TypeScript + Vite + Firebase Cloud Firestore + HashRouter (GitHub Pages)

---

## Funcionalidades

- Login mockado (João, Maria, Pedro, Lucas, admin) — sem senha, sem cadastro
- Atividades globais compartilhadas (uma única coleção `atividades`)
- Criar / editar / excluir / concluir tarefas
- Conclusão única com **transaction atômica** (apenas um usuário consegue concluir)
- Status: Pendente 🟡 / Atrasada 🔴 / Concluída 🟢 (cálculo local, sem consulta extra)
- Filtros (Todas/Pendentes/Atrasadas/Concluídas) e ordenação (prazo, criação) — tudo no React
- Dashboard com indicadores (Total, Pendentes, Atrasadas, Concluídas)
- Tempo real via **único `onSnapshot`** na coleção `atividades`
- Responsivo (desktop, tablet, celular)

---

## Estrutura

```
src/
├── firebase/     # config.ts, atividades.ts (CRUD + transaction)
├── types/        # atividade.ts, usuario.ts
├── hooks/        # useAtividades (único listener), useAuthMock
├── components/   # Header, DashboardStats, FiltrosBar, AtividadeCard, AtividadeForm, ConfirmDialog
├── pages/        # LoginPage, DashboardPage
├── utils/        # datas.ts, status.ts
├── styles/       # globals.css
├── App.tsx       # HashRouter + AuthProvider (localStorage)
└── main.tsx
```

---

## Configuração do Firebase

### 1. Criar projeto

1. Acesse https://console.firebase.google.com → **Add project** (MASCON)
2. **Project Settings → General → Your apps → Web app** → copie o `firebaseConfig`
3. **Build → Firestore Database → Create database** → Start in **test mode** (depois troque rules)

### 2. Preencher `.env`

Copie `.env.example` para `.env` na raiz:

```bash
cp .env.example .env
```

Preencha com os valores do console:

```ini
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

> `.env` está no `.gitignore` e **não** deve ser commitado. `.env.example` fica no repo como modelo.

### 3. Firestore — coleção `atividades`

Não precisa criar manualmente — o primeiro `addDoc` cria a coleção. Cada documento tem:

```
atividades/{autoId}
  titulo: string
  descricao: string
  criadaPor: string        // id mock (joao, maria...)
  criadaPorNome: string    // "João"
  criadaEm: Timestamp      // serverTimestamp
  prazo: Timestamp
  concluida: boolean
  concluidaPor: string|null
  concluidaPorNome: string|null
  concluidaEm: Timestamp|null
```

Não existe `usuarios/{id}/atividades` — é **global**.

### 4. Security Rules

Arquivo `firestore.rules` na raiz. No console: **Firestore → Rules** → cole o conteúdo.

- **V1 (ativa):** `allow read, write: if true` — necessária porque login é mockado (sem `request.auth`). **Insegura** — qualquer pessoa com a apiKey pode escrever. Use apenas em rede interna ou em dev.
- **V2 (comentada):** pronta para quando migrar para Firebase Auth (Anonymous ou Email/Senha). Basta descomentar e comentar a V1. Ela impede sobrescrever conclusão e reabrir tarefas.

> **Recomendação:** para produção, migre para Firebase Auth. O app já isola a lógica de auth em `useAuthMock` — a troca é `signInAnonymously()` + `onAuthStateChanged`, ~30 min. As rules V2 já estão prontas.

---

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:5173/Mascon/
npm run build    # confere tsc + vite build
npm run preview  # serve dist local
```

Se `.env` estiver vazio, o app mostra erro amigável: *“Firebase não configurado. Preencha o arquivo .env…”*.

---

## Deploy no GitHub Pages

Repositório: `https://github.com/JF532/Mascon.git`

### `vite.config.ts`

```ts
base: "/Mascon/"   // deve bater com o nome do repo (case-sensitive)
```

Se renomear o repo, ajuste o `base`. User/Org page (`JF532.github.io`) usaria `base: "/"`.

### GitHub Actions

Workflow em `.github/workflows/deploy.yml`:

- Trigger: `push` em `main`
- Build com `npm ci && npm run build` (lê secrets `VITE_FIREBASE_*`)
- Deploy via `actions/deploy-pages@v4`

### Configurar no GitHub

1. **Settings → Secrets and variables → Actions → New repository secret** — crie os 6 `VITE_FIREBASE_*` (mesmos do `.env`)
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**
3. `git push` em `main` → Actions roda → site em `https://jf532.github.io/Mascon/#/`

> HashRouter (`/#/`) evita o problema clássico de SPA no GH Pages (404 ao recarregar). Não precisa de `404.html`.

---

## Economia do Firebase

Implementado conforme exigido:

- **Um único `onSnapshot`** em `atividades` (`src/firebase/atividades.ts:subscribeAtividades`) — sem listener por tarefa, sem polling, sem N+1
- Filtros, ordenação e `isAtrasada` calculados no React (`useMemo`, `utils/datas.ts`)
- Criar/editar/excluir/concluir atualizam via `addDoc/updateDoc/deleteDoc/runTransaction` e o `onSnapshot` reflete para todos — sem `getDocs` repetidos
- Consumo estimado: 1 read por doc na carga inicial + 1 read por doc alterado (delta do listener). Sem o listener, zero reads pós-carga, mas sem tempo real.

**Pontos que ainda geram leitura/escrita:**

- Cada nova atividade: 1 write
- Cada edição/exclusão/conclusão: 1 write (conclusão: 1 read + 1 write na transaction)
- Listener ativo: 1 read por doc criado/alterado/excluído (cobrado pelo Firestore)

---

## Tratamento de erros

- Carregamento: skeleton + mensagem
- Firebase não configurado: erro em tela com instrução
- Campos inválidos: validação no form
- Conclusão concorrente: `ConcluidaError` → toast *“Esta tarefa já foi concluída por Maria.”*
- Exclusão: dialog de confirmação obrigatório
- Rede: listener `onError` → alerta

---

## Próximos passos sugeridos

- Migrar para Firebase Auth Anonymous para habilitar rules seguras
- Adicionar índice composto se ordenar por `prazo` + `criadaEm`
- Paginação se `atividades` passar de 200 docs
