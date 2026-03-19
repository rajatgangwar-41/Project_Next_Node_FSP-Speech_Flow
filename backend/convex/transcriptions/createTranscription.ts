import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    text: v.string(),
    audioUrl: v.optional(v.string()),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("transcriptions", {
      text: args.text,
      audioUrl: args.audioUrl,
      title: args.title,
      createdAt: Date.now(),
    });
    return id;
  },
});
