import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
}

const savedToken = localStorage.getItem('toefl_token');
const savedUser = localStorage.getItem('toefl_user');

export const useAuthStore = create<AuthState>((set) => ({
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken,
  isAuthenticated: !!savedToken,

  setAuth: (user, token) => {
    localStorage.setItem('toefl_token', token);
    localStorage.setItem('toefl_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  updateUser: (user) => {
    localStorage.setItem('toefl_user', JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    localStorage.removeItem('toefl_token');
    localStorage.removeItem('toefl_user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
