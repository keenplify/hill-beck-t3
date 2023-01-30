import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';

import { api } from "../utils/api";
import { z } from "zod";
import { useEffect, useRef } from "react";
import { useSocketIOStore } from "../stores/socketio";
import { LazyLeafletMap, LazyMapController } from "../components/LazyMap";
import { useGeolocated } from "react-geolocated";

const schema = z.object({
    name: z.string().min(3, 'Room name must contain at least 3 character(s)'),
    lat: z.number(),
    lng: z.number(),
    zoom: z.number()
})

type Values = z.infer<typeof schema>

const CreateRoomModal = () => {
    const { coords } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        });

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<Values>({
        resolver: zodResolver(schema),
        defaultValues: {
            lat: coords?.latitude ?? 0,
            lng: coords?.longitude ?? 0,
            zoom: 8
        }
    });
    const modalRef = useRef<HTMLInputElement>(null)
    const { socket } = useSocketIOStore()
    const { data: sessionData } = useSession();

    const onSubmit = handleSubmit((data) => {
        if (!modalRef.current) return
        modalRef.current.checked = false

        if (!sessionData?.user) return

        socket.emit('create-room', {
            name: data.name,
            userId: sessionData.user.id,
            lat: data.lat,
            lng: data.lng,
            zoom: data.zoom
        })
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
                    <div className="flex flex-col gap-2">
                        <label>Map Center:</label>
                        <div className="relative w-full h-[418px]">
                            <LazyLeafletMap
                                center={coords ? [coords.latitude, coords.longitude] : [0, 0]}
                                zoom={8}
                                className="min-h-[418px]"
                            >
                                <LazyMapController
                                    onDragAndZoom={(values) => {
                                        setValue('lat', values.center.lat)
                                        setValue('lng', values.center.lng)
                                        setValue('zoom', values.zoom)
                                    }}
                                    onReady={(map) => {
                                        if (!map) return;

                                        const center = map.getCenter()

                                        setValue('lat', center.lat)
                                        setValue('lng', center.lng)
                                        setValue('zoom', map.getZoom())
                                    }}
                                />
                            </LazyLeafletMap>
                        </div>
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
    const { data: rooms, refetch } = api.room.getRooms.useQuery();
    const { data: sessionData } = useSession();

    const { socket } = useSocketIOStore()

    useEffect(() => {
        const handleRoomCreated = () => {
            refetch()
        }

        socket.on('room-created', handleRoomCreated)

        return () => {
            socket.off('room-created', handleRoomCreated)
        }
    }, [socket, refetch])

    useEffect(() => {
        socket.emit('lobby')

        return () => {
            socket.emit('unlobby')
        }
    }, [socket])

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
                                            <button className="btn btn-primary w-full btn-sm" onClick={() => {
                                                if (!sessionData.user) return

                                                socket.emit('join-room', {
                                                    roomId: room.id,
                                                    userId: sessionData.user.id
                                                })
                                            }}>Join</button>
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