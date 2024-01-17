import AuthUser from "../../types/UserTypes";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  userData: AuthUser;
  id: string;
  password?: string;
  login: string;
  email: string;
  loginOrEmai?: string;
}
