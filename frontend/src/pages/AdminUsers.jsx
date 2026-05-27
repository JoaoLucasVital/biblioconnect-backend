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

function montarEnderecoResumo(usuario) {
  const partes = [
    usuario.rua,
    usuario.numero ? `nº ${usuario.numero}` : "",
    usuario.bairro,
    usuario.cidade,
    usuario.estado,
  ].filter(Boolean);

  if (partes.length > 0) {
    return partes.join(", ");
  }

  return usuario.endereco || "Não informado";
}

function AdminUsers() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const [usuarioAcao, setUsuarioAcao] = useState(null);
  const [tipoAcao, setTipoAcao] = useState("");
  const [processando, setProcessando] = useState(false);

  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  async function carregarUsuarios() {
    try {
      setLoading(true);
      setFeedback({ type: "", text: "" });

      const response = await api.get("/admin/usuarios");
      setUsuarios(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.erro || "Erro ao carregar usuários.",
      });
    } finally {
      setLoading(false);
    }
  }

  function abrirConfirmacao(usuario, tipo) {
    setUsuarioAcao(usuario);
    setTipoAcao(tipo);
  }

  function fecharConfirmacao() {
    setUsuarioAcao(null);
    setTipoAcao("");
  }

  async function confirmarAcao() {
    if (!usuarioAcao || !tipoAcao) return;

    try {
      setProcessando(true);
      setFeedback({ type: "", text: "" });

      if (tipoAcao === "bloquear") {
        await api.patch(`/admin/usuarios/${usuarioAcao.id}/bloqueio`, {
          bloqueado: !usuarioAcao.bloqueado,
        });

        setFeedback({
          type: usuarioAcao.bloqueado ? "success" : "danger",
          text: usuarioAcao.bloqueado
            ? "Usuário descongelado com sucesso."
            : "Usuário congelado com sucesso.",
        });
      }

      if (tipoAcao === "remover") {
        await api.delete(`/admin/usuarios/${usuarioAcao.id}`);

        setFeedback({
          type: "danger",
          text: "Usuário removido com sucesso.",
        });
      }

      fecharConfirmacao();
      carregarUsuarios();
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.erro || "Erro ao executar ação.",
      });
    } finally {
      setProcessando(false);
    }
  }

  function limparFiltros() {
    setBusca("");
    setFiltroStatus("todos");
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const usuariosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return usuarios.filter((usuario) => {
      const textoBusca = [
        usuario.nome,
        usuario.email,
        usuario.telefone,
        usuario.endereco,
        usuario.cep,
        usuario.rua,
        usuario.bairro,
        usuario.cidade,
        usuario.estado,
        usuario.numero,
        usuario.complemento,
        usuario.pontoReferencia,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const buscaValida = !termo || textoBusca.includes(termo);

      const statusValido =
        filtroStatus === "todos" ||
        (filtroStatus === "ativos" && !usuario.bloqueado) ||
        (filtroStatus === "congelados" && usuario.bloqueado) ||
        (filtroStatus === "comMulta" && Number(usuario.multaTotal || 0) > 0) ||
        (filtroStatus === "emailConfirmado" && usuario.emailConfirmado) ||
        (filtroStatus === "emailPendente" && !usuario.emailConfirmado);

      return buscaValida && statusValido;
    });
  }, [usuarios, busca, filtroStatus]);

  const totalUsuarios = usuarios.length;
  const totalAtivos = usuarios.filter((usuario) => !usuario.bloqueado).length;
  const totalCongelados = usuarios.filter((usuario) => usuario.bloqueado).length;
  const totalComMulta = usuarios.filter(
    (usuario) => Number(usuario.multaTotal || 0) > 0
  ).length;

  const totalMultas = usuariosFiltrados.reduce((total, usuario) => {
    return total + Number(usuario.multaTotal || 0);
  }, 0);

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <p className="page-subtitle">Carregando usuários...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page admin-animated-page">
      <div className="container">
        <h1 className="page-title">Usuários Cadastrados</h1>

        <p className="page-subtitle">
          Visualize clientes, endereço completo, pendências, dados de contato e
          controle de congelamento.
        </p>

        {feedback.text && (
          <p className={`feedback-banner ${feedback.type}`}>{feedback.text}</p>
        )}

        <section className="users-filter-panel">
          <div className="users-filter-top">
            <div>
              <h2>Filtros de usuários</h2>
              <p>
                Busque clientes por dados pessoais, endereço, CEP ou status
                operacional.
              </p>
            </div>

            <button className="btn btn-outline" onClick={limparFiltros}>
              Limpar filtros
            </button>
          </div>

          <div className="users-filter-grid">
            <div className="form-group">
              <label>Buscar usuário</label>
              <input
                type="text"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Nome, email, telefone, CEP, rua, bairro ou cidade"
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={filtroStatus}
                onChange={(event) => setFiltroStatus(event.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="ativos">Ativos</option>
                <option value="congelados">Congelados</option>
                <option value="comMulta">Com multa</option>
                <option value="emailConfirmado">Email confirmado</option>
                <option value="emailPendente">Email pendente</option>
              </select>
            </div>
          </div>
        </section>

        <section className="users-summary-grid">
          <div>
            <span>Total de usuários</span>
            <strong>{totalUsuarios}</strong>
          </div>

          <div>
            <span>Ativos</span>
            <strong>{totalAtivos}</strong>
          </div>

          <div>
            <span>Congelados</span>
            <strong>{totalCongelados}</strong>
          </div>

          <div>
            <span>Com multa</span>
            <strong>{totalComMulta}</strong>
          </div>

          <div>
            <span>Exibidos</span>
            <strong>{usuariosFiltrados.length}</strong>
          </div>

          <div>
            <span>Multas exibidas</span>
            <strong>{formatarMoeda(totalMultas)}</strong>
          </div>
        </section>

        {usuariosFiltrados.length === 0 ? (
          <div className="empty-state">
            <h2>Nenhum usuário encontrado</h2>
            <p>
              Ajuste os filtros ou aguarde clientes criarem conta na plataforma.
            </p>
          </div>
        ) : (
          <div className="admin-users-grid">
            {usuariosFiltrados.map((usuario) => (
              <article
                className={
                  usuario.bloqueado
                    ? "admin-user-card user-blocked enhanced-user-card"
                    : "admin-user-card enhanced-user-card"
                }
                key={usuario.id}
              >
                <div className="admin-user-top">
                  <div className="admin-user-avatar">
                    {usuario.nome?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <div>
                    <h2>{usuario.nome}</h2>
                    <p>{usuario.email}</p>
                  </div>

                  <span
                    className={
                      usuario.bloqueado
                        ? "user-status blocked"
                        : "user-status active"
                    }
                  >
                    {usuario.bloqueado ? "Congelado" : "Ativo"}
                  </span>
                </div>

                <div className="admin-user-info">
                  <div>
                    <span>Telefone</span>
                    <strong>{usuario.telefone || "Não informado"}</strong>
                  </div>

                  <div>
                    <span>Cadastro</span>
                    <strong>{formatarData(usuario.createdAt)}</strong>
                  </div>

                  <div>
                    <span>Pedidos</span>
                    <strong>{usuario.totalPedidos}</strong>
                  </div>

                  <div>
                    <span>Multa total</span>
                    <strong>{formatarMoeda(usuario.multaTotal)}</strong>
                  </div>

                  <div>
                    <span>Email confirmado</span>
                    <strong>{usuario.emailConfirmado ? "Sim" : "Não"}</strong>
                  </div>

                  <div>
                    <span>CEP</span>
                    <strong>{usuario.cep || "Não informado"}</strong>
                  </div>
                </div>

                <div className="user-address-box">
                  <div className="user-address-header">
                    <span>Endereço completo</span>
                    <strong>{montarEnderecoResumo(usuario)}</strong>
                  </div>

                  <div className="user-address-grid">
                    <div>
                      <span>Rua / Avenida</span>
                      <strong>{usuario.rua || "Não informado"}</strong>
                    </div>

                    <div>
                      <span>Número</span>
                      <strong>{usuario.numero || "Não informado"}</strong>
                    </div>

                    <div>
                      <span>Bairro</span>
                      <strong>{usuario.bairro || "Não informado"}</strong>
                    </div>

                    <div>
                      <span>Cidade</span>
                      <strong>{usuario.cidade || "Não informado"}</strong>
                    </div>

                    <div>
                      <span>Estado</span>
                      <strong>{usuario.estado || "Não informado"}</strong>
                    </div>

                    <div>
                      <span>Complemento</span>
                      <strong>{usuario.complemento || "Não informado"}</strong>
                    </div>

                    <div className="address-reference">
                      <span>Ponto de referência</span>
                      <strong>
                        {usuario.pontoReferencia || "Não informado"}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="admin-user-actions">
                  <button
                    className={
                      usuario.bloqueado ? "btn btn-primary" : "btn btn-dark"
                    }
                    onClick={() => abrirConfirmacao(usuario, "bloquear")}
                  >
                    {usuario.bloqueado ? "Descongelar" : "Congelar"}
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => abrirConfirmacao(usuario, "remover")}
                  >
                    Remover
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {usuarioAcao && (
        <div className="popup-overlay final-modal-overlay">
          <div className="popup-card final-modal-card">
            <h2>
              {tipoAcao === "remover"
                ? "Remover usuário"
                : usuarioAcao.bloqueado
                ? "Descongelar usuário"
                : "Congelar usuário"}
            </h2>

            <p>
              {tipoAcao === "remover"
                ? "Tem certeza que deseja remover este usuário? Usuários com pedidos vinculados não poderão ser removidos."
                : usuarioAcao.bloqueado
                ? "Este usuário voltará a poder comprar, alugar e reservar livros."
                : "Este usuário ficará impedido de comprar, alugar e reservar novos livros até ser descongelado."}
            </p>

            <div className="popup-details">
              <span>Nome: {usuarioAcao.nome}</span>
              <span>Email: {usuarioAcao.email}</span>
              <span>Telefone: {usuarioAcao.telefone || "Não informado"}</span>
              <span>Endereço: {montarEnderecoResumo(usuarioAcao)}</span>
              <span>Multa total: {formatarMoeda(usuarioAcao.multaTotal)}</span>
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
                  tipoAcao === "remover" ? "btn btn-danger" : "btn btn-primary"
                }
                onClick={confirmarAcao}
                disabled={processando}
              >
                {processando ? "Processando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminUsers;