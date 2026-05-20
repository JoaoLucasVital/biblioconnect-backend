# 📚 BiblioConnect

## 📌 Descrição

O **BiblioConnect** é um sistema completo de biblioteca online desenvolvido para fins acadêmicos.

O projeto possui:

- **Back-end** em Node.js, Express, Prisma e PostgreSQL
- **Front-end** em React com Vite
- Painel administrativo
- Catálogo de livros
- Sistema de compras, reservas e aluguéis
- Controle financeiro
- Sistema de atrasos e multas
- Comprovantes de pedidos
- Dashboard com gráficos e rankings

---

## 📁 Estrutura do Projeto

```txt
biblioconnect-backend/
├── prisma/
│   └── schema.prisma
├── server.js
├── package.json
├── README.md
├── .env
├── .gitignore
└── frontend/
    ├── src/
    ├── public/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── README.md
```

---

## 🚀 Tecnologias Utilizadas

### Back-end

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT
- BcryptJS
- Nodemailer
- Dotenv
- CORS

### Front-end

- React
- Vite
- React Router DOM
- Axios
- Recharts
- CSS puro

---

## ✅ Funcionalidades do Cliente

- Cadastro de usuários
- Login com autenticação JWT
- Envio de email de confirmação de cadastro
- Visualização do catálogo de livros
- Compra de livros
- Reserva de livros com data de retirada
- Aluguel de livros com cálculo de dias extras
- Consulta de pedidos
- Cancelamento de pedidos
- Tela de pedido confirmado
- Simulação de pagamento aprovado
- Emissão de comprovante
- Impressão ou salvamento do comprovante como PDF

---

## ✅ Funcionalidades do Administrador

- Login administrativo padrão
- Cadastro de livros
- Edição de livros
- Exclusão de livros
- Pausar ou ativar livros
- Colocar ou remover livro dos destaques
- Dashboard administrativo
- Gráficos operacionais
- Ranking de livros mais vendidos
- Ranking de gêneros mais vendidos
- Listagem de usuários cadastrados
- Congelar e descongelar usuários
- Remover usuários sem pedidos vinculados
- Listagem de atrasos e multas
- Resolução de pendências
- Gerenciamento de pedidos
- Controle financeiro
- Alteração manual do status de pagamento
- Bloqueio de finalização de pedido sem pagamento aprovado

---

## 🔐 Login Administrativo Padrão

Ao iniciar o servidor, caso o administrador padrão ainda não exista, ele será criado automaticamente.

```txt
Email: admin@biblioconnect.com
Senha: admin123
```

---

# ⚙️ Como Rodar o Projeto

---

## 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/JoaoLucasVital/biblioconnect-backend.git
```

Depois entre na pasta:

```bash
cd biblioconnect-backend
```

---

# 🖥️ Rodando o Back-end

---

## 1️⃣ Instalar Dependências do Back-end

Na raiz do projeto, rode:

```bash
npm install
```

---

## 2️⃣ Criar o Arquivo `.env`

Crie um arquivo chamado `.env` na raiz do projeto.

Exemplo:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/biblioconnect"
JWT_SECRET="sua_chave_jwt"
EMAIL_USER="seu_email@gmail.com"
EMAIL_PASS="sua_senha_de_app"
```

---

## 3️⃣ Rodar as Migrations do Prisma

```bash
npx prisma migrate dev
```

---

## 4️⃣ Gerar o Prisma Client

```bash
npx prisma generate
```

---

## 5️⃣ Iniciar o Servidor

```bash
npm run dev
```

Servidor local:

```txt
http://localhost:3000
```

---

## 6️⃣ Abrir Prisma Studio

Para visualizar o banco de dados pelo navegador:

```bash
npx prisma studio
```

---

# 🌐 Rodando o Front-end

---

## 1️⃣ Entrar na Pasta do Front-end

```bash
cd frontend
```

---

## 2️⃣ Instalar Dependências do Front-end

```bash
npm install
```

---

## 3️⃣ Iniciar o Front-end

```bash
npm run dev
```

Front-end local:

```txt
http://localhost:5173
```

---

# 📡 Endpoints da API

---

## 📌 Teste do Servidor

| Método | Rota | Descrição |
|---|---|---|
| GET | `/` | Testa se o servidor está rodando |

---

## 🔐 Autenticação

| Método | Rota | Descrição |
|---|---|---|
| POST | `/usuarios` | Cadastrar usuário |
| POST | `/login` | Fazer login |
| GET | `/me` | Buscar usuário logado |

---

### 📌 Exemplo - Cadastro de Usuário

```json
{
  "nome": "Adriano",
  "email": "adriano@gmail.com",
  "senha": "123456",
  "telefone": "999999999",
  "endereco": "Rua A"
}
```

---

### 📌 Exemplo - Login

```json
{
  "email": "adriano@gmail.com",
  "senha": "123456"
}
```

---

# 📚 Livros

---

## Rotas de Livros

| Método | Rota | Descrição |
|---|---|---|
| GET | `/livros` | Listar livros |
| GET | `/livros/:id` | Buscar livro por ID |
| POST | `/livros` | Criar livro |
| PUT | `/livros/:id` | Editar livro |
| PATCH | `/livros/:id/disponibilidade` | Pausar ou ativar livro |
| PATCH | `/livros/:id/destaque` | Colocar ou remover livro dos destaques |
| DELETE | `/livros/:id` | Excluir livro |

---

## 📌 Exemplo - Criar Livro

```json
{
  "titulo": "1984",
  "autor": "George Orwell",
  "redator": "Editora X",
  "ano": 1949,
  "categoria": "Ficção",
  "sinopse": "Uma distopia sobre vigilância e controle social.",
  "precoCompra": 30,
  "precoAluguel": 10,
  "diasInclusos": 7,
  "precoDiaExtra": 2,
  "estoque": 5,
  "isDoado": false,
  "destaque": true,
  "disponivel": true
}
```

> As rotas de criação, edição, exclusão, destaque e disponibilidade são destinadas ao administrador.

---

# 🧾 Pedidos do Cliente

---

## Rotas de Pedidos

| Método | Rota | Descrição |
|---|---|---|
| POST | `/comprar` | Comprar livro |
| POST | `/alugar` | Alugar livro |
| POST | `/reservar` | Reservar livro |
| GET | `/me/pedidos` | Listar pedidos do usuário logado |
| GET | `/pedidos/:id` | Buscar pedido por ID |
| PATCH | `/me/pedidos/:id/cancelar` | Cancelar pedido |
| PATCH | `/pedidos/:id/simular-pagamento` | Simular pagamento aprovado |

---

## 📌 Exemplo - Comprar Livro

```json
{
  "livroId": 1
}
```

---

## 📌 Exemplo - Alugar Livro

```json
{
  "livroId": 1,
  "dias": 10
}
```

---

## 📌 Exemplo - Reservar Livro

```json
{
  "livroId": 1,
  "dataRetirada": "2026-06-15"
}
```

> As rotas de compra, aluguel e reserva usam o usuário logado pelo token.  
> Não é necessário enviar `usuarioId` no corpo da requisição.

---

# 🧑‍💼 Administração

---

## Rotas Administrativas

| Método | Rota | Descrição |
|---|---|---|
| GET | `/admin/dashboard` | Dados do dashboard administrativo |
| GET | `/admin/usuarios` | Listar usuários cadastrados |
| PATCH | `/admin/usuarios/:id/bloqueio` | Congelar ou descongelar usuário |
| DELETE | `/admin/usuarios/:id` | Remover usuário |
| GET | `/admin/atrasos` | Listar atrasos e multas |
| GET | `/admin/pedidos` | Listar todos os pedidos |
| PATCH | `/admin/pedidos/:id/status` | Alterar status do pedido |
| GET | `/admin/financeiro` | Buscar resumo financeiro |
| PATCH | `/admin/pedidos/:id/pagamento` | Alterar status de pagamento |

---

# 🏠 Home Pública

---

## Rotas Públicas

| Método | Rota | Descrição |
|---|---|---|
| GET | `/public/home-insights` | Retorna livros mais vendidos e gêneros mais vendidos |

---

# 💰 Regras Financeiras

---

## Status de Pagamento

O sistema trabalha com os seguintes status de pagamento:

```txt
pendente
pago
cancelado
estornado
```

---

## Regra Principal

Somente pedidos com:

```txt
statusPagamento = "pago"
```

entram nos totais financeiros positivos.

---

## Como o Sistema Trata Cada Pagamento

| Status | Entra na Receita? | Observação |
|---|---|---|
| `pendente` | Não | Ainda não foi aprovado |
| `pago` | Sim | Entra como receita aprovada |
| `cancelado` | Não | Não entra nos totais positivos |
| `estornado` | Não | Sai da receita |

---

## Totais Calculados no Financeiro

- Receita aprovada
- Total pendente
- Compras pagas
- Aluguéis pagos
- Reservas/multas pagas
- Valor estornado
- Pedidos pagos
- Pagamentos pendentes

---

# 📦 Regras de Pedidos

---

## Status de Pedido

O sistema trabalha com os seguintes status de pedido:

```txt
pendente
concluido
devolvido
cancelado
```

---

## Trava Operacional

Um pedido só pode ser marcado como:

```txt
concluido
devolvido
```

se o pagamento estiver aprovado.

Ou seja:

```txt
statusPagamento = "pago"
```

Essa regra evita que um pedido seja finalizado sem confirmação financeira.

---

# ❄️ Usuário Congelado

O administrador pode congelar um usuário.

Quando congelado, o usuário não poderá:

- Comprar livros
- Alugar livros
- Reservar livros

Essa função é usada principalmente para usuários com pendências, atrasos ou multas.

---

# ⏰ Atrasos e Multas

---

## Atraso em Reserva

A reserva possui prazo de retirada.

Caso a retirada ultrapasse o prazo definido, o sistema calcula multa por atraso.

---

## Atraso em Aluguel

O aluguel possui:

- Dias inclusos
- Preço por dia extra
- Data prevista de devolução

Caso o prazo seja ultrapassado, o sistema calcula multa com base no preço por dia extra do livro.

---

# 📧 Envio de Email

O sistema envia email em situações como:

- Cadastro de usuário
- Compra
- Reserva
- Aluguel

---

## Conteúdo do Email

O email pode conter:

- Livro selecionado
- Tipo de pedido
- Valor
- Data limite para retirada

---

## Configuração do Email

Para o envio funcionar, configure no `.env`:

```env
EMAIL_USER="seu_email@gmail.com"
EMAIL_PASS="sua_senha_de_app"
```

---

# 🧾 Comprovantes

O comprovante é gerado pelo frontend com base nos dados do pedido.

---

## Dados do Comprovante

O comprovante contém:

- Código do comprovante
- Nome do cliente
- Livro
- Tipo do pedido
- Valor
- Status do pedido
- Status do pagamento
- Data do pedido
- Data de retirada
- Data de devolução, em caso de aluguel

---

## Impressão do Comprovante

O usuário pode:

- Imprimir o comprovante
- Salvar o comprovante como PDF pelo navegador

---

## Nome Sugerido do PDF

O nome sugerido segue o padrão:

```txt
Comprovante - Tipo - Nome do Livro - Pedido 0001.pdf
```

---

# 🧠 Regras de Negócio

- Cada usuário deve ter email único.
- Livro com estoque 0 não pode ser comprado, alugado ou reservado.
- Livro indisponível não aparece para operação do cliente.
- Livro marcado como doado pode ter restrições específicas.
- Compra, reserva e aluguel reduzem o estoque.
- Cancelamento de pedido devolve o estoque.
- Aluguel calcula valor final com base nos dias escolhidos.
- Reserva permite selecionar data de retirada.
- Admin pode congelar usuários inadimplentes.
- Pedido só pode ser finalizado após pagamento aprovado.
- Valores financeiros só contam como receita após pagamento aprovado.

---

# 🌍 Deploy

---

## Back-end

Para deploy do back-end em produção:

1. Configure as variáveis de ambiente no serviço escolhido.
2. Não envie o arquivo `.env` para o GitHub.
3. Garanta que o servidor use porta dinâmica.

No `server.js`, deve existir:

```js
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
```

---

## Front-end

Para deploy do front-end:

1. Entre na pasta `frontend`.

```bash
cd frontend
```

2. Rode o build:

```bash
npm run build
```

3. A pasta `dist` será gerada automaticamente.

4. O deploy pode ser feito em serviços como:

- GitHub Pages
- Vercel
- Netlify

---

# 🔒 Segurança

O arquivo `.env` não deve ser enviado ao GitHub.

---

## `.gitignore` Recomendado

```gitignore
node_modules
.env
dist
build
.DS_Store

frontend/node_modules
frontend/dist
frontend/.env
```

---

# 📌 Status do Projeto

- Backend funcional
- Frontend funcional
- API REST completa
- Banco de dados integrado
- Autenticação com JWT
- Painel administrativo integrado
- Controle financeiro implementado
- Sistema de pedidos implementado
- Sistema de atrasos e multas implementado
- Sistema de comprovantes implementado
- Projeto organizado em repositório único

---

# 🧠 Autor

Projeto desenvolvido para fins acadêmicos.
