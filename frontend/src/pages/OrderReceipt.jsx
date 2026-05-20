import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/api.js";

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarData(data) {
  if (!data) return "Não informado";

  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatarDataHora(data) {
  if (!data) return "Não informado";

  return new Date(data).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function traduzirTipo(tipo) {
  const tipos = {
    compra: "Compra",
    reserva: "Reserva",
    aluguel: "Aluguel",
  };

  return tipos[tipo] || tipo;
}

function traduzirStatusPedido(status) {
  const statusMap = {
    pendente: "Pendente",
    concluido: "Concluído",
    devolvido: "Devolvido",
    cancelado: "Cancelado",
  };

  return statusMap[status] || status;
}

function traduzirPagamento(status) {
  const statusMap = {
    pendente: "Pagamento pendente",
    pago: "Pagamento aprovado",
    cancelado: "Pagamento cancelado",
    estornado: "Pagamento estornado",
  };

  return statusMap[status] || status || "Pagamento pendente";
}

function gerarCodigoComprovante(pedido) {
  if (!pedido) return "";

  const ano = new Date(pedido.createdAt).getFullYear();
  return `BC-${ano}-${String(pedido.id).padStart(6, "0")}`;
}

function limparNomeArquivo(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function OrderReceipt() {
  const { id } = useParams();

  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  async function carregarPedido() {
    try {
      setLoading(true);
      setFeedback({ type: "", text: "" });

      const response = await api.get(`/pedidos/${id}`);

      setPedido(response.data);
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.erro || "Erro ao carregar comprovante.",
      });
    } finally {
      setLoading(false);
    }
  }

  function definirTituloComprovante() {
    if (!pedido) return;

    const nomeLivro = limparNomeArquivo(pedido.livro?.titulo || "Pedido");
    const tipoPedido = traduzirTipo(pedido.tipo);
    const numeroPedido = String(pedido.id).padStart(4, "0");

    document.title = `Comprovante - ${tipoPedido} - ${nomeLivro} - Pedido ${numeroPedido}`;
  }

  function imprimirComprovante() {
    definirTituloComprovante();

    setTimeout(() => {
      window.print();
    }, 100);
  }

  useEffect(() => {
    carregarPedido();
  }, [id]);

  useEffect(() => {
    if (pedido) {
      definirTituloComprovante();
    }

    return () => {
      document.title = "BiblioConnect";
    };
  }, [pedido]);

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <p className="page-subtitle">Carregando comprovante...</p>
        </div>
      </main>
    );
  }

  if (!pedido) {
    return (
      <main className="page">
        <div className="container">
          {feedback.text && (
            <p className={`feedback-banner ${feedback.type}`}>
              {feedback.text}
            </p>
          )}

          <Link to="/meus-pedidos" className="btn btn-primary">
            Voltar para meus pedidos
          </Link>
        </div>
      </main>
    );
  }

  const codigoComprovante = gerarCodigoComprovante(pedido);
  const pagamentoPago = pedido.statusPagamento === "pago";

  return (
    <main className="page receipt-page">
      <div className="container">
        <section className="receipt-toolbar no-print">
          <div>
            <span className="section-kicker">Comprovante</span>

            <h1>Comprovante do pedido</h1>

            <p>
              Documento de registro interno da operação realizada no
              BiblioConnect.
            </p>
          </div>

          <div className="receipt-toolbar-actions">
            <button className="btn btn-primary" onClick={imprimirComprovante}>
              Imprimir / Salvar PDF
            </button>

            <Link to="/meus-pedidos" className="btn btn-outline">
              Meus pedidos
            </Link>

            <Link to="/livros" className="btn btn-dark">
              Catálogo
            </Link>
          </div>
        </section>

        {feedback.text && (
          <p className={`feedback-banner ${feedback.type} no-print`}>
            {feedback.text}
          </p>
        )}

        <section className="receipt-paper">
          <header className="receipt-header">
            <div className="receipt-brand">
              <div className="receipt-logo-mark">BC</div>

              <div>
                <h2>BiblioConnect</h2>
                <span>Biblioteca Online</span>
              </div>
            </div>

            <div className="receipt-code-box">
              <span>Código do comprovante</span>
              <strong>{codigoComprovante}</strong>
            </div>
          </header>

          <section className="receipt-status-row">
            <div
              className={
                pagamentoPago
                  ? "receipt-status-card paid"
                  : "receipt-status-card pending"
              }
            >
              <span>Status de pagamento</span>
              <strong>{traduzirPagamento(pedido.statusPagamento)}</strong>
            </div>

            <div className="receipt-status-card">
              <span>Status do pedido</span>
              <strong>{traduzirStatusPedido(pedido.status)}</strong>
            </div>

            <div className="receipt-status-card">
              <span>Tipo de operação</span>
              <strong>{traduzirTipo(pedido.tipo)}</strong>
            </div>
          </section>

          <section className="receipt-section">
            <div className="receipt-section-title">
              <span>01</span>
              <h3>Dados do cliente</h3>
            </div>

            <div className="receipt-grid">
              <div>
                <span>Nome</span>
                <strong>{pedido.usuario?.nome || "Não informado"}</strong>
              </div>

              <div>
                <span>Email</span>
                <strong>{pedido.usuario?.email || "Não informado"}</strong>
              </div>

              <div>
                <span>Telefone</span>
                <strong>{pedido.usuario?.telefone || "Não informado"}</strong>
              </div>

              <div>
                <span>Endereço</span>
                <strong>{pedido.usuario?.endereco || "Não informado"}</strong>
              </div>
            </div>
          </section>

          <section className="receipt-section">
            <div className="receipt-section-title">
              <span>02</span>
              <h3>Dados do livro</h3>
            </div>

            <div className="receipt-grid">
              <div>
                <span>Título</span>
                <strong>{pedido.livro?.titulo || "Não informado"}</strong>
              </div>

              <div>
                <span>Autor</span>
                <strong>{pedido.livro?.autor || "Não informado"}</strong>
              </div>

              <div>
                <span>Categoria</span>
                <strong>{pedido.livro?.categoria || "Não informado"}</strong>
              </div>

              <div>
                <span>Valor do pedido</span>
                <strong>{formatarMoeda(pedido.valor)}</strong>
              </div>
            </div>
          </section>

          <section className="receipt-section">
            <div className="receipt-section-title">
              <span>03</span>
              <h3>Detalhes da operação</h3>
            </div>

            <div className="receipt-grid">
              <div>
                <span>Número do pedido</span>
                <strong>#{pedido.id}</strong>
              </div>

              <div>
                <span>Data do pedido</span>
                <strong>{formatarDataHora(pedido.createdAt)}</strong>
              </div>

              <div>
                <span>Retirada limite</span>
                <strong>{formatarData(pedido.retiradaLimite)}</strong>
              </div>

              <div>
                <span>Pagamento</span>
                <strong>{traduzirPagamento(pedido.statusPagamento)}</strong>
              </div>

              {pedido.tipo === "aluguel" && (
                <>
                  <div>
                    <span>Dias de aluguel</span>
                    <strong>{pedido.diasAluguel} dias</strong>
                  </div>

                  <div>
                    <span>Devolução prevista</span>
                    <strong>{formatarData(pedido.devolucaoPrevista)}</strong>
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="receipt-total-box">
            <div>
              <span>Total do comprovante</span>
              <strong>{formatarMoeda(pedido.valor)}</strong>
            </div>

            <p>
              Este comprovante registra a movimentação realizada no sistema
              BiblioConnect. Para validade financeira plena, o status de
              pagamento deve constar como aprovado.
            </p>
          </section>

          <footer className="receipt-footer">
            <span>Gerado em {formatarDataHora(new Date())}</span>
            <span>BiblioConnect • Sistema de Biblioteca Online</span>
          </footer>
        </section>
      </div>
    </main>
  );
}

export default OrderReceipt;