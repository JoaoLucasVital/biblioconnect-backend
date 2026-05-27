import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api.js";

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

function AdminBookCover({ livro }) {
  const imagem = montarUrlImagem(livro.imagemUrl);

  return (
    <div className="admin-book-cover-thumb">
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

      <div
        className={
          imagem
            ? "admin-book-cover-fallback hidden"
            : "admin-book-cover-fallback"
        }
      >
        {livro.titulo?.slice(0, 2)?.toUpperCase()}
      </div>
    </div>
  );
}

function AdminBooks() {
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [livroParaExcluir, setLivroParaExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  async function carregarLivros() {
    try {
      setLoading(true);
      setErro("");

      const response = await api.get("/livros");

      setLivros(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setErro("Erro ao carregar livros.");
    } finally {
      setLoading(false);
    }
  }

  async function alternarDisponibilidade(livro) {
    try {
      setMensagem("");
      setErro("");

      await api.patch(`/livros/${livro.id}/disponibilidade`, {
        disponivel: !livro.disponivel,
      });

      setMensagem(
        !livro.disponivel
          ? "Livro ativado com sucesso."
          : "Livro pausado com sucesso."
      );

      carregarLivros();
    } catch (error) {
      setErro(
        error.response?.data?.erro ||
          "Erro ao alterar disponibilidade do livro."
      );
    }
  }

  async function alternarDestaque(livro) {
    try {
      setMensagem("");
      setErro("");

      await api.patch(`/livros/${livro.id}/destaque`, {
        destaque: !livro.destaque,
      });

      setMensagem(
        !livro.destaque
          ? "Livro colocado em destaque."
          : "Livro removido dos destaques."
      );

      carregarLivros();
    } catch (error) {
      setErro(error.response?.data?.erro || "Erro ao alterar destaque.");
    }
  }

  async function confirmarExclusao() {
    if (!livroParaExcluir) return;

    try {
      setExcluindo(true);
      setMensagem("");
      setErro("");

      await api.delete(`/livros/${livroParaExcluir.id}`);

      setMensagem("Livro excluído com sucesso.");
      setLivroParaExcluir(null);
      carregarLivros();
    } catch (error) {
      setErro(error.response?.data?.erro || "Erro ao excluir livro.");
    } finally {
      setExcluindo(false);
    }
  }

  useEffect(() => {
    carregarLivros();
  }, []);

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <p className="page-subtitle">Carregando livros...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container">
        <div className="form-page-header">
          <div>
            <h1 className="page-title">Gerenciar Livros</h1>
            <p className="page-subtitle">
              Edite, pause, destaque ou exclua livros do catálogo.
            </p>
          </div>

          <Link to="/adicionar-livro" className="btn btn-primary">
            Novo Livro
          </Link>
        </div>

        {erro && <p className="form-error">{erro}</p>}
        {mensagem && <p className="form-success">{mensagem}</p>}

        {livros.length === 0 ? (
          <div className="empty-state">
            <h2>Nenhum livro cadastrado</h2>
            <p>Cadastre o primeiro livro para ele aparecer no catálogo.</p>
          </div>
        ) : (
          <div className="admin-books-list">
            {livros.map((livro) => (
              <div className="admin-book-card admin-book-card-with-cover" key={livro.id}>
                <div className="admin-book-main">
                  <AdminBookCover livro={livro} />

                  <div>
                    <div className="book-title-row">
                      <h2>{livro.titulo}</h2>

                      {livro.destaque && (
                        <span className="book-badge">Destaque</span>
                      )}

                      {!livro.disponivel && (
                        <span className="book-badge paused">Pausado</span>
                      )}
                    </div>

                    <p>{livro.autor}</p>

                    <small>
                      {livro.categoria} • Estoque: {livro.estoque} • Compra:{" "}
                      {formatarMoeda(livro.precoCompra)} • Aluguel:{" "}
                      {formatarMoeda(livro.precoAluguel)}
                    </small>

                    {livro.imagemUrl ? (
                      <span className="admin-image-status ok">
                        Imagem cadastrada
                      </span>
                    ) : (
                      <span className="admin-image-status warning">
                        Sem imagem de capa
                      </span>
                    )}
                  </div>
                </div>

                <div className="admin-book-actions">
                  <Link
                    to={`/editar-livro/${livro.id}`}
                    className="btn btn-outline"
                  >
                    Editar
                  </Link>

                  <button
                    className="btn btn-dark"
                    onClick={() => alternarDisponibilidade(livro)}
                  >
                    {livro.disponivel ? "Pausar" : "Ativar"}
                  </button>

                  <button
                    className="btn btn-outline"
                    onClick={() => alternarDestaque(livro)}
                  >
                    {livro.destaque ? "Remover Destaque" : "Destacar"}
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => setLivroParaExcluir(livro)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {livroParaExcluir && (
        <div className="popup-overlay final-modal-overlay">
          <div className="popup-card final-modal-card">
            <h2>Excluir livro</h2>

            <p>
              Tem certeza que deseja excluir{" "}
              <strong>{livroParaExcluir.titulo}</strong>?
            </p>

            <div className="popup-book-resume">
              <AdminBookCover livro={livroParaExcluir} />

              <div className="popup-details">
                <span>Autor: {livroParaExcluir.autor}</span>
                <span>Categoria: {livroParaExcluir.categoria}</span>
                <span>Estoque: {livroParaExcluir.estoque}</span>
                <span>
                  Compra: {formatarMoeda(livroParaExcluir.precoCompra)}
                </span>
              </div>
            </div>

            <p className="danger-note">
              Essa ação só será permitida se o livro não tiver pedidos
              vinculados. Caso tenha pedidos, pause o livro em vez de excluir.
            </p>

            <div className="popup-actions">
              <button
                className="btn btn-outline"
                onClick={() => setLivroParaExcluir(null)}
                disabled={excluindo}
              >
                Cancelar
              </button>

              <button
                className="btn btn-danger"
                onClick={confirmarExclusao}
                disabled={excluindo}
              >
                {excluindo ? "Excluindo..." : "Confirmar exclusão"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminBooks;