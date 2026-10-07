import { useState } from 'react';
import { useStore } from './store.js';
import { ChartEstado, ChartTipo } from './components/Charts.jsx';
import { RequerimientosTable } from './components/RequerimientosTable.jsx';
import { ResumenTable } from './components/ResumenTable.jsx';
import { ConfirmModal } from './components/ConfirmModal.jsx';
import { KpiRow } from './components/KpiRow.jsx';

const TAB_RESUMEN = '__resumen__';

export default function App() {
  const productos = useStore((s) => s.productos);
  const crearProducto = useStore((s) => s.crearProducto);
  const renombrarProducto = useStore((s) => s.renombrarProducto);
  const eliminarProducto = useStore((s) => s.eliminarProducto);
  const obtenerResumenGlobal = useStore((s) => s.obtenerResumenGlobal);

  const [tabActiva, setTabActiva] = useState(TAB_RESUMEN);
  const [editandoTab, setEditandoTab] = useState(null);
  const [nombreTemp, setNombreTemp] = useState('');
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const resumen = obtenerResumenGlobal();
  const productoActivo = productos.find((p) => p.id === tabActiva);

  const handleCrearProducto = () => {
    crearProducto();
    // Selecciona la última pestaña creada tras el render.
    setTimeout(() => {
      const nuevos = useStore.getState().productos;
      setTabActiva(nuevos[nuevos.length - 1].id);
    }, 0);
  };

  const iniciarEdicion = (producto) => {
    setEditandoTab(producto.id);
    setNombreTemp(producto.nombre);
  };

  const confirmarEdicion = () => {
    if (editandoTab) renombrarProducto(editandoTab, nombreTemp);
    setEditandoTab(null);
  };

  const handleEliminarProducto = () => {
    const id = productoAEliminar.id;
    eliminarProducto(id);
    if (tabActiva === id) setTabActiva(TAB_RESUMEN);
    setProductoAEliminar(null);
  };

  // Requerimientos a graficar según la pestaña activa.
  const reqsGrafico = tabActiva === TAB_RESUMEN ? resumen : (productoActivo?.requerimientos ?? []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">📈</div>
        <div>
          <h1>Tablero de Priorización de Requerimientos</h1>
          <p>Gestión y seguimiento de requerimientos de producto con priorización automática.</p>
        </div>
      </header>

      {/* ---- Navegación por pestañas ---- */}
      <nav className="tabs">
        <button
          className={`tab tab-resumen ${tabActiva === TAB_RESUMEN ? 'active' : ''}`}
          onClick={() => setTabActiva(TAB_RESUMEN)}
        >
          Resumen General
        </button>

        {productos.map((p) => (
          <button
            key={p.id}
            className={`tab ${tabActiva === p.id ? 'active' : ''}`}
            onClick={() => setTabActiva(p.id)}
            onDoubleClick={() => iniciarEdicion(p)}
            title="Doble clic para renombrar"
          >
            {editandoTab === p.id ? (
              <input
                className="tab-edit-input"
                autoFocus
                value={nombreTemp}
                onChange={(e) => setNombreTemp(e.target.value)}
                onBlur={confirmarEdicion}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmarEdicion();
                  if (e.key === 'Escape') setEditandoTab(null);
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <>
                {p.nombre}
                <span
                  role="button"
                  aria-label={`Eliminar ${p.nombre}`}
                  className="tab-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProductoAEliminar(p);
                  }}
                >
                  ×
                </span>
              </>
            )}
          </button>
        ))}

        <button className="btn btn-add-tab" onClick={handleCrearProducto}>
          + Crear producto
        </button>
      </nav>

      {/* ---- KPIs ---- */}
      <KpiRow requerimientos={reqsGrafico} />

      {/* ---- Gráficos superiores ---- */}
      <section className="charts-row">
        <ChartEstado requerimientos={reqsGrafico} />
        <ChartTipo requerimientos={reqsGrafico} />
      </section>

      {/* ---- Contenido según pestaña ---- */}
      {tabActiva === TAB_RESUMEN ? (
        <ResumenTable requerimientos={resumen} />
      ) : productoActivo ? (
        <RequerimientosTable producto={productoActivo} />
      ) : (
        <div className="table-section">
          <p className="empty-row">Selecciona una pestaña de producto.</p>
        </div>
      )}

      {productoAEliminar && (
        <ConfirmModal
          titulo="Eliminar producto"
          mensaje={`¿Eliminar el producto "${productoAEliminar.nombre}" y todos sus requerimientos? Esta acción no se puede deshacer.`}
          onConfirmar={handleEliminarProducto}
          onCancelar={() => setProductoAEliminar(null)}
        />
      )}
    </div>
  );
}
