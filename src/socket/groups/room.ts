import { validatePayload } from "../helpers/validate";
import { JoinRoomPayloadSchema } from "../schemas/payloads/room/join";
import { prisma } from "../../server/db";
import type { SocketIOServer, SocketIOSocket } from "../socket";
import { JOIN_ROOM_SUCCESSFUL, LEAVE_ROOM_SUCCESSFUL, START_ROOM_SUCCESSFUL } from "../constants/messages";
import { CreateRoomPayloadSchema } from "../schemas/payloads/room/create";
import { StartRoomPayloadSchema } from "../schemas/payloads/room/start";
import { LeaveRoomPayloadSchema } from "../schemas/payloads/room/leave";
import { CreatePartitionPayloadSchema } from "../schemas/payloads/partitions/create";

export function SetupRoomSocket(socket: SocketIOSocket, server: SocketIOServer) {
    socket.on('join-room', async (data: unknown) => {
        const { userId, roomId } = validatePayload(socket, JoinRoomPayloadSchema, data)

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                currentRoomId: roomId
            }
        })

        await socket.join(roomId)
        await socket.leave('lobby')

        server.to(userId).emit('message', JOIN_ROOM_SUCCESSFUL)
        server.to(roomId).emit('room-updated')
    })

    socket.on('create-room', async (payload) => {
        const { name, userId } = validatePayload(socket, CreateRoomPayloadSchema, payload)

        const room = await prisma.room.create({
            data: {
                name,
                ownerId: userId
            }
        })

        await socket.join('lobby')
        server.to('lobby').emit('room-created', room.id)
    })

    socket.on('room-start', async (payload) => {
        const { roomId } = validatePayload(socket, StartRoomPayloadSchema, payload)

        await prisma.room.update({
            where: {
                id: roomId
            },
            data: {
                status: 'Started'
            }
        })

        server.to(roomId).emit('message', START_ROOM_SUCCESSFUL)
    })

    socket.on('leave-room', async (payload) => {
        const { userId, roomId } = validatePayload(socket, LeaveRoomPayloadSchema, payload)

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                currentRoomId: null
            }
        })

        await socket.leave(roomId)
        await socket.join('lobby')
        server.to(roomId).emit('room-updated')
        server.to(userId).emit('message', LEAVE_ROOM_SUCCESSFUL)
    })

    socket.on('lobby', () => socket.join('lobby'))
    socket.on('unlobby', () => socket.leave('lobby'))

    socket.on('create-partition', async (payload) => {
        const { points, userId, roomId } = validatePayload(socket, CreatePartitionPayloadSchema, payload)

        const partition = await prisma.landPartition.create({
            data: {
                edges: JSON.stringify(points),
                isActive: false,
                ownerId: userId,
                roomId
            }
        })

        server.to(roomId).emit('initiate-vote', partition.id)
    })
}