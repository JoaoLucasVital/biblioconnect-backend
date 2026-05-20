import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api.js";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  async function carregarUsuarioLogado() {
    const token = localStorage.getItem("@biblioconnect:token");

    if (!token) {
      setLoadingAuth(false);
      return;
    }

    try {
      const response = await api.get("/me");
      setUsuario(response.data);
    } catch (error) {
      localStorage.removeItem("@biblioconnect:token");
      localStorage.removeItem("@biblioconnect:usuario");
      setUsuario(null);
    } finally {
      setLoadingAuth(false);
    }
  }

  async function login(email, senha) {
    const response = await api.post("/login", {
      email,
      senha,
    });

    const { token, usuario } = response.data;

    localStorage.setItem("@biblioconnect:token", token);
    localStorage.setItem("@biblioconnect:usuario", JSON.stringify(usuario));

    setUsuario(usuario);

    return usuario;
  }

  async function register(dados) {
    const response = await api.post("/usuarios", dados);
    return response.data;
  }

  function logout() {
    localStorage.removeItem("@biblioconnect:token");
    localStorage.removeItem("@biblioconnect:usuario");
    setUsuario(null);
  }

  useEffect(() => {
    carregarUsuarioLogado();
  }, []);

  const isAuthenticated = !!usuario;
  const isAdmin = usuario?.role === "ADMIN";

  return (
    <AuthContext.Provider
      value={{
        usuario,
        isAuthenticated,
        isAdmin,
        loadingAuth,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}