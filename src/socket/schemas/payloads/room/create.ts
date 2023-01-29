import { z } from "zod";

export const CreateRoomPayloadSchema = z.object({
    name: z.string(),
    userId: z.string()
})

export type CreateRoomPayload = z.infer<typeof CreateRoomPayloadSchema>