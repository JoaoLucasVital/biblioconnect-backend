# 📚 BiblioConnect - Sistema Web de Biblioteca

## 📌 Descrição

O **BiblioConnect** é um sistema web full-stack desenvolvido para gerenciamento de bibliotecas comunitárias, escolares ou institucionais.

O sistema permite controlar usuários, livros, reservas, compras, aluguéis, pagamentos, atrasos, multas, comprovantes e administração geral da biblioteca.

A aplicação possui:

- Frontend em **React.js com Vite**
- Backend em **Node.js com Express**
- Banco de dados **PostgreSQL**
- ORM **Prisma**
- Autenticação com **JWT**
- Envio de emails com **Gmail + Nodemailer**
- Upload de imagens de livros
- Dashboard administrativo com gráficos reais
- Cadastro com busca automática de CEP
- Recuperação de senha por email
- Confirmação de email obrigatória

---

## 🎯 Objetivo do Projeto

O objetivo do BiblioConnect é facilitar a gestão de bibliotecas, centralizando em uma única plataforma:

- Cadastro e autenticação de usuários
- Confirmação de email
- Recuperação de senha
- Catálogo de livros
- Compra, reserva e aluguel
- Controle de estoque
- Controle financeiro
- Atrasos e multas
- Comprovantes
- Painel administrativo
- Upload de capas dos livros
- Reset geral para apresentação e testes

---

## 👥 Público-alvo

O sistema foi pensado para:

- Administradores de bibliotecas
- Bibliotecas comunitárias
- Bibliotecas escolares
- Usuários/leitores cadastrados
- Projetos acadêmicos de gestão de acervo

---

## 🚀 Tecnologias Utilizadas

### Frontend

- React.js
- Vite
- React Router DOM
- Axios
- Recharts
- CSS personalizado
- Tema claro/escuro
- Layout responsivo

### Backend

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT
- Bcrypt
- Nodemailer
- Multer
- CORS
- Dotenv

### Serviços externos

- Gmail SMTP para envio de emails
- ViaCEP para preenchimento automático de endereço

---

## 🗂️ Estrutura do Projeto

```bash
biblioconnect-backend/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── styles/
│   ├── package.json
│   └── vite.config.js
│
├── prisma/
│   └── schema.prisma
│
├── uploads/
│   └── livros/
│
├── server.js
├── package.json
├── .env
├── .gitignore
└── README.md
```

---

# ⚙️ Como Rodar o Projeto

## 1️⃣ Clonar o repositório

```bash
git clone https://github.com/JoaoLucasVital/biblioconnect-backend.git
```

Depois entre na pasta:

```bash
cd biblioconnect-backend
```

---

# 🖥️ Backend

## 2️⃣ Instalar dependências do backend

```bash
npm install
```

---

## 3️⃣ Configurar o arquivo `.env`

Crie um arquivo `.env` na raiz do backend:

```env
DATABASE_URL="postgresql://postgres:admin@localhost:5432/biblioconnect"
JWT_SECRET="biblioconnect_secret"

EMAIL_USER="biblioconnect.sistema@gmail.com"
EMAIL_PASS="SENHA_DE_APP_DO_GMAIL"

BACKEND_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:5173"
```

### Observação sobre email

O `EMAIL_USER` é o email oficial do sistema, usado para enviar:

- Confirmação de cadastro
- Redefinição de senha
- Confirmação de pedidos

O `EMAIL_PASS` **não é a senha normal do Gmail**.

Ele deve ser uma **senha de app** gerada na Conta Google.

---

## 4️⃣ Rodar as migrations do Prisma

```bash
npx prisma migrate dev
```

---

## 5️⃣ Gerar Prisma Client

```bash
npx prisma generate
```

---

## 6️⃣ Rodar o backend

```bash
npm run dev
```

Servidor rodando em:

```bash
http://localhost:3000
```

---

## 7️⃣ Abrir Prisma Studio

```bash
npx prisma studio
```

---

# 🌐 Frontend

## 8️⃣ Acessar a pasta do frontend

```bash
cd frontend
```

---

## 9️⃣ Instalar dependências do frontend

```bash
npm install
```

---

## 🔟 Rodar o frontend

```bash
npm run dev
```

Frontend rodando em:

```bash
http://localhost:5173
```

---

# 🔐 Autenticação

## Cadastro de Usuário

O usuário pode criar uma conta informando:

- Nome completo
- Email
- Senha
- Confirmação de senha
- Telefone
- CEP
- Rua/Avenida
- Bairro
- Cidade
- Estado
- Número
- Complemento
- Ponto de referência

Após o cadastro, o sistema envia um email de confirmação.

O usuário só consegue acessar a conta após confirmar o email.

---

## Login

O login é feito com:

- Email
- Senha

O sistema valida:

- Se o usuário existe
- Se a senha está correta
- Se o email foi confirmado
- Se o usuário está bloqueado/congelado

---

## Recuperação de Senha

O sistema possui fluxo de recuperação de senha:

1. Usuário clica em **Esqueci minha senha**
2. Informa o email cadastrado
3. O sistema envia um link de redefinição
4. O usuário acessa o link
5. Define uma nova senha
6. A nova senha passa a ser usada no login

---

## Visualização de Senha

Os campos de senha possuem botão de exibir/ocultar senha em:

- Login
- Cadastro
- Redefinição de senha

---

# 👤 Usuário Administrador

Ao iniciar o sistema, o backend cria automaticamente um administrador padrão, caso ele ainda não exista.

```bash
Email: admin@biblioconnect.com
Senha: admin123
```

O administrador possui acesso ao painel administrativo.

---

# 📚 Funcionalidades do Usuário Cliente

O cliente pode:

- Criar conta
- Confirmar email
- Fazer login
- Recuperar senha
- Visualizar catálogo de livros
- Buscar livros
- Filtrar por categoria
- Comprar livros
- Reservar livros
- Alugar livros
- Selecionar data de retirada da reserva
- Visualizar pedidos
- Cancelar pedidos
- Gerar comprovante
- Imprimir ou salvar comprovante em PDF

---

# 🛠️ Funcionalidades do Administrador

O administrador pode:

- Acessar dashboard
- Visualizar gráficos reais
- Gerenciar livros
- Adicionar livros
- Editar livros
- Excluir livros
- Pausar ou ativar livros
- Colocar livros em destaque
- Remover livros do destaque
- Enviar imagem de capa do livro
- Gerenciar pedidos
- Alterar status de pedido
- Alterar status de pagamento
- Visualizar usuários
- Ver endereço completo dos usuários
- Congelar usuários
- Descongelar usuários
- Remover usuários sem pedidos vinculados
- Visualizar atrasos
- Calcular multas automaticamente
- Acessar resumo financeiro
- Resetar sistema para apresentação

---

# 🖼️ Upload de Imagens dos Livros

O sistema permite que o administrador envie uma imagem de capa ao cadastrar ou editar um livro.

As imagens são salvas em:

```bash
uploads/livros/
```

E são exibidas automaticamente em:

- Catálogo
- Home
- Slider de destaques
- Painel administrativo
- Popups de confirmação
- Ranking de livros mais vendidos

Formatos aceitos:

- JPG
- JPEG
- PNG
- WEBP

Tamanho máximo recomendado:

```bash
5MB
```

---

# 🏠 Home

A página inicial possui:

- Apresentação do sistema
- Estatísticas do acervo
- Livros em destaque
- Slider com animação suave
- Livros mais vendidos
- Gêneros mais vendidos
- Explicação do fluxo do sistema
- Botões para catálogo, cadastro, pedidos ou painel admin

---

# 📖 Catálogo

O catálogo possui:

- Busca por título, autor, categoria ou sinopse
- Filtro por categoria
- Filtro por tipo
- Cards com capa real do livro
- Valor de compra
- Valor de aluguel
- Estoque
- Botões de compra, aluguel e reserva
- Popups de confirmação

---

# 📦 Pedidos

O sistema trabalha com três tipos de pedido:

- Compra
- Reserva
- Aluguel

Cada pedido possui:

- Tipo
- Status
- Status de pagamento
- Valor
- Data de criação
- Livro vinculado
- Usuário vinculado
- Prazo de retirada
- Devolução prevista, quando for aluguel

---

# 💰 Financeiro

O financeiro considera apenas pagamentos aprovados.

Status de pagamento:

- Pendente
- Pago
- Cancelado
- Estornado

Regras:

- Pedido pendente não entra na receita
- Pedido cancelado não entra na receita
- Pedido estornado não entra na receita positiva
- Pedido só pode ser concluído ou devolvido se o pagamento estiver aprovado
- O administrador pode alterar manualmente o status financeiro

---

# ⏰ Atrasos e Multas

O sistema calcula automaticamente atrasos e multas.

## Reserva

A reserva possui prazo de retirada.

Caso o usuário escolha uma data acima do prazo gratuito, o sistema calcula multa.

## Aluguel

O aluguel possui devolução prevista.

Caso a devolução esteja atrasada, o sistema calcula multa com base no valor de dia extra do livro.

---

# 🧾 Comprovantes

Após realizar um pedido, o usuário pode acessar o comprovante.

O comprovante possui:

- Nome do usuário
- Livro
- Tipo do pedido
- Valor
- Status
- Data
- Informações da biblioteca
- Opção de imprimir
- Opção de salvar em PDF

O nome do arquivo é personalizado com base na compra/pedido, e não com o nome padrão do projeto.

---

# 🧑‍💼 Gerenciamento de Usuários

O administrador consegue visualizar:

- Nome
- Email
- Telefone
- Status da conta
- Email confirmado ou pendente
- Total de pedidos
- Multa total
- CEP
- Rua
- Número
- Bairro
- Cidade
- Estado
- Complemento
- Ponto de referência

Também pode:

- Congelar usuário
- Descongelar usuário
- Remover usuário sem pedidos vinculados

Usuário congelado não pode:

- Comprar
- Reservar
- Alugar

---

# 🧹 Reset Geral do Sistema

O painel administrativo possui uma área restrita para resetar o sistema.

Para resetar, o administrador precisa:

- Abrir a área restrita
- Digitar a senha do admin
- Digitar exatamente `RESETAR`
- Confirmar a ação no popup

O reset apaga:

- Usuários clientes
- Livros
- Pedidos
- Compras
- Reservas
- Aluguéis
- Multas
- Rankings
- Capas enviadas

O reset mantém:

- Usuário administrador padrão

Essa funcionalidade foi criada para facilitar apresentações acadêmicas e testes do sistema.

---

# 🔄 Regras de Negócio

1. Livro com estoque 0 não pode ser comprado, reservado ou alugado.
2. Apenas administradores podem acessar telas administrativas.
3. Usuário congelado não pode realizar novos pedidos.
4. Pedido cancelado devolve o estoque.
5. Pedido só pode ser concluído ou devolvido após pagamento aprovado.
6. Valores pendentes não entram no total recebido.
7. Valores estornados não entram nos totais positivos.
8. Aluguel calcula automaticamente dias extras.
9. Reserva exige data de retirada.
10. Cadastro exige confirmação de email.
11. Recuperação de senha usa token temporário.
12. Reset do sistema exige senha do administrador.
13. O administrador padrão não é excluído no reset.
14. Livros podem ser pausados sem serem removidos.
15. Livros com pedidos vinculados não podem ser excluídos diretamente.

---

# 📡 Principais Endpoints da API

## Autenticação e Usuário

| Método | Rota | Descrição |
|---|---|---|
| POST | `/usuarios` | Cadastro de usuário |
| POST | `/login` | Login |
| GET | `/me` | Buscar usuário logado |
| GET | `/confirmar-email/:token` | Confirmar email |
| POST | `/reenviar-confirmacao` | Reenviar confirmação |
| POST | `/esqueci-senha` | Solicitar redefinição de senha |
| PATCH | `/redefinir-senha/:token` | Redefinir senha |

---

## Livros

| Método | Rota | Descrição |
|---|---|---|
| GET | `/livros` | Listar livros |
| GET | `/livros/:id` | Buscar livro por ID |
| POST | `/livros` | Criar livro |
| PUT | `/livros/:id` | Editar livro |
| PATCH | `/livros/:id/destaque` | Alterar destaque |
| PATCH | `/livros/:id/disponibilidade` | Pausar ou ativar livro |
| DELETE | `/livros/:id` | Excluir livro |

---

## Pedidos

| Método | Rota | Descrição |
|---|---|---|
| POST | `/comprar` | Comprar livro |
| POST | `/reservar` | Reservar livro |
| POST | `/alugar` | Alugar livro |
| GET | `/me/pedidos` | Pedidos do usuário |
| GET | `/pedidos/:id` | Buscar pedido por ID |
| PATCH | `/me/pedidos/:id/cancelar` | Cancelar pedido |
| PATCH | `/pedidos/:id/simular-pagamento` | Simular pagamento aprovado |

---

## Administração

| Método | Rota | Descrição |
|---|---|---|
| GET | `/admin/dashboard` | Dados do dashboard |
| GET | `/admin/pedidos` | Listar todos os pedidos |
| PATCH | `/admin/pedidos/:id/status` | Alterar status do pedido |
| PATCH | `/admin/pedidos/:id/pagamento` | Alterar status de pagamento |
| GET | `/admin/usuarios` | Listar usuários |
| PATCH | `/admin/usuarios/:id/bloqueio` | Congelar/descongelar usuário |
| DELETE | `/admin/usuarios/:id` | Remover usuário |
| GET | `/admin/atrasos` | Listar atrasos |
| GET | `/admin/financeiro` | Resumo financeiro |
| POST | `/admin/resetar-sistema` | Reset geral do sistema |
| GET | `/public/home-insights` | Rankings públicos da Home |

---

# 🌐 Rotas do Frontend

| Rota | Descrição |
|---|---|
| `/` | Página inicial |
| `/livros` | Catálogo |
| `/login` | Login |
| `/cadastro` | Cadastro |
| `/esqueci-senha` | Solicitar recuperação de senha |
| `/redefinir-senha/:token` | Redefinir senha |
| `/meus-pedidos` | Pedidos do cliente |
| `/pedido-confirmado/:id` | Pedido confirmado |
| `/comprovante/:id` | Comprovante |
| `/admin` | Dashboard administrativo |
| `/admin/livros` | Gerenciar livros |
| `/admin/pedidos` | Gerenciar pedidos |
| `/admin/financeiro` | Financeiro |
| `/admin/usuarios` | Usuários |
| `/admin/atrasos` | Atrasos e multas |
| `/adicionar-livro` | Adicionar livro |
| `/editar-livro/:id` | Editar livro |

---

# 🧩 Diagrama Entidade-Relacionamento

```mermaid
erDiagram
    USUARIO ||--o{ PEDIDO : realiza
    LIVRO ||--o{ PEDIDO : pertence

    USUARIO {
        int id PK
        string nome
        string email UK
        string senha
        string telefone
        string endereco
        string cep
        string rua
        string bairro
        string cidade
        string estado
        string numero
        string complemento
        string pontoReferencia
        string role
        boolean emailConfirmado
        string tokenConfirmacaoEmail
        datetime tokenConfirmacaoExpira
        string tokenResetSenha
        datetime tokenResetSenhaExpira
        boolean bloqueado
        datetime createdAt
    }

    LIVRO {
        int id PK
        string titulo
        string autor
        string redator
        int ano
        string categoria
        string sinopse
        float precoCompra
        float precoAluguel
        int diasInclusos
        float precoDiaExtra
        int estoque
        boolean isDoado
        string imagemUrl
        boolean destaque
        boolean disponivel
        datetime createdAt
        datetime updatedAt
    }

    PEDIDO {
        int id PK
        string tipo
        string status
        string statusPagamento
        float valor
        int diasAluguel
        datetime retiradaLimite
        datetime devolucaoPrevista
        datetime createdAt
        int usuarioId FK
        int livroId FK
    }
```

---

# 🏗️ Arquitetura do Projeto

```mermaid
flowchart TD
    A[Usuário / Administrador] --> B[Frontend React + Vite]

    B --> C[Axios / API Service]

    C --> D[Backend Node.js + Express]

    D --> E[Middlewares]
    E --> E1[CORS]
    E --> E2[JSON Parser]
    E --> E3[JWT Auth]
    E --> E4[Admin Guard]
    E --> E5[Multer Upload]

    D --> F[Rotas Públicas]
    F --> F1[Cadastro]
    F --> F2[Login]
    F --> F3[Confirmação de Email]
    F --> F4[Recuperação de Senha]
    F --> F5[Catálogo]
    F --> F6[Home Insights]

    D --> G[Rotas Protegidas]
    G --> G1[Comprar]
    G --> G2[Reservar]
    G --> G3[Alugar]
    G --> G4[Meus Pedidos]
    G --> G5[Comprovante]

    D --> H[Rotas Administrativas]
    H --> H1[Dashboard]
    H --> H2[Livros]
    H --> H3[Pedidos]
    H --> H4[Usuários]
    H --> H5[Financeiro]
    H --> H6[Atrasos]
    H --> H7[Reset Geral]

    D --> I[Prisma ORM]
    I --> J[(PostgreSQL)]

    D --> K[Nodemailer]
    K --> L[Gmail SMTP]

    D --> M[Uploads Locais]
    M --> N[uploads/livros]

    B --> O[ViaCEP API]
    O --> P[Preenchimento automático de endereço]
```

---

# 🧱 Arquitetura em Camadas

```mermaid
flowchart LR
    A[Camada de Interface] --> B[Camada de Comunicação]
    B --> C[Camada de API]
    C --> D[Camada de Regras de Negócio]
    D --> E[Camada de Persistência]
    E --> F[Banco de Dados]

    A1[React Pages] --> A
    A2[Components] --> A
    A3[CSS Global] --> A

    B1[Axios] --> B
    B2[AuthContext] --> B

    C1[Express Routes] --> C
    C2[Middlewares] --> C

    D1[Pedidos] --> D
    D2[Financeiro] --> D
    D3[Multas] --> D
    D4[Autenticação] --> D
    D5[Upload de Imagens] --> D

    E1[Prisma ORM] --> E
    F1[PostgreSQL] --> F
```

---

# 🧪 Testes Recomendados

## Cadastro

- Criar usuário com endereço completo
- Buscar CEP automaticamente
- Confirmar senha diferente
- Confirmar senha correta
- Receber email de confirmação
- Tentar login antes de confirmar
- Confirmar email
- Fazer login

---

## Recuperação de Senha

- Clicar em esqueci senha
- Informar email cadastrado
- Receber link no email
- Redefinir senha
- Fazer login com nova senha

---

## Livros

- Adicionar livro com capa
- Editar capa
- Pausar livro
- Ativar livro
- Destacar livro
- Remover destaque
- Ver livro no catálogo
- Ver livro no slider

---

## Pedidos

- Comprar livro
- Reservar livro
- Alugar livro
- Cancelar pedido
- Gerar comprovante
- Simular pagamento
- Alterar status pelo admin

---

## Financeiro

- Ver pedido pendente
- Aprovar pagamento
- Conferir total recebido
- Estornar pedido
- Conferir remoção dos totais positivos

---

## Reset Geral

- Entrar como admin
- Abrir área restrita
- Digitar senha
- Digitar `RESETAR`
- Confirmar reset
- Verificar se usuários clientes, livros e pedidos foram apagados
- Confirmar que o admin continua existindo

---

# 👨‍💻 Equipe

Projeto desenvolvido para fins acadêmicos.

- Lucas Soares Silva - 01631745
- Adriano Mikhael - 01605455
- João Lucas - 01624753

---

# 📌 Status do Projeto

✅ Backend funcional  
✅ Frontend funcional  
✅ Integração frontend + backend  
✅ Banco PostgreSQL integrado  
✅ Prisma ORM configurado  
✅ Login com JWT  
✅ Confirmação de email  
✅ Recuperação de senha  
✅ Cadastro com CEP automático  
✅ Upload de capas  
✅ Catálogo funcional  
✅ Pedidos funcionais  
✅ Dashboard administrativo  
✅ Financeiro administrativo  
✅ Atrasos e multas  
✅ Comprovantes  
✅ Reset geral para apresentação  
✅ Projeto pronto para apresentação acadêmica  

---

# 🚀 Próximos Passos

- Deploy do backend
- Deploy do frontend
- Configuração de domínio
- Gateway de pagamento real
- Armazenamento externo de imagens
- Melhorias de segurança para produção
- Logs administrativos
- Relatórios exportáveis
