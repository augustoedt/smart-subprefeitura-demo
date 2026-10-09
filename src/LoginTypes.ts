export type UserRole = 'CENTRAL' | 'GESTOR' | 'FUNCIONARIO' | 'ASSISTENTE_SOCIAL' | null;

export interface UserSession {
  role: UserRole;
  subprefeituraId?: string;
  matricula?: string;
}
