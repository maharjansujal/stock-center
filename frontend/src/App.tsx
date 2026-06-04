import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { LoginPage } from "./pages/LoginPage";
import Layout from "./components/Layout";
import  InventoryPage  from "./pages/InventoryPage";
import RequestsPage from "./pages/RequestsPage";
import DashboardPage from "./pages/DashboardPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  const { isAuthenticated, isRestoringSession, isAdmin } = useAuth();

  if (isRestoringSession) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f172a] text-slate-200">
        <p className="animate-pulse text-sm font-medium tracking-wide">
          Restoring Session...
        </p>
      </div>
    );
  }

  const router = createBrowserRouter([
    {
      path: "/login",
      element: !isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />,
    },
    {
      path: "/register",
      element: !isAuthenticated ? (
        <RegisterPage />
      ) : (
        <Navigate to="/" replace />
      ),
    },
    {
      path: "/",
      element: isAuthenticated ? <Layout /> : <Navigate to="/login" replace />,
      children: [
        { index: true, element: <DashboardPage /> },

        {
          path: "inventory",
          element: isAdmin ? <InventoryPage /> : <Navigate to="/" replace />,
        },

        { path: "requests", element: <RequestsPage /> },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);

  return <RouterProvider router={router} />;
}
