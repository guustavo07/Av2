import express from "express";
import jsonwebtoken from "jsonwebtoken";
import { user, PRIVATE_KEY, tokenValidated } from "./auth.js";

const api = express();
api.use(express.json());

api.get('/', (_, res) => res.status(200).json({
  message: 'Rota pública'
}));

api.get('/login', (req, res) => {
  const [, hash] = req.headers.authorization?.split('') || ['', ''];
  const [email, password] = Buffer.from(hash, 'base64').toString().split(':');

  try {
    const correctPassword = email === 'gustavo@gmail.com' && password === "123456";

    if (!correctPassword) {
      return res.status(401).send("Email ou senha inválido");
    }

    const token = jsonwebtoken.sign(
      { user: JSON.stringify(user) },
      PRIVATE_KEY,
      { expiresIn: '60m' }
    );

    return res.status(200).json({ data: { user, token } });
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});

api.use('*', tokenValidated);

api.get('/private', (req, res) => {
  const { user } = req.headers;
  const currentUser = JSON.parse(user);
  
  return res.status(200).json({
    message: 'Rota Privada',
    data: {
      userLogged: currentUser
    }
  });
});

api.listen(3000, () => console.log("Servidor escutando na porta 3000..."));
