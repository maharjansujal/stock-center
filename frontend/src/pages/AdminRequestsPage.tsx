import { useRequests } from "../hooks/useRequest";
import { AlertTriangle, Check, X } from "lucide-react";
import { normalizeError } from "../utils/formatError";

export function AdminRequestsPage() {
  const {
    allRequests,
    isFetchingAllRequests,
    reviewRequest,
    isReviewingRequest,
    reviewRequestError,
  } = useRequests();

  function handleReview (public_id: string, status: "approved" | "denied") {
    reviewRequest({ public_id, status });
  };

  const errorMessage = normalizeError(reviewRequestError);

  function getStatusStyle (status: "pending" | "approved" | "denied") {
    switch (status) {
      case "approved":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "denied":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">
          Incoming Supply Requests
        </h1>
        <p className="text-sm text-slate-400">
          Review, approve, or deny resource requests submitted by staff members.
        </p>
      </div>
      {errorMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-400 backdrop-blur-sm">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-rose-200">
              Action Denied
            </h3>
            <p className="mt-0.5 text-xs text-rose-400/90 leading-relaxed">
              {errorMessage}
            </p>
          </div>
        </div>
      )}
      {/* REQS MANAGEMENT TABLE */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
        {isFetchingAllRequests ? (
          <div className="flex h-48 items-center justify-center">
            <p className="animate-pulse text-sm text-slate-400">
              Loading incoming requests...
            </p>
          </div>
        ) : allRequests.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-slate-400 text-sm">
            No supply requests registered in the system.
          </div>
        ) : (
          <div className="overflow-x-auto">
            {errorMessage}
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4">User ID</th>
                  <th className="px-6 py-4">Item Index</th>
                  <th className="px-6 py-4 text-center">Quantity</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">
                    Administrative Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {allRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-300">
                      User #{req.user_id}
                    </td>
                    <td className="px-6 py-4 text-slate-200">
                      Item #{req.item_id}
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-slate-100">
                      {req.quantity}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusStyle(
                          req.status,
                        )}`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {req.status === "pending" ? (
                        <div className="flex justify-end gap-2">
                          <button
                            disabled={isReviewingRequest}
                            onClick={() =>
                              handleReview(req.public_id, "approved")
                            }
                            className="inline-flex items-center gap-1 rounded bg-emerald-600/20 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white disabled:opacity-50 transition-all"
                            title="Approve Request"
                          >
                            <Check size={14} />
                            Approve
                          </button>
                          <button
                            disabled={isReviewingRequest}
                            onClick={() =>
                              handleReview(req.public_id, "denied")
                            }
                            className="inline-flex items-center gap-1 rounded bg-rose-600/20 px-2.5 py-1 text-xs font-semibold text-rose-400 border border-rose-500/30 hover:bg-rose-600 hover:text-white disabled:opacity-50 transition-all"
                            title="Deny Request"
                          >
                            <X size={14} />
                            Deny
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic select-none pr-4">
                          Resolved
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
