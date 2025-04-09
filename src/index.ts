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
app.use(
  cors({
    origin: "*",
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
