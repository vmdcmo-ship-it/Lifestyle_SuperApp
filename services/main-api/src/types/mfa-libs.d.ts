declare module 'speakeasy' {
  export function generateSecret(opts?: {
    name?: string;
    length?: number;
  }): {
    ascii: string;
    otpauth_url?: string;
    base32: string;
  };

  interface TotpWithVerify {
    (opts: { secret: string; encoding?: string }): string;
    verify(opts: {
      secret: string;
      encoding?: string;
      token: string;
      window?: number;
    }): boolean;
  }
  export const totp: TotpWithVerify;

  export function verify(opts: {
    secret: string;
    encoding?: string;
    token: string;
    window?: number;
  }): boolean;
}

declare module 'qrcode' {
  export function toDataURL(url: string): Promise<string>;
}
