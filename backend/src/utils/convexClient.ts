import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api.js";

const convexUrl = process.env.CONVEX_URL;

if (!convexUrl) {
  throw new Error("CONVEX_URL not set in .env");
}

export const convex = new ConvexHttpClient(convexUrl);

export { api };
