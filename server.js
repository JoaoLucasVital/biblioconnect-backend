import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ======================
// EMAIL CONFIG
// ======================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ======================
// FUNÇÃO CALCULO ALUGUEL
// ======================
function calcularAluguel(livro, dias) {
  const diasExtras = Math.max(0, dias - livro.diasInclusos);
  return livro.precoAluguel + diasExtras * livro.precoDiaExtra;
}

// ======================
// ROTA TESTE
// ======================
app.get("/", (req, res) => {
  res.send("Servidor rodando 🚀");
});

// ======================
// CADASTRO USUARIO
// ======================
app.post("/usuarios", async (req, res) => {
  try {
    const { email } = req.body;

    const existe = await prisma.usuario.findUnique({
      where: { email },
    });

    if (existe) {
      return res.status(400).json({ erro: "Email já cadastrado" });
    }

    const usuario = await prisma.usuario.create({
      data: req.body,
    });

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao cadastrar usuário" });
  }
});

// ======================
// LOGIN
// ======================
app.post("/login", async (req, res) => {
  try {
    const { email } = req.body;

    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ erro: "Erro no login" });
  }
});

// ======================
// CRIAR LIVRO
// ======================
app.post("/livros", async (req, res) => {
  try {
    const livro = await prisma.livro.create({
      data: req.body,
    });

    res.json(livro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao criar livro" });
  }
});

// ======================
// LISTAR LIVROS
// ======================
app.get("/livros", async (req, res) => {
  try {
    const livros = await prisma.livro.findMany();
    res.json(livros);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar livros" });
  }
});

// ======================
// RESERVA
// ======================
app.post("/reservar", async (req, res) => {
  try {
    const { usuarioId, livroId } = req.body;

    const user = await prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!user) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    const livro = await prisma.livro.findUnique({
      where: { id: livroId },
    });

    if (!livro || livro.estoque <= 0 || livro.isDoado) {
      return res.status(400).json({ erro: "Livro indisponível" });
    }

    const retiradaLimite = new Date();
    retiradaLimite.setDate(retiradaLimite.getDate() + 7);

    const pedido = await prisma.pedido.create({
      data: {
        tipo: "reserva",
        status: "pendente",
        valor: 0,
        retiradaLimite,
        usuarioId,
        livroId,
      },
    });

    await prisma.livro.update({
      where: { id: livroId },
      data: { estoque: livro.estoque - 1 },
    });

    await enviarEmail(user.email, livro, pedido);

    res.json(pedido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro na reserva" });
  }
});

// ======================
// COMPRA
// ======================
app.post("/comprar", async (req, res) => {
  try {
    const { usuarioId, livroId } = req.body;

    const user = await prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    const livro = await prisma.livro.findUnique({
      where: { id: livroId },
    });

    if (!user) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    if (!livro || livro.estoque <= 0) {
      return res.status(400).json({ erro: "Livro indisponível" });
    }

    const retiradaLimite = new Date();
    retiradaLimite.setDate(retiradaLimite.getDate() + 7);

    const pedido = await prisma.pedido.create({
      data: {
        tipo: "compra",
        status: "pendente",
        valor: livro.precoCompra,
        retiradaLimite,
        usuarioId,
        livroId,
      },
    });

    await prisma.livro.update({
      where: { id: livroId },
      data: { estoque: livro.estoque - 1 },
    });

    await enviarEmail(user.email, livro, pedido);

    res.json(pedido);
  } catch (error) {
    res.status(500).json({ erro: "Erro na compra" });
  }
});

// ======================
// ALUGUEL
// ======================
app.post("/alugar", async (req, res) => {
  try {
    const { usuarioId, livroId, dias } = req.body;

    const user = await prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    const livro = await prisma.livro.findUnique({
      where: { id: livroId },
    });

    if (!user) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    if (!livro || livro.estoque <= 0) {
      return res.status(400).json({ erro: "Livro indisponível" });
    }

    const valor = calcularAluguel(livro, dias);

    const retiradaLimite = new Date();
    retiradaLimite.setDate(retiradaLimite.getDate() + 7);

    const devolucao = new Date();
    devolucao.setDate(devolucao.getDate() + dias);

    const pedido = await prisma.pedido.create({
      data: {
        tipo: "aluguel",
        status: "pendente",
        valor,
        diasAluguel: dias,
        retiradaLimite,
        devolucaoPrevista: devolucao,
        usuarioId,
        livroId,
      },
    });

    await prisma.livro.update({
      where: { id: livroId },
      data: { estoque: livro.estoque - 1 },
    });

    await enviarEmail(user.email, livro, pedido);

    res.json(pedido);
  } catch (error) {
    res.status(500).json({ erro: "Erro no aluguel" });
  }
});

// ======================
// EMAIL
// ======================
async function enviarEmail(email, livro, pedido) {
  try {
    await transporter.sendMail({
      from: "BiblioConnect",
      to: email,
      subject: "Confirmação de Pedido",
      html: `
        <h2>Pedido confirmado</h2>
        <p><b>Livro:</b> ${livro.titulo}</p>
        <p><b>Tipo:</b> ${pedido.tipo}</p>
        <p><b>Valor:</b> R$ ${pedido.valor}</p>
        <p><b>Retirada até:</b> ${new Date(
          pedido.retiradaLimite,
        ).toLocaleDateString()}</p>
      `,
    });
  } catch (error) {
    console.log("Erro no email:", error);
  }
}

// ======================
// START SERVER
// ======================
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000 🚀");
});
