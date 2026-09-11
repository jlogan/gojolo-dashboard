/**
 * Create a new organization for the signed-in caller.
 *
 * Thin chat-parity wrapper around Agent-Native's `createOrganization` helper.
 * Does not invent a Jolo org table — membership and active-org settings stay
 * in the framework org system.
 *
 * Usage:
 *   pnpm action create-organization --name="Acme"
 */

import { defineAction, fail } from "@agent-native/core/action";
import { createOrganization } from "@agent-native/core/org";
import { z } from "zod";

export default defineAction({
  description:
    "Create a new organization and add the signed-in caller as an admin member. Activates the new org for the caller. Returns id and name.",
  schema: z.object({
    name: z.string().min(1).describe("Organization name"),
  }),
  run: async (args, ctx) => {
    const email = ctx?.userEmail?.trim();
    if (!email) {
      fail("You must be signed in to create an organization.", {
        errorCode: "unauthenticated",
        statusCode: 401,
      });
    }

    const { id, name } = await createOrganization(args.name, email, "admin");

    return { id, name };
  },
});
