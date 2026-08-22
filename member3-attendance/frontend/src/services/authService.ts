import api from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
}

interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await api.post("/auth/login", { email, password });

    localStorage.setItem("dayflow_token", res.data.token);
    localStorage.setItem("dayflow_user", JSON.stringify(res.data.user));

    return res.data;
  },

  async getMe(): Promise<{ success: boolean; user: User }> {
  const res = await api.get("/auth/me");
  return {
    success: true,
    user: res.data.user,
  };
},

  logout() {
    localStorage.removeItem("dayflow_token");
    localStorage.removeItem("dayflow_user");
  },

  getCurrentUser(): User | null {
    const user = localStorage.getItem("dayflow_user");
    return user ? JSON.parse(user) : null;
  },

  getToken(): string | null {
    return localStorage.getItem("dayflow_token");
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("dayflow_token");
  },
};