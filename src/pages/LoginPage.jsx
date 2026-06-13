import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAsTeacher, loginAsStudent } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (activeTab === 'teacher') {
        await loginAsTeacher(email, password);
      } else {
        await loginAsStudent(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.message === '교사 계정이 아닙니다.' || err.message === '학생 계정이 아닙니다.'
          ? err.message
          : '로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-icon-large">✓</span>
          </div>
          <h1>Todo Manager</h1>
          <p className="auth-subtitle">할 일 관리 앱에 오신 것을 환영합니다</p>
        </div>

        <div className="auth-tabs">
          <button
            id="tab-student"
            className={`auth-tab ${activeTab === 'student' ? 'active' : ''}`}
            onClick={() => { setActiveTab('student'); setError(''); }}
          >
            🎓 학생
          </button>
          <button
            id="tab-teacher"
            className={`auth-tab ${activeTab === 'teacher' ? 'active' : ''}`}
            onClick={() => { setActiveTab('teacher'); setError(''); }}
          >
            👨‍🏫 교사
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            id="login-submit"
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {activeTab === 'student' && (
          <p className="auth-footer">
            계정이 없으신가요? <Link to="/signup">회원가입</Link>
          </p>
        )}
      </div>
    </div>
  );
}
