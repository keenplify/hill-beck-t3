import type { Server as HTTPServer } from 'http'
import type { Socket as NetSocket } from 'net'
import type { Server as IOServer } from 'socket.io'
import type { NextApiResponse } from 'next'
import type { Socket } from 'socket.io';
import type { JoinRoomPayload } from './schemas/payloads/room/join';
import type { CreateRoomPayload } from './schemas/payloads/room/create';
import type { StartRoomPayload } from './schemas/payloads/room/start';
import type { LeaveRoomPayload } from './schemas/payloads/room/leave';
import type { SetupPayload } from './schemas/payloads/setup/setup';

export type SocketIOEventsMap = {
    // Client Emitters
    'setup': (payload: SetupPayload) => void
    'join-room': (payload: JoinRoomPayload) => void,
    'create-room': (payload: CreateRoomPayload) => void,
    'room-start': (payload: StartRoomPayload) => void,
    'leave-room': (payload: LeaveRoomPayload) => void,
    'lobby': () => void,
    'unlobby': () => void

    // Server Emitters
    'exception': (message: string) => void,
    'message': (message: string) => void,
    'room-created': (roomId: string) => void,
    'room-updated': () => void
}

export interface SocketServer extends HTTPServer {
    io?: SocketIOServer | undefined
}

export interface SocketWithIO extends NetSocket {
    server: SocketServer
}

export interface NextApiResponseWithSocket extends NextApiResponse {
    socket: SocketWithIO
}

export type SocketIOSocket = Socket<SocketIOEventsMap, SocketIOEventsMap, SocketIOEventsMap, unknown>

export type SocketIOServer = IOServer<SocketIOEventsMap, SocketIOEmittersMap>