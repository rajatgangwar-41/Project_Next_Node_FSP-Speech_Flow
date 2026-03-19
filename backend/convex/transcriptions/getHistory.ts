import { query } from "../_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    // You can add .filter(q => q.eq(q.field("userId"), ctx.auth.getUserIdentity()?.subject)) later
    return await ctx.db.query("transcriptions").order("desc").take(50); // last 50 – adjust as needed
  },
});
