import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api.js";

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function AdminBooks() {
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function carregarLivros() {
    try {
      setLoading(true);
      setErro("");

      const response = await api.get("/livros");

      setLivros(response.data);
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

  async function excluirLivro(livro) {
    const confirmar = window.confirm(
      `Tem certeza que deseja excluir o livro "${livro.titulo}"?`
    );

    if (!confirmar) return;

    try {
      setMensagem("");
      setErro("");

      await api.delete(`/livros/${livro.id}`);

      setMensagem("Livro excluído com sucesso.");
      carregarLivros();
    } catch (error) {
      setErro(error.response?.data?.erro || "Erro ao excluir livro.");
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
              <div className="admin-book-card" key={livro.id}>
                <div className="admin-book-main">
                  <div className="admin-book-icon">📚</div>

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
                    onClick={() => excluirLivro(livro)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default AdminBooks;