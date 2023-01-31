import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";

import { api } from "../utils/api";
import Link from "next/link";

const History: NextPage = () => {
    const { data: rooms } = api.room.getHistory.useQuery();
    const { data: sessionData } = useSession();

    console.log(rooms)

    return (
        <>
            <Head>
                <title>Hill-Beck App - History</title>
            </Head>
            <div className="w-full h-full flex flex-col items-center m-16">
                <h2 className="text-2xl font-bold mb-2">History</h2>
                {
                    sessionData ? <table className="table table-zebra w-full max-w-[48rem]">
                        <thead>
                            <tr>
                                <td>Room Name</td>
                                <td>Room Owner</td>
                                <td> </td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                rooms && rooms.length > 0 ? rooms.map((room, key) => (
                                    <tr key={key}>
                                        <td>{room.name}</td>
                                        <td>{room.owner.name}</td>
                                        <td>
                                            {/* <button className="btn btn-primary w-full btn-sm" onClick={() => {
                                                if (!sessionData.user) return

                                                socket.emit('join-room', {
                                                    roomId: room.id,
                                                    userId: sessionData.user.id
                                                })
                                            }}>View</button> */}
                                            <Link
                                                className="btn btn-primary"
                                                href={{
                                                    pathname: 'summary',
                                                    query: {
                                                        roomId: room.id
                                                    }
                                                }}
                                            >View</Link>
                                        </td>
                                    </tr>
                                )) : <tr>
                                    <td colSpan={3}>
                                        <center>No room found</center>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table> : <div>
                        Unable to get history without logging in. Please log in.
                    </div>
                }
            </div>
        </>
    );
};

export default History