import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../App.css';

export function Plans() {
  const { token, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Redireciona se não logado
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const requestPlan = async (planName: string) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      await axios.post(
        `${API_URL}/api/plans/request`,
        { plan_name: planName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(`Solicitação do plano ${planName.toUpperCase()} enviada com sucesso! O Administrador entrará em contato.`);
      await refreshUser();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao solicitar plano');
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    { id: 'start', name: 'Start', price: 'R$ 99,00', interactions: 50 },
    { id: 'grow', name: 'Grow', price: 'R$ 199,00', interactions: 110 },
    { id: 'premium', name: 'Premium', price: 'R$ 299,00', interactions: 200 }
  ];

  return (
    <div className="app-container" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />
      
      <div style={{ textAlign: 'center', marginBottom: '3rem', zIndex: 10 }}>
        <h1 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 700 }}>Escolha seu Plano</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem', fontSize: '1.1rem' }}>Desbloqueie interações com o Robot auto Python</p>
      </div>

      {success && (
        <div style={{ background: 'rgba(52, 199, 89, 0.1)', color: '#34c759', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', zIndex: 10, textAlign: 'center', maxWidth: '600px' }}>
          {success}
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(255, 59, 48, 0.1)', color: '#ff3b30', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', zIndex: 10, textAlign: 'center', maxWidth: '600px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1000px', zIndex: 10 }}>
        {plans.map((p) => (
          <div key={p.id} className="portfolio-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.5rem' }}>{p.name}</h2>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '1.5rem' }}>{p.price}<span style={{fontSize:'1rem', color:'rgba(255,255,255,0.5)', fontWeight:400}}>/mês</span></div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', width: '100%', color: 'rgba(255,255,255,0.8)' }}>
              <li style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Interações</span>
                <strong>{p.interactions}</strong>
              </li>
              <li style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Suporte</span>
                <strong>Email</strong>
              </li>
            </ul>

            <button 
              className="suggestion-btn" 
              onClick={() => requestPlan(p.id)}
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '1rem', background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)' }}
            >
              Solicitar Ativação
            </button>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '3rem', zIndex: 10 }}>
        <button className="suggestion-btn" onClick={() => navigate('/')}>Voltar para o Chat</button>
      </div>
    </div>
  );
}
