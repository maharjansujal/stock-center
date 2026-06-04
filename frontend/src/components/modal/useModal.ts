import { useState, useCallback } from "react";

export type UseModalReturn = {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export function useModal(initial = false): UseModalReturn {
  const [open, setOpen] = useState(initial);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  return {
    open,
    openModal,
    closeModal,
  };
}