import { COLOR_ESTADO, COLOR_TIPO } from '../constants.js';

/**
 * Tabla consolidada de solo lectura para el Resumen General.
 * Muestra los requerimientos de todos los productos, ordenados por priorización.
 */
export function ResumenTable({ requerimientos }) {
  return (
    <div className="table-section">
      <div className="table-header">
        <h3>Resumen consolidado de todos los productos</h3>
        <span className="hint">Vista de solo lectura · se actualiza en tiempo real</span>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Requerimiento</th>
              <th>Producto</th>
              <th>Tipo</th>
              <th>Usuarios/Mes</th>
              <th>Impacto</th>
              <th>Confianza</th>
              <th>Est. (h)</th>
              <th>Priorización</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {requerimientos.length === 0 ? (
              <tr>
                <td colSpan={10} className="empty-row">
                  Aún no hay requerimientos en ningún producto.
                </td>
              </tr>
            ) : (
              requerimientos.map((r, idx) => (
                <tr key={r.id}>
                  <td className="rank-cell">
                    <span className={`rank-badge ${idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? 'bronze' : ''}`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td>{r.requerimiento || <em style={{ color: '#94a3b8' }}>(sin nombre)</em>}</td>
                  <td>{r.productoNombre}</td>
                  <td>
                    <span className="badge" style={{ background: COLOR_TIPO[r.tipo] }}>{r.tipo}</span>
                  </td>
                  <td>{r.usuarios}</td>
                  <td>{r.impacto}</td>
                  <td>{r.confianza}</td>
                  <td>{r.estimacion}</td>
                  <td className="priori-cell">
                    <span className={`priori-badge ${idx === 0 ? 'top' : ''}`}>{r.priorizacion}</span>
                  </td>
                  <td>
                    <span className="badge" style={{ background: COLOR_ESTADO[r.estado] }}>{r.estado}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
