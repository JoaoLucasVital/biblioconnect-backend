import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import api from "../api/api.js";

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function AdminDashboard() {
  const [stats, setStats] = useState({
    reservas: 0,
    vendas: 0,
    alugueis: 0,
    usuarios: 0,
    usuariosBloqueados: 0,
    livros: 0,
    atrasos: 0,
    multasPendentes: 0,
    livrosMaisVendidos: [],
    generosMaisVendidos: [],
    livroMaisVendido: null,
    generoMaisVendido: null,
  });

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarDashboard() {
    try {
      setLoading(true);
      setErro("");

      const response = await api.get("/admin/dashboard");

      setStats({
        reservas: response.data.reservas || 0,
        vendas: response.data.vendas || 0,
        alugueis: response.data.alugueis || 0,
        usuarios: response.data.usuarios || 0,
        usuariosBloqueados: response.data.usuariosBloqueados || 0,
        livros: response.data.livros || 0,
        atrasos: response.data.atrasos || 0,
        multasPendentes: response.data.multasPendentes || 0,
        livrosMaisVendidos: response.data.livrosMaisVendidos || [],
        generosMaisVendidos: response.data.generosMaisVendidos || [],
        livroMaisVendido: response.data.livroMaisVendido || null,
        generoMaisVendido: response.data.generoMaisVendido || null,
      });
    } catch (error) {
      setErro(
        error.response?.data?.erro ||
          "Erro ao carregar dados do painel administrativo."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDashboard();
  }, []);

  const barData = useMemo(
    () => [
      { nome: "Reservas", valor: stats.reservas },
      { nome: "Vendas", valor: stats.vendas },
      { nome: "Aluguéis", valor: stats.alugueis },
      { nome: "Atrasos", valor: stats.atrasos },
    ],
    [stats]
  );

  const pieData = useMemo(
    () => [
      {
        name: "Usuários ativos",
        value: Math.max(stats.usuarios - stats.usuariosBloqueados, 0),
      },
      { name: "Usuários congelados", value: stats.usuariosBloqueados },
    ],
    [stats]
  );

  const generosData = useMemo(
    () =>
      stats.generosMaisVendidos.map((item) => ({
        nome: item.genero,
        vendas: item.quantidadeVendas,
      })),
    [stats.generosMaisVendidos]
  );

  const livrosData = useMemo(
    () =>
      stats.livrosMaisVendidos.map((item) => ({
        nome:
          item.titulo.length > 16
            ? `${item.titulo.slice(0, 16)}...`
            : item.titulo,
        vendas: item.quantidadeVendas,
      })),
    [stats.livrosMaisVendidos]
  );

  const pieColors = ["#1E3A5F", "#E67E00"];

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <p className="page-subtitle">Carregando painel administrativo...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page admin-animated-page">
      <div className="container">
        <section className="admin-dashboard-hero solid-hero">
          <div className="hero-content">
            <span className="admin-dashboard-badge">Área administrativa</span>
            <h1>Painel do BiblioConnect</h1>
            <p>
              Controle pedidos, usuários, livros, vendas, gêneros, atrasos e
              multas com visão operacional clara.
            </p>
          </div>

          <div className="admin-dashboard-alert professional-card">
            <span className="alert-kicker">Pendências</span>
            <strong>{stats.atrasos} atrasos ativos</strong>
            <small>{formatarMoeda(stats.multasPendentes)} em multas</small>
          </div>
        </section>

        {erro && <p className="feedback-banner error">{erro}</p>}

        <section className="admin-hot-summary">
          <div>
            <span className="hot-label">
              🔥 Livro mais vendido
            </span>

            <strong>
              {stats.livroMaisVendido
                ? stats.livroMaisVendido.titulo
                : "Sem vendas registradas"}
            </strong>

            {stats.livroMaisVendido && (
              <small>
                {stats.livroMaisVendido.quantidadeVendas} venda
                {stats.livroMaisVendido.quantidadeVendas !== 1 ? "s" : ""}
              </small>
            )}
          </div>

          <div>
            <span className="hot-label">
              🔥 Gênero mais vendido
            </span>

            <strong>
              {stats.generoMaisVendido
                ? stats.generoMaisVendido.genero
                : "Sem gêneros ranqueados"}
            </strong>

            {stats.generoMaisVendido && (
              <small>
                {stats.generoMaisVendido.quantidadeVendas} venda
                {stats.generoMaisVendido.quantidadeVendas !== 1 ? "s" : ""}
              </small>
            )}
          </div>
        </section>

        {stats.atrasos > 0 && (
          <section className="critical-warning">
            <div className="critical-warning-copy">
              <h2>Existem pendências operacionais em aberto</h2>
              <p>
                Há reservas ou aluguéis em atraso. Acesse a área de atrasos
                para acompanhar multas e agir sobre usuários inadimplentes.
              </p>
            </div>

            <Link to="/admin/atrasos" className="btn btn-danger">
              Ver atrasos
            </Link>
          </section>
        )}

        <section className="admin-shortcuts">
          <Link to="/admin/pedidos" className="admin-shortcut-card featured">
            <span className="shortcut-kicker">Operação</span>
            <strong>Gerenciar pedidos</strong>
            <small>Concluir, devolver ou cancelar pedidos em andamento.</small>
          </Link>

          <Link to="/admin/livros" className="admin-shortcut-card">
            <span className="shortcut-kicker">Catálogo</span>
            <strong>Gerenciar livros</strong>
            <small>Editar, pausar, destacar e organizar o acervo.</small>
          </Link>

          <Link to="/admin/usuarios" className="admin-shortcut-card">
            <span className="shortcut-kicker">Clientes</span>
            <strong>Usuários</strong>
            <small>Visualizar clientes, multas e status de bloqueio.</small>
          </Link>

          <Link to="/admin/atrasos" className="admin-shortcut-card warning">
            <span className="shortcut-kicker">Financeiro</span>
            <strong>Atrasos e multas</strong>
            <small>Monitorar inadimplência e resolver pendências.</small>
          </Link>
        </section>

        <section className="stats-grid admin-stats-grid">
          <div className="stat-card">
            <span>Reservas</span>
            <strong>{stats.reservas}</strong>
          </div>

          <div className="stat-card">
            <span>Vendas</span>
            <strong>{stats.vendas}</strong>
          </div>

          <div className="stat-card">
            <span>Aluguéis</span>
            <strong>{stats.alugueis}</strong>
          </div>

          <div className="stat-card danger-stat">
            <span>Atrasos</span>
            <strong>{stats.atrasos}</strong>
          </div>

          <div className="stat-card">
            <span>Usuários</span>
            <strong>{stats.usuarios}</strong>
          </div>

          <div className="stat-card">
            <span>Congelados</span>
            <strong>{stats.usuariosBloqueados}</strong>
          </div>

          <div className="stat-card">
            <span>Livros</span>
            <strong>{stats.livros}</strong>
          </div>

          <div className="stat-card money-stat">
            <span>Multas pendentes</span>
            <strong>{formatarMoeda(stats.multasPendentes)}</strong>
          </div>
        </section>

        <section className="dashboard-grid professional-chart-grid">
          <div className="chart-card professional-card">
            <div className="chart-card-header">
              <div>
                <h2>Movimentações da biblioteca</h2>
                <p>Reservas, vendas, aluguéis e atrasos atuais.</p>
              </div>
            </div>

            <div className="real-chart-box">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d6dde7" />
                  <XAxis dataKey="nome" tick={{ fill: "#5b6676", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#5b6676", fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="valor" fill="#1E3A5F" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card professional-card">
            <div className="chart-card-header">
              <div>
                <h2>Status de usuários</h2>
                <p>Distribuição entre usuários ativos e congelados.</p>
              </div>
            </div>

            <div className="real-chart-box">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={pieColors[index % pieColors.length]}
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

        <section className="dashboard-grid professional-chart-grid admin-sales-charts">
          <div className="chart-card professional-card">
            <div className="chart-card-header">
              <div>
                <h2>Livros mais vendidos</h2>
                <p>Ranking automático baseado em compras registradas.</p>
              </div>
            </div>

            {livrosData.length > 0 ? (
              <div className="real-chart-box">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={livrosData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d6dde7" />
                    <XAxis dataKey="nome" tick={{ fill: "#5b6676", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#5b6676", fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="vendas" fill="#E67E00" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="ranking-empty">
                <h4>Sem vendas registradas</h4>
                <p>O gráfico será preenchido quando houver compras.</p>
              </div>
            )}
          </div>

          <div className="chart-card professional-card">
            <div className="chart-card-header">
              <div>
                <h2>Gêneros mais vendidos</h2>
                <p>Preferência dos leitores por categoria.</p>
              </div>
            </div>

            {generosData.length > 0 ? (
              <div className="real-chart-box">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={generosData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d6dde7" />
                    <XAxis dataKey="nome" tick={{ fill: "#5b6676", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#5b6676", fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="vendas" fill="#1E3A5F" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="ranking-empty">
                <h4>Sem gêneros ranqueados</h4>
                <p>O gráfico será preenchido quando houver compras.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;