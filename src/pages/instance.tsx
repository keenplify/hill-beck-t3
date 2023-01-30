
import type { NextPage } from "next";
import { LazyEditControl, LazyFeatureGroup, LazyLeafletMap, LazyMapController } from "../components/LazyMap";
import { api } from "../utils/api";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSocketIOStore } from "../stores/socketio";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { VotingToast } from "../components/toasts/VotingToast";
import { z } from "zod";
import type L from "leaflet";
import type { Point } from "leaflet";
import { CoordsSchema } from "../socket/schemas/payloads/partitions/create";
import { useRouter } from "next/router";

const Instance: NextPage = () => {
    const { data: room, refetch } = api.room.currentRoom.useQuery();
    const { data: sessionData } = useSession();
    const { socket } = useSocketIOStore();
    const [map, setMap] = useState<L.Map>()
    const [leaflet, setLeaflet] = useState<typeof L>()
    const router = useRouter()
    const [isInitialized, setIsInitialized] = useState(false)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const setupInstance = async () => {
        setIsInitialized(true)
        const handleMessage = () => {
            refetch()
        }

        const handleInitiateVote = (partitionId: string) => {
            if (!sessionData?.user) return
            if (!room) return

            refetch()
            toast(<VotingToast
                userId={sessionData.user.id}
                roomId={room.id}
                partitionId={partitionId}
            />, {
                closeButton: false,
                autoClose: false
            })
        }

        const handleInstanceEnded = () => {
            if (!room) return

            toast('The instance has ended. Redirecting to summary...', {
                type: 'success',
                theme: 'dark'
            })

            setTimeout(() => {
                router.push({
                    pathname: 'summary',
                    query: {
                        roomId: room.id
                    }
                })
            }, 2500)
        }

        socket.on('message', handleMessage)
        socket.on('initiate-vote', handleInitiateVote)
        socket.on('instance-ended', handleInstanceEnded)
    }

    useEffect(() => {
        if (!isInitialized) setupInstance()
    }, [])

    return <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
        {
            room && <LazyLeafletMap
                center={[room.lat, room.lng]}
                zoom={room.zoom}
                className="min-h-[calc(100vh-4rem)]"
                dragging={false}
                zoomControl={false}
            >
                <LazyMapController
                    onReady={(map, L) => {
                        setLeaflet(L)
                        setMap(map)
                        const featureGroup = L.featureGroup();

                        if (!room) return

                        const polygons = room.landPartitions.map((p) => {
                            if (!p.edges) return
                            const parsed = JSON.parse(p.edges?.toString())
                            return {
                                edges: z.array(CoordsSchema).parse(parsed),
                                owner: p.owner
                            }
                        })

                        for (const polygon of polygons) {
                            if (!polygon) continue

                            const lPoly = L.polygon(polygon.edges)

                            lPoly.bindTooltip(L.tooltip({
                                direction: 'center',
                                className: 'area-tooltip',
                                content: `${polygon.owner.name}`
                            }))

                            featureGroup.addLayer(lPoly)
                        }

                        map.addLayer(featureGroup)

                        map.on('draw:drawstop', (e) => {
                            if (!map) return
                            if (!sessionData?.user) return
                            if (!room) return

                            const layerKeys = Object.keys(e.target._layers)
                            const latestLayer = e.target._layers[`${layerKeys[layerKeys.length - 1]}`]
                            const coords = latestLayer._rings[0].map((point: Point) => {
                                const coords = map.layerPointToLatLng(point) as L.LatLng

                                return {
                                    lat: coords.lat,
                                    lng: coords.lng
                                }
                            })

                            socket.emit('create-partition', {
                                userId: sessionData.user.id,
                                roomId: room.id,
                                coords
                            })
                        })

                        return () => {
                            map.removeLayer(featureGroup)
                            map.off('draw:drawstop')
                        }
                    }}
                />
                {
                    room?.currentTurnUserId == sessionData?.user?.id && map && leaflet && (
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
                            />
                        </LazyFeatureGroup>
                    )
                }
            </LazyLeafletMap>
        }
    </div>
}

export default dynamic(() => Promise.resolve(Instance), {
    ssr: false,
})