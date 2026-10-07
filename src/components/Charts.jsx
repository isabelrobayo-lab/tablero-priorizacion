import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid,
} from 'recharts';
import { ESTADOS, TIPOS, COLOR_ESTADO, COLOR_TIPO } from '../constants.js';

const tooltipStyle = {
  background: '#1e293b',
  border: '1px solid #334155',
  borderRadius: 8,
  color: '#e2e8f0',
};

/**
 * Gráfico 1: Distribución por Estado (dona con conteo por fase del ciclo de vida).
 */
export function ChartEstado({ requerimientos }) {
  const data = ESTADOS.map((estado) => ({
    name: estado,
    value: requerimientos.filter((r) => r.estado === estado).length,
  })).filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="chart-card">
        <h3>📊 Distribución por Estado</h3>
        <p className="chart-desc">Requerimientos en cada fase del ciclo de vida</p>
        <div className="chart-empty">
          <span className="icon">📭</span>
          Sin datos para mostrar
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3>📊 Distribución por Estado</h3>
      <p className="chart-desc">Requerimientos en cada fase del ciclo de vida</p>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
            label={(e) => `${e.value}`}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLOR_ESTADO[entry.name]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Gráfico 2: Matriz de Impacto/Priorización por Tipo.
 * Barras agrupadas: cantidad de requerimientos y priorización total acumulada por tipo.
 */
export function ChartTipo({ requerimientos }) {
  const data = TIPOS.map((tipo) => {
    const items = requerimientos.filter((r) => r.tipo === tipo);
    const prioridadTotal = items.reduce((acc, r) => acc + r.priorizacion, 0);
    return {
      name: tipo,
      cantidad: items.length,
      priorizacion: Math.round(prioridadTotal * 100) / 100,
    };
  }).filter((d) => d.cantidad > 0);

  if (data.length === 0) {
    return (
      <div className="chart-card">
        <h3>🎯 Impacto / Priorización por Tipo</h3>
        <p className="chart-desc">Cantidad y priorización acumulada por tipo de requerimiento</p>
        <div className="chart-empty">
          <span className="icon">📭</span>
          Sin datos para mostrar
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3>🎯 Impacto / Priorización por Tipo</h3>
      <p className="chart-desc">Cantidad y priorización acumulada por tipo de requerimiento</p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
          <Bar dataKey="cantidad" name="Cantidad" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLOR_TIPO[entry.name]} />
            ))}
          </Bar>
          <Bar dataKey="priorizacion" name="Priorización total" fill="#22c55e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
