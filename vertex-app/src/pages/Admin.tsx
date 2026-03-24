import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface PlanRequest {
  id: string;
  user_id: string;
  plan_name: string;
  status: string;
  created_at: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  plan: string;
  interactions_limit: number;
  interactions_used: number;
}

export function Admin() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<PlanRequest[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [tab, setTab] = useState<'requests'|'users'>('requests');

  useEffect(() => {
    if (!token || !user?.is_admin) {
      navigate('/');
    }
  }, [token, user, navigate]);

  const fetchData = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const [reqsRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/requests`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setRequests(reqsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token && user?.is_admin) {
      fetchData();
    }
  }, [token, user]);

  const handleApprove = async (id: string) => {
    if (!confirm('Você já cobrou via PIX? Tem certeza da aprovação? Isso adicionará as interações ao usuário instantaneamente.')) return;
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      await axios.post(`${API_URL}/api/admin/requests/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Erro ao aprovar');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      await axios.post(`${API_URL}/api/admin/requests/${id}/reject`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateLimit = async (userId: string, currentLimit: number) => {
    const newLimit = prompt('Novo limite de interações para o usuário:', currentLimit.toString());
    if (newLimit && !isNaN(parseInt(newLimit))) {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        await axios.put(`${API_URL}/api/admin/users/${userId}/interactions`, 
          { interactions_limit: parseInt(newLimit) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="app-container" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
      <div className="ambient-orb orb-1" />
      <div style={{ zIndex: 10, maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#fff', fontSize: '2rem' }}>Painel Administrativo</h1>
          <button className="suggestion-btn" onClick={() => navigate('/')}>Sair</button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => setTab('requests')}
            style={{ 
              padding: '0.75rem 1.5rem', 
              borderRadius: '8px', 
              background: tab === 'requests' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)',
              border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 600
            }}>
            Solicitações de Planos
          </button>
          <button 
            onClick={() => setTab('users')}
            style={{ 
              padding: '0.75rem 1.5rem', 
              borderRadius: '8px', 
              background: tab === 'users' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)',
              border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 600
            }}>
            Usuários
          </button>
        </div>

        {tab === 'requests' && (
          <div style={{ background: 'rgba(20,20,25,0.7)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
             <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
                <thead style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                  <tr>
                    <th style={{ padding: '1rem' }}>Plano</th>
                    <th style={{ padding: '1rem' }}>Usuário Referência (ID)</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{r.plan_name}</td>
                      <td style={{ padding: '1rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{r.user_id}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem',
                          background: r.status === 'pending' ? 'rgba(255, 193, 7, 0.2)' : 
                                      r.status === 'approved' ? 'rgba(52, 199, 89, 0.2)' : 'rgba(255, 59, 48, 0.2)',
                          color: r.status === 'pending' ? '#ffc107' : 
                                 r.status === 'approved' ? '#34c759' : '#ff3b30'
                        }}>
                          {r.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                        {r.status === 'pending' && (
                          <>
                            <button onClick={() => handleApprove(r.id)} style={{ background: '#34c759', border: 'none', color: '#fff', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Aprovar (PIX Ok)</button>
                            <button onClick={() => handleReject(r.id)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Rejeitar</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && (
                    <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Nenhuma solicitação encontrada.</td></tr>
                  )}
                </tbody>
             </table>
          </div>
        )}

        {tab === 'users' && (
          <div style={{ background: 'rgba(20,20,25,0.7)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
             <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
                <thead style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                  <tr>
                    <th style={{ padding: '1rem' }}>Nome</th>
                    <th style={{ padding: '1rem' }}>Email</th>
                    <th style={{ padding: '1rem' }}>Plano</th>
                    <th style={{ padding: '1rem' }}>Uso</th>
                    <th style={{ padding: '1rem' }}>Limite</th>
                    <th style={{ padding: '1rem' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem' }}>{u.name}</td>
                      <td style={{ padding: '1rem' }}>{u.email}</td>
                      <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{u.plan}</td>
                      <td style={{ padding: '1rem' }}>{u.interactions_used}</td>
                      <td style={{ padding: '1rem' }}>{u.interactions_limit}</td>
                      <td style={{ padding: '1rem' }}>
                        <button 
                          onClick={() => handleUpdateLimit(u.id, u.interactions_limit)}
                          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                          Editar Limite
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        )}

      </div>
    </div>
  );
}
