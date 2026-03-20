import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/backend";
import { createClerkClient } from "@clerk/backend";
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY! || "",
});

const http = httpRouter();

http.route({
  path: "/api/webhook/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const event = await validateRequest(request);

    if (!event) {
      return new Response("Error occurred", { status: 400 });
    }

    switch (event.type) {
      case "user.created": {
        const { id, first_name, last_name, image_url, email_addresses } =
          event.data;

        const email = email_addresses?.[0]?.email_address;

        await ctx.runMutation(internal.private.users.createUser, {
          clerkId: id,
          email: email || "",
          firstName: first_name ?? undefined,
          lastName: last_name ?? undefined,
          imageUrl: image_url ?? undefined,
        });

        break;
      }
      default:
        console.log("Ignored Clerk webhook event", event.type);
    }

    return new Response(null, { status: 200 });
  }),
});

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadString = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id") || "",
    "svix-timestamp": req.headers.get("svix-timestamp") || "",
    "svix-signature": req.headers.get("svix-signature") || "",
  };

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  try {
    return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
  } catch (error) {
    console.error("Error verifying webhook event", error);
    return null;
  }
}

export default http;
