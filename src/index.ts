import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { authRoutes, userProfileRoutes } from "./routes";

const app = express();
const PORT = 8080;

// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());
var whitelist = [
  "https://convertium-monorepo.vercel.app/login",
  "http://localhost:3000",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});
app.use(authRoutes);
app.use(userProfileRoutes);

const dbURI =
  "mongodb+srv://putraridho:123456qwerty@cluster0.fxze0ox.mongodb.net/example";
mongoose
  .connect(dbURI)
  .then((result) =>
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    })
  )
  .catch((err) => console.error(err));
