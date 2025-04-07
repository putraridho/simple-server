import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { authRoutes } from "./routes";

const app = express();
const PORT = 8000;

// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});
app.use(authRoutes);

const dbURI = process.env.DB_URI || "mongodb://localhost:27017/mydb";
mongoose
  .connect(dbURI)
  .then((result) =>
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    })
  )
  .catch((err) => console.error(err));
