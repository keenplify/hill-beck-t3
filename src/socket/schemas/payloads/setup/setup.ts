import { z } from "zod";

export const SetupPayloadSchema = z.object({
    userId: z.string(),
})

export type SetupPayload = z.infer<typeof SetupPayloadSchema>