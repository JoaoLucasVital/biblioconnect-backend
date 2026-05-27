import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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

function HomeBookCover({ livro }) {
  const imagem = montarUrlImagem(livro?.imagemUrl);

  return (
    <div className="featured-book-cover home-real-book-cover">
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

      <div className={imagem ? "home-cover-fallback hidden" : "home-cover-fallback"}>
        <span>{livro?.titulo?.slice(0, 2)?.toUpperCase()}</span>
        <small>{livro?.categoria}</small>
      </div>
    </div>
  );
}

function RankingCover({ livro }) {
  const imagem = montarUrlImagem(livro?.imagemUrl);

  return (
    <div className="ranking-book-cover-mini">
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

      <div className={imagem ? "ranking-cover-fallback hidden" : "ranking-cover-fallback"}>
        {livro?.titulo?.slice(0, 2)?.toUpperCase()}
      </div>
    </div>
  );
}

function Home() {
  const { isAuthenticated, isAdmin, usuario } = useAuth();

  const [livros, setLivros] = useState([]);
  const [insights, setInsights] = useState({
    livrosMaisVendidos: [],
    generosMaisVendidos: [],
    livroMaisVendido: null,
    generoMaisVendido: null,
  });

  const [currentBanner, setCurrentBanner] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const [loading, setLoading] = useState(true);

  async function carregarHome() {
    try {
      setLoading(true);

      const [livrosResponse, insightsResponse] = await Promise.all([
        api.get("/livros"),
        api.get("/public/home-insights").catch(() => ({
          data: {
            livrosMaisVendidos: [],
            generosMaisVendidos: [],
            livroMaisVendido: null,
            generoMaisVendido: null,
          },
        })),
      ]);

      setLivros(Array.isArray(livrosResponse.data) ? livrosResponse.data : []);
      setInsights(insightsResponse.data);
    } catch (error) {
      console.error("Erro ao carregar Home:", error);
    } finally {
      setLoading(false);
    }
  }

  function changeBanner(index) {
    if (index === currentBanner) return;

    setIsChanging(true);

    setTimeout(() => {
      setCurrentBanner(index);
      setIsChanging(false);
    }, 520);
  }

  useEffect(() => {
    carregarHome();
  }, []);

  const livrosDisponiveis = useMemo(
    () => livros.filter((livro) => livro.disponivel),
    [livros]
  );

  const livrosDestaque = useMemo(() => {
    const destaques = livrosDisponiveis.filter((livro) => livro.destaque);
    return destaques.length > 0 ? destaques : livrosDisponiveis.slice(0, 4);
  }, [livrosDisponiveis]);

  const estatisticas = useMemo(() => {
    const total = livrosDisponiveis.length;
    const aluguel = livrosDisponiveis.filter(
      (livro) => Number(livro.precoAluguel) > 0
    ).length;
    const compra = livrosDisponiveis.filter(
      (livro) => Number(livro.precoCompra) > 0
    ).length;
    const destaques = livrosDisponiveis.filter((livro) => livro.destaque).length;

    return {
      total,
      aluguel,
      compra,
      destaques,
    };
  }, [livrosDisponiveis]);

  useEffect(() => {
    if (livrosDestaque.length <= 1) return;

    const interval = setInterval(() => {
      const next =
        currentBanner === livrosDestaque.length - 1 ? 0 : currentBanner + 1;

      changeBanner(next);
    }, 6000);

    return () => clearInterval(interval);
  }, [currentBanner, livrosDestaque.length]);

  useEffect(() => {
    if (currentBanner > livrosDestaque.length - 1) {
      setCurrentBanner(0);
    }
  }, [livrosDestaque.length, currentBanner]);

  const banner = livrosDestaque[currentBanner];

  return (
    <main className="home-page-v2">
      <section className="home-hero-v2 container">
        <div className="home-hero-copy">
          <span className="section-kicker">Biblioteca online integrada</span>

          <h1>Acervo, pedidos e gestão bibliotecária em um fluxo único.</h1>

          <p>
            O BiblioConnect centraliza catálogo, compras, reservas, aluguéis,
            controle de estoque, atrasos, multas e acompanhamento administrativo.
          </p>

          <div className="home-hero-actions">
            <Link to="/livros" className="btn btn-primary">
              Ver catálogo
            </Link>

            {!isAuthenticated && (
              <Link to="/cadastro" className="btn btn-outline hero-outline">
                Criar cadastro
              </Link>
            )}

            {isAuthenticated && !isAdmin && (
              <Link to="/meus-pedidos" className="btn btn-outline hero-outline">
                Meus pedidos
              </Link>
            )}

            {isAdmin && (
              <Link to="/admin" className="btn btn-outline hero-outline">
                Painel administrativo
              </Link>
            )}
          </div>

          {isAuthenticated && (
            <div className="home-welcome-strip">
              <span>Conta ativa</span>
              <strong>{isAdmin ? "Administrador" : usuario?.nome}</strong>
            </div>
          )}
        </div>

        <div className="home-hero-panel">
          <div className="hero-panel-header">
            <span>Acervo disponível</span>
            <strong>{loading ? "..." : estatisticas.total}</strong>
          </div>

          <div className="hero-panel-grid">
            <div>
              <span>Disponíveis para compra</span>
              <strong>{estatisticas.compra}</strong>
            </div>

            <div>
              <span>Disponíveis para aluguel</span>
              <strong>{estatisticas.aluguel}</strong>
            </div>

            <div>
              <span>Livros em destaque</span>
              <strong>{estatisticas.destaques}</strong>
            </div>
          </div>

          <div className="hero-panel-note">
            <strong>Estoque automatizado</strong>
            <p>
              Cada compra, aluguel ou reserva atualiza o catálogo e o histórico
              do cliente.
            </p>
          </div>
        </div>
      </section>

      <section className="container featured-slider-v2">
        <div className="section-heading-row">
          <div>
            <span className="section-kicker">Destaques do acervo</span>
            <h2>Livros selecionados pela biblioteca</h2>
          </div>

          <Link to="/livros" className="text-link">
            Explorar todos
          </Link>
        </div>

        {loading ? (
          <div className="featured-empty-v2">
            <h3>Carregando acervo...</h3>
            <p>Buscando livros cadastrados no sistema.</p>
          </div>
        ) : banner ? (
          <>
            <article
              key={banner.id}
              className={
                isChanging
                  ? "featured-book-v2 slider-fading-out"
                  : "featured-book-v2 slider-fading-in"
              }
            >
              <div className="featured-book-copy">
                <span className="book-category-label">{banner.categoria}</span>

                <h2>{banner.titulo}</h2>

                <p>{banner.sinopse}</p>

                <div className="featured-book-meta">
                  <div>
                    <span>Autor</span>
                    <strong>{banner.autor}</strong>
                  </div>

                  <div>
                    <span>Compra</span>
                    <strong>{formatarMoeda(banner.precoCompra)}</strong>
                  </div>

                  <div>
                    <span>Aluguel</span>
                    <strong>{formatarMoeda(banner.precoAluguel)}</strong>
                  </div>
                </div>

                <Link to="/livros" className="btn btn-primary">
                  Ver no catálogo
                </Link>
              </div>

              <HomeBookCover livro={banner} />
            </article>

            <div className="slider-dots clean-dots">
              {livrosDestaque.map((item, index) => (
                <button
                  key={item.id}
                  className={currentBanner === index ? "dot active" : "dot"}
                  onClick={() => changeBanner(index)}
                  aria-label={`Ir para ${item.titulo}`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="featured-empty-v2">
            <h3>Nenhum livro disponível ainda</h3>
            <p>
              Assim que o administrador cadastrar livros ativos, eles aparecerão
              nesta área.
            </p>
          </div>
        )}
      </section>

      <section className="container sales-insights-home">
        <div className="section-heading-row">
          <div>
            <span className="section-kicker">Dados da plataforma</span>
            <h2>Mais vendidos e gêneros em alta</h2>
          </div>
        </div>

        <div className="sales-insights-grid">
          <article className="sales-panel">
            <div className="sales-panel-header">
              <div>
                <span className="section-kicker">Livros mais vendidos</span>
                <h3>Ranking de vendas</h3>
              </div>

              {insights.livroMaisVendido && (
                <span className="hot-label">
                  🔥 {insights.livroMaisVendido.titulo}
                </span>
              )}
            </div>

            {insights.livrosMaisVendidos?.length > 0 ? (
              <div className="ranking-list">
                {insights.livrosMaisVendidos.map((livro, index) => (
                  <div className="ranking-row ranking-row-with-cover" key={livro.id}>
                    <span className="ranking-position">{index + 1}</span>

                    <RankingCover livro={livro} />

                    <div>
                      <strong>{livro.titulo}</strong>
                      <small>
                        {livro.autor} • {livro.categoria}
                      </small>
                    </div>

                    <span className="ranking-count">
                      {livro.quantidadeVendas} venda
                      {livro.quantidadeVendas !== 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ranking-empty">
                <h4>Sem vendas registradas</h4>
                <p>
                  Quando clientes comprarem livros, o ranking será preenchido
                  automaticamente.
                </p>
              </div>
            )}
          </article>

          <article className="sales-panel">
            <div className="sales-panel-header">
              <div>
                <span className="section-kicker">Gêneros mais vendidos</span>
                <h3>Preferência dos leitores</h3>
              </div>

              {insights.generoMaisVendido && (
                <span className="hot-label">
                  🔥 {insights.generoMaisVendido.genero}
                </span>
              )}
            </div>

            {insights.generosMaisVendidos?.length > 0 ? (
              <div className="genre-sales-list">
                {insights.generosMaisVendidos.map((genero, index) => (
                  <div className="genre-sales-row" key={genero.genero}>
                    <div>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{genero.genero}</strong>
                    </div>

                    <div className="genre-sales-track">
                      <div
                        style={{
                          width: `${
                            (genero.quantidadeVendas /
                              insights.generosMaisVendidos[0]
                                .quantidadeVendas) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>

                    <small>
                      {genero.quantidadeVendas} venda
                      {genero.quantidadeVendas !== 1 ? "s" : ""}
                    </small>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ranking-empty">
                <h4>Sem gêneros ranqueados</h4>
                <p>
                  O ranking de gêneros será gerado automaticamente a partir das
                  compras realizadas.
                </p>
              </div>
            )}
          </article>
        </div>
      </section>

      <section className="container home-operations-v2">
        <div className="section-heading-row">
          <div>
            <span className="section-kicker">Fluxo do sistema</span>
            <h2>Como a biblioteca opera</h2>
          </div>
        </div>

        <div className="operation-grid-v2">
          <article>
            <span className="operation-number">01</span>
            <h3>Catálogo ativo</h3>
            <p>
              Os livros liberados pelo administrador aparecem automaticamente
              para clientes.
            </p>
          </article>

          <article>
            <span className="operation-number">02</span>
            <h3>Pedido registrado</h3>
            <p>
              Compra, reserva ou aluguel ficam vinculados ao cliente logado e ao
              estoque.
            </p>
          </article>

          <article>
            <span className="operation-number">03</span>
            <h3>Controle de prazos</h3>
            <p>
              O sistema calcula devolução, retirada e multas de atraso de forma
              automática.
            </p>
          </article>

          <article>
            <span className="operation-number">04</span>
            <h3>Gestão administrativa</h3>
            <p>
              O painel acompanha pedidos, usuários, gêneros, vendas, atrasos e
              bloqueios.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

export default Home;