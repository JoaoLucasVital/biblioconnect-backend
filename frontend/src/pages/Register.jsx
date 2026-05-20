import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    endereco: "",
  });

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setErro("");
    setSucesso("");
    setLoading(true);

    try {
      await register(form);

      setSucesso("Cadastro realizado com sucesso. Você será levado para a página inicial.");

      setTimeout(() => {
        navigate("/");
      }, 1400);
    } catch (error) {
      setErro(error.response?.data?.erro || "Erro ao cadastrar usuário.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-mark">BC</span>
          <h1>Criar cadastro</h1>
          <p>Cadastre-se para acessar reservas, compras e aluguéis.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome completo</label>
            <input
              type="text"
              name="nome"
              placeholder="Digite seu nome"
              value={form.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Digite seu email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              name="senha"
              placeholder="Crie uma senha"
              value={form.senha}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Telefone</label>
            <input
              type="text"
              name="telefone"
              placeholder="Digite seu telefone"
              value={form.telefone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Endereço</label>
            <input
              type="text"
              name="endereco"
              placeholder="Digite seu endereço"
              value={form.endereco}
              onChange={handleChange}
            />
          </div>

          {erro && <p className="feedback-banner error">{erro}</p>}
          {sucesso && <p className="feedback-banner success">{sucesso}</p>}

          <button className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? "Cadastrando..." : "Criar conta"}
          </button>
        </form>

        <p className="auth-footer">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </main>
  );
}

export default Register;