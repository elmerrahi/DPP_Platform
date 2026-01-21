import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">DPP</span>
          <span className="brand-text">DPP Platform 2030</span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/signin" className="nav-cta">
            Sign In
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
