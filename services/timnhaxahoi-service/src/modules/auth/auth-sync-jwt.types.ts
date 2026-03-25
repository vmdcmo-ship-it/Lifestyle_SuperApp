/** Payload private + registered sau verify jwt — họ C */
export interface AuthSyncJwtPayload {
  iss?: string;
  aud?: string;
  sub: string;
  purpose?: string;
  email: string;
  phone: string;
  full_name?: string;
  jti?: string;
  iat?: number;
  exp?: number;
}
