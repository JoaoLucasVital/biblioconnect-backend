import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setErro("");
    setLoading(true);

    try {
      await login(email, senha);
      navigate("/");
    } catch (error) {
      setErro(error.response?.data?.erro || "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-mark">BC</span>
          <h1>Entrar na plataforma</h1>
          <p>Acesse sua conta para reservar, alugar ou comprar livros.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div className="password-label-row">
              <label>Senha</label>

              <Link to="/esqueci-senha" className="forgot-password-link">
                Esqueci minha senha
              </Link>
            </div>

            <div className="password-input-box">
              <input
                type={mostrarSenha ? "text" : "password"}
                placeholder="Digite sua senha"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                required
              />

              <button
                type="button"
                className="password-eye-btn"
                onClick={() => setMostrarSenha((prev) => !prev)}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenha ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          {erro && <p className="feedback-banner error">{erro}</p>}

          <button className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="admin-login-info">
          <strong>Acesso administrativo de teste</strong>
          <span>admin@biblioconnect.com</span>
          <span>admin123</span>
        </div>

        <p className="auth-footer">
          Ainda não tem conta? <Link to="/cadastro">Criar cadastro</Link>
        </p>
      </div>
    </main>
  );
}

export default Login;