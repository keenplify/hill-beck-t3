import { z } from "zod";

export const CreatePartitionVotePayloadSchema = z.object({
    isAgree: z.boolean(),
    partitionId: z.string(),
    userId: z.string(),
    roomId: z.string()
})



export type CreatePartitionVotePayload = z.infer<typeof CreatePartitionVotePayloadSchema>