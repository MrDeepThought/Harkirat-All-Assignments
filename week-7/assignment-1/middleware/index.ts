export { };
import jwt, { Secret } from "jsonwebtoken";
import { Response, Request, RequestHandler, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();
export const SECRET: Secret = process.env.SECRET === undefined ? 'SECr3t': process.env.SECRET;

export const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      if (typeof user === 'object') req.headers.userId = user?.id;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
