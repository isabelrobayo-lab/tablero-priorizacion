import { ESTADOS } from '../constants.js';

/**
 * Fila de indicadores clave (KPIs) calculados a partir de los requerimientos visibles.
 */
export function KpiRow({ requerimientos }) {
  const total = requerimientos.length;
  const enProduccion = requerimientos.filter((r) => r.estado === 'Producción').length;
  const enCurso = requerimientos.filter((r) =>
    ['En curso', 'Pruebas QC', 'Pruebas UAT', 'PAP'].includes(r.estado)
  ).length;
  const topPrioridad = total > 0 ? requerimientos[0].priorizacion : 0;

  const kpis = [
    { label: 'Total requerimientos', value: total, sub: `${ESTADOS.length} estados posibles`, accent: '#4f46e5' },
    { label: 'Prioridad más alta', value: topPrioridad, sub: total > 0 ? requerimientos[0].requerimiento || '(sin nombre)' : 'Sin datos', accent: '#059669' },
    { label: 'En ejecución', value: enCurso, sub: 'Curso · QC · UAT · PAP', accent: '#d97706' },
    { label: 'En producción', value: enProduccion, sub: 'Completados', accent: '#0ea5e9' },
  ];

  return (
    <div className="kpi-row">
      {kpis.map((k) => (
        <div className="kpi-card" key={k.label} style={{ '--accent': k.accent }}>
          <div className="kpi-label">{k.label}</div>
          <div className="kpi-value" style={{ color: k.accent }}>{k.value}</div>
          <div className="kpi-sub" title={k.sub}>{k.sub}</div>
        </div>
      ))}
    </div>
  );
}
