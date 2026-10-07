import { useState } from 'react';
import { TIPOS, ESTADOS, ESCALA, COLOR_ESTADO, COLOR_TIPO } from '../constants.js';
import { useStore } from '../store.js';
import { ConfirmModal } from './ConfirmModal.jsx';

const filaVacia = () => ({
  requerimiento: '',
  tipo: TIPOS[0],
  usuarios: '',
  impacto: ESCALA[1],
  confianza: ESCALA[1],
  estimacion: '',
  estado: ESTADOS[0],
});

/**
 * Tabla interactiva de requerimientos de un producto.
 * - Edición en línea con recálculo automático de priorización.
 * - Fila de alta para crear nuevos requerimientos.
 * - Eliminación con confirmación.
 */
export function RequerimientosTable({ producto }) {
  const actualizarRequerimiento = useStore((s) => s.actualizarRequerimiento);
  const agregarRequerimiento = useStore((s) => s.agregarRequerimiento);
  const eliminarRequerimiento = useStore((s) => s.eliminarRequerimiento);

  const [nuevo, setNuevo] = useState(filaVacia());
  const [errores, setErrores] = useState({});
  const [porEliminar, setPorEliminar] = useState(null);

  const validarNuevo = () => {
    const err = {};
    if (!nuevo.requerimiento.trim()) err.requerimiento = true;
    if (nuevo.usuarios === '' || Number(nuevo.usuarios) < 0 || !Number.isInteger(Number(nuevo.usuarios)))
      err.usuarios = true;
    if (nuevo.estimacion === '' || Number(nuevo.estimacion) <= 0) err.estimacion = true;
    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const handleCrear = () => {
    if (!validarNuevo()) return;
    agregarRequerimiento(producto.id, nuevo);
    setNuevo(filaVacia());
    setErrores({});
  };

  // Actualiza un campo de un requerimiento existente (edición en línea).
  const handleEditar = (reqId, campo, valor) => {
    actualizarRequerimiento(producto.id, reqId, { [campo]: valor });
  };

  return (
    <div className="table-section">
      <div className="table-header">
        <h3>Requerimientos · {producto.nombre}</h3>
        <span className="hint">Ordenado automáticamente por priorización (mayor a menor)</span>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Requerimiento</th>
              <th>Tipo</th>
              <th>Usuarios/Mes</th>
              <th>Impacto</th>
              <th>Confianza</th>
              <th>Est. (h)</th>
              <th>Priorización</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Fila de creación */}
            <tr className="row-create">
              <td className="rank-cell">+</td>
              <td className="col-req">
                <input
                  type="text"
                  placeholder="Código o descripción"
                  value={nuevo.requerimiento}
                  className={errores.requerimiento ? 'invalid' : ''}
                  onChange={(e) => setNuevo({ ...nuevo, requerimiento: e.target.value })}
                />
              </td>
              <td>
                <select value={nuevo.tipo} onChange={(e) => setNuevo({ ...nuevo, tipo: e.target.value })}>
                  {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </td>
              <td>
                <input
                  type="number" min="0" step="1" placeholder="0"
                  value={nuevo.usuarios}
                  className={errores.usuarios ? 'invalid' : ''}
                  onChange={(e) => setNuevo({ ...nuevo, usuarios: e.target.value })}
                />
              </td>
              <td>
                <select value={nuevo.impacto} onChange={(e) => setNuevo({ ...nuevo, impacto: Number(e.target.value) })}>
                  {ESCALA.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </td>
              <td>
                <select value={nuevo.confianza} onChange={(e) => setNuevo({ ...nuevo, confianza: Number(e.target.value) })}>
                  {ESCALA.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </td>
              <td>
                <input
                  type="number" min="0" step="0.5" placeholder="0.0"
                  value={nuevo.estimacion}
                  className={errores.estimacion ? 'invalid' : ''}
                  onChange={(e) => setNuevo({ ...nuevo, estimacion: e.target.value })}
                />
              </td>
              <td className="priori-cell">—</td>
              <td>
                <select value={nuevo.estado} onChange={(e) => setNuevo({ ...nuevo, estado: e.target.value })}>
                  {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td>
                <button className="btn btn-primary btn-sm" onClick={handleCrear}>Agregar</button>
              </td>
            </tr>

            {/* Filas existentes */}
            {producto.requerimientos.length === 0 ? (
              <tr>
                <td colSpan={10} className="empty-row">
                  No hay requerimientos aún. Usa la fila superior para agregar el primero.
                </td>
              </tr>
            ) : (
              producto.requerimientos.map((r, idx) => (
                <tr key={r.id}>
                  <td className="rank-cell">
                    <span className={`rank-badge ${idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? 'bronze' : ''}`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="col-req">
                    <input
                      type="text"
                      value={r.requerimiento}
                      onChange={(e) => handleEditar(r.id, 'requerimiento', e.target.value)}
                    />
                  </td>
                  <td>
                    <select value={r.tipo} onChange={(e) => handleEditar(r.id, 'tipo', e.target.value)}>
                      {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number" min="0" step="1"
                      value={r.usuarios}
                      onChange={(e) => handleEditar(r.id, 'usuarios', e.target.value)}
                    />
                  </td>
                  <td>
                    <select value={r.impacto} onChange={(e) => handleEditar(r.id, 'impacto', Number(e.target.value))}>
                      {ESCALA.map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </td>
                  <td>
                    <select value={r.confianza} onChange={(e) => handleEditar(r.id, 'confianza', Number(e.target.value))}>
                      {ESCALA.map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number" min="0" step="0.5"
                      value={r.estimacion}
                      onChange={(e) => handleEditar(r.id, 'estimacion', e.target.value)}
                    />
                  </td>
                  <td className="priori-cell">
                    <span className={`priori-badge ${idx === 0 ? 'top' : ''}`}>{r.priorizacion}</span>
                  </td>
                  <td>
                    <select
                      value={r.estado}
                      style={{ borderLeft: `4px solid ${COLOR_ESTADO[r.estado]}` }}
                      onChange={(e) => handleEditar(r.id, 'estado', e.target.value)}
                    >
                      {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="icon-btn"
                      title="Eliminar requerimiento"
                      onClick={() => setPorEliminar(r)}
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {porEliminar && (
        <ConfirmModal
          titulo="Eliminar requerimiento"
          mensaje={`¿Seguro que deseas eliminar "${porEliminar.requerimiento || 'este requerimiento'}"? Esta acción no se puede deshacer.`}
          onConfirmar={() => {
            eliminarRequerimiento(producto.id, porEliminar.id);
            setPorEliminar(null);
          }}
          onCancelar={() => setPorEliminar(null)}
        />
      )}
    </div>
  );
}
