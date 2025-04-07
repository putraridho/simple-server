import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models";

function handleErrors(err: { [key: string]: any }) {
  console.error(err.message);
  let errors: { [key: string]: any } = {};

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach((e: any) => {
      errors[e.properties.path] = e.properties.message;
    });
  } else {
    errors.message = "Oops, something went wrong";
  }

  return errors;
}

function createToken(id: string, keepMeLoggedIn: boolean) {
  return jwt.sign(
    { id },
    "climb or root sick rear will hope effect universe available journey listen pond compare slope break empty unusual kept lead alike likely driven escape",
    {
      expiresIn: keepMeLoggedIn ? "1y" : "1d",
    }
  );
}

class Auth {
  async signupPost(req: Request, res: Response) {
    const { user_id, password, keepMeLoggedIn } = req.body;

    try {
      await User.create({ user_id, password });

      res.status(201).send("User created successfully");
    } catch (err: any) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  }

  async loginPost(req: Request, res: Response) {
    const { user_id, password, keepMeLoggedIn } = req.body;

    try {
      const user = await User.findOne({
        user_id,
      }).exec();

      if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          const token = createToken(user._id.toString(), keepMeLoggedIn);

          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: keepMeLoggedIn
              ? 365 * 24 * 60 * 60 * 1000
              : 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          });
          res.status(200).json({
            id: user._id,
            user_id: user.user_id,
            token,
          });
          return;
        }
      }
      res.status(404).send("User ID and/or password is not correct");
    } catch (err: any) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  }
}

export default new Auth();
