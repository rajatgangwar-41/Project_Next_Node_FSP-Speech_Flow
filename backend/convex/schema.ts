import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),

  transcriptions: defineTable({
    userId: v.id("users"),
    text: v.string(),
    audioUrl: v.optional(v.string()),
    title: v.optional(v.string()),
  }).index("by_userId", ["userId"]),
});
