import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";

function AddBooks() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    titulo: "",
    autor: "",
    redator: "",
    ano: "",
    categoria: "",
    sinopse: "",
    precoCompra: "",
    precoAluguel: "",
    diasInclusos: "",
    precoDiaExtra: "",
    estoque: "",
    isDoado: false,
    destaque: false,
    disponivel: true,
  });

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function cadastrarLivro() {
    setErro("");
    setLoading(true);

    try {
      const dadosLivro = {
        titulo: form.titulo,
        autor: form.autor,
        redator: form.redator,
        ano: Number(form.ano),
        categoria: form.categoria,
        sinopse: form.sinopse,
        precoCompra: Number(form.precoCompra),
        precoAluguel: Number(form.precoAluguel),
        diasInclusos: Number(form.diasInclusos),
        precoDiaExtra: Number(form.precoDiaExtra),
        estoque: Number(form.estoque),
        isDoado: form.isDoado,
        destaque: form.destaque,
        disponivel: form.disponivel,
      };

      await api.post("/livros", dadosLivro);

      setShowConfirm(false);
      navigate("/admin/livros");
    } catch (error) {
      setErro(error.response?.data?.erro || "Erro ao cadastrar livro.");
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    setShowConfirm(true);
  }

  return (
    <main className="page">
      <div className="container">
        <div className="form-page-header">
          <div>
            <h1 className="page-title">Adicionar Livro</h1>
            <p className="page-subtitle">
              Cadastre um novo livro no catálogo da biblioteca.
            </p>
          </div>

          <button className="btn btn-outline" onClick={() => navigate("/admin")}>
            Voltar ao painel
          </button>
        </div>

        <form className="book-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Informações principais</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>Título</label>
                <input
                  type="text"
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  placeholder="Ex: Dom Casmurro"
                  required
                />
              </div>

              <div className="form-group">
                <label>Autor</label>
                <input
                  type="text"
                  name="autor"
                  value={form.autor}
                  onChange={handleChange}
                  placeholder="Ex: Machado de Assis"
                  required
                />
              </div>

              <div className="form-group">
                <label>Redator/Editora</label>
                <input
                  type="text"
                  name="redator"
                  value={form.redator}
                  onChange={handleChange}
                  placeholder="Ex: Editora Nacional"
                  required
                />
              </div>

              <div className="form-group">
                <label>Ano</label>
                <input
                  type="number"
                  name="ano"
                  value={form.ano}
                  onChange={handleChange}
                  placeholder="Ex: 1899"
                  required
                />
              </div>

              <div className="form-group">
                <label>Categoria</label>
                <input
                  type="text"
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  placeholder="Ex: Romance"
                  required
                />
              </div>

              <div className="form-group">
                <label>Estoque</label>
                <input
                  type="number"
                  name="estoque"
                  value={form.estoque}
                  onChange={handleChange}
                  placeholder="Ex: 10"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Sinopse</label>
              <textarea
                name="sinopse"
                value={form.sinopse}
                onChange={handleChange}
                placeholder="Digite uma breve descrição do livro"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Valores e aluguel</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>Preço de compra</label>
                <input
                  type="number"
                  step="0.01"
                  name="precoCompra"
                  value={form.precoCompra}
                  onChange={handleChange}
                  placeholder="Ex: 39.90"
                  required
                />
              </div>

              <div className="form-group">
                <label>Preço de aluguel</label>
                <input
                  type="number"
                  step="0.01"
                  name="precoAluguel"
                  value={form.precoAluguel}
                  onChange={handleChange}
                  placeholder="Ex: 8.00"
                  required
                />
              </div>

              <div className="form-group">
                <label>Dias inclusos</label>
                <input
                  type="number"
                  name="diasInclusos"
                  value={form.diasInclusos}
                  onChange={handleChange}
                  placeholder="Ex: 7"
                  required
                />
              </div>

              <div className="form-group">
                <label>Preço por dia extra</label>
                <input
                  type="number"
                  step="0.01"
                  name="precoDiaExtra"
                  value={form.precoDiaExtra}
                  onChange={handleChange}
                  placeholder="Ex: 2.00"
                  required
                />
              </div>
            </div>

            <label className="checkbox-row">
              <input
                type="checkbox"
                name="isDoado"
                checked={form.isDoado}
                onChange={handleChange}
              />
              <span>Este livro é doado?</span>
            </label>

            <label className="checkbox-row">
              <input
                type="checkbox"
                name="destaque"
                checked={form.destaque}
                onChange={handleChange}
              />
              <span>Colocar este livro em destaque no slider da Home?</span>
            </label>

            <label className="checkbox-row">
              <input
                type="checkbox"
                name="disponivel"
                checked={form.disponivel}
                onChange={handleChange}
              />
              <span>Livro disponível para venda, aluguel e reserva?</span>
            </label>
          </div>

          {erro && <p className="form-error">{erro}</p>}

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate("/admin")}
            >
              Cancelar
            </button>

            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar Livro"}
            </button>
          </div>
        </form>
      </div>

      {showConfirm && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h2>Confirmar cadastro</h2>

            <p>
              Deseja cadastrar o livro <strong>{form.titulo}</strong> no
              catálogo?
            </p>

            <div className="popup-details">
              <span>Autor: {form.autor}</span>
              <span>Categoria: {form.categoria}</span>
              <span>Estoque: {form.estoque}</span>
              <span>
                Destaque: {form.destaque ? "Sim" : "Não"}
              </span>
            </div>

            <div className="popup-actions">
              <button
                className="btn btn-outline"
                onClick={() => setShowConfirm(false)}
                disabled={loading}
              >
                Revisar
              </button>

              <button
                className="btn btn-primary"
                onClick={cadastrarLivro}
                disabled={loading}
              >
                {loading ? "Salvando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default AddBooks;