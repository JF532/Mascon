interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  variant = "danger",
  onConfirm,
  onCancel,
  loading,
}: Props) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-text">{message}</p>
        <div className="form-actions">
          <button className="btn btn-ghost" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
          <button
            className={variant === "danger" ? "btn btn-danger" : "btn btn-primary"}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Aguarde..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
