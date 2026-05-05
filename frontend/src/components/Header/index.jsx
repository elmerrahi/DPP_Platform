import { Link, NavLink, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../../utils/auth.js';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">DPP</span>
          <span className="brand-text">DPP Platform 2030</span>
        </Link>
        <nav className="nav-links">
          {isAuthenticated() ? (
            <button type="button" className="nav-cta" onClick={handleLogout}>
              Log out
            </button>
          ) : (
            <NavLink to="/signin" className="nav-cta">
              Sign In
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
