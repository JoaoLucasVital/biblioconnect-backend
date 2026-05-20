# 📚 BiblioConnect

Sistema completo de biblioteca online desenvolvido para fins acadêmicos.

O **BiblioConnect** possui back-end em **Node.js + Express + Prisma + PostgreSQL** e front-end em **React + Vite**, permitindo gerenciamento de livros, usuários, compras, reservas, aluguéis, pagamentos simulados, comprovantes, painel administrativo, financeiro, atrasos e multas.

---

## 📌 Estrutura do repositório

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
🚀 Tecnologias utilizadas
Back-end
Node.js
Express
Prisma ORM
PostgreSQL
JWT
BcryptJS
Nodemailer
Dotenv
CORS
Front-end
React
Vite
React Router DOM
Axios
Recharts
CSS puro
✅ Funcionalidades principais
Cliente
Cadastro de usuários
Login com autenticação JWT
Envio de email de confirmação de cadastro
Visualização do catálogo de livros
Compra de livros
Reserva de livros com data de retirada
Aluguel de livros com cálculo de dias extras
Consulta de pedidos do usuário
Cancelamento de pedidos
Tela de pedido confirmado
Simulação de pagamento aprovado
Emissão de comprovante
Impressão/salvamento do comprovante como PDF pelo navegador
Administrador
Login administrativo padrão
Cadastro de livros
Edição de livros
Exclusão de livros
Pausar ou ativar livros
Colocar ou remover livro dos destaques
Dashboard administrativo
Gráficos operacionais
Ranking de livros mais vendidos
Ranking de gêneros mais vendidos
Listagem de usuários cadastrados
Congelar e descongelar usuários
Remover usuários sem pedidos vinculados
Listagem de atrasos e multas
Resolução de pendências
Gerenciamento de pedidos
Controle financeiro
Alteração manual do status de pagamento
Trava para impedir finalização de pedido sem pagamento aprovado
🔐 Login administrativo padrão

Ao iniciar o servidor, caso o administrador padrão ainda não exista, ele será criado automaticamente.

Email: admin@biblioconnect.com
Senha: admin123
⚙️ Como rodar o projeto
1. Clonar o repositório
git clone https://github.com/JoaoLucasVital/biblioconnect-backend.git
cd biblioconnect-backend
🖥️ Rodando o back-end
1. Instalar dependências do back-end

Na raiz do projeto:

npm install
2. Criar o arquivo .env

Crie um arquivo .env na raiz do projeto:

DATABASE_URL="postgresql://usuario:senha@localhost:5432/biblioconnect"
JWT_SECRET="sua_chave_jwt"
EMAIL_USER="seu_email@gmail.com"
EMAIL_PASS="sua_senha_de_app"
3. Rodar migrations do Prisma
npx prisma migrate dev
4. Gerar Prisma Client
npx prisma generate
5. Iniciar o servidor
npm run dev

Servidor local:

http://localhost:3000
🌐 Rodando o front-end
1. Entrar na pasta do front
cd frontend
2. Instalar dependências do front
npm install
3. Rodar o front-end
npm run dev

Front-end local:

http://localhost:5173
🧪 Prisma Studio

Para visualizar o banco de dados pelo navegador, rode na raiz do projeto:

npx prisma studio
📡 Endpoints da API
Teste do servidor
Método	Rota	Descrição
GET	/	Testa se o servidor está rodando
🔐 Autenticação
Método	Rota	Descrição
POST	/usuarios	Cadastrar usuário
POST	/login	Login
GET	/me	Buscar dados do usuário logado
Exemplo - Cadastro de usuário
{
  "nome": "Adriano",
  "email": "adriano@gmail.com",
  "senha": "123456",
  "telefone": "999999999",
  "endereco": "Rua A"
}
Exemplo - Login
{
  "email": "adriano@gmail.com",
  "senha": "123456"
}
📚 Livros
Método	Rota	Descrição
GET	/livros	Listar livros
GET	/livros/:id	Buscar livro por ID
POST	/livros	Criar livro
PUT	/livros/:id	Editar livro
PATCH	/livros/:id/disponibilidade	Pausar ou ativar livro
PATCH	/livros/:id/destaque	Colocar ou remover livro dos destaques
DELETE	/livros/:id	Excluir livro
Exemplo - Criar livro
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

As rotas de criação, edição, exclusão, destaque e disponibilidade exigem autenticação de administrador.

🧾 Pedidos do cliente
Método	Rota	Descrição
POST	/comprar	Comprar livro
POST	/alugar	Alugar livro
POST	/reservar	Reservar livro
GET	/me/pedidos	Listar pedidos do usuário logado
GET	/pedidos/:id	Buscar pedido por ID
PATCH	/me/pedidos/:id/cancelar	Cancelar pedido
PATCH	/pedidos/:id/simular-pagamento	Simular pagamento aprovado
Exemplo - Comprar livro
{
  "livroId": 1
}
Exemplo - Alugar livro
{
  "livroId": 1,
  "dias": 10
}
Exemplo - Reservar livro
{
  "livroId": 1,
  "dataRetirada": "2026-06-15"
}

Essas rotas usam o usuário logado pelo token. Não é necessário enviar usuarioId.

🧑‍💼 Administração
Método	Rota	Descrição
GET	/admin/dashboard	Dados do dashboard administrativo
GET	/admin/usuarios	Listar usuários cadastrados
PATCH	/admin/usuarios/:id/bloqueio	Congelar ou descongelar usuário
DELETE	/admin/usuarios/:id	Remover usuário
GET	/admin/atrasos	Listar atrasos e multas
GET	/admin/pedidos	Listar todos os pedidos
PATCH	/admin/pedidos/:id/status	Alterar status do pedido
GET	/admin/financeiro	Buscar resumo financeiro
PATCH	/admin/pedidos/:id/pagamento	Alterar status de pagamento
🏠 Home pública
Método	Rota	Descrição
GET	/public/home-insights	Retorna livros mais vendidos e gêneros mais vendidos
💰 Regras financeiras

O sistema trabalha com os seguintes status de pagamento:

pendente
pago
cancelado
estornado
Regra principal

Somente pedidos com:

statusPagamento = "pago"

entram nos totais financeiros positivos.

Ou seja:

Pedido pendente não entra como receita.
Pedido pago entra como receita aprovada.
Pedido estornado sai da receita.
Pedido cancelado não entra na receita.
Totais financeiros

O financeiro calcula:

Receita aprovada
Total pendente
Compras pagas
Aluguéis pagos
Reservas/multas pagas
Valor estornado
Pedidos pagos
Pagamentos pendentes
📦 Regras de pedidos

O sistema trabalha com os seguintes status de pedido:

pendente
concluido
devolvido
cancelado
Trava operacional

Um pedido só pode ser marcado como:

concluido
devolvido

se o pagamento estiver aprovado.

Ou seja:

statusPagamento = "pago"

Isso evita que um pedido seja finalizado sem confirmação financeira.

❄️ Usuário congelado

O administrador pode congelar um usuário.

Quando congelado, o usuário não poderá:

Comprar livros
Alugar livros
Reservar livros

Essa função é usada principalmente para usuários com pendências ou multas.

⏰ Atrasos e multas

O sistema calcula atrasos automaticamente em:

Reservas
Aluguéis
Reserva

A reserva possui prazo gratuito de retirada.

Caso a retirada ultrapasse o prazo definido, o sistema calcula multa por atraso.

Aluguel

O aluguel possui:

Dias inclusos
Preço por dia extra
Data prevista de devolução

Caso o prazo seja ultrapassado, o sistema calcula multa com base no preço por dia extra do livro.

📧 Envio de email

O sistema envia email em situações como:

Cadastro de usuário
Compra
Reserva
Aluguel

O email pode conter:

Livro selecionado
Tipo de pedido
Valor
Data limite para retirada

Para o envio funcionar, configure corretamente no .env:

EMAIL_USER="seu_email@gmail.com"
EMAIL_PASS="sua_senha_de_app"
🧠 Regras de negócio
Cada usuário deve ter email único.
Livro com estoque 0 não pode ser comprado, alugado ou reservado.
Livro indisponível não aparece para operação do cliente.
Livro marcado como doado pode ter restrições específicas.
Compra, reserva e aluguel reduzem o estoque.
Cancelamento de pedido devolve o estoque.
Aluguel calcula valor final com base nos dias escolhidos.
Reserva permite selecionar data de retirada.
Admin pode congelar usuários inadimplentes.
Pedido só pode ser finalizado após pagamento aprovado.
Valores financeiros só contam como receita após pagamento aprovado.
🧾 Comprovantes

O comprovante é gerado pelo frontend com base nos dados do pedido.

Ele contém:

Código do comprovante
Nome do cliente
Livro
Tipo do pedido
Valor
Status do pedido
Status do pagamento
Data do pedido
Data de retirada
Data de devolução, em caso de aluguel

O usuário pode imprimir ou salvar como PDF pelo navegador.

O nome sugerido do PDF segue o padrão:

Comprovante - Tipo - Nome do Livro - Pedido 0001.pdf
🌍 Deploy
Back-end

Para deploy do back-end em produção:

Configure as variáveis de ambiente no serviço escolhido.
Não envie o arquivo .env para o GitHub.
Garanta que o servidor use porta dinâmica.

No server.js, deve existir:

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
Front-end

Para deploy do front-end:

Entre na pasta frontend.
Rode o build:
npm run build
A pasta dist será gerada automaticamente.
O deploy pode ser feito em serviços como GitHub Pages, Vercel ou Netlify.
🔒 Segurança

O arquivo .env não deve ser enviado ao GitHub.

O .gitignore deve conter:

node_modules
.env
dist
build
.DS_Store

frontend/node_modules
frontend/dist
frontend/.env
📌 Status do projeto
Backend funcional
Frontend funcional
API REST completa
Banco de dados integrado
Autenticação com JWT
Painel administrativo integrado
Controle financeiro implementado
Sistema de pedidos implementado
Sistema de atrasos e multas implementado
Sistema de comprovantes implementado
Projeto organizado em repositório único
🧠 Autor

Projeto desenvolvido para fins acadêmicos.


Depois de colar esse README, rode na raiz do repositório:

```bash
git add README.md
git commit -m "Atualiza README do projeto BiblioConnect"
git push origin main
