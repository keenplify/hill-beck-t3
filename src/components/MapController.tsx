import { useMap } from "react-leaflet";
import { useEffect } from 'react';
import type { LatLng, LeafletEvent, Map } from "leaflet";
import L from 'leaflet'

interface Props {
    onDragAndZoom?: (values: {
        event: LeafletEvent
        center: LatLng,
        zoom: number
    }) => void
    onReady?: (map: Map, leaflet: typeof L) => ((() => void) | void)
}

export const MapController = ({ onDragAndZoom, onReady }: Props) => {
    const map = useMap()

    useEffect(() => {
        onDragAndZoom && map.addEventListener('dragend', (event) => {
            onDragAndZoom({
                center: map.getCenter(),
                zoom: map.getZoom(),
                event
            })
        })

        onDragAndZoom && map.addEventListener('zoomend', (event) => {
            onDragAndZoom({
                center: map.getCenter(),
                zoom: map.getZoom(),
                event
            })
        })

        return () => {
            onDragAndZoom && map.removeEventListener('dragend')
            onDragAndZoom && map.removeEventListener('zoomend')
        }
    }, [map, onDragAndZoom])

    useEffect(() => {
        const cleanup = onReady && onReady(map, L)

        return () => {
            cleanup && cleanup()
        }
    }, [onReady, map])

    return <></>
}