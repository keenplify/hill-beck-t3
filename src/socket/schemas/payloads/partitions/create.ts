import { z } from "zod";

export const CoordsSchema = z.object({
    lat: z.number(),
    lng: z.number()
})

export type Coord = z.infer<typeof CoordsSchema>

export const CreatePartitionPayloadSchema = z.object({
    userId: z.string(),
    roomId: z.string(),
    coords: z.array(CoordsSchema)
})

export type CreatePartitionPayload = z.infer<typeof CreatePartitionPayloadSchema>