import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calcularPriorizacion } from './constants.js';

// Generador de IDs simple y suficiente para uso local en el navegador.
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

/**
 * Normaliza un requerimiento: fuerza tipos y recalcula la priorización.
 * La priorización es SIEMPRE derivada, nunca se confía en el valor entrante.
 */
function normalizarRequerimiento(req) {
  const usuarios = Math.max(0, Math.trunc(Number(req.usuarios) || 0));
  const estimacion = Math.max(0, Number(req.estimacion) || 0);
  const impacto = Number(req.impacto) || 0;
  const confianza = Number(req.confianza) || 0;
  const base = {
    id: req.id || uid(),
    requerimiento: String(req.requerimiento ?? '').trim(),
    tipo: req.tipo,
    usuarios,
    impacto,
    confianza,
    estimacion,
    estado: req.estado,
  };
  return { ...base, priorizacion: calcularPriorizacion(base) };
}

// Ordena de mayor a menor priorización (desc).
const ordenarPorPrioridad = (lista) =>
  [...lista].sort((a, b) => b.priorizacion - a.priorizacion);

const estadoInicial = {
  productos: [
    { id: uid(), nombre: 'Producto 1', requerimientos: [] },
  ],
};

export const useStore = create(
  persist(
    (set, get) => ({
      ...estadoInicial,

      // ---- Gestión de productos (pestañas) ----
      crearProducto: (nombre) =>
        set((s) => ({
          productos: [
            ...s.productos,
            { id: uid(), nombre: nombre?.trim() || `Producto ${s.productos.length + 1}`, requerimientos: [] },
          ],
        })),

      renombrarProducto: (productoId, nombre) =>
        set((s) => ({
          productos: s.productos.map((p) =>
            p.id === productoId ? { ...p, nombre: nombre.trim() || p.nombre } : p
          ),
        })),

      eliminarProducto: (productoId) =>
        set((s) => ({
          productos: s.productos.filter((p) => p.id !== productoId),
        })),

      // ---- CRUD de requerimientos ----
      agregarRequerimiento: (productoId, req) =>
        set((s) => ({
          productos: s.productos.map((p) =>
            p.id === productoId
              ? { ...p, requerimientos: ordenarPorPrioridad([...p.requerimientos, normalizarRequerimiento(req)]) }
              : p
          ),
        })),

      actualizarRequerimiento: (productoId, reqId, cambios) =>
        set((s) => ({
          productos: s.productos.map((p) => {
            if (p.id !== productoId) return p;
            const requerimientos = p.requerimientos.map((r) =>
              r.id === reqId ? normalizarRequerimiento({ ...r, ...cambios }) : r
            );
            return { ...p, requerimientos: ordenarPorPrioridad(requerimientos) };
          }),
        })),

      eliminarRequerimiento: (productoId, reqId) =>
        set((s) => ({
          productos: s.productos.map((p) =>
            p.id === productoId
              ? { ...p, requerimientos: p.requerimientos.filter((r) => r.id !== reqId) }
              : p
          ),
        })),

      // ---- Selector derivado: Resumen General (todos los productos) ----
      obtenerResumenGlobal: () => {
        const { productos } = get();
        const todos = productos.flatMap((p) =>
          p.requerimientos.map((r) => ({ ...r, productoNombre: p.nombre, productoId: p.id }))
        );
        return ordenarPorPrioridad(todos);
      },
    }),
    {
      name: 'tablero-priorizacion',
      version: 1,
    }
  )
);
