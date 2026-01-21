import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../../utils/api.js';

export default function UserDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getDashboard()
      .then((data) => {
        if (isMounted) {
          setDashboard(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Unable to load your dashboard. Please sign in again.');
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="dashboard">
        <h2>Loading your dashboard...</h2>
      </section>
    );
  }

  if (error) {
    return (
      <section className="dashboard">
        <h2>{error}</h2>
      </section>
    );
  }

  const recent = dashboard?.recent_dpps ?? [];

  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome back, {dashboard.user.name}</h2>
        <p>Your DPP workspace is ready to manage and audit passports.</p>
      </div>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total DPPs</h3>
          <p>{dashboard.dpp_count}</p>
        </div>
        <div className="dashboard-card">
          <h3>Latest Activity</h3>
          <p>{recent.length ? 'Recent DPP updates' : 'No DPPs yet'}</p>
        </div>
        <div className="dashboard-card">
          <h3>Account</h3>
          <p>{dashboard.user.email}</p>
        </div>
        <div className="dashboard-card">
          <h3>Actions</h3>
          <div className="dashboard-actions">
            <Link className="btn btn-primary" to="/dpp/create">
              Create DPP
            </Link>
            <Link className="btn btn-secondary" to="/audit">
              Run Audit
            </Link>
          </div>
        </div>
      </div>
      <div className="dashboard-list">
        {recent.length ? (
          recent.map((item) => (
            <div className="dashboard-item" key={item.id}>
              <div>
                <h4>{item.productName}</h4>
                <span>Product ID: {item.productId}</span>
              </div>
              <span className="pill">Created</span>
            </div>
          ))
        ) : (
          <div className="dashboard-item">
            <div>
              <h4>No passports yet</h4>
              <span>Create your first DPP to see it here.</span>
            </div>
            <span className="pill">Get started</span>
          </div>
        )}
      </div>
    </section>
  );
}
