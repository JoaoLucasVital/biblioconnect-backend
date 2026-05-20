import { useEffect, useState } from "react";
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

function AdminDelays() {
  const [atrasos, setAtrasos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const [processandoId, setProcessandoId] = useState(null);
  const [acaoConfirmacao, setAcaoConfirmacao] = useState(null);

  async function carregarAtrasos() {
    try {
      setLoading(true);
      setFeedback({ type: "", text: "" });

      const response = await api.get("/admin/atrasos");
      setAtrasos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.erro || "Erro ao carregar atrasos.",
      });
    } finally {
      setLoading(false);
    }
  }

  function abrirConfirmacao(atraso, tipoAcao) {
    setAcaoConfirmacao({ atraso, tipoAcao });
  }

  function fecharConfirmacao() {
    setAcaoConfirmacao(null);
  }

  async function confirmarAcao() {
    if (!acaoConfirmacao) return;

    const { atraso, tipoAcao } = acaoConfirmacao;

    try {
      setProcessandoId(atraso.id);
      setFeedback({ type: "", text: "" });

      if (tipoAcao === "congelar") {
        await api.patch(`/admin/usuarios/${atraso.usuario.id}/bloqueio`, {
          bloqueado: true,
        });

        setFeedback({
          type: "danger",
          text: `Usuário ${atraso.usuario.nome} congelado com sucesso.`,
        });
      }

      if (tipoAcao === "resolver") {
        const novoStatus = atraso.tipo === "aluguel" ? "devolvido" : "concluido";

        await api.patch(`/admin/pedidos/${atraso.id}/status`, {
          status: novoStatus,
        });

        setFeedback({
          type: "success",
          text: "Pendência resolvida com sucesso.",
        });
      }

      fecharConfirmacao();
      carregarAtrasos();
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.erro || "Erro ao executar ação.",
      });
    } finally {
      setProcessandoId(null);
    }
  }

  useEffect(() => {
    carregarAtrasos();
  }, []);

  const totalMultas = atrasos.reduce((total, item) => {
    return total + Number(item.multa || 0);
  }, 0);

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <p className="page-subtitle">Carregando atrasos...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page admin-animated-page">
      <div className="container">
        <div className="delays-page-header">
          <div>
            <h1 className="page-title">Atrasos e Multas</h1>
            <p className="page-subtitle">
              Acompanhe reservas e aluguéis atrasados, calcule multas e resolva pendências.
            </p>
          </div>
        </div>

        {feedback.text && (
          <p className={`feedback-banner ${feedback.type}`}>{feedback.text}</p>
        )}

        <section className="delays-summary">
          <div>
            <span>Total de atrasos</span>
            <strong>{atrasos.length}</strong>
          </div>

          <div>
            <span>Multas pendentes</span>
            <strong>{formatarMoeda(totalMultas)}</strong>
          </div>
        </section>

        {atrasos.length === 0 ? (
          <div className="empty-state">
            <h2>Nenhum atraso no momento</h2>
            <p>
              Quando houver reservas ou aluguéis atrasados, eles aparecerão nesta área.
            </p>
          </div>
        ) : (
          <div className="delays-list">
            {atrasos.map((atraso) => (
              <article className="delay-card" key={atraso.id}>
                <div className="delay-content">
                  <div className="delay-header">
                    <div>
                      <h2>{atraso.livro.titulo}</h2>

                      <p>
                        {traduzirTipo(atraso.tipo)} de{" "}
                        <strong>{atraso.usuario.nome}</strong>
                      </p>
                    </div>

                    <span className="delay-fine">{formatarMoeda(atraso.multa)}</span>
                  </div>

                  <div className="delay-grid">
                    <div>
                      <span>Usuário</span>
                      <strong>{atraso.usuario.nome}</strong>
                    </div>

                    <div>
                      <span>Email</span>
                      <strong>{atraso.usuario.email}</strong>
                    </div>

                    <div>
                      <span>Telefone</span>
                      <strong>{atraso.usuario.telefone || "Não informado"}</strong>
                    </div>

                    <div>
                      <span>Endereço</span>
                      <strong>{atraso.usuario.endereco || "Não informado"}</strong>
                    </div>

                    <div>
                      <span>Tipo</span>
                      <strong>{traduzirTipo(atraso.tipo)}</strong>
                    </div>

                    <div>
                      <span>Data limite</span>
                      <strong>{formatarData(atraso.dataReferencia)}</strong>
                    </div>

                    <div>
                      <span>Dias de atraso</span>
                      <strong>{atraso.diasAtraso} dias</strong>
                    </div>

                    <div>
                      <span>Multa</span>
                      <strong>{formatarMoeda(atraso.multa)}</strong>
                    </div>

                    <div>
                      <span>Status do usuário</span>
                      <strong>{atraso.usuario.bloqueado ? "Congelado" : "Ativo"}</strong>
                    </div>

                    <div>
                      <span>Preço por dia extra</span>
                      <strong>{formatarMoeda(atraso.livro.precoDiaExtra || 2)}</strong>
                    </div>
                  </div>

                  <div className="delay-actions">
                    {!atraso.usuario.bloqueado && (
                      <button
                        className="btn btn-danger"
                        onClick={() => abrirConfirmacao(atraso, "congelar")}
                        disabled={processandoId === atraso.id}
                      >
                        Congelar usuário
                      </button>
                    )}

                    <button
                      className="btn btn-primary"
                      onClick={() => abrirConfirmacao(atraso, "resolver")}
                      disabled={processandoId === atraso.id}
                    >
                      Resolver pendência
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {acaoConfirmacao && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h2>
              {acaoConfirmacao.tipoAcao === "congelar"
                ? "Congelar usuário"
                : "Resolver pendência"}
            </h2>

            {acaoConfirmacao.tipoAcao === "congelar" ? (
              <p>
                Tem certeza que deseja congelar{" "}
                <strong>{acaoConfirmacao.atraso.usuario.nome}</strong>? Ele não
                poderá fazer novas compras, reservas ou aluguéis.
              </p>
            ) : (
              <p>
                Confirmar que a pendência de{" "}
                <strong>{acaoConfirmacao.atraso.usuario.nome}</strong> foi resolvida?
              </p>
            )}

            <div className="popup-details">
              <span>Livro: {acaoConfirmacao.atraso.livro.titulo}</span>
              <span>Tipo: {traduzirTipo(acaoConfirmacao.atraso.tipo)}</span>
              <span>Dias de atraso: {acaoConfirmacao.atraso.diasAtraso}</span>
              <span>Multa: {formatarMoeda(acaoConfirmacao.atraso.multa)}</span>
            </div>

            <div className="popup-actions">
              <button
                className="btn btn-outline"
                onClick={fecharConfirmacao}
                disabled={processandoId === acaoConfirmacao.atraso.id}
              >
                Voltar
              </button>

              <button
                className={
                  acaoConfirmacao.tipoAcao === "congelar"
                    ? "btn btn-danger"
                    : "btn btn-primary"
                }
                onClick={confirmarAcao}
                disabled={processandoId === acaoConfirmacao.atraso.id}
              >
                {processandoId === acaoConfirmacao.atraso.id
                  ? "Processando..."
                  : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminDelays;