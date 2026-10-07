/**
 * Modal de confirmación genérico para acciones destructivas.
 */
export function ConfirmModal({ titulo, mensaje, onConfirmar, onCancelar }) {
  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">⚠️</div>
        <h3>{titulo}</h3>
        <p>{mensaje}</p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={onConfirmar}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
