// components/common/ConfirmDialog.tsx

// Reusable confirmation dialog for destructive actions
// Used before delete operations across all features

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

// ─────────────────────────────────────────────────────
// CONFIRM DIALOG PROPS
// ─────────────────────────────────────────────────────
interface ConfirmDialogProps {
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  variant?: "danger" | "default";
}

// ─────────────────────────────────────────────────────
// CONFIRM DIALOG COMPONENT
// ─────────────────────────────────────────────────────
const ConfirmDialog = ({
  isOpen,
  open,
  onClose,
  onOpenChange,
  onConfirm,
  isLoading = false,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
}: ConfirmDialogProps) => {
  const dialogOpen = open ?? isOpen ?? false;
  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange?.(nextOpen);
    if (!nextOpen) {
      onClose?.();
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md rounded-xl">

        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {/* Warning Icon */}
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <DialogTitle className="text-[18px] font-semibold text-zinc-900">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-[14px] text-zinc-500 ml-[52px]">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-2 mt-2">
          {/* Cancel */}
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border-zinc-300 text-zinc-700 hover:bg-zinc-50"
          >
            Cancel
          </Button>

          {/* Confirm */}
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Deleting...
              </span>
            ) : (
              confirmLabel
            )}
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
