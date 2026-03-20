import { QueryCtx } from "../../convex/_generated/server.js";

export async function getCurrentUser(
  ctx: QueryCtx,
  { clerkId }: { clerkId: string },
) {
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
    .unique();
}
