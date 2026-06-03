import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { LoginPage } from "./pages/LoginPage";
import Layout from "./components/Layout";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";

// Dummy placeholder views to prevent TypeScript compilation errors
const DummyDashboard = () => (
  <div className="text-white font-medium">Dashboard Sub-View Pane</div>
);
const DummyInventory = () => (
  <div className="text-white font-medium">Inventory Table Registry</div>
);
const DummyRequests = () => (
  <div className="text-white font-medium">Global System Requests Workflow</div>
);

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

  // Define client-side engine routing configuration mapping matching state rules
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
          element: isAdmin ? <DummyInventory /> : <Navigate to="/" replace />,
        },

        { path: "requests", element: <DummyRequests /> },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);

  return <RouterProvider router={router} />;
}
