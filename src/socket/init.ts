
import { Server } from 'socket.io'
import { SetupRoomSocket } from "./groups/room";
import type { NextApiResponseWithSocket, SocketIOEventsMap } from './socket';


export function initializeSocket(res: NextApiResponseWithSocket) {
    const io = new Server<SocketIOEventsMap>(res.socket.server)
    res.socket.server.io = io

    io.on('connection', (socket) => {
        SetupRoomSocket(socket)
    })

    return io
}