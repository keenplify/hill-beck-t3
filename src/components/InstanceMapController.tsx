import L from 'leaflet'
import { PointSchema } from "../socket/schemas/payloads/partitions/create";
import { z } from "zod";
import { useMap } from "react-leaflet";
import { useEffect } from 'react';
import { api } from '../utils/api';

export const InstanceMapController = () => {
    const { data: room } = api.room.currentRoom.useQuery();
    const map = useMap()

    useEffect(() => {
        const featureGroup = L.featureGroup();

        (async () => {
            if (!room) return

            const polygons = room.landPartitions.map((p) => {
                if (!p.edges) return
                const parsed = JSON.parse(p.edges?.toString())
                return z.array(PointSchema).parse(parsed)
            })

            const coords = polygons.map((polygon) => polygon?.map(point => map.layerPointToLatLng(L.point(point.x, point.y))))


            for (const coord of coords) {
                if (!coord) continue

                featureGroup.addLayer(L.polygon(coord))
            }

            map.addLayer(featureGroup)
        })()

        return () => {
            map.removeLayer(featureGroup)
        }
    }, [room, map])

    return <></>
}