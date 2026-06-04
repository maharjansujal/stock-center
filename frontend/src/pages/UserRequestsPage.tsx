import { useState } from "react";
import { Plus, Edit2 } from "lucide-react";
import { useInventory } from "../hooks/useInventory";
import type { InventoryRequest } from "../types/api";
import { useRequests } from "../hooks/useRequest";
import { useModal } from "../components/modal/useModal";
import Modal from "../components/modal/Modal";
import { normalizeError } from "../utils/formatError";
import Input from "../components/form/Input";

export function UserRequestsPage() {
  const requestModal = useModal();

  // Wire up your exact hooks
  const {
    personalRequests,
    isFetchingPersonalRequests,
    createRequest,
    createRequestError,
    isCreatingRequest,
    updateRequest,
    updateRequestError,
    isUpdatingRequest,
  } = useRequests();

  const { inventories, isFetchingInventories } = useInventory();

  // Track if we are creating or modifying an existing ticket
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [selectedRequest, setSelectedRequest] =
    useState<InventoryRequest | null>(null);

  // Form input bindings
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState<number>(1);

  const error = createRequestError || updateRequestError;

  const errorMessage = normalizeError(error);

  function openCreateModal() {
    setModalMode("create");
    setSelectedRequest(null);
    setItemId("");
    setQuantity(1);
    requestModal.openModal();
  }

  function openUpdateModal(req: InventoryRequest) {
    setModalMode("update");
    setSelectedRequest(req);
    setItemId(req.item_id.toString());
    setQuantity(req.quantity);
    requestModal.openModal();
  }

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const parsedItemId = parseInt(itemId, 10);

    if (!parsedItemId || quantity <= 0) return;

    if (modalMode === "create") {
      createRequest(
        { item_id: parsedItemId, quantity },
        { onSuccess: () => requestModal.closeModal() },
      );
    } else if (modalMode === "update" && selectedRequest) {
      updateRequest(
        {
          public_id: selectedRequest.public_id,
          item_id: parsedItemId,
          quantity,
        },
        { onSuccess: () => requestModal.closeModal() },
      );
    }
  }

  function getStatusStyle(status: "pending" | "approved" | "denied") {
    switch (status) {
      case "approved":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "denied":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            My Supply Requests
          </h1>
          <p className="text-sm text-slate-400">
            Request inventory resources and keep track of authorization updates.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors cursor-pointer"
        >
          <Plus size={18} />
          New Request
        </button>
      </div>

      {/* HISTORICAL REQS CONTAINER */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
        {isFetchingPersonalRequests ? (
          <div className="flex h-48 items-center justify-center">
            <p className="animate-pulse text-sm text-slate-400">
              Loading your history logs...
            </p>
          </div>
        ) : personalRequests.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-slate-400 text-sm">
            You haven't submitted any supply requests yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4">Item Index</th>
                  <th className="px-6 py-4">Reference ID</th>
                  <th className="px-6 py-4 text-center">Amount</th>
                  <th className="px-6 py-4 text-center">Verification Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {personalRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-200">
                      Item #{req.item_id}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                      {req.public_id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-slate-100">
                      {req.quantity}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusStyle(req.status)}`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {req.status === "pending" ? (
                        <button
                          onClick={() => openUpdateModal(req)}
                          className="text-slate-400 hover:text-indigo-400 transition-colors inline-flex cursor-pointer"
                          title="Edit Pending Request"
                        >
                          <Edit2 size={16} />
                        </button>
                      ) : (
                        <span className="text-xs text-slate-600 italic select-none">
                          Locked
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

      <Modal
        modalProps={requestModal}
        title={
          modalMode === "create"
            ? "Create Stock Request"
            : "Modify Request Details"
        }
      >
        <form onSubmit={handleSubmit} className="w-95 space-y-4">
          {errorMessage && (
            <div className="rounded-md bg-rose-500/10 p-3 text-xs font-medium text-rose-400 border border-rose-500/20">
              {errorMessage}
            </div>
          )}
          <div>
            <label
              htmlFor="modal-item"
              className="block text-xs font-medium text-slate-400 uppercase tracking-wider"
            >
              Select Desired Supply Item
            </label>
            <select
              id="modal-item"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              disabled={isFetchingInventories}
              className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            >
              <option value="" disabled>
                {isFetchingInventories
                  ? "Loading items..."
                  : "-- Choose Warehouse Item --"}
              </option>
              {inventories.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.item_name} (Stock: {inv.total_stock})
                </option>
              ))}
            </select>
          </div>

          <div>
            <Input
              label="Requested Amount"
              id="modal-qty"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={requestModal.closeModal}
              className="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreatingRequest || isUpdatingRequest}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {modalMode === "create"
                ? isCreatingRequest
                  ? "Sending..."
                  : "Submit Request"
                : isUpdatingRequest
                  ? "Updating..."
                  : "Save Edits"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
