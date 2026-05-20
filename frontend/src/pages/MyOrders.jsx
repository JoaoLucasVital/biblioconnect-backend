import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    reserva: "Reserva",
    compra: "Compra",
    aluguel: "Aluguel",
  };

  return tipos[tipo] || tipo;
}

function traduzirStatus(status) {
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

function getPedidoIcon(tipo) {
  if (tipo === "compra") return "💰";
  if (tipo === "reserva") return "📌";
  if (tipo === "aluguel") return "📖";
  return "📚";
}

function MyOrders() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [pedidoCancelamento, setPedidoCancelamento] = useState(null);
  const [cancelando, setCancelando] = useState(false);

  async function carregarPedidos() {
    try {
      setLoading(true);
      setFeedback({ type: "", text: "" });

      const response = await api.get("/me/pedidos");

      setPedidos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      const mensagemBackend =
        error.response?.data?.detalhe ||
        error.response?.data?.erro ||
        error.message ||
        "Erro ao carregar seus pedidos.";

      setFeedback({ type: "error", text: mensagemBackend });
    } finally {
      setLoading(false);
    }
  }

  async function confirmarCancelamento() {
    if (!pedidoCancelamento) return;

    try {
      setCancelando(true);

      await api.patch(`/me/pedidos/${pedidoCancelamento.id}/cancelar`);

      setFeedback({
        type: "danger",
        text: "Pedido cancelado com sucesso.",
      });

      setPedidoCancelamento(null);
      carregarPedidos();
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.erro || "Erro ao cancelar pedido.",
      });
    } finally {
      setCancelando(false);
    }
  }

  useEffect(() => {
    carregarPedidos();
  }, []);

  const reservas = pedidos.filter((pedido) => pedido.tipo === "reserva");
  const compras = pedidos.filter((pedido) => pedido.tipo === "compra");
  const alugueis = pedidos.filter((pedido) => pedido.tipo === "aluguel");

  const grupos = [
    {
      titulo: "Reservas",
      descricao: "Livros reservados para retirada na biblioteca.",
      pedidos: reservas,
    },
    {
      titulo: "Compras",
      descricao: "Livros comprados e aguardando retirada.",
      pedidos: compras,
    },
    {
      titulo: "Aluguéis",
      descricao: "Livros alugados com prazo de devolução.",
      pedidos: alugueis,
    },
  ];

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <p className="page-subtitle">Carregando seus pedidos...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container">
        <h1 className="page-title">Meus Pedidos</h1>

        <p className="page-subtitle">
          Acompanhe separadamente suas reservas, compras e aluguéis.
        </p>

        {feedback.text && (
          <p className={`feedback-banner ${feedback.type}`}>{feedback.text}</p>
        )}

        {pedidos.length === 0 ? (
          <div className="empty-state">
            <h2>Nenhum pedido encontrado</h2>
            <p>
              Quando você reservar, comprar ou alugar um livro, o pedido
              aparecerá aqui.
            </p>
          </div>
        ) : (
          <div className="orders-groups">
            {grupos.map((grupo) => (
              <section className="orders-group" key={grupo.titulo}>
                <div className="orders-group-header">
                  <div>
                    <h2>{grupo.titulo}</h2>
                    <p>{grupo.descricao}</p>
                  </div>

                  <span>{grupo.pedidos.length}</span>
                </div>

                {grupo.pedidos.length === 0 ? (
                  <div className="orders-empty-small">
                    Nenhum pedido nesta categoria.
                  </div>
                ) : (
                  <div className="orders-list">
                    {grupo.pedidos.map((pedido) => (
                      <div className="order-card" key={pedido.id}>
                        <div className="order-main">
                          <div className="order-icon">
                            {getPedidoIcon(pedido.tipo)}
                          </div>

                          <div>
                            <div className="order-title-row">
                              <h2>
                                {pedido.livro?.titulo ||
                                  "Livro não encontrado"}
                              </h2>

                              <span className={`order-badge ${pedido.tipo}`}>
                                {traduzirTipo(pedido.tipo)}
                              </span>

                              <span className={`status-badge ${pedido.status}`}>
                                {traduzirStatus(pedido.status)}
                              </span>

                              <span
                                className={`payment-mini-status ${
                                  pedido.statusPagamento || "pendente"
                                }`}
                              >
                                {traduzirPagamento(
                                  pedido.statusPagamento || "pendente"
                                )}
                              </span>
                            </div>

                            <p>
                              {pedido.livro?.autor || "Autor não informado"}
                            </p>

                            <small>
                              Data do pedido: {formatarData(pedido.createdAt)}
                            </small>
                          </div>
                        </div>

                        <div className="order-details">
                          <div>
                            <span>Tipo</span>
                            <strong>{traduzirTipo(pedido.tipo)}</strong>
                          </div>

                          <div>
                            <span>Valor</span>
                            <strong>{formatarMoeda(pedido.valor)}</strong>
                          </div>

                          <div>
                            <span>Retirada</span>
                            <strong>{formatarData(pedido.retiradaLimite)}</strong>
                          </div>

                          <div>
                            <span>Pagamento</span>
                            <strong>
                              {traduzirPagamento(
                                pedido.statusPagamento || "pendente"
                              )}
                            </strong>
                          </div>

                          {pedido.tipo === "aluguel" && (
                            <>
                              <div>
                                <span>Dias de aluguel</span>
                                <strong>{pedido.diasAluguel} dias</strong>
                              </div>

                              <div>
                                <span>Devolução</span>
                                <strong>
                                  {formatarData(pedido.devolucaoPrevista)}
                                </strong>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="order-actions">
                          <Link
                            to={`/comprovante/${pedido.id}`}
                            className="btn btn-outline"
                          >
                            Comprovante
                          </Link>

                          {pedido.status !== "cancelado" && (
                            <button
                              className="btn btn-danger"
                              onClick={() => setPedidoCancelamento(pedido)}
                            >
                              Cancelar pedido
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </div>

      {pedidoCancelamento && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h2>Cancelar pedido</h2>

            <p>
              Tem certeza que deseja cancelar este pedido de{" "}
              <strong>{traduzirTipo(pedidoCancelamento.tipo)}</strong>?
            </p>

            <div className="popup-details">
              <span>Livro: {pedidoCancelamento.livro?.titulo}</span>
              <span>Valor: {formatarMoeda(pedidoCancelamento.valor)}</span>
              <span>
                Data do pedido: {formatarData(pedidoCancelamento.createdAt)}
              </span>
            </div>

            <div className="popup-actions">
              <button
                className="btn btn-outline"
                onClick={() => setPedidoCancelamento(null)}
                disabled={cancelando}
              >
                Voltar
              </button>

              <button
                className="btn btn-danger"
                onClick={confirmarCancelamento}
                disabled={cancelando}
              >
                {cancelando ? "Cancelando..." : "Confirmar cancelamento"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default MyOrders;