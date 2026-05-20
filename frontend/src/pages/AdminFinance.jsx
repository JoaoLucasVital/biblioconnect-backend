import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
    pendente: "Pendente",
    pago: "Pago",
    cancelado: "Cancelado",
    estornado: "Estornado",
  };

  return statusMap[status] || status;
}

function AdminFinance() {
  const [financeiro, setFinanceiro] = useState({
    totalRecebido: 0,
    totalPendente: 0,
    totalCompras: 0,
    totalAlugueis: 0,
    totalReservasMultas: 0,
    totalEstornado: 0,
    totalCanceladoPagamento: 0,
    pedidosPagos: 0,
    pedidosPendentes: 0,
    pedidosCanceladosPagamento: 0,
    pedidosEstornados: 0,
    porTipo: [],
    porPagamento: [],
    pedidosRecentes: [],
  });

  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [pedidoAcao, setPedidoAcao] = useState(null);
  const [novoPagamento, setNovoPagamento] = useState("");
  const [processando, setProcessando] = useState(false);

  async function carregarFinanceiro() {
    try {
      setLoading(true);
      setFeedback({ type: "", text: "" });

      const response = await api.get("/admin/financeiro");

      setFinanceiro({
        totalRecebido: response.data.totalRecebido || 0,
        totalPendente: response.data.totalPendente || 0,
        totalCompras: response.data.totalCompras || 0,
        totalAlugueis: response.data.totalAlugueis || 0,
        totalReservasMultas: response.data.totalReservasMultas || 0,
        totalEstornado: response.data.totalEstornado || 0,
        totalCanceladoPagamento: response.data.totalCanceladoPagamento || 0,
        pedidosPagos: response.data.pedidosPagos || 0,
        pedidosPendentes: response.data.pedidosPendentes || 0,
        pedidosCanceladosPagamento:
          response.data.pedidosCanceladosPagamento || 0,
        pedidosEstornados: response.data.pedidosEstornados || 0,
        porTipo: response.data.porTipo || [],
        porPagamento: response.data.porPagamento || [],
        pedidosRecentes: response.data.pedidosRecentes || [],
      });
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error.response?.data?.erro ||
          "Erro ao carregar dados financeiros.",
      });
    } finally {
      setLoading(false);
    }
  }

  function abrirPagamento(pedido, statusPagamento) {
    setPedidoAcao(pedido);
    setNovoPagamento(statusPagamento);
  }

  function fecharPagamento() {
    setPedidoAcao(null);
    setNovoPagamento("");
  }

  async function confirmarPagamento() {
    if (!pedidoAcao || !novoPagamento) return;

    try {
      setProcessando(true);
      setFeedback({ type: "", text: "" });

      await api.patch(`/admin/pedidos/${pedidoAcao.id}/pagamento`, {
        statusPagamento: novoPagamento,
      });

      setFeedback({
        type: novoPagamento === "pago" ? "success" : "danger",
        text:
          novoPagamento === "pago"
            ? "Pagamento aprovado. O valor agora entrou na receita."
            : "Status de pagamento atualizado. O valor foi removido da receita aprovada.",
      });

      fecharPagamento();
      carregarFinanceiro();
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error.response?.data?.erro ||
          "Erro ao alterar status de pagamento.",
      });
    } finally {
      setProcessando(false);
    }
  }

  useEffect(() => {
    carregarFinanceiro();
  }, []);

  const tipoChart = useMemo(
    () =>
      financeiro.porTipo.map((item) => ({
        nome: item.nome,
        valor: Number(item.valor || 0),
      })),
    [financeiro.porTipo]
  );

  const pagamentoChart = useMemo(
    () =>
      financeiro.porPagamento.map((item) => ({
        name: item.nome,
        value: Number(item.quantidade || 0),
      })),
    [financeiro.porPagamento]
  );

  const pagamentoColors = ["#15803d", "#e67e00", "#b91c1c", "#475569"];

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <p className="page-subtitle">Carregando financeiro...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page admin-animated-page">
      <div className="container">
        <section className="finance-hero">
          <div>
            <span className="section-kicker">Controle financeiro</span>

            <h1>Financeiro da biblioteca</h1>

            <p>
              Acompanhe apenas receitas aprovadas, pagamentos pendentes,
              estornos e movimentações financeiras da plataforma.
            </p>
          </div>

          <div className="finance-hero-card">
            <span>Receita aprovada</span>
            <strong>{formatarMoeda(financeiro.totalRecebido)}</strong>
          </div>
        </section>

        {feedback.text && (
          <p className={`feedback-banner ${feedback.type}`}>
            {feedback.text}
          </p>
        )}

        <section className="finance-rule-alert">
          <strong>Regra financeira ativa</strong>
          <p>
            Valores pendentes, estornados ou cancelados não entram como receita.
            O sistema só soma em compras, aluguéis e reservas/multas quando o
            pagamento estiver aprovado.
          </p>
        </section>

        <section className="finance-stats-grid">
          <div className="finance-stat-card received">
            <span>Receita aprovada</span>
            <strong>{formatarMoeda(financeiro.totalRecebido)}</strong>
          </div>

          <div className="finance-stat-card pending">
            <span>Total pendente</span>
            <strong>{formatarMoeda(financeiro.totalPendente)}</strong>
          </div>

          <div className="finance-stat-card">
            <span>Compras pagas</span>
            <strong>{formatarMoeda(financeiro.totalCompras)}</strong>
          </div>

          <div className="finance-stat-card">
            <span>Aluguéis pagos</span>
            <strong>{formatarMoeda(financeiro.totalAlugueis)}</strong>
          </div>

          <div className="finance-stat-card">
            <span>Reservas/multas pagas</span>
            <strong>{formatarMoeda(financeiro.totalReservasMultas)}</strong>
          </div>

          <div className="finance-stat-card">
            <span>Pedidos pagos</span>
            <strong>{financeiro.pedidosPagos}</strong>
          </div>

          <div className="finance-stat-card">
            <span>Pagamentos pendentes</span>
            <strong>{financeiro.pedidosPendentes}</strong>
          </div>

          <div className="finance-stat-card danger-money">
            <span>Valor estornado</span>
            <strong>{formatarMoeda(financeiro.totalEstornado)}</strong>
          </div>
        </section>

        <section className="dashboard-grid professional-chart-grid finance-charts">
          <div className="chart-card professional-card">
            <div className="chart-card-header">
              <div>
                <h2>Receita aprovada por tipo</h2>
                <p>Somente pagamentos aprovados entram neste gráfico.</p>
              </div>
            </div>

            <div className="real-chart-box">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={tipoChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d6dde7" />
                  <XAxis
                    dataKey="nome"
                    tick={{ fill: "#5b6676", fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: "#5b6676", fontSize: 12 }} />
                  <Tooltip formatter={(value) => formatarMoeda(value)} />
                  <Bar dataKey="valor" fill="#1E3A5F" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card professional-card">
            <div className="chart-card-header">
              <div>
                <h2>Status de pagamentos</h2>
                <p>Quantidade de pedidos por situação financeira.</p>
              </div>
            </div>

            <div className="real-chart-box">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={pagamentoChart}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                  >
                    {pagamentoChart.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={pagamentoColors[index % pagamentoColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="finance-orders-section">
          <div className="section-heading-row">
            <div>
              <span className="section-kicker">Movimentações recentes</span>
              <h2>Pedidos financeiros</h2>
            </div>
          </div>

          {financeiro.pedidosRecentes.length === 0 ? (
            <div className="empty-state">
              <h2>Nenhuma movimentação financeira</h2>
              <p>Quando pedidos forem criados, eles aparecerão aqui.</p>
            </div>
          ) : (
            <div className="finance-orders-list">
              {financeiro.pedidosRecentes.map((pedido) => (
                <article className="finance-order-card" key={pedido.id}>
                  <div>
                    <h3>{pedido.livro?.titulo}</h3>

                    <p>
                      {traduzirTipo(pedido.tipo)} de{" "}
                      <strong>{pedido.usuario?.nome}</strong>
                    </p>

                    <small>
                      Pedido #{pedido.id} • {formatarData(pedido.createdAt)}
                    </small>
                  </div>

                  <div className="finance-order-values">
                    <span>{formatarMoeda(pedido.valor)}</span>

                    <strong
                      className={`payment-mini-status ${pedido.statusPagamento}`}
                    >
                      {traduzirPagamento(pedido.statusPagamento)}
                    </strong>
                  </div>

                  <div className="finance-order-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => abrirPagamento(pedido, "pago")}
                      disabled={pedido.statusPagamento === "pago"}
                    >
                      Marcar pago
                    </button>

                    <button
                      className="btn btn-outline"
                      onClick={() => abrirPagamento(pedido, "pendente")}
                      disabled={pedido.statusPagamento === "pendente"}
                    >
                      Pendente
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => abrirPagamento(pedido, "estornado")}
                      disabled={pedido.statusPagamento === "estornado"}
                    >
                      Estornar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {pedidoAcao && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h2>Alterar pagamento</h2>

            <p>
              Confirmar alteração do pedido{" "}
              <strong>#{pedidoAcao.id}</strong> para{" "}
              <strong>{traduzirPagamento(novoPagamento)}</strong>?
            </p>

            <div className="popup-details">
              <span>Livro: {pedidoAcao.livro?.titulo}</span>
              <span>Cliente: {pedidoAcao.usuario?.nome}</span>
              <span>Valor: {formatarMoeda(pedidoAcao.valor)}</span>
              <span>
                Status atual:{" "}
                {traduzirPagamento(pedidoAcao.statusPagamento)}
              </span>
            </div>

            <div className="popup-actions">
              <button
                className="btn btn-outline"
                onClick={fecharPagamento}
                disabled={processando}
              >
                Voltar
              </button>

              <button
                className={
                  novoPagamento === "pago"
                    ? "btn btn-primary"
                    : "btn btn-danger"
                }
                onClick={confirmarPagamento}
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

export default AdminFinance;