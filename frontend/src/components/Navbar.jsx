import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import BrandLogo from "./BrandLogo.jsx";

function Navbar() {
  const { usuario, isAuthenticated, isAdmin, logout, loadingAuth } = useAuth();
  const navigate = useNavigate();

  const [navbarHidden, setNavbarHidden] = useState(false);
  const [navbarCompact, setNavbarCompact] = useState(false);
  const lastScrollY = useRef(0);

  function handleLogout() {
    logout();
    navigate("/");
  }

  function getNavLinkClass(isActive) {
    return isActive ? "nav-link active" : "nav-link";
  }

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;

      setNavbarCompact(currentScrollY > 40);

      if (currentScrollY < 90) {
        setNavbarHidden(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (currentScrollY > lastScrollY.current + 8) {
        setNavbarHidden(true);
      }

      if (currentScrollY < lastScrollY.current - 8) {
        setNavbarHidden(false);
      }

      lastScrollY.current = currentScrollY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={[
        "navbar",
        navbarHidden ? "navbar-hidden" : "",
        navbarCompact ? "navbar-compact" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="container navbar-shell">
        <div className="navbar-left">
          <Link to="/" className="brand">
            <BrandLogo className="brand-logo" />

            <div className="brand-text">
              <strong>BiblioConnect</strong>
              <span>Biblioteca Online</span>
            </div>
          </Link>
        </div>

        <div className="navbar-center">
          <div className="nav-cluster">
            <NavLink
              to="/"
              className={({ isActive }) => getNavLinkClass(isActive)}
            >
              Início
            </NavLink>

            <NavLink
              to="/livros"
              className={({ isActive }) => getNavLinkClass(isActive)}
            >
              Catálogo
            </NavLink>
          </div>

          {!loadingAuth && isAuthenticated && !isAdmin && (
            <>
              <span className="nav-divider" />

              <div className="nav-cluster">
                <NavLink
                  to="/meus-pedidos"
                  className={({ isActive }) => getNavLinkClass(isActive)}
                >
                  Meus Pedidos
                </NavLink>
              </div>
            </>
          )}

          {!loadingAuth && isAdmin && (
            <>
              <span className="nav-divider" />

              <div className="nav-cluster">
                <NavLink
                  to="/admin"
                  className={({ isActive }) => getNavLinkClass(isActive)}
                >
                  Painel
                </NavLink>

                <NavLink
                  to="/admin/livros"
                  className={({ isActive }) => getNavLinkClass(isActive)}
                >
                  Livros
                </NavLink>

                <NavLink
                  to="/admin/pedidos"
                  className={({ isActive }) => getNavLinkClass(isActive)}
                >
                  Pedidos
                </NavLink>

                <NavLink
                  to="/admin/financeiro"
                  className={({ isActive }) => getNavLinkClass(isActive)}
                >
                  Financeiro
                </NavLink>

                <NavLink
                  to="/admin/usuarios"
                  className={({ isActive }) => getNavLinkClass(isActive)}
                >
                  Usuários
                </NavLink>

                <NavLink
                  to="/admin/atrasos"
                  className={({ isActive }) => getNavLinkClass(isActive)}
                >
                  Atrasos
                </NavLink>

                <NavLink
                  to="/adicionar-livro"
                  className={({ isActive }) => getNavLinkClass(isActive)}
                >
                  Novo Livro
                </NavLink>
              </div>
            </>
          )}
        </div>

        <div className="navbar-right">
          {!loadingAuth && !isAuthenticated && (
            <div className="nav-auth">
              <NavLink
                to="/login"
                className={({ isActive }) => getNavLinkClass(isActive)}
              >
                Login
              </NavLink>

              <NavLink
                to="/cadastro"
                className={({ isActive }) => getNavLinkClass(isActive)}
              >
                Cadastro
              </NavLink>
            </div>
          )}

          {!loadingAuth && isAuthenticated && (
            <div className="user-panel">
              <div className="user-chip">
                <span className="user-label">Olá,</span>
                <strong>{usuario?.nome}</strong>
              </div>

              <button className="logout-btn" onClick={handleLogout}>
                Sair
              </button>
            </div>
          )}

          <div className="theme-toggle-box">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;