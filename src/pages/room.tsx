import { type NextPage } from "next";
import Head from "next/head";
import { api } from "../utils/api";
import { FaSpinner } from 'react-icons/fa'

const Room: NextPage = () => {
    const { data: room } = api.room.currentRoom.useQuery();

    return (
        <>
            <Head>
                <title>Hill-Beck App - Rooms</title>
            </Head>
            {
                room ? <div className="w-full h-full">
                    <h1>Room: {room.name}</h1>
                    <table>
                        <tbody>
                            {
                                room.users.map((user) => <tr key={user.id}>
                                    <td>{user.name}</td>
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div> : <div className="flex justify-center items-center w-full">
                    <FaSpinner className="animate-spin" />
                </div>
            }

        </>
    );
};

export default Room