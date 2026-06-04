import { X } from "lucide-react";
import type { UseModalReturn } from "./useModal";

export default function Modal({
  open,
  onClose,
  children,
  modalProps,
  title,
}: {
  open?: boolean;
  onClose?: () => void;
  modalProps?: UseModalReturn;
  children: React.ReactNode;
  title?: string;
}) {
  const isOpen = modalProps?.open ?? open ?? false;
  const handleClose = onClose ?? modalProps?.closeModal ?? (() => {});

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="w-full max-w-lg rounded-sm shadow-xl flex flex-col bg-surface text-primary border border-border overflow-hidden">
        <div className="bg-surface-hover border-b border-border px-4 py-3 flex justify-between items-center">
          <h1 className="font-bold text-primary">{title}</h1>

          <button
            onClick={handleClose}
            className="text-secondary hover:text-primary transition-colors cursor-pointer"
            title="Close"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <div
          className="px-4 py-4 overflow-y-auto modal-scroll bg-surface"
          style={{ maxHeight: "calc(90vh - 70px)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
