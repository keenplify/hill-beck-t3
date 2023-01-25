import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "../utils/api";

export function MainNavbar() {
    const router = useRouter()
    const { data: sessionData } = useSession();
    const { data: currentRoom } = api.room.currentRoom.useQuery();
    const { mutate: leaveRoom } = api.room.leaveRoom.useMutation({
        onSuccess: () => router.push('/rooms')
    });

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
                    onClick={() => leaveRoom()}
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