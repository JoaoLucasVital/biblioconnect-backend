import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loadingAuth } = useAuth();

  if (loadingAuth) {
    return (
      <main className="page">
        <div className="container">
          <p className="page-subtitle">Verificando autenticação...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <main className="page">
        <div className="container">
          <div className="access-denied">
            <h1>Acesso negado</h1>
            <p>Esta área é exclusiva para administradores.</p>
          </div>
        </div>
      </main>
    );
  }

  return children;
}

export default AdminRoute;