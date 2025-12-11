export interface User {
  fullName: string;
  email: string;
  birthDate: string;
  phone: string;
  password: string;
}
export interface AuthResponse {
  success: boolean;
  user: {
    email: string;
    name: string;
  };
}

const users = new Map<string, User>();

export const auth = {
  signup: (data: User): AuthResponse => {
    if (users.has(data.email)) {
      throw new Error("User already exists");
    }
    users.set(data.email, { ...data });
    return {
      success: true,
      user: { email: data.email, name: data.fullName },
    };
  },

  login: (email: string, password: string): AuthResponse => {
    const user = users.get(email);
    if (!user || user.password !== password) {
      throw new Error("Invalid credentials");
    }
    return {
      success: true,
      user: { email: user.email, name: user.fullName },
    };
  },

  resetPassword: (email: string, newPassword: string): { success: boolean } => {
    const user = users.get(email);
    if (!user) {
      throw new Error("User not found");
    }
    user.password = newPassword;
    return { success: true };
  },

  getUser: (email: string): User | undefined => {
    return users.get(email);
  },
};
