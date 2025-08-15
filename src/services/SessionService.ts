import { httpClient } from './utils/httpClient';

interface SignInResponse {
  accessToken: string;
  session: string;
}

interface SignInDTO {
  email: string;
  password: string;
}

interface RefreshTokenResponse {
  accessToken: string;
  session: string;
}

interface RefreshTokenDTO {
  session: string;
}

export class SessionService {
  static async signIn({ email, password }: SignInDTO): Promise<SignInResponse> {
    const { data } = await httpClient.post('/sessions/sign-in', {
      email,
      password,
    });

    return data;
  }

  static async refreshToken({
    session,
  }: RefreshTokenDTO): Promise<RefreshTokenResponse> {
    const { data } = await httpClient.post('/sessions/refresh-token', {
      session,
    });

    return data;
  }
}
