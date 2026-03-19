import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  transcriptions: defineTable({
    userId: v.optional(v.id("users")), // if you add auth later
    text: v.string(),
    audioUrl: v.optional(v.string()), // if you store audio in Convex storage
    createdAt: v.number(),
    title: v.optional(v.string()), // optional short preview
  }).index("by_created", ["createdAt"]),
});
