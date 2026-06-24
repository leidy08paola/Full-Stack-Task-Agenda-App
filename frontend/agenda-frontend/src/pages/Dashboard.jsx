import React, { useEffect, useState } from 'react';
import { getTareas, createTarea, buscarTareas, deleteTarea, updateTarea } from '../services/tareaService';
import { logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [busqueda, setBusqueda] = useState('');
  
  // 💡 ESTADOS NUEVOS PARA EL CONTROL DE EDICIÓN
  const [editando, setEditando] = useState(false);
  const [idTareaEditar, setIdTareaEditar] = useState(null);

  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));
  const navigate = useNavigate();

  const cargarTareas = async () => {
    try {
      const data = await getTareas();
      setTareas(data);
    } catch (error) {
      console.error("Error al cargar tareas", error);
    }
  };

  useEffect(() => {
    cargarTareas();
  }, []);

  // Maneja tanto la creación como la actualización
  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        // Si está en modo edición, llama al PUT
        await updateTarea(idTareaEditar, { 
          titulo, 
          descripcion, 
          fecha_vencimiento: fechaVencimiento 
        });
        alert("Tarea actualizada con éxito");
      } else {
        // Si no, crea una nueva tarea normal
        await createTarea({ titulo, descripcion, fecha_vencimiento: fechaVencimiento });
      }
      
      // Limpiamos el formulario y los estados de edición
      limpiarFormulario();
      cargarTareas();
    } catch (error) {
      alert("Error al procesar la tarea");
    }
  };

  // Activa el modo de edición cargando los datos en el formulario
  const activarEdicion = (tarea) => {
    setEditando(true);
    setIdTareaEditar(tarea.id);
    setTitulo(tarea.titulo);
    setDescripcion(tarea.descripcion);
    // Formatear la fecha a YYYY-MM-DD para que el input type="date" la reconozca
    setFechaVencimiento(tarea.fecha_vencimiento ? tarea.fecha_vencimiento.substring(0, 10) : '');
  };

  const limpiarFormulario = () => {
    setTitulo('');
    setDescripcion('');
    setFechaVencimiento('');
    setEditando(false);
    setIdTareaEditar(null);
  };

  const handleBuscar = async (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    if (valor.trim() === '') {
      cargarTareas();
    } else {
      try {
        const data = await buscarTareas(valor);
        setTareas(data);
      } catch (error) {
        console.error("Error en la búsqueda", error);
      }
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta tarea?")) {
      try {
        await deleteTarea(id);
        if (idTareaEditar === id) limpiarFormulario(); // Por si eliminan la que están editando
        cargarTareas();
      } catch (error) {
        alert("Error al eliminar la tarea");
      }
    }
  };

  const handleSalir = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h2>📋 Mi Agenda de Tareas</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            Bienvenido, <strong>{usuarioLogueado?.nombre || 'Usuario'}</strong> ({usuarioLogueado?.rol || 'Sin Rol'})
          </p>
        </div>
        <button onClick={handleSalir} style={styles.logoutBtn}>Cerrar Sesión</button>
      </header>

      <div style={styles.searchContainer}>
        <input 
          type="text" 
          placeholder="🔍 Buscar tarea..." 
          value={busqueda}
          onChange={handleBuscar}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.content}>
        {/* FORMULARIO DINÁMICO (CAMBIA SEGÚN EL MODO) */}
        <form onSubmit={handleGuardar} style={styles.form}>
          <h3>{editando ? '✏️ Editar Tarea' : 'Nueva Tarea'}</h3>
          <input 
            type="text" 
            placeholder="Título" 
            value={titulo} 
            onChange={(e) => setTitulo(e.target.value)} 
            required 
            style={styles.input}
          />
          <textarea 
            placeholder="Descripción" 
            value={descripcion} 
            onChange={(e) => setDescripcion(e.target.value)} 
            style={styles.textarea}
          />
          <input 
            type="date" 
            value={fechaVencimiento} 
            onChange={(e) => setFechaVencimiento(e.target.value)} 
            style={styles.input}
          />
          <button 
            type="submit" 
            style={editando ? styles.updateBtn : styles.submitBtn}
          >
            {editando ? 'Actualizar Cambios' : 'Guardar Tarea'}
          </button>
          
          {editando && (
            <button 
              type="button" 
              onClick={limpiarFormulario} 
              style={styles.cancelBtn}
            >
              Cancelar Edición
            </button>
          )}
        </form>

        <div style={styles.list}>
          <h3>Mis Tareas</h3>
          {tareas.length === 0 ? (
            <p>No hay tareas pendientes.</p>
          ) : (
            tareas.map((tarea) => (
              <div key={tarea.id} style={styles.card}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{tarea.titulo}</h4>
                  <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>{tarea.descripcion}</p>
                  <small style={{ color: '#999' }}>Vence: {tarea.fecha_vencimiento ? new Date(tarea.fecha_vencimiento).toLocaleDateString() : 'Sin fecha'}</small>
                </div>
                <div style={styles.actions}>
                  {/* BOTÓN PARA EDITAR */}
                  <button onClick={() => activarEdicion(tarea)} style={styles.editBtn}>✏️</button>
                  {/* BOTÓN PARA ELIMINAR */}
                  <button onClick={() => handleEliminar(tarea.id)} style={styles.deleteBtn}>🗑️</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ccc', paddingBottom: '10px', marginBottom: '20px' },
  logoutBtn: { backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  searchContainer: { marginBottom: '20px' },
  searchInput: { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' },
  content: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' },
  form: { backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: 'fit-content' },
  input: { width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc', height: '80px', boxSizing: 'border-box', resize: 'none' },
  submitBtn: { width: '100%', backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  updateBtn: { width: '100%', backgroundColor: '#ffc107', color: 'black', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  cancelBtn: { width: '100%', backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', marginTop: '5px' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  card: { backgroundColor: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #eee', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  actions: { display: 'flex', gap: '10px' },
  editBtn: { backgroundColor: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', padding: '5px' },
  deleteBtn: { backgroundColor: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', padding: '5px' }
};

export default Dashboard;