import jsonwebtoken from "jsonwebtoken";

export const PRIVATE_KEY = '1010FFF';
export const user = {
  name: 'Gustavo',
  email: 'gustavo@gmail.com'
};

export function tokenValidated(request, response, next) {
  const [, token] = request.headers.authorization?.split(' ') || ['', ''];
  if (!token) return response.status(401).send("Acesso negado");

  try {
    const payload = jsonwebtoken.verify(token, PRIVATE_KEY);
    const userIdFromToken = typeof payload !== 'string' && payload.user;

    if (!user && !userIdFromToken) {
      return response.status(401).json({ message: 'Token inválido' });
    }

    request.headers.user = payload.user;

    return next();
  } catch (error) {
    console.log(error);
    return response.status(401).json({ message: "Token inválido" });
  }
}
