import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login({ email, password });
      // Si el login es correcto, se va al panel de control
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>🔑 Iniciar Sesión</h2>
        
        {error && <p style={styles.error}>{error}</p>}
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Correo Electrónico:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={styles.input}
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Contraseña:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={styles.input}
            placeholder="********"
          />
        </div>

        <button type="submit" style={styles.button}>Ingresar</button>

        <p style={styles.linkText}>
          ¿No tienes cuenta? <Link to="/registro" style={styles.link}>Regístrate aquí</Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f6f9' },
  form: { padding: '30px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '320px' },
  title: { textAlign: 'center', marginBottom: '20px', color: '#333' },
  inputGroup: { marginBottom: '15px', display: 'flex', flexDirection: 'column' },
  label: { fontWeight: 'bold', marginBottom: '5px', color: '#555', fontSize: '14px' },
  input: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' },
  button: { width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' },
  error: { color: 'red', fontSize: '14px', marginBottom: '10px', textAlign: 'center', backgroundColor: '#ffe6e6', padding: '5px', borderRadius: '4px' },
  linkText: { textAlign: 'center', marginTop: '15px', fontSize: '14px', color: '#666' },
  link: { color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }
};

export default Login;