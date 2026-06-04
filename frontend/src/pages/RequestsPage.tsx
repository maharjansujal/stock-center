import { useAuth } from "../hooks/useAuth";
import { AdminRequestsPage } from "./AdminRequestsPage";
import { UserRequestsPage } from "./UserRequestsPage";

export default function RequestsPage() {
  const { isAdmin } = useAuth();

  if (isAdmin) return <AdminRequestsPage />;

  return <UserRequestsPage />;
}
