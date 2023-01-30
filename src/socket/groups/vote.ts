import { validatePayload } from "../helpers/validate";
import { CreatePartitionVotePayloadSchema } from "../schemas/payloads/partition-votes/create";
import type { SocketIOServer, SocketIOSocket } from "../socket";
import { prisma } from "../../server/db";
import { VOTING_FAILED } from "../constants/messages";

export function SetupVoteSocket(socket: SocketIOSocket, server: SocketIOServer) {
    socket.on('create-vote', async (payload) => {
        const { isAgree, partitionId, userId, roomId } = validatePayload(socket, CreatePartitionVotePayloadSchema, payload)

        if (isAgree) {
            await prisma.landPartitionVote.create({
                data: {
                    landPartitionId: partitionId,
                    ownerId: userId
                }
            })
        } else {
            await prisma.landPartition.delete({
                where: {
                    id: partitionId
                }
            })
            await prisma.room.update({
                where: {
                    id: roomId
                },
                data: {
                    currentTurnUserId: null
                }
            })
            server.to(roomId).emit('message', VOTING_FAILED)
        }

        server.to(roomId).emit('room-updated')
    })
}