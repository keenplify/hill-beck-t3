import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "../utils/api";
import { LazyLeafletMap, LazyMapController } from "../components/LazyMap";
import { CoordsSchema } from "../socket/schemas/payloads/partitions/create";
import { z } from "zod";

const Summary: NextPage = () => {
    const {
        query: {
            roomId
        }
    } = useRouter()

    const { data: room } = api.room.getRoom.useQuery(`${roomId}`, {
        enabled: !!roomId
    });

    return (
        <>
            <Head>
                <title>Hill-Beck App - Summary</title>
            </Head>
            <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
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

                                return () => {
                                    map.removeLayer(featureGroup)
                                }
                            }}
                        />
                    </LazyLeafletMap>
                }
            </div>
        </>
    );
};

export default Summary