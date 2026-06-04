import { useAuth } from "../hooks/useAuth";
import { useInventory } from "../hooks/useInventory";
import { useRequests } from "../hooks/useRequest";

export default function DashboardPage() {
  const { isAdmin, user } = useAuth();
  const { inventories } = useInventory();
  const { allRequests, personalRequests } = useRequests();

  const requestsToDisplay = isAdmin ? allRequests : personalRequests;
  const pendingRequestsCount = requestsToDisplay.filter(
    (r) => r.status === "pending",
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white m-0">
          Welcome back, {user?.name}
        </h1>
        <p className="text-sm text-slate-400 m-0">
          Here is what's happening with the system inventory metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0f172a] border border-[#1e293b] p-5 rounded-xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 m-0">
            Total Inventory Items
          </p>
          <p className="text-3xl font-bold text-white mt-2 mb-0">
            {inventories.length}
          </p>
        </div>

        <div className="bg-[#0f172a] border border-[#1e293b] p-5 rounded-xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 m-0">
            {isAdmin ? "Global Pending Approvals" : "My Active Requests"}
          </p>
          <p className="text-3xl font-bold text-amber-400 mt-2 mb-0">
            {pendingRequestsCount}
          </p>
        </div>
      </div>

      {isAdmin && (
        <div className="bg-[#0f172a] border border-[#1e293b] p-6 rounded-xl">
          <h3 className="text-sm font-semibold text-white mb-4">
            Admin System Actions
          </h3>
        </div>
      )}
    </div>
  );
}
