import { type NextPage } from "next";
import Head from "next/head";
import { api } from "../utils/api";
import { FaSpinner } from 'react-icons/fa'
import { useEffect } from "react";
import { useSocketIOStore } from "../stores/socketio";
import Image from "next/image";
import { useSession } from "next-auth/react";

const Room: NextPage = () => {
    const { data: room, refetch } = api.room.currentRoom.useQuery();
    const { socket } = useSocketIOStore()
    const { data: sessionData } = useSession();

    useEffect(() => {
        const handleRoomUpdated = () => {
            refetch()
        }

        socket.on('room-updated', handleRoomUpdated)

        return () => {
            socket.off('room-updated', handleRoomUpdated)
        }
    }, [socket, refetch])

    return (
        <>
            <Head>
                <title>Hill-Beck App - {room?.name}</title>
            </Head>
            {
                room ? <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
                    <div className="flex gap-4 h-[24rem]">
                        <div className="h-full overflow-y-auto">
                            <table className="table table-zebra w-[24rem]">
                                <tbody>
                                    {
                                        room.users.map((user) => <tr key={user.id}>
                                            <td>
                                                {
                                                    user.image && <Image
                                                        src={user.image}
                                                        className="avatar rounded-full"
                                                        alt={`${user.name} avatar`}
                                                        width={32}
                                                        height={32}
                                                        unoptimized
                                                    />
                                                }
                                            </td>
                                            <td>{user.name} {user.id == room.ownerId && `(Owner)`}</td>
                                        </tr>)
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 rounded-lg shadow h-full flex flex-col w-[16rem] relative bg-secondary-content">
                            <h1 className="text-md font-bold">Room Name: {room.name}</h1>
                            <h2 className="text-md">Room Owner: {room.owner.name}</h2>
                            {
                                sessionData?.user?.id === room.ownerId && (
                                    <div className="bottom-0 mt-auto">
                                        <button
                                            className="btn btn-primary w-full text-sm"
                                            onClick={() => socket.emit('room-start', { roomId: room.id })}
                                        >
                                            Start
                                        </button>
                                    </div>
                                )
                            }

                        </div>
                    </div>
                </div> : <div className="flex justify-center items-center w-full">
                    <FaSpinner className="animate-spin" />
                </div>
            }

        </>
    );
};

export default Room