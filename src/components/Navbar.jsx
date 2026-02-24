import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          ServPro
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Accueil</Link>
          </li>
          <li className="nav-item">
            <Link to="/services" className="nav-link">Services</Link>
          </li>
          {isAuthenticated && (
            <li className="nav-item">
              <Link to="/my-bookings" className="nav-link">Mes Réservations</Link>
            </li>
          )}
        </ul>

        <div className="nav-auth">
          {isAuthenticated ? (
            <>
              <span className="user-name">Bonjour, {user?.name}</span>
              <button onClick={handleLogout} className="btn-logout">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">
                Connexion
              </Link>
              <Link to="/register" className="btn-register">
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
