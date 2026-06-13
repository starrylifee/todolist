import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';

export default function DashboardPage() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // 실시간 구독으로 할 일 목록 불러오기
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'todos'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todoList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTodos(todoList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 할 일 추가 (Create)
  const handleAddTodo = async (title) => {
    try {
      await addDoc(collection(db, 'todos'), {
        title,
        completed: false,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('할 일 추가 실패:', error);
    }
  };

  // 할 일 수정 (Update)
  const handleUpdateTodo = async (id, updates) => {
    try {
      await updateDoc(doc(db, 'todos', id), updates);
    } catch (error) {
      console.error('할 일 수정 실패:', error);
    }
  };

  // 할 일 삭제 (Delete)
  const handleDeleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, 'todos', id));
    } catch (error) {
      console.error('할 일 삭제 실패:', error);
    }
  };

  // 필터링된 할 일 목록
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="dashboard">
      <Header />

      <main className="dashboard-main">
        <div className="dashboard-container">
          <div className="dashboard-stats">
            <div className="stat-card">
              <span className="stat-number">{todos.length}</span>
              <span className="stat-label">전체</span>
            </div>
            <div className="stat-card stat-active">
              <span className="stat-number">{activeCount}</span>
              <span className="stat-label">진행 중</span>
            </div>
            <div className="stat-card stat-done">
              <span className="stat-number">{completedCount}</span>
              <span className="stat-label">완료</span>
            </div>
          </div>

          <TodoForm onAdd={handleAddTodo} />

          <div className="filter-bar">
            <button
              id="filter-all"
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              전체
            </button>
            <button
              id="filter-active"
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              진행 중
            </button>
            <button
              id="filter-completed"
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              완료
            </button>
          </div>

          {loading ? (
            <div className="loading-screen">
              <div className="loading-spinner"></div>
              <p>할 일 목록을 불러오는 중...</p>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📝</span>
              <p>{filter === 'all' ? '아직 할 일이 없습니다.' : `${filter === 'active' ? '진행 중인' : '완료된'} 할 일이 없습니다.`}</p>
              {filter === 'all' && (
                <p className="empty-hint">위 입력란에 새로운 할 일을 추가해보세요!</p>
              )}
            </div>
          ) : (
            <ul className="todo-list">
              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={handleUpdateTodo}
                  onDelete={handleDeleteTodo}
                />
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
