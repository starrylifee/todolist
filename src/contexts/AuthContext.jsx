import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // 교사 로그인
  async function loginAsTeacher(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Firestore에서 역할 확인
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    if (userDoc.exists() && userDoc.data().role === 'teacher') {
      return userCredential;
    }
    // 교사가 아니면 로그아웃
    await signOut(auth);
    throw new Error('교사 계정이 아닙니다.');
  }

  // 학생 회원가입
  async function signupAsStudent(email, password, displayName) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Firestore에 사용자 정보 저장
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      displayName,
      role: 'student',
      createdAt: new Date().toISOString(),
    });
    return userCredential;
  }

  // 학생 로그인
  async function loginAsStudent(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    if (userDoc.exists() && userDoc.data().role === 'student') {
      return userCredential;
    }
    await signOut(auth);
    throw new Error('학생 계정이 아닙니다.');
  }

  // 로그아웃
  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        // Firestore에서 역할 가져오기
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    loading,
    loginAsTeacher,
    signupAsStudent,
    loginAsStudent,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
