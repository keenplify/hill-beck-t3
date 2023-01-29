import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useSocketIOStore } from "../stores/socketio";
import { api } from "../utils/api";

export function MainNavbar() {
    const { data: sessionData } = useSession();
    const { data: currentRoom } = api.room.currentRoom.useQuery();
    const { socket } = useSocketIOStore()

    return <div className="navbar bg-base-100 h-[4rem]">
        <div className="navbar-start">
            <Link href="/" className="btn btn-ghost normal-case text-xl">HBLD App</Link>
        </div>
        <div className="navbar-end flex gap-2">
            {sessionData?.user?.name && <p>
                Logged in as <b>{sessionData.user.name}</b>
            </p>}
            {
                currentRoom ? <button
                    className="btn btn-secondary"
                    onClick={() => sessionData?.user && socket.emit('leave-room', {
                        userId: sessionData.user.id,
                        roomId: currentRoom.id
                    })}
                >
                    Leave Room
                </button> : <button
                    className="btn btn-primary"
                    onClick={sessionData ? () => void signOut() : () => void signIn()}
                >
                    {sessionData ? "Sign out" : "Sign in"}
                </button>
            }
        </div>
    </div>
}