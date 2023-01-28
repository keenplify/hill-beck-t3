import { validatePayload } from "../helpers/validate";
import { JoinRoomPayloadSchema } from "../schemas/payloads/room/join";
import { prisma } from "../../server/db";
import type { SocketIOSocket } from "../socket";
import { JOIN_ROOM_SUCCESSFUL } from "../constants/messages";

export function SetupRoomSocket(socket: SocketIOSocket) {
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

        socket.emit('message', JOIN_ROOM_SUCCESSFUL)
    })
}