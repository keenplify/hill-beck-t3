import { create } from 'zustand'
import io from "socket.io-client";
import type { Socket } from "socket.io-client";
import type { SocketIOEventsMap } from '../socket/socket';
import { toast } from 'react-toastify';


interface SocketIOStore {
    socket: Socket<SocketIOEventsMap, SocketIOEventsMap>,
    latestMessage: string | null
    latestException: string | null
}

export const useSocketIOStore = create<SocketIOStore>((set) => {
    const socket = io() as Socket<SocketIOEventsMap, SocketIOEventsMap>

    socket.on('message', (msg: string) => {
        typeof msg === 'string' && toast(msg, {
            type: 'info',
            theme: 'dark'
        })
        set({
            latestMessage: msg
        })
    })

    socket.on('exception', (exception) => {
        typeof exception === 'string' && toast(exception, {
            type: 'error',
            theme: 'dark'
        })

        set({
            latestException: exception
        })
    })

    return {
        socket,
        latestMessage: null,
        latestException: null
    }
})