import type { SocketIOServer } from "../socket";
import { prisma } from "../../server/db";
import type { Room, User } from "@prisma/client";
import { ROOM_TURN_CHANGED, VOTING_SUCCESS } from "../constants/messages";

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
            return updated.currentTurnUser
        }
    }

    const endTurn = async (room: Room) => {
        await prisma.room.update({
            where: {
                id: room.id
            },
            data: {
                currentTurnUserId: null
            }
        })
    }

    const determineTurn = async (room: Room & {
        users: User[]
    }) => {
        for (const user of room.users) {
            const land = await prisma.landPartition.findFirst({
                where: {
                    roomId: room.id,
                    ownerId: user.id,
                }
            })

            if (!land) return user
        }
    }

    const handleManageInstance = async () => {
        const startedInstances = await prisma.room.findMany({
            where: {
                status: 'Started'
            },
            include: {
                landPartitions: {
                    include: {
                        votes: true
                    }
                },
                owner: true,
                users: true
            }
        })

        for (const instance of startedInstances) {
            // Set current turn to owner if no current turn
            if (!instance.currentTurnUserId) {
                const possibleTurnUser = await determineTurn(instance)

                if (!possibleTurnUser) {
                    await prisma.room.update({
                        where: {
                            id: instance.id
                        },
                        data: {
                            status: 'Done'
                        }
                    })

                    server.to(instance.id).emit('instance-ended')
                }
                else {
                    await giveTurn(instance, possibleTurnUser?.id)
                    server.to(instance.id).emit('room-updated')
                }
            }
            else {
                // Check if votes are enough
                const playerCount = instance.users.length
                const currentVotes = (await prisma.landPartitionVote.findMany({
                    where: {
                        landPartition: {
                            room: {
                                status: 'Started',
                                id: instance.id
                            },
                            ownerId: instance.currentTurnUserId
                        },
                    }
                })).length

                if (playerCount == currentVotes) {
                    server.to(instance.id).emit('message', VOTING_SUCCESS)
                    endTurn(instance)
                }

                server.to(instance.id).emit('room-updated')
            }
        }
    }

    setInterval(handleManageInstance, 2500)
}