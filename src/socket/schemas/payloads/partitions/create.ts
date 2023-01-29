import { z } from "zod";

export const PointSchema = z.object({
    x: z.number(),
    y: z.number()
})

export type Point = z.infer<typeof PointSchema>

export const CreatePartitionPayloadSchema = z.object({
    userId: z.string(),
    roomId: z.string(),
    points: z.array(PointSchema)
})



export type CreatePartitionPayload = z.infer<typeof CreatePartitionPayloadSchema>