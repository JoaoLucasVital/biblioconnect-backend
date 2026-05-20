import { useEffect, useMemo, useState } from "react";
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

function AdminOrders() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const [pedidoAcao, setPedidoAcao] = useState(null);
  const [novoStatus, setNovoStatus] = useState("");
  const [processando, setProcessando] = useState(false);

  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [busca, setBusca] = useState("");

  async function carregarPedidos() {
    try {
      setLoading(true);
      setFeedback({ type: "", text: "" });

      const response = await api.get("/admin/pedidos");

      setPedidos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.erro || "Erro ao carregar pedidos.",
      });
    } finally {
      setLoading(false);
    }
  }

  function abrirConfirmacao(pedido, status) {
    if (
      (status === "concluido" || status === "devolvido") &&
      pedido.statusPagamento !== "pago"
    ) {
      setFeedback({
        type: "error",
        text: "Este pedido ainda não possui pagamento aprovado. Marque o pagamento como pago no Financeiro antes de finalizar.",
      });

      return;
    }

    setPedidoAcao(pedido);
    setNovoStatus(status);
  }

  function fecharConfirmacao() {
    setPedidoAcao(null);
    setNovoStatus("");
  }

  async function confirmarStatus() {
    if (!pedidoAcao || !novoStatus) return;

    try {
      setProcessando(true);
      setFeedback({ type: "", text: "" });

      await api.patch(`/admin/pedidos/${pedidoAcao.id}/status`, {
        status: novoStatus,
      });

      if (novoStatus === "cancelado") {
        setFeedback({
          type: "danger",
          text: "Pedido cancelado com sucesso.",
        });
      } else {
        setFeedback({
          type: "success",
          text: "Status do pedido atualizado com sucesso.",
        });
      }

      fecharConfirmacao();
      carregarPedidos();
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.erro || "Erro ao atualizar status.",
      });
    } finally {
      setProcessando(false);
    }
  }

  function limparFiltros() {
    setFiltroTipo("todos");
    setFiltroStatus("todos");
    setBusca("");
  }

  useEffect(() => {
    carregarPedidos();
  }, []);

  const pedidosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return pedidos.filter((pedido) => {
      const tipoValido = filtroTipo === "todos" || pedido.tipo === filtroTipo;

      const statusValido =
        filtroStatus === "todos" || pedido.status === filtroStatus;

      const textoBusca = [
        pedido.livro?.titulo,
        pedido.livro?.autor,
        pedido.usuario?.nome,
        pedido.usuario?.email,
        pedido.usuario?.telefone,
        pedido.statusPagamento,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const buscaValida = !termo || textoBusca.includes(termo);

      return tipoValido && statusValido && buscaValida;
    });
  }, [pedidos, filtroTipo, filtroStatus, busca]);

  const pendentes = pedidosFiltrados.filter(
    (pedido) => pedido.status === "pendente"
  );

  const finalizados = pedidosFiltrados.filter(
    (pedido) => pedido.status !== "pendente"
  );

  const totalMultas = pedidosFiltrados.reduce((total, pedido) => {
    return total + Number(pedido.multaAtual || 0);
  }, 0);

  const totalValor = pedidosFiltrados.reduce((total, pedido) => {
    return total + Number(pedido.valor || 0);
  }, 0);

  const grupos = [
    {
      titulo: "Pedidos pendentes",
      descricao: "Pedidos que ainda precisam de ação administrativa.",
      pedidos: pendentes,
    },
    {
      titulo: "Histórico finalizado",
      descricao: "Pedidos concluídos, devolvidos ou cancelados.",
      pedidos: finalizados,
    },
  ];

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <p className="page-subtitle">Carregando pedidos...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page admin-animated-page">
      <div className="container">
        <div className="orders-admin-header">
          <div>
            <h1 className="page-title">Gerenciar Pedidos</h1>

            <p className="page-subtitle">
              Finalize apenas pedidos com pagamento aprovado. Pedidos pendentes
              continuam aguardando confirmação financeira.
            </p>
          </div>
        </div>

        {feedback.text && (
          <p className={`feedback-banner ${feedback.type}`}>{feedback.text}</p>
        )}

        <section className="orders-payment-rule">
          <strong>Regra operacional ativa</strong>
          <p>
            Pedidos só podem ser concluídos ou devolvidos depois que o pagamento
            estiver aprovado no módulo Financeiro.
          </p>
        </section>

        <section className="orders-filter-panel">
          <div className="orders-filter-top">
            <div>
              <h2>Filtros</h2>
              <p>Encontre pedidos por tipo, status, cliente ou livro.</p>
            </div>

            <button className="btn btn-outline" onClick={limparFiltros}>
              Limpar filtros
            </button>
          </div>

          <div className="orders-filter-grid">
            <div className="form-group">
              <label>Buscar</label>
              <input
                type="text"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Nome, email, telefone, livro ou pagamento"
              />
            </div>

            <div className="form-group">
              <label>Tipo</label>
              <select
                value={filtroTipo}
                onChange={(event) => setFiltroTipo(event.target.value)}
              >
                <option value="todos">Todos os tipos</option>
                <option value="compra">Compra</option>
                <option value="reserva">Reserva</option>
                <option value="aluguel">Aluguel</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={filtroStatus}
                onChange={(event) => setFiltroStatus(event.target.value)}
              >
                <option value="todos">Todos os status</option>
                <option value="pendente">Pendente</option>
                <option value="concluido">Concluído</option>
                <option value="devolvido">Devolvido</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>
        </section>

        <section className="orders-admin-summary">
          <div>
            <span>Pedidos encontrados</span>
            <strong>{pedidosFiltrados.length}</strong>
          </div>

          <div>
            <span>Pendentes</span>
            <strong>{pendentes.length}</strong>
          </div>

          <div>
            <span>Valor filtrado</span>
            <strong>{formatarMoeda(totalValor)}</strong>
          </div>

          <div>
            <span>Multas filtradas</span>
            <strong>{formatarMoeda(totalMultas)}</strong>
          </div>
        </section>

        {pedidosFiltrados.length === 0 ? (
          <div className="empty-state">
            <h2>Nenhum pedido encontrado</h2>
            <p>
              Ajuste os filtros ou aguarde clientes realizarem ações no
              catálogo.
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
                  <div className="admin-orders-list">
                    {grupo.pedidos.map((pedido) => {
                      const pagamentoAprovado =
                        pedido.statusPagamento === "pago";

                      return (
                        <article className="admin-order-card" key={pedido.id}>
                          <div className="admin-order-top">
                            <div className="order-icon">
                              {pedido.tipo === "compra" && "💰"}
                              {pedido.tipo === "reserva" && "📌"}
                              {pedido.tipo === "aluguel" && "📖"}
                            </div>

                            <div>
                              <div className="order-title-row">
                                <h2>{pedido.livro?.titulo}</h2>

                                <span className={`order-badge ${pedido.tipo}`}>
                                  {traduzirTipo(pedido.tipo)}
                                </span>

                                <span
                                  className={`status-badge ${pedido.status}`}
                                >
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
                                Cliente: <strong>{pedido.usuario?.nome}</strong>
                              </p>

                              <small>
                                Pedido feito em{" "}
                                {formatarData(pedido.createdAt)}
                              </small>
                            </div>
                          </div>

                          {!pagamentoAprovado &&
                            pedido.status === "pendente" && (
                              <div className="payment-lock-warning">
                                Pagamento ainda não aprovado. Finalização
                                bloqueada.
                              </div>
                            )}

                          <div className="admin-order-grid">
                            <div>
                              <span>Email</span>
                              <strong>{pedido.usuario?.email}</strong>
                            </div>

                            <div>
                              <span>Telefone</span>
                              <strong>
                                {pedido.usuario?.telefone || "Não informado"}
                              </strong>
                            </div>

                            <div>
                              <span>Endereço</span>
                              <strong>
                                {pedido.usuario?.endereco || "Não informado"}
                              </strong>
                            </div>

                            <div>
                              <span>Valor</span>
                              <strong>{formatarMoeda(pedido.valor)}</strong>
                            </div>

                            <div>
                              <span>Pagamento</span>
                              <strong>
                                {traduzirPagamento(
                                  pedido.statusPagamento || "pendente"
                                )}
                              </strong>
                            </div>

                            <div>
                              <span>Multa atual</span>
                              <strong>
                                {formatarMoeda(pedido.multaAtual)}
                              </strong>
                            </div>

                            <div>
                              <span>Retirada</span>
                              <strong>
                                {formatarData(pedido.retiradaLimite)}
                              </strong>
                            </div>

                            {pedido.tipo === "aluguel" && (
                              <div>
                                <span>Devolução prevista</span>
                                <strong>
                                  {formatarData(pedido.devolucaoPrevista)}
                                </strong>
                              </div>
                            )}

                            <div>
                              <span>Status</span>
                              <strong>{traduzirStatus(pedido.status)}</strong>
                            </div>
                          </div>

                          {pedido.status === "pendente" && (
                            <div className="admin-order-actions">
                              {pedido.tipo === "aluguel" ? (
                                <button
                                  className="btn btn-primary"
                                  onClick={() =>
                                    abrirConfirmacao(pedido, "devolvido")
                                  }
                                  disabled={!pagamentoAprovado}
                                >
                                  Marcar devolvido
                                </button>
                              ) : (
                                <button
                                  className="btn btn-primary"
                                  onClick={() =>
                                    abrirConfirmacao(pedido, "concluido")
                                  }
                                  disabled={!pagamentoAprovado}
                                >
                                  Marcar concluído
                                </button>
                              )}

                              <button
                                className="btn btn-danger"
                                onClick={() =>
                                  abrirConfirmacao(pedido, "cancelado")
                                }
                              >
                                Cancelar pedido
                              </button>
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </div>

      {pedidoAcao && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h2>Atualizar pedido</h2>

            <p>
              Confirmar alteração do pedido de{" "}
              <strong>{traduzirTipo(pedidoAcao.tipo)}</strong> para{" "}
              <strong>{traduzirStatus(novoStatus)}</strong>?
            </p>

            <div className="popup-details">
              <span>Livro: {pedidoAcao.livro?.titulo}</span>
              <span>Cliente: {pedidoAcao.usuario?.nome}</span>
              <span>Valor: {formatarMoeda(pedidoAcao.valor)}</span>
              <span>
                Pagamento:{" "}
                {traduzirPagamento(pedidoAcao.statusPagamento || "pendente")}
              </span>
              <span>Multa atual: {formatarMoeda(pedidoAcao.multaAtual)}</span>
            </div>

            <div className="popup-actions">
              <button
                className="btn btn-outline"
                onClick={fecharConfirmacao}
                disabled={processando}
              >
                Voltar
              </button>

              <button
                className={
                  novoStatus === "cancelado"
                    ? "btn btn-danger"
                    : "btn btn-primary"
                }
                onClick={confirmarStatus}
                disabled={processando}
              >
                {processando ? "Atualizando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminOrders;