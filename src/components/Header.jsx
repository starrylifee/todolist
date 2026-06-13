import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const roleBadgeText = userRole === 'teacher' ? '교사' : '학생';

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="header-logo">
          <span className="logo-icon">✓</span>
          Todo Manager
        </h1>
      </div>
      <div className="header-right">
        <span className="role-badge" data-role={userRole}>
          {roleBadgeText}
        </span>
        <span className="user-email">{currentUser?.email}</span>
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
