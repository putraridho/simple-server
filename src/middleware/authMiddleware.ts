import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(
      token,
      process.env.SALT || "secret",
      (err: any, decodedToken: any) => {
        if (err) {
          console.log(err.message);
          res.status(401).send("Unauthorized");
        } else {
          console.log(decodedToken);
          next();
        }
      }
    );
  } else {
    res.status(401).send("Unauthorized");
  }
}
