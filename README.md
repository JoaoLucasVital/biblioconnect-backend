# 📚 BiblioConnect - Backend API

## 📌 Descrição

O **BiblioConnect** é uma API REST desenvolvida para gerenciar bibliotecas comunitárias.
O sistema permite cadastro de usuários, controle de livros e gerenciamento de reservas, compras e alugueis.

---

## 🚀 Tecnologias Utilizadas

* Node.js
* Express
* Prisma ORM
* PostgreSQL
* Nodemailer
* Dotenv
* CORS

---

## ⚙️ Como rodar o backend

### 1️⃣ Acesse a pasta do projeto

```bash
cd biblioconnect-backend
```

---

### 2️⃣ Instale as dependências

```bash
npm install
```

---

### 3️⃣ Configure o arquivo `.env`

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/biblioconnect"

```

---

### 4️⃣ Rodar migrations (Prisma) e banco de dados(Postgree)


```bash
npx prisma migrate dev
```

---

### 5️⃣ Iniciar o servidor

```bash
npm run dev
```

Servidor rodando em:

```
http://localhost:3000
```

---

## 📡 Endpoints da API

| Método | Rota                 | Descrição         |
| ------ | -------------------- | ----------------- |
| GET    | `/`                  | Teste do servidor |
| POST   | `/usuarios`          | Cadastrar usuário |
| POST   | `/login`             | Login             |
| POST   | `/livros`            | Criar livro       |
| GET    | `/livros`            | Listar livros     |
| POST   | `/reservar`          | Reservar livro    |
| POST   | `/comprar`           | Comprar livro     |
| POST   | `/alugar`            | Alugar livro      |
| GET    | `/livros/:id/status` | Status do livro   |

---

## 🧪 Exemplos de Requisição

### 📌 Criar Usuário

**POST** `/usuarios`

```json
{
  "nome": "Adriano",
  "email": "adriano@gmail.com",
  "telefone": "999999",
  "endereco": "Rua A"
}
```

---

### 📌 Login

**POST** `/login`

```json
{
  "email": "adriano@gmail.com"
}
```

---

### 📌 Criar Livro

**POST** `/livros`

```json
{
  "titulo": "1984",
  "autor": "George Orwell",
  "redator": "Editora X",
  "ano": 1949,
  "categoria": "Ficção",
  "sinopse": "Distopia",
  "precoCompra": 30,
  "precoAluguel": 10,
  "diasInclusos": 7,
  "precoDiaExtra": 2,
  "estoque": 5,
  "isDoado": false
}
```

---

### 📌 Listar Livros

**GET** `/livros`

---

### 📌 Reservar Livro

**POST** `/reservar`

```json
{
  "usuarioId": 1,
  "livroId": 1
}
```

---

### 📌 Comprar Livro

**POST** `/comprar`

```json
{
  "usuarioId": 1,
  "livroId": 1
}
```

---

### 📌 Alugar Livro

**POST** `/alugar`

```json
{
  "usuarioId": 1,
  "livroId": 1,
  "dias": 10
}
```

---

### 📌 Status do Livro

**GET** `/livros/1/status`

---
## para verificar também no prisma
npx prisma studio

## 📧 Envio de Email

Após realizar uma reserva, compra ou aluguel, o sistema envia um e-mail automático com:

* Livro selecionado
* Tipo de pedido
* Valor
* Data limite para retirada (7 dias)

---

## 📊 Regras de Negócio

* Livro com estoque 0 não pode ser reservado/alugado
* Livro marcado como `isDoado` não pode ser emprestado
* Cada usuário é único por e-mail
* Prazo de retirada: 7 dias
* Aluguel possui cálculo automático de valor

---

## 🧠 Autor

Projeto desenvolvido para fins acadêmicos.

---

## 🚀 Status do Projeto

✔ Backend funcional
✔ API REST completa
✔ Banco de dados integrado
✔ Sistema pronto para integração com frontend
