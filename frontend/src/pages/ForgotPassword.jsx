import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api.js";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setFeedback({ type: "", text: "" });

      const response = await api.post("/esqueci-senha", {
        email,
      });

      setFeedback({
        type: "success",
        text:
          response.data?.mensagem ||
          "Se este email estiver cadastrado, enviaremos um link de redefinição.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error.response?.data?.erro ||
          "Erro ao solicitar redefinição de senha.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-mark">BC</span>
          <h1>Esqueci minha senha</h1>
          <p>
            Informe o email cadastrado. Se ele existir no sistema, enviaremos um
            link para redefinir sua senha.
          </p>
        </div>

        {feedback.text && (
          <p className={`feedback-banner ${feedback.type}`}>
            {feedback.text}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email cadastrado</label>
            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? "Enviando..." : "Enviar link de redefinição"}
          </button>
        </form>

        <p className="auth-footer">
          Lembrou sua senha? <Link to="/login">Voltar para login</Link>
        </p>
      </div>
    </main>
  );
}

export default ForgotPassword;