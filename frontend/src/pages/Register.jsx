import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function limparCep(valor) {
  return String(valor || "").replace(/\D/g, "").slice(0, 8);
}

function formatarCep(valor) {
  const cepLimpo = limparCep(valor);

  if (cepLimpo.length <= 5) {
    return cepLimpo;
  }

  return `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5)}`;
}

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    telefone: "",
    cep: "",
    rua: "",
    bairro: "",
    cidade: "",
    estado: "",
    numero: "",
    complemento: "",
    pontoReferencia: "",
  });

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);

  const [cepFeedback, setCepFeedback] = useState({
    type: "",
    text: "",
    fading: false,
  });

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  function mostrarCepFeedback(type, text) {
    setCepFeedback({
      type,
      text,
      fading: false,
    });

    setTimeout(() => {
      setCepFeedback((prev) => ({
        ...prev,
        fading: true,
      }));
    }, 4200);

    setTimeout(() => {
      setCepFeedback({
        type: "",
        text: "",
        fading: false,
      });
    }, 5000);
  }

  function limparFeedbackCep() {
    setCepFeedback({
      type: "",
      text: "",
      fading: false,
    });
  }

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "cep") {
      setForm((prev) => ({
        ...prev,
        cep: formatarCep(value),
      }));

      limparFeedbackCep();
      return;
    }

    if (name === "estado") {
      setForm((prev) => ({
        ...prev,
        estado: value.toUpperCase().slice(0, 2),
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function buscarCep() {
    const cepLimpo = limparCep(form.cep);

    setErro("");
    limparFeedbackCep();

    if (cepLimpo.length !== 8) {
      mostrarCepFeedback("error", "Digite um CEP válido com 8 números.");
      return;
    }

    try {
      setBuscandoCep(true);

      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        mostrarCepFeedback(
          "error",
          "CEP não encontrado. Confira os números digitados."
        );
        return;
      }

      setForm((prev) => ({
        ...prev,
        cep: formatarCep(cepLimpo),
        rua: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
      }));

      mostrarCepFeedback(
        "success",
        "Endereço encontrado. Complete número, complemento e referência se necessário."
      );
    } catch (error) {
      mostrarCepFeedback(
        "error",
        "Não foi possível buscar o CEP agora. Preencha manualmente."
      );
    } finally {
      setBuscandoCep(false);
    }
  }

  function validarFormulario() {
    if (!form.nome.trim()) return "Informe seu nome completo.";
    if (!form.email.trim()) return "Informe seu email.";

    if (!form.senha) return "Crie uma senha.";
    if (form.senha.length < 6) {
      return "A senha deve ter pelo menos 6 caracteres.";
    }

    if (!form.confirmarSenha) return "Confirme sua senha.";

    if (form.senha !== form.confirmarSenha) {
      return "As senhas não coincidem.";
    }

    if (!limparCep(form.cep)) return "Informe o CEP.";

    if (limparCep(form.cep).length !== 8) {
      return "Informe um CEP válido com 8 números.";
    }

    if (!form.rua.trim()) return "Informe a rua ou avenida.";
    if (!form.bairro.trim()) return "Informe o bairro.";
    if (!form.cidade.trim()) return "Informe a cidade.";
    if (!form.estado.trim()) return "Informe o estado.";
    if (!form.numero.trim()) return "Informe o número da residência.";

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setErro("");
    setSucesso("");

    const erroValidacao = validarFormulario();

    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    setLoading(true);

    try {
      const dadosCadastro = {
        nome: form.nome.trim(),
        email: form.email.trim(),
        senha: form.senha,
        telefone: form.telefone.trim(),
        cep: form.cep.trim(),
        rua: form.rua.trim(),
        bairro: form.bairro.trim(),
        cidade: form.cidade.trim(),
        estado: form.estado.trim().toUpperCase(),
        numero: form.numero.trim(),
        complemento: form.complemento.trim(),
        pontoReferencia: form.pontoReferencia.trim(),
      };

      await register(dadosCadastro);

      setSucesso(
        "Cadastro realizado com sucesso. Verifique seu email para confirmar a conta."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (error) {
      setErro(error.response?.data?.erro || "Erro ao cadastrar usuário.");
    } finally {
      setLoading(false);
    }
  }

  const cadastroBloqueado =
    loading ||
    buscandoCep ||
    !form.nome ||
    !form.email ||
    !form.senha ||
    !form.confirmarSenha ||
    !form.cep ||
    !form.rua ||
    !form.bairro ||
    !form.cidade ||
    !form.estado ||
    !form.numero ||
    form.senha !== form.confirmarSenha;

  return (
    <main className="auth-page register-page-enhanced">
      <div className="auth-card register-card-wide">
        <div className="auth-header">
          <span className="auth-mark">BC</span>
          <h1>Criar cadastro</h1>
          <p>
            Cadastre-se para acessar reservas, compras e aluguéis. Após o
            cadastro, confirme seu email para liberar o login.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="register-section">
            <h2>Dados pessoais</h2>

            <div className="register-grid">
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
                <label>Telefone</label>
                <input
                  type="text"
                  name="telefone"
                  placeholder="Digite seu telefone"
                  value={form.telefone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="register-section">
            <h2>Segurança da conta</h2>

            <div className="register-grid">
              <div className="form-group">
                <label>Senha</label>

                <div className="password-input-box">
                  <input
                    type={mostrarSenha ? "text" : "password"}
                    name="senha"
                    placeholder="Crie uma senha"
                    value={form.senha}
                    onChange={handleChange}
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

              <div className="form-group">
                <label>Confirmar senha</label>

                <div className="password-input-box">
                  <input
                    type={mostrarConfirmarSenha ? "text" : "password"}
                    name="confirmarSenha"
                    placeholder="Digite a senha novamente"
                    value={form.confirmarSenha}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="password-eye-btn"
                    onClick={() => setMostrarConfirmarSenha((prev) => !prev)}
                    aria-label={
                      mostrarConfirmarSenha ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    {mostrarConfirmarSenha ? "Ocultar" : "Mostrar"}
                  </button>
                </div>

                {form.confirmarSenha && form.senha !== form.confirmarSenha && (
                  <small className="field-warning">
                    As senhas ainda não coincidem.
                  </small>
                )}
              </div>
            </div>
          </div>

          <div className="register-section">
            <h2>Endereço completo</h2>

            <div className="cep-row">
              <div className="form-group">
                <label>CEP</label>
                <input
                  type="text"
                  name="cep"
                  placeholder="00000-000"
                  value={form.cep}
                  onChange={handleChange}
                  onBlur={buscarCep}
                  required
                />
              </div>

              <button
                type="button"
                className="btn cep-search-btn"
                onClick={buscarCep}
                disabled={buscandoCep}
              >
                {buscandoCep ? "Buscando..." : "Buscar CEP"}
              </button>
            </div>

            {cepFeedback.text && (
              <p
                className={`cep-feedback ${cepFeedback.type} ${
                  cepFeedback.fading ? "fade-out" : ""
                }`}
              >
                {cepFeedback.text}
              </p>
            )}

            <div className="register-grid">
              <div className="form-group">
                <label>Rua / Avenida</label>
                <input
                  type="text"
                  name="rua"
                  placeholder="Rua, avenida ou travessa"
                  value={form.rua}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Bairro</label>
                <input
                  type="text"
                  name="bairro"
                  placeholder="Bairro"
                  value={form.bairro}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Cidade</label>
                <input
                  type="text"
                  name="cidade"
                  placeholder="Cidade"
                  value={form.cidade}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Estado</label>
                <input
                  type="text"
                  name="estado"
                  placeholder="UF"
                  value={form.estado}
                  onChange={handleChange}
                  maxLength="2"
                  required
                />
              </div>

              <div className="form-group">
                <label>Número</label>
                <input
                  type="text"
                  name="numero"
                  placeholder="Número da residência"
                  value={form.numero}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Complemento</label>
                <input
                  type="text"
                  name="complemento"
                  placeholder="Casa, apartamento, bloco..."
                  value={form.complemento}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Ponto de referência</label>
              <input
                type="text"
                name="pontoReferencia"
                placeholder="Ex: próximo à praça, mercado, escola..."
                value={form.pontoReferencia}
                onChange={handleChange}
              />
            </div>
          </div>

          {erro && <p className="feedback-banner error">{erro}</p>}
          {sucesso && <p className="feedback-banner success">{sucesso}</p>}

          <button
            className="btn btn-primary auth-btn"
            disabled={cadastroBloqueado}
          >
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