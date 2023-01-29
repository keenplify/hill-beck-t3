import type { ReactNode } from "react"
import { JOIN_ROOM_SUCCESSFUL, LEAVE_ROOM_SUCCESSFUL, START_ROOM_SUCCESSFUL } from "../socket/constants/messages";
import { useRouter } from "next/router";
import { useSocketIOStore } from "../stores/socketio";
import { useEffect } from "react";
import { env } from "process";
import { useSession } from "next-auth/react";

interface Props {
    children: ReactNode
}

export function MainContainer({ children }: Props) {
    const { socket } = useSocketIOStore()
    const { data: sessionData } = useSession();

    const router = useRouter()

    useEffect(() => {
        void fetch(`${env.NEXT_HOSTNAME ?? ''}/api/socket`)
    }, [])

    useEffect(() => {
        if (sessionData?.user) {
            console.log('setting up')
            socket.emit('setup', { userId: sessionData.user.id })
        }
    }, [router, socket, sessionData])

    useEffect(() => {
        const handleMessage = (message: string) => {
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

        return () => {
            socket.off('message', handleMessage)
        }
    }, [socket, router])

    return <main className="flex bg-gradient-to-b from-[#2e026d] to-[#15162c] min-h-[calc(100vh-4rem)] w-full text-white flex-col items-center">
        {children}
    </main>
}