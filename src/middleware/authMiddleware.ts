import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.oid;

  if (token) {
    jwt.verify(
      token,
      "climb or root sick rear will hope effect universe available journey listen pond compare slope break empty unusual kept lead alike likely driven escape",
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
