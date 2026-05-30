export interface AuthSession {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}
