import { create } from 'zustand'
import io from "socket.io-client";
import type { Socket } from "socket.io-client";
import type { SocketIOEventsMap } from '../socket/socket';
interface SocketIOStore {
    socket: Socket<SocketIOEventsMap, SocketIOEventsMap>,
}

export const useSocketIOStore = create<SocketIOStore>(() => {
    const socket = io() as Socket<SocketIOEventsMap, SocketIOEventsMap>

    return {
        socket,
    }
})