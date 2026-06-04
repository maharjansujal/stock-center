import { useState } from "react";
import { Plus, Edit2, Trash2, AlertTriangle, Hospital } from "lucide-react";
import { useInventory } from "../hooks/useInventory";
import type { Inventory } from "../types/api";
import { useModal } from "../components/modal/useModal";
import Modal from "../components/modal/Modal";
import { normalizeError } from "../utils/formatError";
import Input from "../components/form/Input";

export default function InventoryPage() {
  const inventoryModal = useModal();

  // Directly wiring up your exact hook endpoints
  const {
    inventories,
    isFetchingInventories,
    createInventory,
    isCreatingInventory,
    updateInventory,
    isUpdatingInventory,
    deleteInventory,
    deleteInventoryError,

    restoreInventory,
    restoreInventoryError,
  } = useInventory();
  const activeError = deleteInventoryError || restoreInventoryError;
  const errorMessage = normalizeError(activeError);

  // Component setup states
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);

  // Form input field elements
  const [itemName, setItemName] = useState("");
  const [totalStock, setTotalStock] = useState<number>(0);

  function openAddModal() {
    setModalMode("add");
    setSelectedItem(null);
    setItemName("");
    setTotalStock(0);
    inventoryModal.openModal();
  }

  function openEditModal(item: Inventory) {
    setModalMode("edit");
    setSelectedItem(item);
    setItemName(item.item_name);
    setTotalStock(item.total_stock);
    inventoryModal.openModal();
  }

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    if (modalMode === "add") {
      createInventory(
        { item_name: itemName, total_stock: totalStock },
        { onSuccess: () => inventoryModal.closeModal() },
      );
    } else if (modalMode === "edit" && selectedItem) {
      updateInventory(
        {
          public_id: selectedItem.public_id,
          item_name: itemName,
          total_stock: totalStock,
        },
        { onSuccess: () => inventoryModal.closeModal() },
      );
    }
  };

  function handleDelete(item: Inventory) {
    if (confirm(`Are you sure you want to delete ${item.item_name}?`)) {
      deleteInventory(item.public_id);
    }
  }

  function handleRestore(item: Inventory) {
    if (
      confirm(`Are you sure you want to recover and restore ${item.item_name}?`)
    ) {
      restoreInventory(item.public_id);
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Inventory Management
          </h1>
          <p className="text-sm text-slate-400">
            Monitor stock levels, add new items, and adjust warehouse records.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors cursor-pointer"
        >
          <Plus size={18} />
          Add New Item
        </button>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-400 backdrop-blur-sm">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-rose-200">Action Denied</h3>
            <p className="mt-0.5 text-xs text-rose-400/90 leading-relaxed">
              {errorMessage}
            </p>
          </div>
        </div>
      )}

      {/* INVENTORY TRACKING TABLE */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
        {isFetchingInventories ? (
          <div className="flex h-48 items-center justify-center">
            <p className="animate-pulse text-sm text-slate-400">
              Loading warehouse items...
            </p>
          </div>
        ) : inventories.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-slate-400 text-sm">
            No items found in the database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4">Item Name</th>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4 text-center">Available Stock</th>
                  <th className="px-6 py-4 text-center">Stock Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {inventories.map((item: Inventory) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-200">
                      {item.item_name}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                      {item.public_id.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-slate-100">
                      {item.total_stock}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.total_stock === 0 ? (
                        <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-medium text-rose-400 border border-rose-500/20">
                          Out of Stock
                        </span>
                      ) : item.total_stock <= 15 ? (
                        <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400 border border-amber-500/20">
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                          Healthy
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 text-slate-400">
                        <button
                          onClick={() => openEditModal(item)}
                          className="hover:text-indigo-400 transition-colors cursor-pointer"
                          title="Edit Item"
                        >
                          <Edit2 size={16} />
                        </button>
                        {item.deleted_at ? (
                          <button
                            onClick={() => handleRestore(item)}
                            className="hover:text-green-400 transition-colors cursor-pointer"
                            title="Recover Item"
                          >
                            <Hospital size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDelete(item)}
                            className="hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        modalProps={inventoryModal}
        title={
          modalMode === "add"
            ? "Add New Inventory Item"
            : "Update Inventory Item"
        }
      >
        <form onSubmit={handleSubmit} className="w-95 space-y-4">
          <div>
            <Input
              label="Item Name"
              id="modal-item-name"
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g., Wireless Mouse"
              required
            />
          </div>

          <div>
            <Input
              label="Total Stock Quantity"
              type="number"
              min={0}
              value={totalStock}
              onChange={(e) => setTotalStock(parseInt(e.target.value, 10) || 0)}
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={inventoryModal.closeModal}
              className="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreatingInventory || isUpdatingInventory}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {modalMode === "add"
                ? isCreatingInventory
                  ? "Saving..."
                  : "Save Item"
                : isUpdatingInventory
                  ? "Updating..."
                  : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
