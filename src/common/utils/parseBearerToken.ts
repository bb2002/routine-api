import { JwtService } from '@nestjs/jwt';

export default function parseBearerToken(
  authorization: string | null | undefined,
) {
  if (authorization && authorization.startsWith('Bearer ')) {
    const accessToken = authorization.split(' ')[1];
    const jwtService = new JwtService();

    try {
      jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET,
      });
    } catch (ex) {
      return null;
    }

    return accessToken;
  }

  return null;
}
