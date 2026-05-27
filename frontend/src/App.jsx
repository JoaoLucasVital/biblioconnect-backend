import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx";

import Navbar from "./components/Navbar.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Books from "./pages/Books.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

import AdminDashboard from "./pages/AdminDashboard.jsx";
import AddBook from "./pages/AddBooks.jsx";
import AdminBooks from "./pages/AdminBooks.jsx";
import EditBook from "./pages/EditBook.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import AdminDelays from "./pages/AdminDelays.jsx";
import AdminOrders from "./pages/AdminOrders.jsx";
import AdminFinance from "./pages/AdminFinance.jsx";

import MyOrders from "./pages/MyOrders.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import OrderReceipt from "./pages/OrderReceipt.jsx";

import "./styles/global.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/livros" element={<Books />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/esqueci-senha" element={<ForgotPassword />} />
          <Route path="/redefinir-senha/:token" element={<ResetPassword />} />

          <Route
            path="/meus-pedidos"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pedido-confirmado/:id"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />

          <Route
            path="/comprovante/:id"
            element={
              <ProtectedRoute>
                <OrderReceipt />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/livros"
            element={
              <AdminRoute>
                <AdminBooks />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/pedidos"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/financeiro"
            element={
              <AdminRoute>
                <AdminFinance />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/usuarios"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/atrasos"
            element={
              <AdminRoute>
                <AdminDelays />
              </AdminRoute>
            }
          />

          <Route
            path="/adicionar-livro"
            element={
              <AdminRoute>
                <AddBook />
              </AdminRoute>
            }
          />

          <Route
            path="/editar-livro/:id"
            element={
              <AdminRoute>
                <EditBook />
              </AdminRoute>
            }
          />

          <Route
            path="*"
            element={
              <main className="page">
                <div className="container">
                  <h1 className="page-title">Página não encontrada</h1>
                  <p className="page-subtitle">
                    Essa rota ainda não foi configurada.
                  </p>
                </div>
              </main>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;