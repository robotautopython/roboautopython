import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../App.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const { data } = await axios.post(`${API_URL}/api/auth/login`, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      login(data.access_token, data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao realizar login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />
      <div className="ambient-orb orb-3" />
      
      <div className="auth-box fade-in" style={{
        background: 'rgba(20, 20, 25, 0.7)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '3rem',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center' }}>
          <img src="https://ik.imagekit.io/lflb43qwh/MEU%20ROB%C3%94/01d98a63-915e-4e9e-8098-d118cef3e431.psd%20(1).png" alt="Avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '1rem', border: '2px solid rgba(255,255,255,0.1)' }} />
          <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '600' }}>Bem-vindo de volta</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Entre na sua conta para continuar</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(255, 59, 48, 0.1)', color: '#ff3b30', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <input 
              type="email" 
              placeholder="Seu E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#fff',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Sua Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#fff',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="suggestion-btn"
            style={{ 
              marginTop: '1rem', 
              justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              fontWeight: 600,
              padding: '1rem'
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>Ainda não tem conta? </span>
          <Link to="/register" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Crie uma agora</Link>
        </div>
      </div>
    </div>
  );
}
