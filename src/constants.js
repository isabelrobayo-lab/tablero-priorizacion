// Enumeraciones del dominio. Fuente única de verdad para validaciones y dropdowns.

export const TIPOS = ['Incidente', 'Mejora', 'Normativo', 'Obsolescencia TI'];

export const ESTADOS = [
  'En definición',
  'Backlog',
  'En curso',
  'Pruebas QC',
  'Pruebas UAT',
  'PAP',
  'Producción',
];

// Valores seleccionables para Impacto y Nivel de Confianza (0.5 = mínimo, 5 = alto)
export const ESCALA = [0.5, 1, 2, 3, 4, 5];

// Paleta de colores por estado (para gráficos y badges)
export const COLOR_ESTADO = {
  'En definición': '#94a3b8',
  Backlog: '#64748b',
  'En curso': '#3b82f6',
  'Pruebas QC': '#f59e0b',
  'Pruebas UAT': '#eab308',
  PAP: '#a855f7',
  Producción: '#22c55e',
};

// Paleta de colores por tipo
export const COLOR_TIPO = {
  Incidente: '#ef4444',
  Mejora: '#3b82f6',
  Normativo: '#a855f7',
  'Obsolescencia TI': '#f59e0b',
};

/**
 * Calcula la puntuación de priorización.
 * Formula: (Usuarios/Mes * Impacto * Confianza) / Estimación en Horas
 * Devuelve 0 si la estimación es 0 o inválida para evitar división por cero.
 */
export function calcularPriorizacion({ usuarios, impacto, confianza, estimacion }) {
  const u = Number(usuarios) || 0;
  const i = Number(impacto) || 0;
  const c = Number(confianza) || 0;
  const e = Number(estimacion) || 0;
  if (e <= 0) return 0;
  const resultado = (u * i * c) / e;
  return Math.round(resultado * 100) / 100; // 2 decimales
}
