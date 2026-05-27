import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/api.js";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (novaSenha.length < 6) {
      setFeedback({
        type: "error",
        text: "A senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setFeedback({
        type: "error",
        text: "As senhas não coincidem.",
      });
      return;
    }

    try {
      setLoading(true);
      setFeedback({ type: "", text: "" });

      const response = await api.patch(`/redefinir-senha/${token}`, {
        novaSenha,
      });

      setFeedback({
        type: "success",
        text: response.data?.mensagem || "Senha redefinida com sucesso.",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1300);
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.erro || "Erro ao redefinir senha.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="section-kicker">Nova senha</span>

        <h1>Redefinir senha</h1>

        <p>Crie uma nova senha para acessar sua conta no BiblioConnect.</p>

        {feedback.text && (
          <p className={`feedback-banner ${feedback.type}`}>
            {feedback.text}
          </p>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Nova senha</label>

            <div className="password-input-box">
              <input
                type={mostrarNovaSenha ? "text" : "password"}
                value={novaSenha}
                onChange={(event) => setNovaSenha(event.target.value)}
                placeholder="Mínimo de 6 caracteres"
                required
              />

              <button
                type="button"
                className="password-eye-btn"
                onClick={() => setMostrarNovaSenha((prev) => !prev)}
                aria-label={
                  mostrarNovaSenha ? "Ocultar nova senha" : "Mostrar nova senha"
                }
              >
                {mostrarNovaSenha ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirmar nova senha</label>

            <div className="password-input-box">
              <input
                type={mostrarConfirmarSenha ? "text" : "password"}
                value={confirmarSenha}
                onChange={(event) => setConfirmarSenha(event.target.value)}
                placeholder="Digite a senha novamente"
                required
              />

              <button
                type="button"
                className="password-eye-btn"
                onClick={() => setMostrarConfirmarSenha((prev) => !prev)}
                aria-label={
                  mostrarConfirmarSenha
                    ? "Ocultar confirmação de senha"
                    : "Mostrar confirmação de senha"
                }
              >
                {mostrarConfirmarSenha ? "Ocultar" : "Mostrar"}
              </button>
            </div>

            {confirmarSenha && novaSenha !== confirmarSenha && (
              <small className="field-warning">
                As senhas ainda não coincidem.
              </small>
            )}
          </div>

          <button className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? "Salvando..." : "Redefinir senha"}
          </button>
        </form>

        <div className="auth-extra-links">
          <Link to="/login">Voltar para o login</Link>
        </div>
      </section>
    </main>
  );
}

export default ResetPassword;