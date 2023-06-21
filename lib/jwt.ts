import jwt, { JwtPayload } from "jsonwebtoken";

interface SignOption {
  expiresIn?: string | number;
}

const DEFAULT_SIGN_OPTION: SignOption = {
  expiresIn: "30d",
};

export function signJwtAccessToken(
  payload: JwtPayload,
  options: SignOption = DEFAULT_SIGN_OPTION
) {
  const jwt_key = process.env.NEXTAUTH_SECRET;
  const token = jwt.sign(payload, jwt_key!, options);
  return token;
}

export function verifyJwt(token: string) {
  try {
    const jwt_key = process.env.NEXTAUTH_SECRET;
    const decoded = jwt.verify(token, jwt_key!);
    return decoded as JwtPayload;
  } catch (error) {
    console.log(error);
    return null;
  }
}
