import type { Server as HTTPServer } from 'http'
import type { Socket as NetSocket } from 'net'
import type { Server as IOServer } from 'socket.io'
import type { NextApiResponse } from 'next'
import type { Socket } from 'socket.io';
import type { DefaultEventsMap } from 'socket.io/dist/typed-events';

export type SocketIOEventsMap = {
    'join-room': (payload: JoinRoomPayload) => void,
    'exception': any,
    'message': any
}

export interface SocketServer extends HTTPServer {
    io?: IOServer<SocketIOEventsMap> | undefined
}

export interface SocketWithIO extends NetSocket {
    server: SocketServer
}

export interface NextApiResponseWithSocket extends NextApiResponse {
    socket: SocketWithIO
}

export type SocketIOSocket = Socket<SocketIOEventsMap, SocketIOEventsMap, DefaultEventsMap, unknown>
