import type { SocketIOServer } from "../socket";
import { prisma } from "../../server/db";
import type { Room } from "@prisma/client";
import { ROOM_TURN_CHANGED } from "../constants/messages";

export function SetupInstanceManager(server: SocketIOServer) {
    const giveTurn = async (room: Room, userId: string) => {
        const updated = await prisma.room.update({
            where: {
                id: room.id,
            },
            data: {
                currentTurnUserId: userId
            },
            include: {
                currentTurnUser: true
            }
        })

        if (updated.currentTurnUser) {
            server.to(room.id).emit('message', ROOM_TURN_CHANGED)
            server.to(room.id).emit('message', `The turn has been given to ${updated.currentTurnUser.name}`)
        }
    }

    const handleManageInstance = async () => {
        const startedInstances = await prisma.room.findMany({
            where: {
                status: 'Started'
            },
            include: {
                landPartitions: true,
                owner: true,
                users: true
            }
        })

        for (const instance of startedInstances) {
            // Set current turn to owner if no current turn
            if (!instance.currentTurnUserId) await giveTurn(instance, instance.ownerId)

            server.to(instance.id).emit('room-updated')
        }
    }

    setInterval(handleManageInstance, 2500)
}