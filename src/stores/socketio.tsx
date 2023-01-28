import { create } from 'zustand'
import io from "socket.io-client";
import type { Socket } from "socket.io-client";
import type { SocketIOEventsMap } from '../socket/socket';
import { toast } from 'react-toastify';


interface SocketIOStore {
    socket: Socket<SocketIOEventsMap, SocketIOEventsMap>,
    latestMessage: string | null
    latestException: object | null
}

export const useSocketIOStore = create<SocketIOStore>((set) => {
    const socket = io()

    socket.on('message', (msg: string) => {
        typeof msg === 'string' && toast(msg)
        set({
            latestMessage: msg
        })
    })

    socket.on('exception', (exception: object) => {
        typeof exception === 'string' && toast(exception, {
            type: 'error'
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