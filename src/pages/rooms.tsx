import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';

import { api } from "../utils/api";
import { z } from "zod";
import { useRef } from "react";
import { useRouter } from "next/router";

const schema = z.object({
    name: z.string().min(3, 'Room name must contain at least 3 character(s)')
})

type Values = z.infer<typeof schema>

const CreateRoomModal = () => {
    const router = useRouter()

    const { mutate: joinRoomMutate } = api.room.joinRoom.useMutation({
        onSuccess: () => router.push('/room')
    })

    const { refetch: refetchRooms } = api.room.getRooms.useQuery();
    const { register, handleSubmit, formState: { errors } } = useForm<Values>({
        resolver: zodResolver(schema)
    });
    const modalRef = useRef<HTMLInputElement>(null)
    const { mutate } = api.room.createRoom.useMutation({
        onMutate: () => refetchRooms(),
        onSuccess: (room) => {
            if (!modalRef.current) return
            modalRef.current.checked = false
            joinRoomMutate(room.id)
        }
    })

    const onSubmit = handleSubmit((data) => {
        mutate(data)
    });

    return <>
        <input type="checkbox" id="create-room-modal" className="modal-toggle" ref={modalRef} />
        <div className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg text-center">Create Room</h3>
                <form onSubmit={onSubmit} className="pt-4 gap-4 flex flex-col">
                    <div className="flex gap-2 items-center">
                        <label>Room Name:</label>
                        <input className="input input-secondary grow" {...register('name')} />
                    </div>
                    {errors.name?.message && <p className="text-error text-sm">{errors.name.message}</p>}
                    <input type="submit" className="btn btn-primary w-full" />
                    <label htmlFor="create-room-modal" className="btn btn-secondary w-full text-sm">Close</label>
                </form>
            </div>
        </div>
    </>
}

const Rooms: NextPage = () => {
    const router = useRouter()
    const { data: rooms } = api.room.getRooms.useQuery();
    const { data: sessionData } = useSession();
    const { mutate: joinRoomMutate } = api.room.joinRoom.useMutation({
        onSuccess: () => router.push('/room')
    })

    return (
        <>
            <Head>
                <title>Hill-Beck App - Rooms</title>
            </Head>
            <div className="w-full h-full flex flex-col items-center m-16">
                <h2 className="text-2xl font-bold mb-2">Available Rooms</h2>
                {
                    sessionData ? <table className="table table-zebra w-full max-w-[48rem]">
                        <thead>
                            <tr>
                                <td>Room Name</td>
                                <td>Room Owner</td>
                                <td>
                                    <div className="w-full flex justify-end">
                                        <label htmlFor="create-room-modal" className="btn btn-secondary btn-sm">+ Create Room</label>
                                    </div>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                rooms && rooms.length > 0 ? rooms.map((room, key) => (
                                    <tr key={key}>
                                        <td>{room.name}</td>
                                        <td>{room.owner.name}</td>
                                        <td>
                                            <button className="btn btn-primary w-full btn-sm" onClick={() => joinRoomMutate(room.id)}>Join</button>
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
                        Unable to get rooms without logging in. Please log in.
                    </div>
                }
            </div>
            <CreateRoomModal />
        </>
    );
};

export default Rooms