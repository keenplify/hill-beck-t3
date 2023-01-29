
import type { NextPage } from "next";
import { LazyEditControl, LazyFeatureGroup, LazyMapController, LeafletMapWithClusters } from "../components/LazyMap";
import { api } from "../utils/api";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSocketIOStore } from "../stores/socketio";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import type { Id } from "react-toastify";
import { toast } from "react-toastify";
import { VotingToast } from "../components/toasts/VotingToast";

const Instance: NextPage = () => {

    const { data: room, refetch } = api.room.currentRoom.useQuery();
    const { data: sessionData } = useSession();
    const { socket } = useSocketIOStore();
    const [isVotingPartition, setIsVotingPartition] = useState<string>()
    const [toastId, setToastId] = useState<Id>()

    console.log({ toastId, isVotingPartition })

    useEffect(() => {
        const handleMessage = () => {
            refetch()
        }

        const handleInitiateVote = (partitionId: string) => {
            refetch()
            setIsVotingPartition(partitionId)
            setToastId(toast(<VotingToast />, {
                closeButton: false,
                autoClose: false
            }))
        }

        socket.on('message', handleMessage)
        socket.on('initiate-vote', handleInitiateVote)

        return () => {
            socket.off('room-created', handleMessage)
            socket.off('initiate-vote', handleInitiateVote)
        }
    }, [socket, refetch])

    return <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
        {

        }
        <LeafletMapWithClusters
            center={[0, 0]}
        >
            <LazyMapController />
            {
                room?.currentTurnUserId == sessionData?.user?.id && (
                    <LazyFeatureGroup>
                        <LazyEditControl
                            position='topright'
                            draw={{
                                circle: false,
                                circlemarker: false,
                                marker: false,
                                polyline: false,
                                rectangle: false,
                            }}
                            edit={{
                                remove: false,
                            }}
                            onDrawStop={(e) => {
                                if (!sessionData?.user) return
                                if (!room) return

                                const layerKeys = Object.keys(e.target._layers)
                                const latestLayer = e.target._layers[`${layerKeys[layerKeys.length - 1]}`]
                                const ring = latestLayer._rings[0]

                                socket.emit('create-partition', {
                                    userId: sessionData.user.id,
                                    points: ring,
                                    roomId: room.id
                                })
                            }}
                        />
                    </LazyFeatureGroup>
                )
            }
        </LeafletMapWithClusters>
    </div>
}

export default dynamic(() => Promise.resolve(Instance), {
    ssr: false,
})