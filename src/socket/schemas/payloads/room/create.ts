import { z } from "zod";

export const CreateRoomPayloadSchema = z.object({
    name: z.string(),
    userId: z.string(),
    lat: z.number(),
    lng: z.number(),
    zoom: z.number(),
})

export type CreateRoomPayload = z.infer<typeof CreateRoomPayloadSchema>