import { z } from "zod";

export const JoinRoomPayloadSchema = z.object({
    roomId: z.string(),
    userId: z.string()
})

export type JoinRoomPayload = z.infer<typeof JoinRoomPayloadSchema>