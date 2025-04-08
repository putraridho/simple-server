import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models";

function handleErrors(err: { [key: string]: any }) {
  console.error(err.message);
  let errors: { [key: string]: any } = {};

  if (err.code === 11000) {
    if (err.message.includes("user validation failed")) {
      Object.values(err.errors).forEach((e: any) => {
        errors[e.properties.path] = e.properties.message;
      });
      return errors;
    }

    errors.message = err.message;
    return errors;
  }

  errors.message = "Oops, something went wrong";

  return errors;
}

class UserProfile {
  async profileUpdate(req: Request, res: Response) {
    const user = jwt.decode(req.cookies.jwt) as {
      id: string;
      token: string;
      user_id: string;
    };
    try {
      const result = await User.updateOne({ user_id: user.id }, req.body);
      if (result.matchedCount === 0) {
        res.status(404).send("User not found");
      } else {
        res.status(200).send("User updated successfully");
      }
    } catch (err: any) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  }
}

export default new UserProfile();
