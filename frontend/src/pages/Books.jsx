import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function montarUrlImagem(imagemUrl) {
  if (!imagemUrl) return "";

  if (imagemUrl.startsWith("http://") || imagemUrl.startsWith("https://")) {
    return imagemUrl;
  }

  return `${API_URL}${imagemUrl}`;
}

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

function calcularMultaReserva(dataRetirada) {
  if (!dataRetirada) {
    return {
      diasAtraso: 0,
      multa: 0,
    };
  }

  const prazoGratis = new Date();
  prazoGratis.setDate(prazoGratis.getDate() + 7);
  prazoGratis.setHours(0, 0, 0, 0);

  const retirada = new Date(dataRetirada);
  retirada.setHours(0, 0, 0, 0);

  const diferencaMs = retirada - prazoGratis;

  const diasAtraso = Math.max(
    0,
    Math.ceil(diferencaMs / (1000 * 60 * 60 * 24))
  );

  const multa = diasAtraso * 2;

  return {
    diasAtraso,
    multa,
  };
}

function calcularAluguel(livro, dias) {
  if (!livro || !dias) {
    return {
      diasExtras: 0,
      valorFinal: 0,
      devolucaoPrevista: null,
    };
  }

  const diasEscolhidos = Number(dias);
  const diasExtras = Math.max(0, diasEscolhidos - Number(livro.diasInclusos));

  const valorFinal =
    Number(livro.precoAluguel) + diasExtras * Number(livro.precoDiaExtra);

  const devolucao = new Date();
  devolucao.setDate(devolucao.getDate() + diasEscolhidos);

  return {
    diasExtras,
    valorFinal,
    devolucaoPrevista: devolucao,
  };
}

function BookCover({ livro, variant = "catalog" }) {
  const imagem = montarUrlImagem(livro.imagemUrl);

  return (
    <div className={`catalog-book-cover-v2 real-book-cover ${variant}`}>
      {imagem ? (
        <img
          src={imagem}
          alt={`Capa do livro ${livro.titulo}`}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = "none";
            event.currentTarget.nextElementSibling?.classList.remove("hidden");
          }}
        />
      ) : null}

      <div className={imagem ? "book-cover-fallback hidden" : "book-cover-fallback"}>
        <span>{livro.titulo?.slice(0, 2)?.toUpperCase()}</span>
        <small>{livro.categoria}</small>
      </div>
    </div>
  );
}

function Books() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [tipoFiltro, setTipoFiltro] = useState("todos");

  const [livroReserva, setLivroReserva] = useState(null);
  const [dataRetirada, setDataRetirada] = useState("");
  const [loadingReserva, setLoadingReserva] = useState(false);

  const [livroAluguel, setLivroAluguel] = useState(null);
  const [diasAluguel, setDiasAluguel] = useState("");
  const [loadingAluguel, setLoadingAluguel] = useState(false);

  const [livroCompra, setLivroCompra] = useState(null);
  const [loadingCompra, setLoadingCompra] = useState(false);

  async function carregarLivros() {
    try {
      setLoading(true);
      setFeedback({ type: "", text: "" });

      const response = await api.get("/livros");
      setLivros(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setFeedback({
        type: "error",
        text: "Erro ao carregar catálogo de livros.",
      });
    } finally {
      setLoading(false);
    }
  }

  function limparFiltros() {
    setBusca("");
    setCategoria("todas");
    setTipoFiltro("todos");
  }

  function exigirLogin(mensagem) {
    if (!isAuthenticated) {
      setFeedback({ type: "error", text: mensagem });
      return false;
    }

    return true;
  }

  function abrirCompra(livro) {
    if (!exigirLogin("Faça login para comprar um livro.")) return;

    setFeedback({ type: "", text: "" });
    setLivroCompra(livro);
  }

  async function confirmarCompra() {
    if (!livroCompra) return;

    try {
      setLoadingCompra(true);
      setFeedback({ type: "", text: "" });

      const response = await api.post("/comprar", {
        livroId: livroCompra.id,
      });

      setLivroCompra(null);

      navigate(`/pedido-confirmado/${response.data.id}`);
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.erro || "Erro ao comprar livro.",
      });
    } finally {
      setLoadingCompra(false);
    }
  }

  function abrirAluguel(livro) {
    if (!exigirLogin("Faça login para alugar um livro.")) return;

    setFeedback({ type: "", text: "" });
    setLivroAluguel(livro);
    setDiasAluguel(String(livro.diasInclusos || 1));
  }

  async function confirmarAluguel() {
    if (!livroAluguel) return;

    const dias = Number(diasAluguel);

    if (!dias || dias <= 0) {
      setFeedback({
        type: "error",
        text: "Informe uma quantidade válida de dias.",
      });
      return;
    }

    try {
      setLoadingAluguel(true);
      setFeedback({ type: "", text: "" });

      const response = await api.post("/alugar", {
        livroId: livroAluguel.id,
        dias,
      });

      setLivroAluguel(null);
      setDiasAluguel("");

      navigate(`/pedido-confirmado/${response.data.id}`);
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.erro || "Erro ao alugar livro.",
      });
    } finally {
      setLoadingAluguel(false);
    }
  }

  function abrirReserva(livro) {
    if (!exigirLogin("Faça login para reservar um livro.")) return;

    setFeedback({ type: "", text: "" });
    setLivroReserva(livro);
    setDataRetirada("");
  }

  async function confirmarReserva() {
    if (!dataRetirada) {
      setFeedback({
        type: "error",
        text: "Selecione uma data de retirada.",
      });
      return;
    }

    try {
      setLoadingReserva(true);
      setFeedback({ type: "", text: "" });

      const response = await api.post("/reservar", {
        livroId: livroReserva.id,
        dataRetirada,
      });

      setLivroReserva(null);
      setDataRetirada("");

      navigate(`/pedido-confirmado/${response.data.id}`);
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.erro || "Erro ao reservar livro.",
      });
    } finally {
      setLoadingReserva(false);
    }
  }

  useEffect(() => {
    carregarLivros();
  }, []);

  const livrosDisponiveis = useMemo(
    () => livros.filter((livro) => livro.disponivel),
    [livros]
  );

  const categorias = useMemo(() => {
    const lista = livrosDisponiveis
      .map((livro) => livro.categoria)
      .filter(Boolean);

    return ["todas", ...new Set(lista)];
  }, [livrosDisponiveis]);

  const livrosVisiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return livrosDisponiveis.filter((livro) => {
      const texto = [
        livro.titulo,
        livro.autor,
        livro.categoria,
        livro.sinopse,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const buscaValida = !termo || texto.includes(termo);
      const categoriaValida =
        categoria === "todas" || livro.categoria === categoria;

      const tipoValido =
        tipoFiltro === "todos" ||
        (tipoFiltro === "compra" && Number(livro.precoCompra) > 0) ||
        (tipoFiltro === "aluguel" && Number(livro.precoAluguel) > 0) ||
        (tipoFiltro === "destaque" && livro.destaque);

      return buscaValida && categoriaValida && tipoValido;
    });
  }, [livrosDisponiveis, busca, categoria, tipoFiltro]);

  const reservaCalculada = calcularMultaReserva(dataRetirada);
  const aluguelCalculado = calcularAluguel(livroAluguel, diasAluguel);

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <p className="page-subtitle">Carregando catálogo...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page catalog-page-v2">
      <div className="container">
        <section className="catalog-header-v2">
          <div>
            <span className="section-kicker">Catálogo operacional</span>
            <h1>Livros disponíveis</h1>
            <p>
              Consulte o acervo ativo, compare valores e escolha entre compra,
              aluguel ou reserva.
            </p>
          </div>

          <div className="catalog-counter-card">
            <span>Livros encontrados</span>
            <strong>{livrosVisiveis.length}</strong>
          </div>
        </section>

        {feedback.text && (
          <p className={`feedback-banner ${feedback.type}`}>{feedback.text}</p>
        )}

        <section className="catalog-filter-panel-v2">
          <div className="form-group">
            <label>Buscar no acervo</label>
            <input
              type="text"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Título, autor, categoria ou sinopse"
            />
          </div>

          <div className="form-group">
            <label>Categoria</label>
            <select
              value={categoria}
              onChange={(event) => setCategoria(event.target.value)}
            >
              {categorias.map((item) => (
                <option key={item} value={item}>
                  {item === "todas" ? "Todas as categorias" : item}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tipo</label>
            <select
              value={tipoFiltro}
              onChange={(event) => setTipoFiltro(event.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="compra">Compra</option>
              <option value="aluguel">Aluguel</option>
              <option value="destaque">Destaques</option>
            </select>
          </div>

          <button className="btn btn-outline" onClick={limparFiltros}>
            Limpar
          </button>
        </section>

        {livrosVisiveis.length === 0 ? (
          <div className="empty-state">
            <h2>Nenhum livro encontrado</h2>
            <p>
              Ajuste os filtros ou aguarde novos livros serem liberados no
              catálogo.
            </p>
          </div>
        ) : (
          <div className="catalog-grid-v2">
            {livrosVisiveis.map((livro) => (
              <article className="catalog-book-card-v2" key={livro.id}>
                <BookCover livro={livro} variant="catalog" />

                <div className="catalog-book-body-v2">
                  <div className="catalog-book-heading">
                    <div>
                      <h2>{livro.titulo}</h2>
                      <p>{livro.autor}</p>
                    </div>

                    {livro.destaque && (
                      <span className="book-badge">Destaque</span>
                    )}
                  </div>

                  <p className="book-synopsis">{livro.sinopse}</p>

                  <div className="catalog-price-row">
                    <div>
                      <span>Compra</span>
                      <strong>{formatarMoeda(livro.precoCompra)}</strong>
                    </div>

                    <div>
                      <span>Aluguel</span>
                      <strong>{formatarMoeda(livro.precoAluguel)}</strong>
                    </div>
                  </div>

                  <div className="catalog-meta-row">
                    <span>{livro.diasInclusos} dias inclusos</span>
                    <span>Extra: {formatarMoeda(livro.precoDiaExtra)}/dia</span>
                    <span>Estoque: {livro.estoque}</span>
                  </div>

                  <div className="catalog-actions-v2">
                    <button
                      className="btn btn-primary"
                      onClick={() => abrirCompra(livro)}
                      disabled={livro.estoque <= 0}
                    >
                      Comprar
                    </button>

                    <button
                      className="btn btn-dark"
                      onClick={() => abrirAluguel(livro)}
                      disabled={livro.estoque <= 0}
                    >
                      Alugar
                    </button>

                    <button
                      className="btn btn-outline"
                      onClick={() => abrirReserva(livro)}
                      disabled={livro.estoque <= 0 || livro.isDoado}
                    >
                      Reservar
                    </button>
                  </div>

                  {livro.estoque <= 0 && (
                    <p className="stock-warning">Livro sem estoque.</p>
                  )}

                  {livro.isDoado && (
                    <p className="stock-warning">
                      Livro doado: reserva bloqueada.
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {livroCompra && (
        <div className="popup-overlay final-modal-overlay">
          <div className="popup-card final-modal-card">
            <h2>Confirmar compra</h2>

            <p>
              Você está comprando o livro{" "}
              <strong>{livroCompra.titulo}</strong>.
            </p>

            <div className="popup-book-resume">
              <BookCover livro={livroCompra} variant="modal" />

              <div className="popup-details">
                <span>Autor: {livroCompra.autor}</span>
                <span>Categoria: {livroCompra.categoria}</span>
                <span>Valor: {formatarMoeda(livroCompra.precoCompra)}</span>
                <span>Retirada: até 7 dias após a compra</span>
              </div>
            </div>

            <div className="popup-actions">
              <button
                className="btn btn-outline"
                onClick={() => setLivroCompra(null)}
                disabled={loadingCompra}
              >
                Cancelar
              </button>

              <button
                className="btn btn-primary"
                onClick={confirmarCompra}
                disabled={loadingCompra}
              >
                {loadingCompra ? "Comprando..." : "Confirmar compra"}
              </button>
            </div>
          </div>
        </div>
      )}

      {livroAluguel && (
        <div className="popup-overlay final-modal-overlay">
          <div className="popup-card popup-card-large final-modal-card">
            <h2>Confirmar aluguel</h2>

            <p>
              Escolha por quantos dias deseja alugar{" "}
              <strong>{livroAluguel.titulo}</strong>.
            </p>

            <div className="popup-book-resume">
              <BookCover livro={livroAluguel} variant="modal" />

              <div className="reservation-info">
                <div>
                  <span>Livro</span>
                  <strong>{livroAluguel.titulo}</strong>
                </div>

                <div>
                  <span>Estoque atual</span>
                  <strong>{livroAluguel.estoque}</strong>
                </div>

                <div>
                  <span>Valor base</span>
                  <strong>{formatarMoeda(livroAluguel.precoAluguel)}</strong>
                </div>

                <div>
                  <span>Dias inclusos</span>
                  <strong>{livroAluguel.diasInclusos} dias</strong>
                </div>

                <div>
                  <span>Dia extra</span>
                  <strong>{formatarMoeda(livroAluguel.precoDiaExtra)}</strong>
                </div>

                <div>
                  <span>Dias extras</span>
                  <strong>{aluguelCalculado.diasExtras}</strong>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Quantidade de dias</label>
              <input
                type="number"
                min="1"
                value={diasAluguel}
                onChange={(event) => setDiasAluguel(event.target.value)}
              />
            </div>

            <div className="rent-preview">
              <div>
                <span>Valor final</span>
                <strong>{formatarMoeda(aluguelCalculado.valorFinal)}</strong>
              </div>

              <div>
                <span>Devolução prevista</span>
                <strong>
                  {formatarData(aluguelCalculado.devolucaoPrevista)}
                </strong>
              </div>
            </div>

            <div className="popup-actions">
              <button
                className="btn btn-outline"
                onClick={() => setLivroAluguel(null)}
                disabled={loadingAluguel}
              >
                Cancelar
              </button>

              <button
                className="btn btn-primary"
                onClick={confirmarAluguel}
                disabled={loadingAluguel}
              >
                {loadingAluguel ? "Alugando..." : "Confirmar aluguel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {livroReserva && (
        <div className="popup-overlay final-modal-overlay">
          <div className="popup-card popup-card-large final-modal-card">
            <h2>Confirmar reserva</h2>

            <p>
              Selecione a data em que deseja retirar o livro{" "}
              <strong>{livroReserva.titulo}</strong>.
            </p>

            <div className="popup-book-resume">
              <BookCover livro={livroReserva} variant="modal" />

              <div className="reservation-info">
                <div>
                  <span>Livro</span>
                  <strong>{livroReserva.titulo}</strong>
                </div>

                <div>
                  <span>Estoque atual</span>
                  <strong>{livroReserva.estoque}</strong>
                </div>

                <div>
                  <span>Prazo sem multa</span>
                  <strong>Até 7 dias</strong>
                </div>

                <div>
                  <span>Multa por dia após prazo</span>
                  <strong>R$ 2,00</strong>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Data de retirada</label>
              <input
                type="date"
                value={dataRetirada}
                onChange={(event) => setDataRetirada(event.target.value)}
              />
            </div>

            {dataRetirada && (
              <div className="reservation-calculation">
                <p>
                  Dias após prazo gratuito:{" "}
                  <strong>{reservaCalculada.diasAtraso}</strong>
                </p>

                <p>
                  Multa calculada:{" "}
                  <strong>{formatarMoeda(reservaCalculada.multa)}</strong>
                </p>
              </div>
            )}

            <div className="popup-actions">
              <button
                className="btn btn-outline"
                onClick={() => setLivroReserva(null)}
                disabled={loadingReserva}
              >
                Cancelar
              </button>

              <button
                className="btn btn-primary"
                onClick={confirmarReserva}
                disabled={loadingReserva}
              >
                {loadingReserva ? "Reservando..." : "Confirmar reserva"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Books;