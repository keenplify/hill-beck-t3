import { z } from "zod";

export const StartRoomPayloadSchema = z.object({
    roomId: z.string(),
})

export type StartRoomPayload = z.infer<typeof StartRoomPayloadSchema>