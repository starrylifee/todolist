import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="header-logo">
          <span className="logo-icon">✓</span>
          Todo Manager
        </h1>
      </div>
      <div className="header-right">
        <div className="user-profile">
          {currentUser?.photoURL && (
            <img
              className="user-avatar"
              src={currentUser.photoURL}
              alt="프로필"
              referrerPolicy="no-referrer"
            />
          )}
          <span className="user-name">{currentUser?.displayName || currentUser?.email}</span>
        </div>
        <button
          id="logout-button"
          className="btn btn-ghost"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}
