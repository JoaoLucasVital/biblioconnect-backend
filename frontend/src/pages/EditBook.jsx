import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function montarUrlImagem(imagemUrl) {
  if (!imagemUrl) return "";

  if (imagemUrl.startsWith("http://") || imagemUrl.startsWith("https://")) {
    return imagemUrl;
  }

  return `${API_URL}${imagemUrl}`;
}

function EditBook() {
  const { id } = useParams();
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

  const [imagemAtual, setImagemAtual] = useState("");
  const [novaImagem, setNovaImagem] = useState(null);
  const [previewImagem, setPreviewImagem] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function carregarLivro() {
    try {
      setLoading(true);
      setErro("");

      const response = await api.get(`/livros/${id}`);
      const livro = response.data;

      setForm({
        titulo: livro.titulo || "",
        autor: livro.autor || "",
        redator: livro.redator || "",
        ano: livro.ano || "",
        categoria: livro.categoria || "",
        sinopse: livro.sinopse || "",
        precoCompra: livro.precoCompra || "",
        precoAluguel: livro.precoAluguel || "",
        diasInclusos: livro.diasInclusos || "",
        precoDiaExtra: livro.precoDiaExtra || "",
        estoque: livro.estoque || "",
        isDoado: Boolean(livro.isDoado),
        destaque: Boolean(livro.destaque),
        disponivel: Boolean(livro.disponivel),
      });

      setImagemAtual(livro.imagemUrl || "");
    } catch (error) {
      setErro(error.response?.data?.erro || "Erro ao carregar livro.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleImagemChange(event) {
    const arquivo = event.target.files?.[0];

    if (!arquivo) {
      setNovaImagem(null);
      setPreviewImagem("");
      return;
    }

    const formatosPermitidos = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];

    if (!formatosPermitidos.includes(arquivo.type)) {
      setErro("Envie uma imagem nos formatos JPG, PNG ou WEBP.");
      setNovaImagem(null);
      setPreviewImagem("");
      event.target.value = "";
      return;
    }

    const tamanhoMaximo = 5 * 1024 * 1024;

    if (arquivo.size > tamanhoMaximo) {
      setErro("A imagem deve ter no máximo 5MB.");
      setNovaImagem(null);
      setPreviewImagem("");
      event.target.value = "";
      return;
    }

    setErro("");
    setNovaImagem(arquivo);
    setPreviewImagem(URL.createObjectURL(arquivo));
  }

  function montarFormData() {
    const dados = new FormData();

    dados.append("titulo", form.titulo);
    dados.append("autor", form.autor);
    dados.append("redator", form.redator);
    dados.append("ano", form.ano);
    dados.append("categoria", form.categoria);
    dados.append("sinopse", form.sinopse);
    dados.append("precoCompra", form.precoCompra);
    dados.append("precoAluguel", form.precoAluguel);
    dados.append("diasInclusos", form.diasInclusos);
    dados.append("precoDiaExtra", form.precoDiaExtra);
    dados.append("estoque", form.estoque);
    dados.append("isDoado", String(form.isDoado));
    dados.append("destaque", String(form.destaque));
    dados.append("disponivel", String(form.disponivel));

    if (novaImagem) {
      dados.append("imagem", novaImagem);
    }

    return dados;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setErro("");
    setSucesso("");

    try {
      const dadosLivro = montarFormData();

      await api.put(`/livros/${id}`, dadosLivro, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSucesso("Livro atualizado com sucesso!");

      setTimeout(() => {
        navigate("/admin/livros");
      }, 1000);
    } catch (error) {
      setErro(error.response?.data?.erro || "Erro ao atualizar livro.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    carregarLivro();
  }, [id]);

  useEffect(() => {
    return () => {
      if (previewImagem) {
        URL.revokeObjectURL(previewImagem);
      }
    };
  }, [previewImagem]);

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <p className="page-subtitle">Carregando livro...</p>
        </div>
      </main>
    );
  }

  const imagemParaExibir = previewImagem || montarUrlImagem(imagemAtual);

  return (
    <main className="page">
      <div className="container">
        <div className="form-page-header">
          <div>
            <h1 className="page-title">Editar Livro</h1>
            <p className="page-subtitle">
              Atualize as informações, destaque, disponibilidade e imagem do
              livro.
            </p>
          </div>

          <button
            className="btn btn-outline"
            onClick={() => navigate("/admin/livros")}
          >
            Voltar
          </button>
        </div>

        <form className="book-form" onSubmit={handleSubmit}>
          <div className="form-section book-image-section">
            <div>
              <h2>Capa do livro</h2>
              <p className="form-helper">
                A capa atual será mantida se você não selecionar uma nova
                imagem.
              </p>
            </div>

            <div className="book-upload-grid">
              <div className="book-cover-preview-box">
                {imagemParaExibir ? (
                  <img
                    src={imagemParaExibir}
                    alt="Capa atual do livro"
                    className="book-cover-preview-img"
                  />
                ) : (
                  <div className="book-cover-placeholder">
                    <span>Sem imagem</span>
                    <small>Este livro ainda não possui capa cadastrada</small>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Trocar imagem da capa</label>
                <input
                  type="file"
                  name="imagem"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleImagemChange}
                />

                <small className="input-hint">
                  Tamanho máximo: 5MB. Formatos aceitos: JPG, PNG ou WEBP.
                </small>

                {novaImagem ? (
                  <div className="selected-file-info">
                    <strong>Nova imagem selecionada:</strong>
                    <span>{novaImagem.name}</span>
                  </div>
                ) : (
                  <div className="selected-file-info">
                    <strong>Imagem atual:</strong>
                    <span>
                      {imagemAtual
                        ? "A capa cadastrada será mantida."
                        : "Nenhuma imagem cadastrada ainda."}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

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
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Valores e configurações</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>Preço de compra</label>
                <input
                  type="number"
                  step="0.01"
                  name="precoCompra"
                  value={form.precoCompra}
                  onChange={handleChange}
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
              <span>
                {form.destaque
                  ? "Manter livro em destaque"
                  : "Colocar livro em destaque"}
              </span>
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
          {sucesso && <p className="form-success">{sucesso}</p>}

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate("/admin/livros")}
            >
              Cancelar
            </button>

            <button className="btn btn-primary" disabled={saving}>
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default EditBook;