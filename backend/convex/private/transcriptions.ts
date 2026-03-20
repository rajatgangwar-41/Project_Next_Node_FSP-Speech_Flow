import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "../../src/utils/convexHelper";

export const getUserTranscriptions = query({
  args: {
    clerkId: v.string(),
    limit: v.optional(v.number()),
    includeAudioUrl: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx, { clerkId: args.clerkId });

    if (!user) throw new Error("User not found in DB");

    let transcriptions = await ctx.db
      .query("transcriptions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(args.limit ?? 50);

    if (!args.includeAudioUrl) {
      return transcriptions.map(({ audioUrl, ...rest }) => rest);
    }

    return transcriptions;
  },
});

export const createTranscription = mutation({
  args: {
    clerkId: v.string(),
    text: v.string(),
    audioUrl: v.optional(v.string()),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const user = await getCurrentUser(ctx, { clerkId: args.clerkId });

      if (!user) throw new Error("User not found in DB");

      const id = await ctx.db.insert("transcriptions", {
        userId: user._id,
        text: args.text,
        audioUrl: args.audioUrl,
        title: args.title,
      });

      return id;
    } catch (err) {
      return null;
    }
  },
});
