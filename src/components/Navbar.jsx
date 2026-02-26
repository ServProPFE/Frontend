import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
            <Link to="/" className="nav-link">{t('nav.home')}</Link>
          </li>
          <li className="nav-item">
            <Link to="/services" className="nav-link">{t('nav.services')}</Link>
          </li>
          {isAuthenticated && (
            <li className="nav-item">
              <Link to="/my-bookings" className="nav-link">{t('nav.myBookings')}</Link>
            </li>
          )}
        </ul>

        <div className="nav-auth">
          <LanguageSwitcher />
          {isAuthenticated ? (
            <>
              <span className="user-name">{t('nav.hello', { name: user?.name })}</span>
              <button onClick={handleLogout} className="btn-logout">
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">
                {t('nav.login')}
              </Link>
              <Link to="/register" className="btn-register">
                {t('nav.register')}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
