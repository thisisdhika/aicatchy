export interface User {
  id: string;
  email?: string;
  authMethod: 'anon' | 'oauth' | 'email';
  profile?: UserProfile;
}

export interface UserProfile {
  name?: string;
  avatar?: string;
  preferences?: Record<string, any>;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token?: string;
  expiresAt?: number;
}