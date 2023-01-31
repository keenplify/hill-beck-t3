import type { ReactNode } from "react"
import { JOIN_ROOM_SUCCESSFUL, LEAVE_ROOM_SUCCESSFUL, START_ROOM_SUCCESSFUL } from "../socket/constants/messages";
import { useRouter } from "next/router";
import { useSocketIOStore } from "../stores/socketio";
import { useEffect } from "react";
import { env } from "process";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useThemeStore } from "../stores/theme";
import { api } from "../utils/api";

interface Props {
    children: ReactNode
}

export function MainContainer({ children }: Props) {
    const { socket } = useSocketIOStore()
    const { data: sessionData } = useSession()
    const { refetch } = api.room.currentRoom.useQuery();
    const { theme } = useThemeStore()

    const router = useRouter()

    useEffect(() => {
        void fetch(`${env.NEXT_HOSTNAME ?? ''}/api/socket`)
    }, [])

    useEffect(() => {
        if (sessionData?.user) {
            socket.emit('setup', { userId: sessionData.user.id })
        }
    }, [router, socket, sessionData])

    useEffect(() => {
        const handleMessage = (message: string) => {
            refetch()

            typeof message === 'string' && toast(message, {
                type: 'info',
                theme
            })

            switch (message) {
                case JOIN_ROOM_SUCCESSFUL:
                    router.push('/room')
                    break
                case LEAVE_ROOM_SUCCESSFUL:
                    router.push('/rooms')
                    break
                case START_ROOM_SUCCESSFUL:
                    router.push('/instance')
                    break
            }
        }

        socket.on('message', handleMessage)

        socket.on('exception', (exception) => {
            typeof exception === 'string' && toast(exception, {
                type: 'error',
                theme
            })
        })

        return () => {
            socket.off('message')
            socket.off('exception')
        }
    }, [socket, router, theme])

    return <main className="flex bg-base-100 min-h-[calc(100vh-4rem)] w-full flex-col items-center">
        {children}
    </main>
}