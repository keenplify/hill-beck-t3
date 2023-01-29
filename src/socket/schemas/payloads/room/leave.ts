import { z } from "zod";

export const LeaveRoomPayloadSchema = z.object({
    userId: z.string(),
    roomId: z.string()
})

export type LeaveRoomPayload = z.infer<typeof LeaveRoomPayloadSchema>