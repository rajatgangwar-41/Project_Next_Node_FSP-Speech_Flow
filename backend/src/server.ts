import "./env.js";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import transcribeRouter from "./routes/transcribe.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.use("/api/transcribe", transcribeRouter);

// Simple health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    convexUrl: process.env.CONVEX_URL ? "configured" : "missing",
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Convex URL: ${process.env.CONVEX_URL}`);
});
