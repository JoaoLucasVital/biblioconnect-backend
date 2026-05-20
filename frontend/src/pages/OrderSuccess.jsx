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

  return new Date(data).toLocaleDateString("pt-BR");
}

function traduzirTipo(tipo) {
  const tipos = {
    compra: "Compra",
    reserva: "Reserva",
    aluguel: "Aluguel",
  };

  return tipos[tipo] || tipo;
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

function OrderSuccess() {
  const { id } = useParams();

  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [pagando, setPagando] = useState(false);

  async function carregarPedido() {
    try {
      setLoading(true);
      setFeedback({ type: "", text: "" });

      const response = await api.get(`/pedidos/${id}`);

      setPedido(response.data);
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.erro || "Erro ao carregar pedido.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function simularPagamento() {
    try {
      setPagando(true);
      setFeedback({ type: "", text: "" });

      await api.patch(`/pedidos/${id}/simular-pagamento`);

      setFeedback({
        type: "success",
        text: "Pagamento simulado e aprovado com sucesso.",
      });

      carregarPedido();
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.erro || "Erro ao simular pagamento.",
      });
    } finally {
      setPagando(false);
    }
  }

  useEffect(() => {
    carregarPedido();
  }, [id]);

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <p className="page-subtitle">Carregando pedido...</p>
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

          <Link to="/livros" className="btn btn-primary">
            Voltar ao catálogo
          </Link>
        </div>
      </main>
    );
  }

  const pagamentoPago = pedido.statusPagamento === "pago";

  return (
    <main className="page checkout-page">
      <div className="container">
        <section className="checkout-hero">
          <div>
            <span className="section-kicker">Pedido registrado</span>

            <h1>Pedido #{pedido.id}</h1>

            <p>
              Seu pedido foi criado com sucesso. Confira os detalhes abaixo e
              finalize o pagamento quando estiver pronto.
            </p>
          </div>

          <div
            className={
              pagamentoPago
                ? "payment-status-card paid"
                : "payment-status-card pending"
            }
          >
            <span>Status de pagamento</span>
            <strong>{traduzirPagamento(pedido.statusPagamento)}</strong>
          </div>
        </section>

        {feedback.text && (
          <p className={`feedback-banner ${feedback.type}`}>{feedback.text}</p>
        )}

        <section className="checkout-grid">
          <article className="checkout-card">
            <h2>Resumo do pedido</h2>

            <div className="checkout-details">
              <div>
                <span>Tipo</span>
                <strong>{traduzirTipo(pedido.tipo)}</strong>
              </div>

              <div>
                <span>Livro</span>
                <strong>{pedido.livro?.titulo}</strong>
              </div>

              <div>
                <span>Autor</span>
                <strong>{pedido.livro?.autor}</strong>
              </div>

              <div>
                <span>Valor</span>
                <strong>{formatarMoeda(pedido.valor)}</strong>
              </div>

              <div>
                <span>Status do pedido</span>
                <strong>{pedido.status}</strong>
              </div>

              <div>
                <span>Pagamento</span>
                <strong>{traduzirPagamento(pedido.statusPagamento)}</strong>
              </div>

              <div>
                <span>Data do pedido</span>
                <strong>{formatarData(pedido.createdAt)}</strong>
              </div>

              <div>
                <span>Retirada</span>
                <strong>{formatarData(pedido.retiradaLimite)}</strong>
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
          </article>

          <article className="checkout-card payment-card">
            <h2>Pagamento</h2>

            <p>
              Nesta versão, o pagamento ainda é simulado. Na etapa final do
              projeto, esta área poderá receber o QR Code Pix real do gateway.
            </p>

            <div className="fake-qr-box">
              <div className="fake-qr-grid">
                {Array.from({ length: 49 }).map((_, index) => (
                  <span
                    key={index}
                    className={index % 3 === 0 ? "filled" : ""}
                  />
                ))}
              </div>

              <small>QR Code Pix simulado</small>
            </div>

            {!pagamentoPago ? (
              <button
                className="btn btn-primary"
                onClick={simularPagamento}
                disabled={pagando}
              >
                {pagando ? "Processando..." : "Simular pagamento aprovado"}
              </button>
            ) : (
              <div className="payment-approved-box">
                <strong>Pagamento aprovado</strong>
                <span>O pedido já está marcado como pago.</span>
              </div>
            )}

            <div className="checkout-actions">
              <Link to={`/comprovante/${pedido.id}`} className="btn btn-primary">
                Ver comprovante
              </Link>

              <Link to="/meus-pedidos" className="btn btn-outline">
                Ver meus pedidos
              </Link>

              <Link to="/livros" className="btn btn-dark">
                Voltar ao catálogo
              </Link>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

export default OrderSuccess;