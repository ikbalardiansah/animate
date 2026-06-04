import { create } from "zustand";

type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  role?: string;
};

type AuthState = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));