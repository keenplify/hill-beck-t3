
import { Server } from 'socket.io'
import { SetupInstanceManager } from './groups/instance-loop';
import { SetupRoomSocket } from "./groups/room";
import { SetupVoteSocket } from './groups/vote';
import { validatePayload } from './helpers/validate';
import { SetupPayloadSchema } from './schemas/payloads/setup/setup';
import type { NextApiResponseWithSocket, SocketIOEventsMap } from './socket';


export function initializeSocket(res: NextApiResponseWithSocket) {
    const io = new Server<SocketIOEventsMap, SocketIOEventsMap, SocketIOEventsMap>(res.socket.server)
    res.socket.server.io = io


    io.on('connection', (socket) => {
        socket.on('setup', async (payload) => {
            const { userId } = validatePayload(socket, SetupPayloadSchema, payload)

            await socket.join(userId)
        })

        SetupRoomSocket(socket, io)
        SetupVoteSocket(socket, io)
    })

    SetupInstanceManager(io)

    return io
}